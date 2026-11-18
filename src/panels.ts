import type {
  PluginContext,
  PluginEmbedInstance,
  PluginNote,
} from "./edgeever.ts";
import type { CalloutDomController } from "./dom-renderer.ts";
import {
  buildWrapOrInsertEdit,
  extractCalloutsFromMarkdown,
  serializeCalloutMarkdown,
  type EditorCursorHint,
  type ParsedMarkdownCallout,
} from "./parser.ts";
import {
  BUILTIN_CALLOUT_TYPES,
  formatDefaultCalloutTitle,
  getUiCopy,
  iconToSvgMarkup,
  resolveCalloutType,
  type CalloutFoldModifier,
  type CalloutPluginSettings,
} from "./types.ts";

export interface CalloutOperationArgs {
  context: PluginContext;
  controller: CalloutDomController;
  mode: "insert" | "wrap" | "update";
  callout: {
    type: string;
    fold: CalloutFoldModifier;
    title: string;
    body?: string;
  };
  activeCalloutIndex?: number | null;
}

export const isStructuredNoteError = (error: unknown): boolean =>
  Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: unknown }).code === "STRUCTURED_NOTE_REQUIRED",
  );

const resolveFallbackCalloutIndex = (
  markdown: string,
  hint: EditorCursorHint | null,
): number | null => {
  if (!hint) return null;
  if (hint.activeCalloutIndex !== null) return hint.activeCalloutIndex;
  const blockText = hint.activeBlockText?.trim();
  if (!blockText) return null;
  const callouts = extractCalloutsFromMarkdown(markdown);
  const found = callouts.find(
    (item) =>
      item.rawMarkdown.includes(blockText) ||
      item.effectiveTitle === blockText ||
      `[!${item.rawType}]${item.fold}${item.customTitle ? ` ${item.customTitle}` : ""}` === blockText,
  );
  return found ? found.index : null;
};

export const applyEditorCalloutOperation = async ({
  context,
  controller,
  mode,
  callout,
  activeCalloutIndex,
}: CalloutOperationArgs): Promise<boolean> => {
  const copy = getUiCopy();
  const doc = await context.editor.getDocument();
  if (!doc) {
    context.ui.showNotice(copy.noActiveEditorNotice);
    return false;
  }

  const selection = await context.editor.getSelection();
  const cursorHint = controller.getLastCursorHint();
  const resolvedIndex = activeCalloutIndex ?? resolveFallbackCalloutIndex(doc.contentMarkdown, cursorHint);
  const hasSelection = Boolean(
    (selection && !selection.empty && (selection.contentMarkdown || selection.text)) ||
    cursorHint.sourceSelectionText,
  );

  const effectiveMode: "insert" | "wrap" | "update" =
    mode === "update" && resolvedIndex !== null
      ? "update"
      : mode === "wrap" || (mode === "insert" && hasSelection && !(callout.body ?? "").trim())
        ? "wrap"
        : mode;

  const edits = buildWrapOrInsertEdit(doc.contentMarkdown, {
    mode: effectiveMode,
    callout,
    selectionText: selection?.text ?? "",
    selectionMarkdown: selection?.contentMarkdown ?? "",
    cursorHint,
    activeCalloutIndex: resolvedIndex,
  });

  try {
    await context.editor.editMarkdown(edits);
  } catch (error) {
    if (isStructuredNoteError(error)) {
      context.ui.showNotice(copy.structuredNoteUnsupportedNotice);
    } else {
      context.ui.showNotice(error instanceof Error ? error.message : String(error));
    }
    return false;
  }

  controller.scanAll();
  controller.scheduleDeferredScan();

  if (effectiveMode === "update") {
    context.ui.showNotice(copy.calloutUpdatedNotice);
  } else if (effectiveMode === "wrap" && hasSelection) {
    context.ui.showNotice(copy.calloutWrappedNotice);
  } else {
    context.ui.showNotice(copy.calloutInsertedNotice);
  }
  return true;
};

