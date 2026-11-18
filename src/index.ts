import type { EdgeEverPlugin, PluginContext } from "./edgeever.ts";
import fallbackStylesCss from "../styles.css";
import { CalloutDomController } from "./dom-renderer.ts";
import {
  cycleCalloutFoldAtTarget,
  normalizeCompactCalloutsInMarkdown,
} from "./parser.ts";
import {
  applyEditorCalloutOperation,
  isStructuredNoteError,
  registerCalloutPanels,
} from "./panels.ts";
import {
  getUiCopy,
  parseCustomTypesSetting,
  type CalloutDefaultFoldSetting,
  type CalloutFoldModifier,
  type CalloutPluginSettings,
  type CalloutVisualStyle,
} from "./types.ts";

const loadPluginSettings = async (context: PluginContext): Promise<CalloutPluginSettings> => {
  const [
    defaultTypeVal,
    defaultFoldVal,
    visualStyleVal,
    livePreviewVal,
    rememberFoldVal,
    customTypesVal,
  ] = await Promise.all([
    context.settings.get("default-type").catch(() => null),
    context.settings.get("default-fold").catch(() => null),
    context.settings.get("visual-style").catch(() => null),
    context.settings.get("live-preview-header").catch(() => null),
    context.settings.get("remember-fold-state").catch(() => null),
    context.settings.get("custom-types").catch(() => null),
  ]);

  const defaultType =
    typeof defaultTypeVal === "string" && defaultTypeVal.trim()
      ? defaultTypeVal.trim().toLowerCase()
      : "note";
  const defaultFold: CalloutDefaultFoldSetting =
    defaultFoldVal === "expanded" || defaultFoldVal === "collapsed" || defaultFoldVal === "none"
      ? defaultFoldVal
      : "none";
  const visualStyle: CalloutVisualStyle =
    visualStyleVal === "minimal" || visualStyleVal === "bordered" || visualStyleVal === "obsidian"
      ? visualStyleVal
      : "obsidian";
  const livePreviewHeader = typeof livePreviewVal === "boolean" ? livePreviewVal : true;
  const rememberFoldState = typeof rememberFoldVal === "boolean" ? rememberFoldVal : true;
  const customTypesRaw = typeof customTypesVal === "string" ? customTypesVal : "";

  return {
    defaultType,
    defaultFold,
    visualStyle,
    livePreviewHeader,
    rememberFoldState,
    customTypesRaw,
    customTypes: parseCustomTypesSetting(customTypesRaw),
  };
};

const foldFromDefaultSetting = (setting: CalloutDefaultFoldSetting): CalloutFoldModifier => {
  if (setting === "expanded") return "+";
  if (setting === "collapsed") return "-";
  return "";
};

const ensureFallbackStylesheet = (pluginId: string): (() => void) => {
  if (typeof document === "undefined" || !document.head) {
    return () => {};
  }
  const existingHostStyle = document.head.querySelector(
    `style[data-edgeever-plugin-style="${pluginId}"]`,
  );
  if (existingHostStyle) {
    return () => {};
  }
  const styleEl = document.createElement("style");
  styleEl.dataset.edgeeverPluginStyleFallback = pluginId;
  styleEl.textContent = fallbackStylesCss;
  document.head.appendChild(styleEl);
  return () => {
    styleEl.remove();
  };
};

