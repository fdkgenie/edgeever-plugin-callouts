import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseHTML } from "linkedom";
import { CalloutDomController } from "../src/dom-renderer.ts";
import {
  buildWrapOrInsertEdit,
  cycleCalloutFoldAtTarget,
  extractCalloutsFromMarkdown,
  normalizeCompactCalloutsInMarkdown,
  parseCalloutHeaderLine,
  serializeCalloutMarkdown,
  snapToUtf16Boundary,
} from "../src/parser.ts";
import {
  BUILTIN_CALLOUT_TYPES,
  formatDefaultCalloutTitle,
  parseCustomTypesSetting,
  resolveCalloutType,
} from "../src/types.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(__dirname, "..");
const monorepoPublicDir = path.resolve(pluginRoot, "../../apps/web/public/extensions/callouts");

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const originalMutationObserver = globalThis.MutationObserver;
const originalNode = globalThis.Node;
const originalElement = globalThis.Element;
const originalHTMLElement = globalThis.HTMLElement;
const originalMouseEvent = globalThis.MouseEvent;

const restoreGlobal = (key, prev, stub) => {
  if (globalThis[key] === stub) {
    if (prev === undefined) delete globalThis[key];
    else globalThis[key] = prev;
  }
};

const dom = parseHTML("<!doctype html><html><head></head><body></body></html>");
const doc = dom.document;

const StubMutationObserver = class {
  observe() {}
  disconnect() {}
};

const stubWindow = {
  location: { href: "https://edgeever.example/notes" },
  addEventListener: () => {},
  removeEventListener: () => {},
  getSelection: () => null,
};

globalThis.window = stubWindow;
globalThis.document = doc;
globalThis.MutationObserver = StubMutationObserver;
globalThis.Node = dom.Node;
globalThis.Element = dom.Element;
globalThis.HTMLElement = dom.HTMLElement;
globalThis.MouseEvent = dom.Event;

afterAll(() => {
  restoreGlobal("window", originalWindow, stubWindow);
  restoreGlobal("document", originalDocument, doc);
  restoreGlobal("MutationObserver", originalMutationObserver, StubMutationObserver);
  restoreGlobal("Node", originalNode, dom.Node);
  restoreGlobal("Element", originalElement, dom.Element);
  restoreGlobal("HTMLElement", originalHTMLElement, dom.HTMLElement);
  restoreGlobal("MouseEvent", originalMouseEvent, dom.Event);
});

beforeEach(() => {
  doc.head.replaceChildren();
  doc.body.replaceChildren();
  doc.documentElement.className = "";
  doc.documentElement.lang = "en-US";
  doc.documentElement.removeAttribute("data-ee-callouts-style");
  doc.documentElement.removeAttribute("data-ee-callouts-live-preview");
});

const applyMarkdownEdits = (source, edits) => {
  const ordered = [...edits].sort((a, b) => a.from - b.from || a.to - b.to);
  return ordered.reduceRight(
    (acc, edit) => `${acc.slice(0, edit.from)}${edit.insert}${acc.slice(edit.to)}`,
    source,
  );
};

