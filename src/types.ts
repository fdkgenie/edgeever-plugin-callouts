export type CalloutCategory = "info" | "tips" | "alerts" | "structure";

export type CalloutFoldModifier = "" | "+" | "-";

export type CalloutVisualStyle = "obsidian" | "minimal" | "bordered";

export type CalloutDefaultFoldSetting = "none" | "expanded" | "collapsed";

export type CalloutIconName =
  | "pencil"
  | "clipboard-list"
  | "info"
  | "circle-check"
  | "flame"
  | "check"
  | "circle-help"
  | "triangle-alert"
  | "x"
  | "zap"
  | "bug"
  | "list"
  | "quote"
  | "star"
  | "lightbulb"
  | "bookmark"
  | "sparkles"
  | "shield"
  | "terminal"
  | "book-open";

export interface BuiltinCalloutTypeDef {
  id: string;
  label: string;
  aliases: readonly string[];
  rgb: string;
  icon: CalloutIconName;
  category: CalloutCategory;
  description: string;
}

export interface CustomCalloutDef {
  id: string;
  rgb: string;
  icon: CalloutIconName;
}

export interface ResolvedCalloutSpec {
  id: string;
  canonicalId: string;
  rgb: string;
  icon: CalloutIconName;
  isCustom: boolean;
  isFallback: boolean;
}

export interface CalloutPluginSettings {
  defaultType: string;
  defaultFold: CalloutDefaultFoldSetting;
  visualStyle: CalloutVisualStyle;
  livePreviewHeader: boolean;
  rememberFoldState: boolean;
  customTypesRaw: string;
  customTypes: Map<string, CustomCalloutDef>;
}

export const BUILTIN_CALLOUT_TYPES: readonly BuiltinCalloutTypeDef[] = [
  {
    id: "note",
    label: "Note",
    aliases: [],
    rgb: "68, 138, 255",
    icon: "pencil",
    category: "info",
    description: "General notes and default fallback for unrecognized types.",
  },
  {
    id: "abstract",
    label: "Abstract",
    aliases: ["summary", "tldr"],
    rgb: "0, 176, 255",
    icon: "clipboard-list",
    category: "info",
    description: "High-level summary, abstract, or TL;DR.",
  },
  {
    id: "info",
    label: "Info",
    aliases: [],
    rgb: "2, 132, 199",
    icon: "info",
    category: "info",
    description: "Contextual background and reference details.",
  },
  {
    id: "todo",
    label: "Todo",
    aliases: [],
    rgb: "2, 132, 199",
    icon: "circle-check",
    category: "tips",
    description: "Action items, checklists, and pending tasks.",
  },
  {
    id: "tip",
    label: "Tip",
    aliases: ["hint", "important"],
    rgb: "16, 185, 129",
    icon: "flame",
    category: "tips",
    description: "Helpful advice, hints, and important takeaways.",
  },
  {
    id: "success",
    label: "Success",
    aliases: ["check", "done"],
    rgb: "22, 163, 74",
    icon: "check",
    category: "tips",
    description: "Completed steps, confirmations, and positive outcomes.",
  },
  {
    id: "question",
    label: "Question",
    aliases: ["help", "faq"],
    rgb: "217, 119, 6",
    icon: "circle-help",
    category: "alerts",
    description: "Open questions, help prompts, and FAQ entries.",
  },
  {
    id: "warning",
    label: "Warning",
    aliases: ["caution", "attention"],
    rgb: "234, 88, 12",
    icon: "triangle-alert",
    category: "alerts",
    description: "Warnings, caveats, and points requiring caution.",
  },
  {
    id: "failure",
    label: "Failure",
    aliases: ["fail", "missing"],
    rgb: "225, 29, 72",
    icon: "x",
    category: "alerts",
    description: "Failed checks, unsuccessful attempts, or missing items.",
  },
  {
    id: "danger",
    label: "Danger",
    aliases: ["error"],
    rgb: "220, 38, 38",
    icon: "zap",
    category: "alerts",
    description: "Critical hazards, breaking errors, and destructive alerts.",
  },
  {
    id: "bug",
    label: "Bug",
    aliases: [],
    rgb: "225, 29, 72",
    icon: "bug",
    category: "alerts",
    description: "Known defects, regressions, and diagnostic notes.",
  },
  {
    id: "example",
    label: "Example",
    aliases: [],
    rgb: "124, 58, 237",
    icon: "list",
    category: "structure",
    description: "Worked examples, demonstrations, and sample snippets.",
  },
  {
    id: "quote",
    label: "Quote",
    aliases: ["cite"],
    rgb: "100, 116, 139",
    icon: "quote",
    category: "structure",
    description: "Excerpts, citations, and attributed quotations.",
  },
] as const;