const defaultFoldFromSetting = (setting: CalloutPluginSettings["defaultFold"]): CalloutFoldModifier => {
  if (setting === "expanded") return "+";
  if (setting === "collapsed") return "-";
  return "";
};

const copyTextSafely = async (text: string): Promise<boolean> => {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand fallback.
  }
  if (typeof document !== "undefined" && typeof document.createElement === "function") {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body?.appendChild(textarea);
    textarea.select?.();
    try {
      return Boolean(document.execCommand?.("copy"));
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }
  return false;
};

const renderPreviewBlockquote = (
  controller: CalloutDomController,
  host: HTMLElement,
  data: { type: string; fold: CalloutFoldModifier; title: string; body: string },
) => {
  host.replaceChildren();
  const blockquote = document.createElement("blockquote");
  const headerP = document.createElement("p");
  const typeToken = (data.type.trim() || "note").replace(/[\r\n[\]]/g, "");
  const cleanTitle = data.title.trim();
  headerP.textContent = `[!${typeToken}]${data.fold}${cleanTitle ? ` ${cleanTitle}` : ""}`;
  blockquote.appendChild(headerP);

  const bodyLines = data.body
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of bodyLines) {
    const p = document.createElement("p");
    p.textContent = block;
    blockquote.appendChild(p);
  }

  host.appendChild(blockquote);
  controller.decoratePreviewElement(blockquote);
  return blockquote;
};

interface ExplorerCalloutItem {
  noteId: string;
  noteTitle: string;
  updatedAt: string;
  callout: ParsedMarkdownCallout;
  canonicalId: string;
  rgb: string;
  icon: ReturnType<typeof resolveCalloutType>["icon"];
  searchTerm: string;
}

const MAX_EXPLORER_PAGES = 5;
const EXPLORER_PAGE_SIZE = 100;

const scanWorkspaceCallouts = async (
  context: PluginContext,
  settings: CalloutPluginSettings,
): Promise<ExplorerCalloutItem[]> => {
  const collected: ExplorerCalloutItem[] = [];
  let offset: number | null = 0;
  let pages = 0;

  while (offset !== null && pages < MAX_EXPLORER_PAGES) {
    const page = await context.notes.queryContent({
      sort: "updated-desc",
      limit: EXPLORER_PAGE_SIZE,
      offset,
    });
    pages += 1;

    for (const note of page.notes as PluginNote[]) {
      if (note.kind !== "text" || !note.contentMarkdown) continue;
      const callouts = extractCalloutsFromMarkdown(note.contentMarkdown);
      if (callouts.length === 0) continue;

      const noteTitle = note.title?.trim() || note.excerpt?.trim() || "Untitled";
      for (const callout of callouts) {
        const spec = resolveCalloutType(callout.rawType, settings.customTypes);
        const searchTerm =
          callout.customTitle ||
          callout.bodyMarkdown.split("\n")[0]?.trim() ||
          `[!${callout.rawType}]`;
        collected.push({
          noteId: note.id,
          noteTitle,
          updatedAt: note.updatedAt,
          callout,
          canonicalId: spec.canonicalId,
          rgb: spec.rgb,
          icon: spec.icon,
          searchTerm: searchTerm.slice(0, 120),
        });
      }
    }

    offset = page.nextOffset;
  }

  return collected;
};