const plugin: EdgeEverPlugin = {
  async activate(context) {
    let settings = await loadPluginSettings(context);
    const disposeFallbackStyle = ensureFallbackStylesheet(context.pluginId);
    const controller = new CalloutDomController(context, settings);
    await controller.start();

    const copy = getUiCopy();
    const disposers: Array<() => void> = [
      disposeFallbackStyle,
      () => controller.dispose(),
      ...registerCalloutPanels(context, controller, () => settings),
    ];

    disposers.push(
      context.events.on("settings.changed", async () => {
        settings = await loadPluginSettings(context);
        controller.updateSettings(settings);
      }),
      context.events.on("note.updated", () => controller.scheduleScan()),
      context.events.on("workspace.synced", () => controller.scheduleScan()),
    );

    disposers.push(
      context.commands.register({
        id: "insert-callout",
        title: copy.cmdInsertCallout,
        listed: true,
        menu: true,
        async run() {
          await context.ui.panels.open("callout-composer");
        },
      }),
      context.commands.register({
        id: "open-callout-explorer",
        title: copy.cmdOpenExplorer,
        listed: true,
        menu: true,
        async run() {
          await context.ui.panels.open("callout-explorer");
        },
      }),
      context.commands.register({
        id: "wrap-selection",
        title: copy.cmdWrapSelection,
        listed: true,
        menu: true,
        async run() {
          const selection = await context.editor.getSelection();
          const hint = controller.getLastCursorHint();
          const hasSelection = Boolean(
            (selection && !selection.empty && (selection.contentMarkdown || selection.text)) ||
            hint.sourceSelectionText,
          );
          await applyEditorCalloutOperation({
            context,
            controller,
            mode: hasSelection ? "wrap" : "insert",
            callout: {
              type: settings.defaultType,
              fold: foldFromDefaultSetting(settings.defaultFold),
              title: "",
              ...(hasSelection ? {} : { body: "Callout content" }),
            },
          });
        },
      }),
      context.commands.register({
        id: "cycle-callout-fold",
        title: copy.cmdCycleFold,
        listed: false,
        menu: true,
        async run() {
          const uiCopy = getUiCopy();
          const doc = await context.editor.getDocument();
          if (!doc) {
            context.ui.showNotice(uiCopy.noActiveEditorNotice);
            return;
          }
          const hint = controller.getLastCursorHint();
          const result = cycleCalloutFoldAtTarget(doc.contentMarkdown, hint.activeCalloutIndex);
          if (!result) {
            context.ui.showNotice(uiCopy.noActiveCalloutNotice);
            return;
          }
          try {
            await context.editor.editMarkdown(result.edits);
            controller.scanAll();
            context.ui.showNotice(uiCopy.foldCycledNotice(result.nextFold));
          } catch (error) {
            context.ui.showNotice(
              isStructuredNoteError(error)
                ? uiCopy.structuredNoteUnsupportedNotice
                : error instanceof Error
                  ? error.message
                  : String(error),
            );
          }
        },
      }),
      context.commands.register({
        id: "toggle-all-foldable",
        title: copy.cmdToggleAll,
        listed: false,
        menu: true,
        run() {
          const uiCopy = getUiCopy();
          const { count, collapsed } = controller.toggleAllFoldable();
          context.ui.showNotice(
            count > 0 ? uiCopy.toggledAllNotice(collapsed, count) : uiCopy.noFoldableCalloutsNotice,
          );
        },
      }),
      context.commands.register({
        id: "normalize-callouts",
        title: copy.cmdNormalize,
        listed: false,
        menu: true,
        async run() {
          const uiCopy = getUiCopy();
          const doc = await context.editor.getDocument();
          if (!doc) {
            context.ui.showNotice(uiCopy.noActiveEditorNotice);
            return;
          }
          const { edits, count } = normalizeCompactCalloutsInMarkdown(doc.contentMarkdown);
          if (edits.length === 0) {
            context.ui.showNotice(uiCopy.normalizedNotice(0));
            return;
          }
          try {
            await context.editor.editMarkdown(edits);
            controller.scanAll();
            context.ui.showNotice(uiCopy.normalizedNotice(count));
          } catch (error) {
            context.ui.showNotice(
              isStructuredNoteError(error)
                ? uiCopy.structuredNoteUnsupportedNotice
                : error instanceof Error
                  ? error.message
                  : String(error),
            );
          }
        },
      }),
      context.commands.register({
        id: "insert-tip-callout",
        title: copy.cmdInsertTip,
        listed: false,
        menu: true,
        async run() {
          await applyEditorCalloutOperation({
            context,
            controller,
            mode: "insert",
            callout: {
              type: "tip",
              fold: foldFromDefaultSetting(settings.defaultFold),
              title: "",
              body: "Helpful tip",
            },
          });
        },
      }),
      context.commands.register({
        id: "insert-warning-callout",
        title: copy.cmdInsertWarning,
        listed: false,
        menu: true,
        async run() {
          await applyEditorCalloutOperation({
            context,
            controller,
            mode: "insert",
            callout: {
              type: "warning",
              fold: foldFromDefaultSetting(settings.defaultFold),
              title: "",
              body: "Watch out for this edge case.",
            },
          });
        },
      }),
      context.commands.register({
        id: "insert-question-callout",
        title: copy.cmdInsertQuestion,
        listed: false,
        menu: true,
        async run() {
          await applyEditorCalloutOperation({
            context,
            controller,
            mode: "insert",
            callout: {
              type: "faq",
              fold: "+",
              title: "Frequently Asked Question",
              body: "Add the answer here.",
            },
          });
        },
      }),
    );

    return () => {
      for (const dispose of disposers.reverse()) {
        try {
          dispose();
        } catch {
          // Ensure remaining disposers still execute cleanly.
        }
      }
    };
  },
};

export default plugin;
