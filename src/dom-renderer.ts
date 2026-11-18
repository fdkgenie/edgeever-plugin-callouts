import type { PluginContext } from "./edgeever.ts";
import {
  parseCalloutHeaderLine,
  type EditorCursorHint,
} from "./parser.ts";
import {
  iconToCssUrl,
  resolveCalloutType,
  type CalloutPluginSettings,
} from "./types.ts";

const TARGET_CONTAINER_SELECTOR =
  ".ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host";

const CALLOUT_DATA_ATTRS = [
  "data-ee-callout",
  "data-ee-callout-type",
  "data-ee-callout-foldable",
  "data-ee-callout-collapsed",
  "data-ee-callout-title-only",
  "data-ee-callout-header-clean",
  "data-ee-callout-single-para-body",
  "data-ee-callout-editing",
] as const;

const FOLD_STORAGE_KEY = "fold-states.v1";
const MAX_STORED_FOLD_ENTRIES = 300;

interface StoredFoldEntry {
  collapsed: boolean;
  sourceFold: "+" | "-";
  updatedAt: number;
}

const setAttrIfChanged = (el: Element, name: string, value: string) => {
  if (el.getAttribute(name) !== value) {
    el.setAttribute(name, value);
  }
};

const removeAttrIfPresent = (el: Element, name: string) => {
  if (el.hasAttribute(name)) {
    el.removeAttribute(name);
  }
};

const setCssVarIfChanged = (el: HTMLElement, name: string, value: string) => {
  if (el.style.getPropertyValue(name) !== value) {
    el.style.setProperty(name, value);
  }
};

const removeCssVarIfPresent = (el: HTMLElement, name: string) => {
  if (el.style.getPropertyValue(name)) {
    el.style.removeProperty(name);
  }
};

const getFirstParagraphChild = (blockquote: Element): HTMLElement | null => {
  const first = blockquote.firstElementChild;
  if (!first) return null;
  return first.tagName?.toLowerCase() === "p" ? (first as HTMLElement) : null;
};

const extractFirstLineDetails = (paragraph: Element): { firstLine: string; hasInlineBody: boolean } => {
  let firstLine = "";
  let seenBreak = false;
  let hasInlineBody = false;

  const visit = (node: Node) => {
    if (node.nodeType === 3) {
      const value = node.nodeValue ?? "";
      if (!seenBreak) {
        const nlIndex = value.indexOf("\n");
        if (nlIndex >= 0) {
          firstLine += value.slice(0, nlIndex);
          seenBreak = true;
          if (value.slice(nlIndex + 1).trim().length > 0) {
            hasInlineBody = true;
          }
        } else {
          firstLine += value;
        }
      } else if (value.trim().length > 0) {
        hasInlineBody = true;
      }
      return;
    }

    if (node.nodeType === 1) {
      const el = node as Element;
      const tag = el.tagName?.toLowerCase();
      if (tag === "br") {
        seenBreak = true;
        return;
      }
      for (let i = 0; i < el.childNodes.length; i += 1) {
        visit(el.childNodes[i]);
      }
    }
  };

  for (let i = 0; i < paragraph.childNodes.length; i += 1) {
    visit(paragraph.childNodes[i]);
  }

  return { firstLine, hasInlineBody };
};

const hasInteractiveHeaderContent = (paragraph: Element): boolean =>
  Boolean(paragraph.querySelector("a, img, [data-type], svg, input, button"));

const stripCalloutDecoration = (blockquote: HTMLElement) => {
  for (const attr of CALLOUT_DATA_ATTRS) {
    removeAttrIfPresent(blockquote, attr);
  }
  removeAttrIfPresent(blockquote, "data-ee-callout-key");
  removeCssVarIfPresent(blockquote, "--ee-callout-rgb");
  removeCssVarIfPresent(blockquote, "--ee-callout-icon");

  const firstP = getFirstParagraphChild(blockquote);
  if (firstP) {
    removeAttrIfPresent(firstP, "data-ee-callout-title");
  }
};