describe("Callouts manifest & build artifacts", () => {
  test("validates manifest.json and standalone bundle constraints", async () => {
    const [srcManifest, srcMain, srcCss, pkgRaw] = await Promise.all([
      readFile(path.join(pluginRoot, "manifest.json"), "utf8"),
      readFile(path.join(pluginRoot, "main.js"), "utf8"),
      readFile(path.join(pluginRoot, "styles.css"), "utf8"),
      readFile(path.join(pluginRoot, "package.json"), "utf8"),
    ]);

    const manifest = JSON.parse(srcManifest);
    const pkg = JSON.parse(pkgRaw);

    expect(manifest.type).toBe("plugin");
    expect(manifest.id).toBe("io.edgeever.callouts");
    expect(manifest.id.startsWith("org.edgeever.")).toBe(false);
    expect(manifest.version).toBe(pkg.version);
    expect(manifest.apiVersion).toBe("2");
    expect(manifest.settingsUi).toBe("host");
    expect(manifest.entry).toBe("./main.js");
    expect(manifest.locales?.["zh-CN"]?.name).toBeTruthy();
    expect(manifest.locales?.vi?.name).toBeTruthy();

    for (const field of manifest.settings?.fields ?? []) {
      expect(field.key).toMatch(/^[a-z][a-z0-9._-]*$/);
    }

    expect(Buffer.byteLength(srcMain, "utf8")).toBeLessThanOrEqual(5 * 1024 * 1024);
    expect(Buffer.byteLength(srcCss, "utf8")).toBeLessThanOrEqual(1024 * 1024);
    expect(srcMain).not.toMatch(/^\s*(?:import|export)\s+[^;\n]*from\s+["']\.\.?\//m);

    if (existsSync(monorepoPublicDir)) {
      const [pubManifest, pubMain, pubCss] = await Promise.all([
        readFile(path.join(monorepoPublicDir, "manifest.json"), "utf8"),
        readFile(path.join(monorepoPublicDir, "main.js"), "utf8"),
        readFile(path.join(monorepoPublicDir, "styles.css"), "utf8"),
      ]);
      expect(pubManifest).toBe(srcManifest);
      expect(pubMain).toBe(srcMain);
      expect(pubCss).toBe(srcCss);
    }
  });

  test("contains zero HTML native title attributes in plugin UI source", async () => {
    const sources = await Promise.all([
      readFile(path.join(pluginRoot, "src/index.ts"), "utf8"),
      readFile(path.join(pluginRoot, "src/panels.ts"), "utf8"),
      readFile(path.join(pluginRoot, "src/dom-renderer.ts"), "utf8"),
    ]);
    for (const source of sources) {
      expect(source).not.toMatch(/\.title\s*=[^=]/);
      expect(source).not.toMatch(/setAttribute\(["']title["']/);
    }
  });
});

describe("Obsidian Callouts specification & parser", () => {
  test("resolves all 13 canonical types, 14 aliases, case-insensitivity, fallback, and custom types", () => {
    const aliasPairs = [
      ["abstract", "summary"],
      ["abstract", "tldr"],
      ["tip", "hint"],
      ["tip", "important"],
      ["success", "check"],
      ["success", "done"],
      ["question", "help"],
      ["question", "faq"],
      ["warning", "caution"],
      ["warning", "attention"],
      ["failure", "fail"],
      ["failure", "missing"],
      ["danger", "error"],
      ["quote", "cite"],
    ];

    expect(BUILTIN_CALLOUT_TYPES).toHaveLength(13);
    for (const def of BUILTIN_CALLOUT_TYPES) {
      const resolved = resolveCalloutType(def.id.toUpperCase());
      expect(resolved.canonicalId).toBe(def.id);
      expect(resolved.isFallback).toBe(false);
    }

    for (const [canonical, alias] of aliasPairs) {
      const resolved = resolveCalloutType(alias.toUpperCase());
      expect(resolved.canonicalId).toBe(canonical);
      expect(resolved.isFallback).toBe(false);
    }

    const fallback = resolveCalloutType("unknown-callout-kind");
    expect(fallback.canonicalId).toBe("note");
    expect(fallback.isFallback).toBe(true);

    const customTypes = parseCustomTypesSetting("idea=#eab308,lightbulb;\nsecurity=#10b981,shield\nbad=#xyz");
    expect(customTypes.size).toBe(2);
    const idea = resolveCalloutType("IDEA", customTypes);
    expect(idea.isCustom).toBe(true);
    expect(idea.rgb).toBe("234, 179, 8");
    expect(idea.icon).toBe("lightbulb");
  });

  test("parses header syntax, folds, default titles, escaped brackets, and rejects links", () => {
    expect(parseCalloutHeaderLine("[!note]")).toMatchObject({
      rawType: "note",
      fold: "",
      customTitle: "",
      effectiveTitle: "Note",
    });
    expect(parseCalloutHeaderLine("[!WARNING]+ Careful Now")).toMatchObject({
      rawType: "WARNING",
      normalizedType: "warning",
      fold: "+",
      customTitle: "Careful Now",
      effectiveTitle: "Careful Now",
    });
    expect(parseCalloutHeaderLine("\\[!faq\\]- Hidden Question")).toMatchObject({
      rawType: "faq",
      fold: "-",
      customTitle: "Hidden Question",
      effectiveTitle: "Hidden Question",
      escapedBrackets: true,
    });
    expect(parseCalloutHeaderLine("[!note] [Linked Title](https://example.com)")).toMatchObject({
      rawType: "note",
      customTitle: "[Linked Title](https://example.com)",
    });
    expect(formatDefaultCalloutTitle("my-custom_note")).toBe("My Custom Note");

    expect(parseCalloutHeaderLine("[!note](https://example.com)")).toBeNull();
    expect(parseCalloutHeaderLine("[!note]: https://example.com")).toBeNull();
    expect(parseCalloutHeaderLine("Regular quote text")).toBeNull();
  });

  test("extracts top-level & nested callouts while ignoring front matter and code fences", () => {
    const markdown = [
      "---",
      "title: > [!note] Not a callout",
      "---",
      "",
      "```markdown",
      "> [!warning] Inside code fence",
      "> Ignored",
      "```",
      "",
      "> [!question] Outer question",
      ">",
      "> Outer body",
      ">",
      "> > [!success]- Nested answer",
      "> >",
      "> > Nested body",
      "",
      "> [!info] Title only",
    ].join("\n");

    const callouts = extractCalloutsFromMarkdown(markdown);
    expect(callouts).toHaveLength(3);

    expect(callouts[0]).toMatchObject({
      index: 0,
      depth: 1,
      rawType: "question",
      effectiveTitle: "Outer question",
      fold: "",
      hasCompactBody: false,
    });
    expect(callouts[1]).toMatchObject({
      index: 1,
      depth: 2,
      rawType: "success",
      effectiveTitle: "Nested answer",
      fold: "-",
      bodyMarkdown: "Nested body",
    });
    expect(callouts[2]).toMatchObject({
      index: 2,
      depth: 1,
      rawType: "info",
      effectiveTitle: "Title only",
      bodyMarkdown: "",
    });
  });

  test("serializes and round-trips callout Markdown cleanly", () => {
    const serialized = serializeCalloutMarkdown({
      type: "tip",
      fold: "+",
      title: "Pro Tip",
      body: "First line\n\n- Item A\n- Item B",
    });

    expect(serialized).toBe("> [!tip]+ Pro Tip\n>\n> First line\n>\n> - Item A\n> - Item B");
    const reparsed = extractCalloutsFromMarkdown(serialized);
    expect(reparsed).toHaveLength(1);
    expect(reparsed[0]).toMatchObject({
      normalizedType: "tip",
      fold: "+",
      customTitle: "Pro Tip",
      effectiveTitle: "Pro Tip",
      bodyMarkdown: "First line\n\n- Item A\n- Item B",
    });
  });

  test("supports wrap/insert/update edits, fold cycling, compact normalization, and UTF-16 safety", () => {
    const source = "Intro paragraph\n\nSelect me please\n\nOutro";
    const wrapEdits = buildWrapOrInsertEdit(source, {
      mode: "wrap",
      selectionText: "Select me please",
      selectionMarkdown: "Select me please",
      callout: { type: "important", fold: "+", title: "Key Point" },
    });
    const wrapped = applyMarkdownEdits(source, wrapEdits);
    expect(wrapped).toContain("> [!important]+ Key Point\n>\n> Select me please");

    const cycled = cycleCalloutFoldAtTarget(wrapped, 0);
    expect(cycled?.nextFold).toBe("-");
    const afterCycle = applyMarkdownEdits(wrapped, cycled.edits);
    expect(afterCycle).toContain("> [!important]- Key Point");

    const compact = "> [!note] Compact\n> Line one\n> Line two";
    const norm = normalizeCompactCalloutsInMarkdown(compact);
    expect(norm.count).toBe(1);
    const normalized = applyMarkdownEdits(compact, norm.edits);
    expect(normalized).toBe("> [!note] Compact\n>\n> Line one\n> Line two");

    expect(snapToUtf16Boundary("A😀B", 2)).toBe(1);
  });
});

describe("CalloutDomController & ProseMirror safety", () => {
  test("decorates editor/preview blockquotes without mutating ProseMirror children", async () => {
    const proseMirror = doc.createElement("div");
    proseMirror.className = "ProseMirror";
    proseMirror.setAttribute("contenteditable", "true");

    const noteWrapper = doc.createElement("div");
    noteWrapper.setAttribute("data-note-title", "Demo Note");
    noteWrapper.appendChild(proseMirror);
    doc.body.appendChild(noteWrapper);

    const bqCallout = doc.createElement("blockquote");
    const pHeader = doc.createElement("p");
    pHeader.textContent = "[!faq]- Expandable Question";
    const pBody = doc.createElement("p");
    pBody.textContent = "Hidden answer";
    const nestedBq = doc.createElement("blockquote");
    const nestedP = doc.createElement("p");
    nestedP.textContent = "[!success] Nested OK";
    nestedBq.appendChild(nestedP);
    bqCallout.append(pHeader, pBody, nestedBq);

    const plainQuote = doc.createElement("blockquote");
    const plainP = doc.createElement("p");
    plainP.textContent = "Ordinary blockquote";
    plainQuote.appendChild(plainP);

    proseMirror.append(bqCallout, plainQuote);

    const stored = new Map();
    const mockContext = {
      pluginId: "io.edgeever.callouts",
      storage: {
        get: async (k) => stored.get(k) ?? null,
        set: async (k, v) => stored.set(k, v),
        remove: async (k) => stored.delete(k),
      },
    };

    const controller = new CalloutDomController(mockContext, {
      defaultType: "note",
      defaultFold: "none",
      visualStyle: "obsidian",
      livePreviewHeader: true,
      rememberFoldState: true,
      customTypesRaw: "",
      customTypes: new Map(),
    });
    await controller.start();

    expect(bqCallout.children.length).toBe(3);
    expect(pHeader.childNodes.length).toBe(1);
    expect(pHeader.textContent).toBe("[!faq]- Expandable Question");

    expect(bqCallout.getAttribute("data-ee-callout")).toBe("question");
    expect(bqCallout.getAttribute("data-ee-callout-foldable")).toBe("true");
    expect(bqCallout.getAttribute("data-ee-callout-collapsed")).toBe("true");
    expect(bqCallout.getAttribute("data-ee-callout-header-clean")).toBe("true");
    expect(pHeader.getAttribute("data-ee-callout-title")).toBe("Expandable Question");

    expect(nestedBq.getAttribute("data-ee-callout")).toBe("success");
    expect(nestedBq.getAttribute("data-ee-callout-title-only")).toBe("true");
    expect(plainQuote.hasAttribute("data-ee-callout")).toBe(false);

    const collapsedAfter = controller.toggleCalloutElement(bqCallout);
    expect(collapsedAfter).toBe(false);
    expect(bqCallout.getAttribute("data-ee-callout-collapsed")).toBe("false");
    await Promise.resolve();
    expect(stored.has("fold-states.v1")).toBe(true);

    const toggleAllResult = controller.toggleAllFoldable();
    expect(toggleAllResult).toEqual({ count: 1, collapsed: true });
    expect(bqCallout.getAttribute("data-ee-callout-collapsed")).toBe("true");

    controller.dispose();
    expect(bqCallout.hasAttribute("data-ee-callout")).toBe(false);
    expect(pHeader.hasAttribute("data-ee-callout-title")).toBe(false);
    expect(doc.documentElement.hasAttribute("data-ee-callouts-style")).toBe(false);
  });

  test("handles compact single-paragraph callouts and header-edit reveal on mousedown", async () => {
    const proseMirror = doc.createElement("div");
    proseMirror.className = "ProseMirror";
    proseMirror.setAttribute("contenteditable", "true");
    doc.body.appendChild(proseMirror);

    const compactBq = doc.createElement("blockquote");
    const compactP = doc.createElement("p");
    compactP.textContent = "[!tip]- Compact Title\nCompact body line";
    compactBq.appendChild(compactP);
    proseMirror.appendChild(compactBq);

    const mockContext = {
      pluginId: "io.edgeever.callouts",
      storage: { get: async () => null, set: async () => {}, remove: async () => {} },
    };
    const controller = new CalloutDomController(mockContext, {
      defaultType: "note",
      defaultFold: "none",
      visualStyle: "obsidian",
      livePreviewHeader: true,
      rememberFoldState: false,
      customTypesRaw: "",
      customTypes: new Map(),
    });
    await controller.start();

    expect(compactBq.getAttribute("data-ee-callout")).toBe("tip");
    expect(compactBq.getAttribute("data-ee-callout-single-para-body")).toBe("true");
    expect(compactBq.getAttribute("data-ee-callout-collapsed")).toBe("true");
    expect(compactBq.hasAttribute("data-ee-callout-header-clean")).toBe(false);
    expect(compactP.getAttribute("data-ee-callout-title")).toBe("Compact Title");

    const mousedown = new dom.Event("mousedown", { bubbles: true, cancelable: true });
    compactP.dispatchEvent(mousedown);
    expect(compactBq.getAttribute("data-ee-callout-editing")).toBe("true");

    controller.dispose();
  });
});

describe("Bundled main.js full lifecycle with mock EdgeEver PluginContext", () => {
  test("activates, runs commands, updates settings, mounts panels & embeds, and cleans up", async () => {
    const loaded = await import(pathToFileURL(path.join(pluginRoot, "main.js")).href);
    const plugin = loaded.default;
    expect(typeof plugin.activate).toBe("function");

    const settings = new Map([
      ["default-type", "note"],
      ["default-fold", "none"],
      ["visual-style", "obsidian"],
      ["live-preview-header", true],
      ["remember-fold-state", true],
      ["custom-types", ""],
    ]);
    const storage = new Map();
    const commands = new Map();
    const panels = new Map();
    const embeds = new Map();
    const eventListeners = new Map();
    const notices = [];
    const openedNotes = [];

    const notesData = [
      {
        kind: "text",
        id: "note-1",
        notebookId: "nb-1",
        title: "Architecture",
        excerpt: "Overview",
        tags: [],
        isPinned: false,
        createdAt: "2026-09-01T00:00:00.000Z",
        updatedAt: "2026-09-01T00:00:00.000Z",
        revision: 1,
        contentHash: "hash-1",
        contentJson: { type: "doc", content: [] },
        contentMarkdown: "Intro\n\n> [!warning] Watch out\n>\n> Mind the gap",
        contentText: "Intro Watch out Mind the gap",
      },
      {
        kind: "mind-map",
        id: "note-diagram",
        notebookId: "nb-1",
        title: "Mind Map",
        excerpt: "",
        tags: [],
        isPinned: false,
        createdAt: "2026-09-01T00:00:00.000Z",
        updatedAt: "2026-09-01T00:00:00.000Z",
        revision: 1,
        contentHash: "hash-2",
        contentJson: { type: "doc", content: [] },
        contentMarkdown: "> [!note] Should be skipped for non-text note",
        contentText: "",
      },
    ];

    let liveMarkdown = "Paragraph one\n\nTarget phrase";
    let selectionState = {
      noteId: "note-1",
      from: 15,
      to: 28,
      empty: false,
      text: "Target phrase",
      contentMarkdown: "Target phrase",
    };

    const mockContext = {
      pluginId: "io.edgeever.callouts",
      notes: {
        query: async () => ({ notes: notesData, totalCount: notesData.length, nextOffset: null }),
        queryContent: async () => ({ notes: notesData, totalCount: notesData.length, nextOffset: null }),
        get: async (id) => notesData.find((n) => n.id === id),
      },
      commands: {
        register: (cmd) => {
          commands.set(cmd.id, cmd);
          return () => commands.delete(cmd.id);
        },
      },
      events: {
        on: (event, listener) => {
          const set = eventListeners.get(event) ?? new Set();
          set.add(listener);
          eventListeners.set(event, set);
          return () => set.delete(listener);
        },
      },
      storage: {
        get: async (k) => storage.get(k) ?? null,
        set: async (k, v) => storage.set(k, v),
        remove: async (k) => storage.delete(k),
      },
      settings: {
        get: async (k) => settings.get(k) ?? null,
        set: async (k, v) => settings.set(k, v),
        remove: async (k) => settings.delete(k),
      },
      editor: {
        getSelection: async () => selectionState,
        getDocument: async () => ({ noteId: "note-1", contentMarkdown: liveMarkdown, hasUnsavedChanges: false }),
        editMarkdown: async (edits) => {
          if (liveMarkdown.includes("<!-- edgeever-diagram-v1:")) {
            const err = new Error("Structured note required");
            err.code = "STRUCTURED_NOTE_REQUIRED";
            throw err;
          }
          liveMarkdown = applyMarkdownEdits(liveMarkdown, edits);
          return { noteId: "note-1", contentMarkdown: liveMarkdown, hasUnsavedChanges: true };
        },
        insertEmbed: async () => {
          throw new Error("not used");
        },
        embeds: {
          register: (renderer) => {
            embeds.set(renderer.type, renderer);
            return () => embeds.delete(renderer.type);
          },
        },
        replaceSelection: async () => {},
        insertAtCursor: async () => {},
      },
      ui: {
        showNotice: (msg) => notices.push(msg),
        openNote: async (noteId, options) => openedNotes.push({ noteId, options }),
        panels: {
          register: (panel) => {
            panels.set(panel.id, panel);
            return () => panels.delete(panel.id);
          },
          open: async () => {},
        },
      },
    };

    const cleanup = await plugin.activate(mockContext);
    expect(typeof cleanup).toBe("function");
    expect(doc.head.querySelector('style[data-edgeever-plugin-style-fallback="io.edgeever.callouts"]')).toBeTruthy();
    expect(Array.from(panels.keys())).toEqual(["callout-composer", "callout-explorer"]);
    expect(Array.from(embeds.keys())).toEqual(["callout"]);

    await commands.get("wrap-selection").run();
    expect(liveMarkdown).toContain("> [!note]\n>\n> Target phrase");

    await commands.get("cycle-callout-fold").run();
    expect(liveMarkdown).toContain("> [!note]+\n>\n> Target phrase");

    selectionState = { noteId: "note-1", from: 0, to: 0, empty: true, text: "", contentMarkdown: "" };
    await commands.get("insert-tip-callout").run();
    expect(liveMarkdown).toContain("> [!tip]\n>\n> Helpful tip");

    settings.set("visual-style", "bordered");
    settings.set("custom-types", "idea=#eab308,lightbulb");
    for (const listener of eventListeners.get("settings.changed") ?? []) {
      await listener({ key: "visual-style" });
    }
    expect(doc.documentElement.getAttribute("data-ee-callouts-style")).toBe("bordered");

    liveMarkdown = "> [!idea] Spark\n> Brilliant thought";
    await commands.get("normalize-callouts").run();
    expect(liveMarkdown).toBe("> [!idea] Spark\n>\n> Brilliant thought");

    // Mount Callout Composer panel
    let composerChrome = null;
    let composerClosed = false;
    const composerHost = doc.createElement("div");
    const disposeComposer = await panels.get("callout-composer").mount(composerHost, {
      state: { mode: "edit", calloutIndex: 0 },
      requestClose: async () => {
        composerClosed = true;
      },
      shell: {
        set: (chrome) => {
          composerChrome = chrome;
        },
      },
    });
    expect(composerChrome?.header?.actions?.map((a) => a.id)).toEqual(["copy", "apply"]);
    expect(composerHost.querySelectorAll("button.ee-callouts-type-card").length).toBe(14);
    expect(composerHost.querySelector("[title]")).toBeNull();
    composerChrome.onAction("apply");
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(composerClosed).toBe(true);
    disposeComposer?.();

    // Mount Callout Explorer panel
    let explorerChrome = null;
    let explorerClosed = false;
    const explorerHost = doc.createElement("div");
    const disposeExplorer = await panels.get("callout-explorer").mount(explorerHost, {
      state: null,
      requestClose: async () => {
        explorerClosed = true;
      },
      shell: {
        set: (chrome) => {
          explorerChrome = chrome;
        },
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(explorerChrome?.empty).toBeNull();
    const cards = explorerHost.querySelectorAll(".ee-callouts-explorer-card");
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain("Watch out");
    explorerHost.querySelector(".ee-callouts-open-btn").click();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(openedNotes).toEqual([{ noteId: "note-1", options: { search: "Watch out" } }]);
    expect(explorerClosed).toBe(true);
    disposeExplorer?.();

    // Mount custom embed renderer
    const embedHost = doc.createElement("div");
    const disposeEmbed = await embeds.get("callout").mount(embedHost, {
      id: "embed_1",
      pluginId: "io.edgeever.callouts",
      type: "callout",
      resourceId: "res_1",
      previewResourceId: "",
      title: "Embedded Warning",
      data: { type: "warning", fold: "-", title: "Embedded Warning", body: "Careful!" },
    });
    const embedBq = embedHost.querySelector("blockquote[data-ee-callout]");
    expect(embedBq?.getAttribute("data-ee-callout")).toBe("warning");
    expect(embedBq?.getAttribute("data-ee-callout-collapsed")).toBe("true");
    disposeEmbed?.();
    expect(embedHost.children.length).toBe(0);

    // Structured note protection shows clear notice
    notices.length = 0;
    liveMarkdown = "<!-- edgeever-diagram-v1:{} -->";
    await commands.get("insert-warning-callout").run();
    expect(notices).toEqual(["Callouts can only be inserted into standard Markdown notes."]);

    cleanup();
    expect(doc.head.querySelector('style[data-edgeever-plugin-style-fallback="io.edgeever.callouts"]')).toBeNull();
    expect(doc.documentElement.hasAttribute("data-ee-callouts-style")).toBe(false);
    expect(commands.size).toBe(0);
    expect(panels.size).toBe(0);
    expect(embeds.size).toBe(0);
  });
});