export const registerCalloutPanels = (
  context: PluginContext,
  controller: CalloutDomController,
  getSettings: () => CalloutPluginSettings,
): Array<() => void> => {
  const copy = getUiCopy();

  const disposeComposer = context.ui.panels.register({
    id: "callout-composer",
    title: copy.panelComposerTitle,
    purpose: "workflow",
    presentation: "dialog",
    async mount(container, { shell, requestClose, state }) {
      const uiCopy = getUiCopy();
      const settings = getSettings();
      const stateRecord = state && typeof state === "object" && !Array.isArray(state)
        ? (state as Record<string, unknown>)
        : null;

      let doc = null;
      let selection = null;
      try {
        [doc, selection] = await Promise.all([
          context.editor.getDocument(),
          context.editor.getSelection(),
        ]);
      } catch {
        doc = null;
        selection = null;
      }

      const cursorHint = controller.getLastCursorHint();
      const targetCalloutIndex =
        typeof stateRecord?.calloutIndex === "number"
          ? stateRecord.calloutIndex
          : doc
            ? resolveFallbackCalloutIndex(doc.contentMarkdown, cursorHint)
            : null;
      const existingCallout =
        doc && targetCalloutIndex !== null
          ? extractCalloutsFromMarkdown(doc.contentMarkdown).find((c) => c.index === targetCalloutIndex) ?? null
          : null;

      const isEditMode =
        stateRecord?.mode === "edit" && existingCallout !== null
          ? true
          : stateRecord?.mode === undefined && existingCallout !== null;

      let activeCategory = "all";
      let searchQuery = "";
      let selectedType =
        typeof stateRecord?.type === "string" && stateRecord.type.trim()
          ? stateRecord.type.trim().toLowerCase()
          : isEditMode && existingCallout
            ? existingCallout.normalizedType
            : settings.defaultType;
      let fold: CalloutFoldModifier =
        stateRecord?.fold === "+" || stateRecord?.fold === "-" || stateRecord?.fold === ""
          ? stateRecord.fold
          : isEditMode && existingCallout
            ? existingCallout.fold
            : defaultFoldFromSetting(settings.defaultFold);
      let customTitle =
        typeof stateRecord?.title === "string"
          ? stateRecord.title
          : isEditMode && existingCallout
            ? existingCallout.customTitle
            : "";
      let bodyText =
        typeof stateRecord?.body === "string"
          ? stateRecord.body
          : isEditMode && existingCallout
            ? existingCallout.bodyMarkdown
            : (selection && !selection.empty ? selection.contentMarkdown || selection.text : "") ||
              cursorHint.sourceSelectionText ||
              "";

      let disposed = false;
      let busy = false;

      const root = document.createElement("div");
      root.className = "ee-callouts-panel";
      container.replaceChildren(root);

      const typeGridSection = document.createElement("div");
      const aliasRow = document.createElement("div");
      aliasRow.className = "ee-callouts-alias-row";

      const formGrid = document.createElement("div");
      formGrid.className = "ee-callouts-form-grid";

      const typeInputWrap = document.createElement("label");
      const typeInputLabel = document.createElement("div");
      typeInputLabel.className = "ee-callouts-section-label";
      typeInputLabel.textContent = uiCopy.customTypeInputLabel;
      const typeInput = document.createElement("input");
      typeInput.type = "text";
      typeInput.className = "ee-callouts-input";
      typeInput.placeholder = uiCopy.customTypeInputPlaceholder;
      typeInput.value = selectedType;
      typeInput.setAttribute("aria-label", uiCopy.customTypeInputLabel);
      typeInputWrap.append(typeInputLabel, typeInput);

      const foldWrap = document.createElement("div");
      const foldLabel = document.createElement("div");
      foldLabel.className = "ee-callouts-section-label";
      foldLabel.textContent = uiCopy.foldLabel;
      const foldGroup = document.createElement("div");
      foldGroup.className = "ee-callouts-segmented";
      foldGroup.setAttribute("role", "group");
      foldGroup.setAttribute("aria-label", uiCopy.foldLabel);
      foldWrap.append(foldLabel, foldGroup);

      formGrid.append(typeInputWrap, foldWrap);

      const titleWrap = document.createElement("label");
      const titleLabel = document.createElement("div");
      titleLabel.className = "ee-callouts-section-label";
      titleLabel.textContent = uiCopy.titleLabel;
      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.className = "ee-callouts-input";
      titleInput.placeholder = uiCopy.titlePlaceholder;
      titleInput.value = customTitle;
      titleInput.setAttribute("aria-label", uiCopy.titleLabel);
      titleWrap.append(titleLabel, titleInput);

      const bodyWrap = document.createElement("label");
      const bodyLabel = document.createElement("div");
      bodyLabel.className = "ee-callouts-section-label";
      bodyLabel.textContent = uiCopy.bodyLabel;
      const bodyInput = document.createElement("textarea");
      bodyInput.className = "ee-callouts-textarea";
      bodyInput.placeholder = uiCopy.bodyPlaceholder;
      bodyInput.value = bodyText;
      bodyInput.setAttribute("aria-label", uiCopy.bodyLabel);
      bodyWrap.append(bodyLabel, bodyInput);

      const previewWrap = document.createElement("div");
      const previewLabel = document.createElement("div");
      previewLabel.className = "ee-callouts-section-label";
      previewLabel.textContent = uiCopy.previewLabel;
      const previewHost = document.createElement("div");
      previewHost.className = "ee-callouts-preview-host";
      previewWrap.append(previewLabel, previewHost);

      const markdownWrap = document.createElement("div");
      const markdownLabel = document.createElement("div");
      markdownLabel.className = "ee-callouts-section-label";
      markdownLabel.textContent = uiCopy.markdownLabel;
      const markdownPre = document.createElement("pre");
      markdownPre.className = "ee-callouts-code-preview";
      markdownWrap.append(markdownLabel, markdownPre);

      root.append(
        typeGridSection,
        aliasRow,
        formGrid,
        titleWrap,
        bodyWrap,
        previewWrap,
        markdownWrap,
      );

      const syncShell = () => {
        const currentSettings = getSettings();
        const tabOptions = [
          { value: "all", label: uiCopy.allCategory },
          { value: "info", label: "Info" },
          { value: "tips", label: "Tips" },
          { value: "alerts", label: "Alerts" },
          { value: "structure", label: "Structure" },
        ];
        if (currentSettings.customTypes.size > 0) {
          tabOptions.push({ value: "custom", label: uiCopy.customTypesCategory });
        }

        shell.set({
          header: {
            title: isEditMode ? uiCopy.composerEditTitle : uiCopy.composerTitle,
            description: uiCopy.composerDescription,
            actions: [
              { id: "copy", label: uiCopy.copyMarkdownAction, variant: "ghost", disabled: busy },
              {
                id: "apply",
                label: isEditMode ? uiCopy.updateAction : uiCopy.insertAction,
                variant: "primary",
                disabled: busy,
              },
            ],
          },
          toolbar: [
            { type: "tabs", key: "category", value: activeCategory, options: tabOptions },
            {
              type: "search",
              key: "q",
              placeholder: uiCopy.searchTypesPlaceholder,
              value: searchQuery,
            },
          ],
          onAction(actionId) {
            if (disposed || busy) return;
            if (actionId === "copy") {
              const md = serializeCalloutMarkdown({
                type: selectedType,
                fold,
                title: customTitle,
                body: bodyText,
              });
              void copyTextSafely(md).then(() => {
                context.ui.showNotice(uiCopy.copiedNotice);
              });
              return;
            }
            if (actionId === "apply") {
              busy = true;
              syncShell();
              void applyEditorCalloutOperation({
                context,
                controller,
                mode: isEditMode ? "update" : selection && !selection.empty ? "wrap" : "insert",
                callout: {
                  type: selectedType,
                  fold,
                  title: customTitle,
                  body: bodyText,
                },
                activeCalloutIndex: isEditMode ? existingCallout?.index ?? null : null,
              })
                .then(async (applied) => {
                  if (applied && !disposed) {
                    await requestClose();
                  }
                })
                .finally(() => {
                  busy = false;
                  if (!disposed) syncShell();
                });
            }
          },
          onChange(key, value) {
            if (key === "category") activeCategory = value;
            if (key === "q") searchQuery = value;
            renderTypePicker();
          },
        });
      };

      const renderFoldButtons = () => {
        foldGroup.replaceChildren();
        const options: Array<{ value: CalloutFoldModifier; label: string }> = [
          { value: "", label: uiCopy.foldNone },
          { value: "+", label: uiCopy.foldExpanded },
          { value: "-", label: uiCopy.foldCollapsed },
        ];
        for (const opt of options) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "ee-callouts-seg-btn";
          btn.textContent = opt.label;
          btn.setAttribute("data-active", String(fold === opt.value));
          btn.setAttribute("aria-pressed", String(fold === opt.value));
          btn.addEventListener("click", () => {
            fold = opt.value;
            renderFoldButtons();
            renderPreviews();
          });
          foldGroup.appendChild(btn);
        }
      };

      const renderAliases = () => {
        aliasRow.replaceChildren();
        const spec = resolveCalloutType(selectedType, getSettings().customTypes);
        const def = BUILTIN_CALLOUT_TYPES.find((item) => item.id === spec.canonicalId);
        if (!def || def.aliases.length === 0) return;

        const label = document.createElement("span");
        label.className = "ee-callouts-type-token";
        label.textContent = `${uiCopy.aliasesLabel}:`;
        aliasRow.appendChild(label);

        const names = [def.id, ...def.aliases];
        for (const name of names) {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "ee-callouts-alias-chip";
          chip.textContent = `[!${name}]`;
          chip.style.setProperty("--ee-callout-rgb", def.rgb);
          chip.setAttribute("data-active", String(selectedType.toLowerCase() === name));
          chip.addEventListener("click", () => {
            selectedType = name;
            typeInput.value = name;
            renderTypePicker();
            renderAliases();
            renderPreviews();
          });
          aliasRow.appendChild(chip);
        }
      };

      const renderTypePicker = () => {
        typeGridSection.replaceChildren();
        const currentSettings = getSettings();
        const query = searchQuery.trim().toLowerCase();
        const activeSpec = resolveCalloutType(selectedType, currentSettings.customTypes);

        const grid = document.createElement("div");
        grid.className = "ee-callouts-type-grid";

        const cards: Array<{
          id: string;
          label: string;
          rgb: string;
          icon: ReturnType<typeof resolveCalloutType>["icon"];
          category: string;
          aliases: readonly string[];
        }> = [
          ...Array.from(currentSettings.customTypes.values()).map((custom) => ({
            id: custom.id,
            label: formatDefaultCalloutTitle(custom.id),
            rgb: custom.rgb,
            icon: custom.icon,
            category: "custom",
            aliases: [] as readonly string[],
          })),
          ...BUILTIN_CALLOUT_TYPES.map((builtin) => ({
            id: builtin.id,
            label: builtin.label,
            rgb: builtin.rgb,
            icon: builtin.icon,
            category: builtin.category,
            aliases: builtin.aliases,
          })),
        ];

        for (const item of cards) {
          if (activeCategory !== "all" && item.category !== activeCategory) continue;
          if (
            query &&
            !item.id.includes(query) &&
            !item.label.toLowerCase().includes(query) &&
            !item.aliases.some((alias) => alias.includes(query))
          ) {
            continue;
          }

          const card = document.createElement("button");
          card.type = "button";
          card.className = "ee-callouts-type-card";
          card.style.setProperty("--ee-callout-rgb", item.rgb);
          const isSelected =
            selectedType.toLowerCase() === item.id ||
            activeSpec.canonicalId === item.id;
          card.setAttribute("data-selected", String(isSelected));
          card.setAttribute("aria-pressed", String(isSelected));

          const iconWrap = document.createElement("span");
          iconWrap.className = "ee-callouts-type-icon";
          iconWrap.innerHTML = iconToSvgMarkup(item.icon, 15);

          const meta = document.createElement("span");
          meta.className = "ee-callouts-type-meta";

          const nameEl = document.createElement("span");
          nameEl.className = "ee-callouts-type-name";
          nameEl.textContent = item.label;

          const tokenEl = document.createElement("span");
          tokenEl.className = "ee-callouts-type-token";
          tokenEl.textContent = `[!${item.id}]`;

          meta.append(nameEl, tokenEl);
          card.append(iconWrap, meta);

          card.addEventListener("click", () => {
            selectedType = item.id;
            typeInput.value = item.id;
            renderTypePicker();
            renderAliases();
            renderPreviews();
          });

          grid.appendChild(card);
        }

        typeGridSection.appendChild(grid);
      };

      const renderPreviews = () => {
        const previewCard = renderPreviewBlockquote(controller, previewHost, {
          type: selectedType,
          fold,
          title: customTitle,
          body: bodyText || "Preview body text…",
        });
        if (fold === "+" || fold === "-") {
          const firstP = previewCard.firstElementChild;
          firstP?.addEventListener("click", () => {
            controller.toggleCalloutElement(previewCard);
          });
        }

        markdownPre.textContent = serializeCalloutMarkdown({
          type: selectedType,
          fold,
          title: customTitle,
          body: bodyText,
        });
      };

      typeInput.addEventListener("input", () => {
        selectedType = typeInput.value.trim() || "note";
        renderTypePicker();
        renderAliases();
        renderPreviews();
      });

      titleInput.addEventListener("input", () => {
        customTitle = titleInput.value;
        renderPreviews();
      });

      bodyInput.addEventListener("input", () => {
        bodyText = bodyInput.value;
        renderPreviews();
      });

      syncShell();
      renderTypePicker();
      renderAliases();
      renderFoldButtons();
      renderPreviews();

      return () => {
        disposed = true;
        container.replaceChildren();
      };
    },
  });

  const disposeExplorer = context.ui.panels.register({
    id: "callout-explorer",
    title: copy.panelExplorerTitle,
    purpose: "dashboard",
    presentation: "dialog",
    mount(container, { shell, requestClose }) {
      const uiCopy = getUiCopy();
      let disposed = false;
      let loading = true;
      let typeFilter = "all";
      let searchQuery = "";
      let items: ExplorerCalloutItem[] = [];

      const root = document.createElement("div");
      root.className = "ee-callouts-panel";
      container.replaceChildren(root);

      const syncExplorerChrome = (filteredCount: number) => {
        const isEmpty = !loading && filteredCount === 0;
        shell.set({
          header: {
            title: uiCopy.explorerTitle,
            description: uiCopy.explorerDescription,
            actions: [
              { id: "refresh", label: uiCopy.refreshAction, variant: "default", disabled: loading },
              { id: "compose", label: uiCopy.insertAction, variant: "primary" },
            ],
          },
          toolbar: [
            {
              type: "tabs",
              key: "typeFilter",
              value: typeFilter,
              options: [
                { value: "all", label: uiCopy.allCategory },
                { value: "note", label: "Note" },
                { value: "tip", label: "Tip" },
                { value: "todo", label: "Todo" },
                { value: "question", label: "Question" },
                { value: "warning", label: "Warning" },
                { value: "danger", label: "Danger" },
              ],
            },
            {
              type: "search",
              key: "q",
              placeholder: uiCopy.searchExplorerPlaceholder,
              value: searchQuery,
            },
          ],
          empty: isEmpty
            ? {
                title: uiCopy.emptyExplorerTitle,
                description: uiCopy.emptyExplorerDescription,
              }
            : null,
          onAction(actionId) {
            if (disposed) return;
            if (actionId === "refresh") {
              void load();
              return;
            }
            if (actionId === "compose") {
              void requestClose().then(() => context.ui.panels.open("callout-composer"));
            }
          },
          onChange(key, value) {
            if (key === "typeFilter") typeFilter = value;
            if (key === "q") searchQuery = value;
            renderList();
          },
        });
      };

      const renderList = () => {
        if (disposed) return;
        root.replaceChildren();

        if (loading) {
          syncExplorerChrome(1);
          const status = document.createElement("p");
          status.className = "ee-callouts-type-token";
          status.textContent = uiCopy.scanningNotes;
          root.appendChild(status);
          return;
        }

        const q = searchQuery.trim().toLowerCase();
        const filtered = items.filter((item) => {
          if (typeFilter !== "all" && item.canonicalId !== typeFilter) return false;
          if (!q) return true;
          return (
            item.callout.effectiveTitle.toLowerCase().includes(q) ||
            item.callout.rawType.toLowerCase().includes(q) ||
            item.callout.bodyMarkdown.toLowerCase().includes(q) ||
            item.noteTitle.toLowerCase().includes(q)
          );
        });

        syncExplorerChrome(filtered.length);
        if (filtered.length === 0) return;

        const list = document.createElement("div");
        list.className = "ee-callouts-explorer-list";

        for (const item of filtered) {
          const card = document.createElement("article");
          card.className = "ee-callouts-explorer-card";
          card.style.setProperty("--ee-callout-rgb", item.rgb);

          const head = document.createElement("div");
          head.className = "ee-callouts-explorer-head";

          const titleRow = document.createElement("div");
          titleRow.className = "ee-callouts-explorer-title-row";
          const iconEl = document.createElement("span");
          iconEl.innerHTML = iconToSvgMarkup(item.icon, 16);
          const titleText = document.createElement("span");
          titleText.textContent = item.callout.effectiveTitle;
          titleRow.append(iconEl, titleText);

          const badge = document.createElement("span");
          badge.className = "ee-callouts-badge";
          badge.textContent = `[!${item.callout.rawType}]${item.callout.fold}`;

          head.append(titleRow, badge);
          card.appendChild(head);

          if (item.callout.bodyMarkdown) {
            const body = document.createElement("div");
            body.className = "ee-callouts-explorer-body";
            body.textContent =
              item.callout.bodyMarkdown.length > 260
                ? `${item.callout.bodyMarkdown.slice(0, 260)}…`
                : item.callout.bodyMarkdown;
            card.appendChild(body);
          }

          const foot = document.createElement("div");
          foot.className = "ee-callouts-explorer-foot";

          const meta = document.createElement("span");
          meta.textContent = `${item.noteTitle} · ${uiCopy.lineBadge(item.callout.lineNumber)}`;

          const openBtn = document.createElement("button");
          openBtn.type = "button";
          openBtn.className = "ee-callouts-open-btn";
          openBtn.textContent = uiCopy.openInNote;
          openBtn.addEventListener("click", () => {
            void context.ui
              .openNote(item.noteId, { search: item.searchTerm })
              .then(() => requestClose());
          });

          foot.append(meta, openBtn);
          card.appendChild(foot);
          list.appendChild(card);
        }

        root.appendChild(list);
      };

      const load = async () => {
        loading = true;
        renderList();
        try {
          items = await scanWorkspaceCallouts(context, getSettings());
        } catch (error) {
          items = [];
          context.ui.showNotice(error instanceof Error ? error.message : String(error));
        } finally {
          loading = false;
          renderList();
        }
      };

      void load();

      return () => {
        disposed = true;
        container.replaceChildren();
      };
    },
  });

  const disposeEmbed = context.editor.embeds.register({
    type: "callout",
    mount(container: HTMLElement, embed: PluginEmbedInstance) {
      const data = embed.data && typeof embed.data === "object" && !Array.isArray(embed.data)
        ? (embed.data as Record<string, unknown>)
        : {};
      const type = typeof data.type === "string" && data.type.trim() ? data.type.trim() : "note";
      const fold: CalloutFoldModifier =
        data.fold === "+" || data.fold === "-" ? data.fold : "";
      const title =
        typeof data.title === "string"
          ? data.title
          : embed.title || "";
      const body = typeof data.body === "string" ? data.body : "";

      const wrapper = document.createElement("div");
      wrapper.className = "ee-callouts-preview-host ee-callouts-embed-root";
      const blockquote = renderPreviewBlockquote(controller, wrapper, {
        type,
        fold,
        title,
        body,
      });

      if (fold === "+" || fold === "-") {
        const firstP = blockquote.firstElementChild;
        firstP?.addEventListener("click", () => {
          controller.toggleCalloutElement(blockquote);
        });
      }

      container.replaceChildren(wrapper);
      return () => {
        container.replaceChildren();
      };
    },
  });

  return [disposeComposer, disposeExplorer, disposeEmbed];
};