export class CalloutDomController {
  private readonly context: PluginContext;
  private settings: CalloutPluginSettings;
  private readonly foldOverrides = new Map<string, StoredFoldEntry>();
  private observer: MutationObserver | null = null;
  private themeObserver: MutationObserver | null = null;
  private rafHandle: number | null = null;
  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;
  private lastCursorHint: EditorCursorHint = {
    activeCalloutIndex: null,
    activeBlockText: null,
    sourceSelectionText: null,
  };

  constructor(context: PluginContext, initialSettings: CalloutPluginSettings) {
    this.context = context;
    this.settings = initialSettings;
  }

  async start(): Promise<void> {
    if (this.disposed) return;
    await this.loadFoldOverrides();
    this.applyRootSettingsAttributes();
    this.scanAll();
    this.attachObservers();
    this.attachEventListeners();
  }

  updateSettings(nextSettings: CalloutPluginSettings): void {
    this.settings = nextSettings;
    if (this.disposed) return;
    this.applyRootSettingsAttributes();
    this.scanAll();
  }

  getLastCursorHint(): EditorCursorHint {
    return { ...this.lastCursorHint };
  }

  decoratePreviewElement(blockquote: HTMLElement): void {
    this.decorateBlockquote(blockquote, "preview:0", true);
  }

  scanAll(): void {
    if (
      this.disposed ||
      typeof document === "undefined" ||
      typeof document.querySelectorAll !== "function"
    ) {
      return;
    }
    const containers = document.querySelectorAll(TARGET_CONTAINER_SELECTOR);
    containers.forEach((container) => {
      if (container.parentElement?.closest(TARGET_CONTAINER_SELECTOR)) return;
      this.scanContainer(container);
    });
  }

  scheduleScan(): void {
    if (this.disposed) return;
    if (typeof requestAnimationFrame !== "function") {
      this.scanAll();
      return;
    }
    if (this.rafHandle !== null) return;
    this.rafHandle = requestAnimationFrame(() => {
      this.rafHandle = null;
      this.scanAll();
    });
  }

  scheduleDeferredScan(): void {
    if (this.disposed || typeof setTimeout !== "function") return;
    if (this.timeoutHandle !== null && typeof clearTimeout === "function") {
      clearTimeout(this.timeoutHandle);
    }
    this.timeoutHandle = setTimeout(() => {
      this.timeoutHandle = null;
      this.scanAll();
    }, 0);
  }

  toggleCalloutElement(blockquote: HTMLElement): boolean {
    if (blockquote.getAttribute("data-ee-callout-foldable") !== "true") return false;
    const nextCollapsed = blockquote.getAttribute("data-ee-callout-collapsed") !== "true";
    setAttrIfChanged(blockquote, "data-ee-callout-collapsed", nextCollapsed ? "true" : "false");

    const key = blockquote.getAttribute("data-ee-callout-key");
    const sourceFold = blockquote.getAttribute("data-ee-callout-source-fold") === "-" ? "-" : "+";
    if (key) {
      this.foldOverrides.set(key, {
        collapsed: nextCollapsed,
        sourceFold,
        updatedAt: Date.now(),
      });
      void this.persistFoldOverrides();
    }
    return nextCollapsed;
  }

  toggleAllFoldable(): { count: number; collapsed: boolean } {
    if (typeof document === "undefined") return { count: 0, collapsed: false };
    const targets: HTMLElement[] = [];
    const containers = document.querySelectorAll(TARGET_CONTAINER_SELECTOR);
    containers.forEach((container) => {
      if (container.classList.contains("ee-callouts-preview-host")) return;
      if (container.parentElement?.closest(TARGET_CONTAINER_SELECTOR)) return;
      container.querySelectorAll('blockquote[data-ee-callout][data-ee-callout-foldable="true"]').forEach((el) => {
        targets.push(el as HTMLElement);
      });
    });

    if (targets.length === 0) {
      return { count: 0, collapsed: false };
    }

    const anyExpanded = targets.some((el) => el.getAttribute("data-ee-callout-collapsed") !== "true");
    const nextCollapsed = anyExpanded;

    for (const el of targets) {
      setAttrIfChanged(el, "data-ee-callout-collapsed", nextCollapsed ? "true" : "false");
      const key = el.getAttribute("data-ee-callout-key");
      const sourceFold = el.getAttribute("data-ee-callout-source-fold") === "-" ? "-" : "+";
      if (key) {
        this.foldOverrides.set(key, {
          collapsed: nextCollapsed,
          sourceFold,
          updatedAt: Date.now(),
        });
      }
    }
    void this.persistFoldOverrides();
    return { count: targets.length, collapsed: nextCollapsed };
  }