const BUILTIN_ALIAS_MAP = new Map<string, BuiltinCalloutTypeDef>();
for (const entry of BUILTIN_CALLOUT_TYPES) {
  BUILTIN_ALIAS_MAP.set(entry.id, entry);
  for (const alias of entry.aliases) {
    BUILTIN_ALIAS_MAP.set(alias, entry);
  }
}

export const CALLOUT_ICONS: Record<CalloutIconName, string> = {
  pencil:
    '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  "clipboard-list":
    '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  "circle-check":
    '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  flame:
    '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  "circle-help":
    '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  "triangle-alert":
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  bug: '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
  list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  quote:
    '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  lightbulb:
    '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  sparkles:
    '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  shield:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
  "book-open":
    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
};

const iconUrlCache = new Map<CalloutIconName, string>();

export const iconToSvgMarkup = (iconName: CalloutIconName, size = 16): string => {
  const inner = CALLOUT_ICONS[iconName] ?? CALLOUT_ICONS.pencil;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
};

export const iconToCssUrl = (iconName: CalloutIconName): string => {
  const cached = iconUrlCache.get(iconName);
  if (cached) return cached;
  const inner = CALLOUT_ICONS[iconName] ?? CALLOUT_ICONS.pencil;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const value = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  iconUrlCache.set(iconName, value);
  return value;
};