  dispose(): void {
    this.disposed = true;
    this.observer?.disconnect();
    this.observer = null;
    this.themeObserver?.disconnect();
    this.themeObserver = null;
    if (this.rafHandle !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
    if (this.timeoutHandle !== null && typeof clearTimeout === "function") {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
    this.detachEventListeners();

    if (typeof document !== "undefined" && typeof document.querySelectorAll === "function") {
      const root = document.documentElement;
      root.removeAttribute("data-ee-callouts-style");
      root.removeAttribute("data-ee-callouts-live-preview");
      document.querySelectorAll("blockquote[data-ee-callout]").forEach((el) => {
        stripCalloutDecoration(el as HTMLElement);
        removeAttrIfPresent(el, "data-ee-callout-source-fold");
      });
    }
  }

  private applyRootSettingsAttributes(): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    setAttrIfChanged(root, "data-ee-callouts-style", this.settings.visualStyle);
    setAttrIfChanged(root, "data-ee-callouts-live-preview", String(this.settings.livePreviewHeader));
  }

  private scanContainer(container: Element): void {
    const scopeTitle =
      container.closest("[data-note-title]")?.getAttribute("data-note-title")?.trim() ||
      (container.classList.contains("markdown-content") ? "markdown-content" : "editor");

    const blockquotes = container.querySelectorAll("blockquote");
    let calloutOrder = 0;
    blockquotes.forEach((el) => {
      const bq = el as HTMLElement;
      const isCallout = this.decorateBlockquote(
        bq,
        `${scopeTitle}:${calloutOrder}`,
        container.classList.contains("ee-callouts-preview-host"),
      );
      if (isCallout) {
        calloutOrder += 1;
      }
    });
  }

  private decorateBlockquote(blockquote: HTMLElement, keyPrefix: string, isPreviewHost: boolean): boolean {
    const firstP = getFirstParagraphChild(blockquote);
    if (!firstP) {
      stripCalloutDecoration(blockquote);
      removeAttrIfPresent(blockquote, "data-ee-callout-source-fold");
      return false;
    }

    const { firstLine, hasInlineBody } = extractFirstLineDetails(firstP);
    const parsed = parseCalloutHeaderLine(firstLine);
    if (!parsed) {
      stripCalloutDecoration(blockquote);
      removeAttrIfPresent(blockquote, "data-ee-callout-source-fold");
      return false;
    }

    const spec = resolveCalloutType(parsed.rawType, this.settings.customTypes);
    const hasSiblingBody = blockquote.children.length > 1;
    const isTitleOnly = !hasInlineBody && !hasSiblingBody;
    const isHeaderClean = !hasInlineBody && !hasInteractiveHeaderContent(firstP);
    const foldable = parsed.fold === "+" || parsed.fold === "-";
    const foldKey = `${keyPrefix}:${parsed.normalizedType}:${parsed.effectiveTitle}`;

    setAttrIfChanged(blockquote, "data-ee-callout", spec.canonicalId);
    setAttrIfChanged(blockquote, "data-ee-callout-type", parsed.normalizedType);
    setAttrIfChanged(blockquote, "data-ee-callout-key", foldKey);
    setCssVarIfChanged(blockquote, "--ee-callout-rgb", spec.rgb);
    setCssVarIfChanged(blockquote, "--ee-callout-icon", iconToCssUrl(spec.icon));
    setAttrIfChanged(firstP, "data-ee-callout-title", parsed.effectiveTitle);

    if (isTitleOnly) {
      setAttrIfChanged(blockquote, "data-ee-callout-title-only", "true");
    } else {
      removeAttrIfPresent(blockquote, "data-ee-callout-title-only");
    }

    if (isHeaderClean) {
      setAttrIfChanged(blockquote, "data-ee-callout-header-clean", "true");
    } else {
      removeAttrIfPresent(blockquote, "data-ee-callout-header-clean");
    }

    if (hasInlineBody) {
      setAttrIfChanged(blockquote, "data-ee-callout-single-para-body", "true");
    } else {
      removeAttrIfPresent(blockquote, "data-ee-callout-single-para-body");
    }

    if (foldable) {
      const sourceFold = parsed.fold as "+" | "-";
      setAttrIfChanged(blockquote, "data-ee-callout-foldable", "true");
      setAttrIfChanged(blockquote, "data-ee-callout-source-fold", sourceFold);

      const override = !isPreviewHost && this.settings.rememberFoldState
        ? this.foldOverrides.get(foldKey)
        : undefined;
      const shouldCollapse = override && override.sourceFold === sourceFold
        ? override.collapsed
        : sourceFold === "-";

      // Preserve live interactive state if the user toggled within the same render
      // and already stored an in-session override.
      const sessionOverride = this.foldOverrides.get(foldKey);
      const effectiveCollapsed =
        sessionOverride && sessionOverride.sourceFold === sourceFold
          ? sessionOverride.collapsed
          : shouldCollapse;

      setAttrIfChanged(blockquote, "data-ee-callout-collapsed", effectiveCollapsed ? "true" : "false");
    } else {
      removeAttrIfPresent(blockquote, "data-ee-callout-foldable");
      removeAttrIfPresent(blockquote, "data-ee-callout-collapsed");
      removeAttrIfPresent(blockquote, "data-ee-callout-source-fold");
    }

    return true;
  }

  private async loadFoldOverrides(): Promise<void> {
    if (!this.settings.rememberFoldState) return;
    try {
      const stored = await this.context.storage.get<Record<string, StoredFoldEntry>>(FOLD_STORAGE_KEY);
      if (!stored || typeof stored !== "object") return;
      for (const [key, entry] of Object.entries(stored)) {
        if (
          entry &&
          typeof entry === "object" &&
          typeof entry.collapsed === "boolean" &&
          (entry.sourceFold === "+" || entry.sourceFold === "-")
        ) {
          this.foldOverrides.set(key, entry);
        }
      }
    } catch {
      // Storage may be unavailable in restricted contexts; continue with in-memory map.
    }
  }

  private async persistFoldOverrides(): Promise<void> {
    if (!this.settings.rememberFoldState) return;
    try {
      const entries = Array.from(this.foldOverrides.entries())
        .sort((a, b) => (b[1].updatedAt ?? 0) - (a[1].updatedAt ?? 0))
        .slice(0, MAX_STORED_FOLD_ENTRIES);
      await this.context.storage.set(FOLD_STORAGE_KEY, Object.fromEntries(entries));
    } catch {
      // Ignore storage persistence errors.
    }
  }

  private attachObservers(): void {
    if (typeof MutationObserver === "undefined" || typeof document === "undefined" || !document.body) {
      return;
    }
    this.observer = new MutationObserver((mutations) => {
      const hasStructuralChange = mutations.some(
        (m) => m.type === "childList" || m.type === "characterData",
      );
      if (hasStructuralChange) {
        this.scheduleScan();
      }
    });
    this.observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    this.themeObserver = new MutationObserver(() => {
      this.applyRootSettingsAttributes();
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  private attachEventListeners(): void {
    if (typeof document === "undefined") return;
    document.addEventListener("mousedown", this.handleMouseDownCapture, true);
    document.addEventListener("selectionchange", this.handleSelectionChange);
    document.addEventListener("focusin", this.handleSelectionChange);
  }

  private detachEventListeners(): void {
    if (typeof document === "undefined") return;
    document.removeEventListener("mousedown", this.handleMouseDownCapture, true);
    document.removeEventListener("selectionchange", this.handleSelectionChange);
    document.removeEventListener("focusin", this.handleSelectionChange);
  }

  private readonly handleMouseDownCapture = (event: MouseEvent): void => {
    const rawTarget = event.target;
    const targetEl = rawTarget instanceof Element
      ? rawTarget
      : rawTarget && typeof (rawTarget as Node).parentElement === "object"
        ? (rawTarget as Node).parentElement
        : null;
    if (!targetEl) return;

    const calloutEl = targetEl.closest("blockquote[data-ee-callout]") as HTMLElement | null;
    if (!calloutEl) return;

    const firstP = getFirstParagraphChild(calloutEl);
    const inEditableProseMirror = Boolean(calloutEl.closest('.ProseMirror[contenteditable="true"]'));

    if (calloutEl.getAttribute("data-ee-callout-foldable") === "true") {
      const rect = calloutEl.getBoundingClientRect?.() ?? {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
      const pRect = firstP?.getBoundingClientRect?.();
      const headerBottom = pRect && pRect.height > 0 ? pRect.bottom + 8 : rect.top + 42;
      const inChevronZone =
        rect.width > 0 &&
        event.clientX >= rect.right - 44 &&
        event.clientY >= rect.top - 4 &&
        event.clientY <= headerBottom;
      const inReadOnlyHeader = !inEditableProseMirror && Boolean(firstP && firstP.contains(targetEl));

      if (inChevronZone || inReadOnlyHeader) {
        event.preventDefault();
        event.stopPropagation();
        this.toggleCalloutElement(calloutEl);
        return;
      }
    }

    if (inEditableProseMirror && firstP && firstP.contains(targetEl)) {
      this.markEditingCallout(calloutEl);
    }
  };

  private markEditingCallout(activeCallout: HTMLElement | null): void {
    if (typeof document === "undefined") return;
    document.querySelectorAll('blockquote[data-ee-callout-editing="true"]').forEach((el) => {
      if (el !== activeCallout) {
        removeAttrIfPresent(el, "data-ee-callout-editing");
      }
    });
    if (activeCallout) {
      setAttrIfChanged(activeCallout, "data-ee-callout-editing", "true");
    }
  }

  private readonly handleSelectionChange = (): void => {
    if (this.disposed || typeof document === "undefined" || typeof window === "undefined") {
      return;
    }
    const selection = window.getSelection?.();
    const anchor = selection?.anchorNode ?? null;
    const anchorEl = anchor instanceof Element ? anchor : anchor?.parentElement ?? null;
    if (!anchorEl) {
      this.markEditingCallout(null);
      return;
    }

    const proseMirror = anchorEl.closest(".ProseMirror");
    if (proseMirror) {
      const callouts = Array.from(proseMirror.querySelectorAll("blockquote[data-ee-callout]"));
      const calloutEl = anchorEl.closest("blockquote[data-ee-callout]") as HTMLElement | null;
      const calloutIndex = calloutEl ? callouts.indexOf(calloutEl) : -1;

      const blockEl = anchorEl.closest("p, h1, h2, h3, h4, h5, h6, li");
      this.lastCursorHint = {
        activeCalloutIndex: calloutIndex >= 0 ? calloutIndex : null,
        activeBlockText: blockEl?.textContent?.trim() || null,
        sourceSelectionText: null,
      };

      if (calloutEl) {
        const firstP = getFirstParagraphChild(calloutEl);
        const inFirstP = Boolean(firstP && firstP.contains(anchorEl));
        const isSinglePara = calloutEl.getAttribute("data-ee-callout-single-para-body") === "true";

        if (!inFirstP && calloutEl.getAttribute("data-ee-callout-collapsed") === "true") {
          setAttrIfChanged(calloutEl, "data-ee-callout-collapsed", "false");
        }
        this.markEditingCallout(inFirstP || isSinglePara ? calloutEl : null);
      } else {
        this.markEditingCallout(null);
      }
      return;
    }

    const cmContent = anchorEl.closest(".cm-content");
    if (cmContent) {
      const selected = selection?.toString() ?? "";
      const activeLine = anchorEl.closest(".cm-line")?.textContent?.trim() ?? null;
      this.lastCursorHint = {
        activeCalloutIndex: null,
        activeBlockText: activeLine,
        sourceSelectionText: selected || null,
      };
      this.markEditingCallout(null);
      return;
    }

    this.markEditingCallout(null);
  };
}