export const formatDefaultCalloutTitle = (rawType: string): string => {
  const cleaned = rawType.trim().replace(/[_-]+/g, " ");
  if (!cleaned) return "Note";
  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const HEX_COLOR_PATTERN = /^#([0-9a-f]{6})$/i;
const TYPE_NAME_PATTERN = /^[a-z0-9][a-z0-9_-]*$/i;

const hexToRgbTriplet = (hex: string): string | null => {
  const match = HEX_COLOR_PATTERN.exec(hex.trim());
  if (!match) return null;
  const digits = match[1];
  const r = Number.parseInt(digits.slice(0, 2), 16);
  const g = Number.parseInt(digits.slice(2, 4), 16);
  const b = Number.parseInt(digits.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const isKnownIcon = (value: string): value is CalloutIconName =>
  Object.prototype.hasOwnProperty.call(CALLOUT_ICONS, value);

export const parseCustomTypesSetting = (raw: string): Map<string, CustomCalloutDef> => {
  const result = new Map<string, CustomCalloutDef>();
  if (!raw || typeof raw !== "string") return result;

  const entries = raw.split(/[;\n]+/);
  for (const entry of entries) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;

    const rawId = trimmed.slice(0, eqIndex).trim().toLowerCase();
    if (!TYPE_NAME_PATTERN.test(rawId)) continue;

    const rhs = trimmed.slice(eqIndex + 1).trim();
    const [rawColor, rawIcon] = rhs.split(",").map((part) => part.trim());
    const rgb = hexToRgbTriplet(rawColor ?? "");
    if (!rgb) continue;

    const normalizedIcon = (rawIcon ?? "").toLowerCase();
    const icon: CalloutIconName = isKnownIcon(normalizedIcon) ? normalizedIcon : "pencil";
    result.set(rawId, { id: rawId, rgb, icon });
  }
  return result;
};

export const resolveCalloutType = (
  rawType: string,
  customTypes?: ReadonlyMap<string, CustomCalloutDef>,
): ResolvedCalloutSpec => {
  const normalized = rawType.trim().toLowerCase();
  const custom = customTypes?.get(normalized);
  if (custom) {
    return {
      id: normalized,
      canonicalId: custom.id,
      rgb: custom.rgb,
      icon: custom.icon,
      isCustom: true,
      isFallback: false,
    };
  }

  const builtin = BUILTIN_ALIAS_MAP.get(normalized);
  if (builtin) {
    return {
      id: normalized,
      canonicalId: builtin.id,
      rgb: builtin.rgb,
      icon: builtin.icon,
      isCustom: false,
      isFallback: false,
    };
  }

  const fallback = BUILTIN_CALLOUT_TYPES[0];
  return {
    id: normalized || fallback.id,
    canonicalId: fallback.id,
    rgb: fallback.rgb,
    icon: fallback.icon,
    isCustom: false,
    isFallback: true,
  };
};

export type UiLocale = "en" | "zh-CN" | "vi";

export const detectUiLocale = (): UiLocale => {
  const lang = (
    typeof document !== "undefined" ? document.documentElement.lang : ""
  ) || (
    typeof navigator !== "undefined" ? navigator.language : ""
  );
  const lower = lang.toLowerCase();
  if (lower.startsWith("zh")) return "zh-CN";
  if (lower.startsWith("vi")) return "vi";
  return "en";
};

export interface UiCopy {
  composerTitle: string;
  composerDescription: string;
  composerEditTitle: string;
  insertAction: string;
  updateAction: string;
  copyMarkdownAction: string;
  explorerTitle: string;
  explorerDescription: string;
  refreshAction: string;
  openInNote: string;
  emptyExplorerTitle: string;
  emptyExplorerDescription: string;
  searchTypesPlaceholder: string;
  searchExplorerPlaceholder: string;
  allCategory: string;
  customTypesCategory: string;
  aliasesLabel: string;
  customTypeInputLabel: string;
  customTypeInputPlaceholder: string;
  foldLabel: string;
  foldNone: string;
  foldExpanded: string;
  foldCollapsed: string;
  titleLabel: string;
  titlePlaceholder: string;
  bodyLabel: string;
  bodyPlaceholder: string;
  previewLabel: string;
  markdownLabel: string;
  noActiveEditorNotice: string;
  structuredNoteUnsupportedNotice: string;
  calloutInsertedNotice: string;
  calloutUpdatedNotice: string;
  calloutWrappedNotice: string;
  copiedNotice: string;
  foldCycledNotice: (fold: CalloutFoldModifier) => string;
  noActiveCalloutNotice: string;
  normalizedNotice: (count: number) => string;
  toggledAllNotice: (collapsed: boolean, count: number) => string;
  noFoldableCalloutsNotice: string;
  cmdInsertCallout: string;
  cmdWrapSelection: string;
  cmdCycleFold: string;
  cmdToggleAll: string;
  cmdNormalize: string;
  cmdInsertTip: string;
  cmdInsertWarning: string;
  cmdInsertQuestion: string;
  cmdOpenExplorer: string;
  panelComposerTitle: string;
  panelExplorerTitle: string;
  scanningNotes: string;
  lineBadge: (line: number) => string;
}

const EN_COPY: UiCopy = {
  composerTitle: "Callout Composer",
  composerDescription: "Choose an Obsidian callout type, foldability, title, and Markdown body.",
  composerEditTitle: "Edit Callout",
  insertAction: "Insert Callout",
  updateAction: "Update Callout",
  copyMarkdownAction: "Copy Markdown",
  explorerTitle: "Callout Explorer",
  explorerDescription: "Browse callouts across your Markdown notes.",
  refreshAction: "Refresh",
  openInNote: "Open in note",
  emptyExplorerTitle: "No matching callouts",
  emptyExplorerDescription: "Try another filter or insert a callout like > [!note] in any note.",
  searchTypesPlaceholder: "Filter types or aliases…",
  searchExplorerPlaceholder: "Search title, body, type, or note…",
  allCategory: "All",
  customTypesCategory: "Custom",
  aliasesLabel: "Aliases",
  customTypeInputLabel: "Type / Alias",
  customTypeInputPlaceholder: "e.g. note, faq, tldr, or custom",
  foldLabel: "Foldable behavior",
  foldNone: "Static",
  foldExpanded: "Expanded (+)",
  foldCollapsed: "Collapsed (-)",
  titleLabel: "Custom title (optional)",
  titlePlaceholder: "Leave empty to use default capitalized type",
  bodyLabel: "Callout content (Markdown)",
  bodyPlaceholder: "Write Markdown content… Supports nested >> [!tip] callouts, lists, and code.",
  previewLabel: "Live preview",
  markdownLabel: "Markdown output",
  noActiveEditorNotice: "Open a Markdown note editor first.",
  structuredNoteUnsupportedNotice: "Callouts can only be inserted into standard Markdown notes.",
  calloutInsertedNotice: "Callout inserted.",
  calloutUpdatedNotice: "Callout updated.",
  calloutWrappedNotice: "Selection wrapped in callout.",
  copiedNotice: "Callout Markdown copied to clipboard.",
  foldCycledNotice: (fold) =>
    fold === "+"
      ? "Callout set to foldable expanded (+)."
      : fold === "-"
        ? "Callout set to foldable collapsed (-)."
        : "Callout set to static (non-foldable).",
  noActiveCalloutNotice: "Place the cursor inside a callout first.",
  normalizedNotice: (count) =>
    count > 0
      ? `Normalized ${count} compact callout${count === 1 ? "" : "s"} for rich-text separation.`
      : "All callouts in this note are already normalized.",
  toggledAllNotice: (collapsed, count) =>
    `${collapsed ? "Collapsed" : "Expanded"} ${count} foldable callout${count === 1 ? "" : "s"}.`,
  noFoldableCalloutsNotice: "No foldable callouts found in the current view.",
  cmdInsertCallout: "Insert / Edit Callout…",
  cmdWrapSelection: "Wrap Selection in Callout",
  cmdCycleFold: "Cycle Callout Fold (+ / - / None)",
  cmdToggleAll: "Collapse / Expand All Foldable Callouts",
  cmdNormalize: "Normalize Compact Callouts in Note",
  cmdInsertTip: "Insert Tip Callout ([!tip])",
  cmdInsertWarning: "Insert Warning Callout ([!warning])",
  cmdInsertQuestion: "Insert Foldable FAQ Callout ([!faq]+)",
  cmdOpenExplorer: "Open Callout Explorer",
  panelComposerTitle: "Callout Composer",
  panelExplorerTitle: "Callout Explorer",
  scanningNotes: "Scanning notes for callouts…",
  lineBadge: (line) => `Line ${line}`,
};

const ZH_COPY: UiCopy = {
  composerTitle: "Callout 提示块编辑器",
  composerDescription: "选择 Obsidian 提示块类型、折叠状态、标题与 Markdown 正文。",
  composerEditTitle: "编辑 Callout 提示块",
  insertAction: "插入提示块",
  updateAction: "更新提示块",
  copyMarkdownAction: "复制 Markdown",
  explorerTitle: "Callout 提示块浏览器",
  explorerDescription: "检索并跳转到工作区 Markdown 笔记中的所有 Callout。",
  refreshAction: "刷新",
  openInNote: "在笔记中打开",
  emptyExplorerTitle: "没有匹配的 Callout",
  emptyExplorerDescription: "请切换筛选条件，或在笔记中输入 > [!note] 创建提示块。",
  searchTypesPlaceholder: "搜索类型或别名…",
  searchExplorerPlaceholder: "搜索标题、内容、类型或笔记…",
  allCategory: "全部",
  customTypesCategory: "自定义",
  aliasesLabel: "别名",
  customTypeInputLabel: "类型 / 别名",
  customTypeInputPlaceholder: "如 note、faq、tldr 或自定义名称",
  foldLabel: "折叠设置",
  foldNone: "静态",
  foldExpanded: "默认展开 (+)",
  foldCollapsed: "默认折叠 (-)",
  titleLabel: "自定义标题（可选）",
  titlePlaceholder: "留空则自动使用类型首字母大写名称",
  bodyLabel: "提示块正文（支持 Markdown）",
  bodyPlaceholder: "输入 Markdown 内容… 支持嵌套 >> [!tip]、列表与代码块。",
  previewLabel: "实时预览",
  markdownLabel: "生成的 Markdown",
  noActiveEditorNotice: "请先打开一篇 Markdown 笔记。",
  structuredNoteUnsupportedNotice: "仅普通 Markdown 笔记支持插入 Callout。",
  calloutInsertedNotice: "已插入 Callout 提示块。",
  calloutUpdatedNotice: "已更新 Callout 提示块。",
  calloutWrappedNotice: "已将所选内容包装为 Callout。",
  copiedNotice: "已复制 Callout Markdown。",
  foldCycledNotice: (fold) =>
    fold === "+"
      ? "已设为默认展开 (+)。"
      : fold === "-"
        ? "已设为默认折叠 (-)。"
        : "已设为静态不可折叠。",
  noActiveCalloutNotice: "请先将光标移至一个 Callout 提示块内。",
  normalizedNotice: (count) =>
    count > 0 ? `已规范化 ${count} 个紧凑 Callout 的段落分隔。` : "当前笔记中的 Callout 均已规范。",
  toggledAllNotice: (collapsed, count) =>
    `已${collapsed ? "折叠" : "展开"} ${count} 个可折叠 Callout。`,
  noFoldableCalloutsNotice: "当前视图中没有可折叠的 Callout。",
  cmdInsertCallout: "插入 / 编辑 Callout…",
  cmdWrapSelection: "将选中内容包装为 Callout",
  cmdCycleFold: "切换 Callout 折叠标记 (+ / - / 无)",
  cmdToggleAll: "全部折叠 / 展开可折叠 Callout",
  cmdNormalize: "规范化笔记中的紧凑 Callout",
  cmdInsertTip: "插入提示 Callout ([!tip])",
  cmdInsertWarning: "插入警告 Callout ([!warning])",
  cmdInsertQuestion: "插入可折叠问答 Callout ([!faq]+)",
  cmdOpenExplorer: "打开 Callout 浏览器",
  panelComposerTitle: "Callout 编辑器",
  panelExplorerTitle: "Callout 浏览器",
  scanningNotes: "正在扫描笔记中的 Callout…",
  lineBadge: (line) => `第 ${line} 行`,
};

const VI_COPY: UiCopy = {
  composerTitle: "Trình tạo Callout",
  composerDescription: "Chọn loại callout chuẩn Obsidian, trạng thái thu gọn, tiêu đề và nội dung Markdown.",
  composerEditTitle: "Chỉnh sửa Callout",
  insertAction: "Chèn Callout",
  updateAction: "Cập nhật Callout",
  copyMarkdownAction: "Sao chép Markdown",
  explorerTitle: "Trình duyệt Callout",
  explorerDescription: "Tìm kiếm và mở nhanh các callout trong toàn bộ ghi chú Markdown.",
  refreshAction: "Làm mới",
  openInNote: "Mở trong ghi chú",
  emptyExplorerTitle: "Không tìm thấy callout phù hợp",
  emptyExplorerDescription: "Hãy thử bộ lọc khác hoặc gõ > [!note] trong ghi chú.",
  searchTypesPlaceholder: "Lọc theo loại hoặc bí danh…",
  searchExplorerPlaceholder: "Tìm tiêu đề, nội dung, loại hoặc ghi chú…",
  allCategory: "Tất cả",
  customTypesCategory: "Tùy chỉnh",
  aliasesLabel: "Bí danh",
  customTypeInputLabel: "Loại / Bí danh",
  customTypeInputPlaceholder: "VD: note, faq, tldr hoặc tên tùy chỉnh",
  foldLabel: "Thu gọn",
  foldNone: "Tĩnh",
  foldExpanded: "Mở sẵn (+)",
  foldCollapsed: "Thu gọn sẵn (-)",
  titleLabel: "Tiêu đề tùy chọn",
  titlePlaceholder: "Để trống để dùng tên loại mặc định",
  bodyLabel: "Nội dung Callout (Markdown)",
  bodyPlaceholder: "Nhập nội dung Markdown… Hỗ trợ callout lồng nhau >> [!tip], danh sách và mã nguồn.",
  previewLabel: "Xem trước trực tiếp",
  markdownLabel: "Mã Markdown",
  noActiveEditorNotice: "Hãy mở một ghi chú Markdown trước.",
  structuredNoteUnsupportedNotice: "Chỉ hỗ trợ chèn Callout vào ghi chú Markdown thông thường.",
  calloutInsertedNotice: "Đã chèn Callout.",
  calloutUpdatedNotice: "Đã cập nhật Callout.",
  calloutWrappedNotice: "Đã bọc vùng chọn thành Callout.",
  copiedNotice: "Đã sao chép Markdown của Callout.",
  foldCycledNotice: (fold) =>
    fold === "+"
      ? "Đã đặt callout thành mở sẵn (+)."
      : fold === "-"
        ? "Đã đặt callout thành thu gọn sẵn (-)."
        : "Đã đặt callout ở dạng tĩnh.",
  noActiveCalloutNotice: "Hãy đặt con trỏ vào bên trong một callout trước.",
  normalizedNotice: (count) =>
    count > 0 ? `Đã chuẩn hóa ${count} callout rút gọn.` : "Tất cả callout trong ghi chú đã đúng chuẩn.",
  toggledAllNotice: (collapsed, count) =>
    `Đã ${collapsed ? "thu gọn" : "mở rộng"} ${count} callout có thể thu gọn.`,
  noFoldableCalloutsNotice: "Không có callout có thể thu gọn trong khung nhìn hiện tại.",
  cmdInsertCallout: "Chèn / Sửa Callout…",
  cmdWrapSelection: "Bọc vùng chọn thành Callout",
  cmdCycleFold: "Đổi trạng thái thu gọn Callout (+ / - / Tĩnh)",
  cmdToggleAll: "Thu gọn / Mở tất cả Callout",
  cmdNormalize: "Chuẩn hóa Callout rút gọn trong ghi chú",
  cmdInsertTip: "Chèn Tip Callout ([!tip])",
  cmdInsertWarning: "Chèn Warning Callout ([!warning])",
  cmdInsertQuestion: "Chèn FAQ Callout thu gọn ([!faq]+)",
  cmdOpenExplorer: "Mở Trình duyệt Callout",
  panelComposerTitle: "Trình tạo Callout",
  panelExplorerTitle: "Trình duyệt Callout",
  scanningNotes: "Đang quét các ghi chú để tìm callout…",
  lineBadge: (line) => `Dòng ${line}`,
};

export const getUiCopy = (locale: UiLocale = detectUiLocale()): UiCopy => {
  if (locale === "zh-CN") return ZH_COPY;
  if (locale === "vi") return VI_COPY;
  return EN_COPY;
};
