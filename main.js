// styles.css
var styles_default = `/* EdgeEver Callouts Plugin — Obsidian-Compatible Callout Styles */

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout] {
  --ee-callout-rgb: 68, 138, 255;
  position: relative !important;
  box-sizing: border-box !important;
  margin: 0.9rem 0 !important;
  padding: 0.78rem 1rem !important;
  border: 1px solid rgba(var(--ee-callout-rgb), 0.22) !important;
  border-left: 4px solid rgb(var(--ee-callout-rgb)) !important;
  border-radius: 10px !important;
  background-color: rgba(var(--ee-callout-rgb), 0.08) !important;
  background-image: none !important;
  background-size: auto !important;
  color: var(--edgeever-theme-text, #1e293b) !important;
  font-style: normal !important;
  font-weight: 400 !important;
  text-align: left !important;
  box-shadow: none !important;
}

:root.dark
  :is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout] {
  border-color: rgba(var(--ee-callout-rgb), 0.34) !important;
  border-left-color: rgb(var(--ee-callout-rgb)) !important;
  background-color: rgba(var(--ee-callout-rgb), 0.14) !important;
  color: var(--edgeever-theme-text, #e2e8f0) !important;
}

/* Visual style variants */
html[data-ee-callouts-style="minimal"]
  :is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout] {
  border-top-width: 0 !important;
  border-right-width: 0 !important;
  border-bottom-width: 0 !important;
  border-left: 3.5px solid rgb(var(--ee-callout-rgb)) !important;
  border-radius: 0 8px 8px 0 !important;
  background-color: rgba(var(--ee-callout-rgb), 0.05) !important;
  padding: 0.65rem 0.95rem !important;
}

:root.dark[data-ee-callouts-style="minimal"]
  :is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout] {
  background-color: rgba(var(--ee-callout-rgb), 0.1) !important;
}

html[data-ee-callouts-style="bordered"]
  :is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout] {
  border: 1.5px solid rgba(var(--ee-callout-rgb), 0.45) !important;
  border-left: 4px solid rgb(var(--ee-callout-rgb)) !important;
  border-radius: 10px !important;
  background-color: var(--edgeever-theme-surface, #ffffff) !important;
}

:root.dark[data-ee-callouts-style="bordered"]
  :is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout] {
  border-color: rgba(var(--ee-callout-rgb), 0.55) !important;
  background-color: var(--edgeever-theme-surface, #0f172a) !important;
}

/* Override decorative theme ornaments on blockquote ::before / ::after */
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout]::before,
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout]:not([data-ee-callout-foldable="true"])::after {
  content: none !important;
  display: none !important;
  mask: none !important;
  -webkit-mask: none !important;
  background: none !important;
}

/* Callout header paragraph */
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout] > p:first-child {
  position: relative !important;
  margin-top: 0 !important;
  margin-bottom: 0.48rem !important;
  padding-left: 1.52rem !important;
  min-height: 1.4em;
  color: rgb(var(--ee-callout-rgb)) !important;
  font-weight: 650 !important;
  line-height: 1.5 !important;
}

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-foldable="true"] > p:first-child {
  padding-right: 1.85rem !important;
}

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-title-only="true"] > p:first-child,
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-collapsed="true"] > p:first-child,
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout] > p:first-child:last-child {
  margin-bottom: 0 !important;
}

/* Callout type icon via CSS mask on ::before (zero child DOM mutation inside ProseMirror) */
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout] > p:first-child::before {
  content: "" !important;
  position: absolute !important;
  left: 0 !important;
  top: 0.18em !important;
  width: 1.12em !important;
  height: 1.12em !important;
  background-color: rgb(var(--ee-callout-rgb)) !important;
  -webkit-mask: var(--ee-callout-icon) center / contain no-repeat !important;
  mask: var(--ee-callout-icon) center / contain no-repeat !important;
  pointer-events: none;
}

/* Live Preview clean header: hides raw \`[!type]\` marker when cursor is outside the header */
html:not([data-ee-callouts-live-preview="false"])
  :is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-header-clean="true"]:not([data-ee-callout-editing="true"])
  > p:first-child {
  font-size: 0 !important;
  line-height: 0 !important;
  color: transparent !important;
}

html:not([data-ee-callouts-live-preview="false"])
  :is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-header-clean="true"]:not([data-ee-callout-editing="true"])
  > p:first-child::before {
  font-size: 1rem !important;
  top: 0.22rem !important;
}

html:not([data-ee-callouts-live-preview="false"])
  :is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-header-clean="true"]:not([data-ee-callout-editing="true"])
  > p:first-child::after {
  content: attr(data-ee-callout-title) !important;
  display: inline-block !important;
  font-size: 0.96rem !important;
  line-height: 1.5 !important;
  font-weight: 650 !important;
  color: rgb(var(--ee-callout-rgb)) !important;
  letter-spacing: -0.005em;
}

/* Compact single-paragraph callouts (when header and body share one <p> separated by \\n or <br>) */
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-single-para-body="true"] > p:first-child {
  color: inherit !important;
  font-weight: 400 !important;
}

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-single-para-body="true"] > p:first-child::first-line {
  color: rgb(var(--ee-callout-rgb)) !important;
  font-weight: 650 !important;
}

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-single-para-body="true"][data-ee-callout-collapsed="true"]:not([data-ee-callout-editing="true"])
  > p:first-child {
  font-size: 0 !important;
  line-height: 0 !important;
  color: transparent !important;
}

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-single-para-body="true"][data-ee-callout-collapsed="true"]:not([data-ee-callout-editing="true"])
  > p:first-child::before {
  font-size: 1rem !important;
  top: 0.22rem !important;
}

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-single-para-body="true"][data-ee-callout-collapsed="true"]:not([data-ee-callout-editing="true"])
  > p:first-child::after {
  content: attr(data-ee-callout-title) !important;
  display: inline-block !important;
  font-size: 0.96rem !important;
  line-height: 1.5 !important;
  font-weight: 650 !important;
  color: rgb(var(--ee-callout-rgb)) !important;
}

/* Foldable callout chevron & collapsed body hiding */
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-foldable="true"]::after {
  content: "" !important;
  position: absolute !important;
  right: 0.78rem !important;
  top: 0.88rem !important;
  width: 1rem !important;
  height: 1rem !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: rgb(var(--ee-callout-rgb)) !important;
  background-image: none !important;
  opacity: 0.82 !important;
  cursor: pointer !important;
  transform: rotate(0deg) !important;
  transition: transform 150ms ease, opacity 150ms ease !important;
  -webkit-mask: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2024%2024'%20fill%3D'none'%20stroke%3D'%23000'%20stroke-width%3D'2.2'%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%3E%3Cpath%20d%3D'm6%209%206%206%206-6'%2F%3E%3C%2Fsvg%3E")
    center / contain no-repeat !important;
  mask: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2024%2024'%20fill%3D'none'%20stroke%3D'%23000'%20stroke-width%3D'2.2'%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%3E%3Cpath%20d%3D'm6%209%206%206%206-6'%2F%3E%3C%2Fsvg%3E")
    center / contain no-repeat !important;
}

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-foldable="true"][data-ee-callout-collapsed="true"]::after {
  transform: rotate(-90deg) !important;
}

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout][data-ee-callout-collapsed="true"]
  > :not(:first-child) {
  display: none !important;
}

/* Body spacing inside callout */
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout]
  > :nth-child(2) {
  margin-top: 0 !important;
}

:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout]
  > :last-child {
  margin-bottom: 0 !important;
}

/* Nested callouts */
:is(.ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host)
  blockquote[data-ee-callout]
  blockquote[data-ee-callout] {
  margin: 0.65rem 0 0.2rem !important;
}

/* =====================================================================
   Composer, Explorer & Embed UI Styles
   ===================================================================== */

.ee-callouts-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: #0f172a;
}

:root.dark .ee-callouts-panel {
  color: #e2e8f0;
}

.ee-callouts-section-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

:root.dark .ee-callouts-section-label {
  color: #94a3b8;
}

.ee-callouts-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 8px;
}

.ee-callouts-type-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 9px;
  border: 1px solid rgba(var(--ee-callout-rgb, 100, 116, 139), 0.25);
  background: rgba(var(--ee-callout-rgb, 100, 116, 139), 0.06);
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease;
}

.ee-callouts-type-card:hover {
  border-color: rgba(var(--ee-callout-rgb, 100, 116, 139), 0.55);
  background: rgba(var(--ee-callout-rgb, 100, 116, 139), 0.12);
}

.ee-callouts-type-card[data-selected="true"] {
  border-color: rgb(var(--ee-callout-rgb, 100, 116, 139));
  background: rgba(var(--ee-callout-rgb, 100, 116, 139), 0.14);
  box-shadow: 0 0 0 2px rgba(var(--ee-callout-rgb, 100, 116, 139), 0.22);
}

.ee-callouts-type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  border-radius: 6px;
  background: rgba(var(--ee-callout-rgb, 100, 116, 139), 0.14);
  color: rgb(var(--ee-callout-rgb, 100, 116, 139));
}

.ee-callouts-type-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.ee-callouts-type-name {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ee-callouts-type-token {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10.5px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:root.dark .ee-callouts-type-token {
  color: #94a3b8;
}

.ee-callouts-alias-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.ee-callouts-alias-chip {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  cursor: pointer;
}

.ee-callouts-alias-chip[data-active="true"] {
  border-color: rgb(var(--ee-callout-rgb, 22, 160, 110));
  background: rgba(var(--ee-callout-rgb, 22, 160, 110), 0.14);
  color: rgb(var(--ee-callout-rgb, 22, 160, 110));
  font-weight: 600;
}

:root.dark .ee-callouts-alias-chip {
  border-color: #334155;
  background: #1e293b;
  color: #cbd5e1;
}

.ee-callouts-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .ee-callouts-form-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.ee-callouts-input,
.ee-callouts-textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  padding: 7px 10px;
  font-size: 13px;
  line-height: 1.45;
  outline: none;
}

.ee-callouts-input:focus,
.ee-callouts-textarea:focus {
  border-color: #16a06e;
  box-shadow: 0 0 0 2px rgba(22, 160, 110, 0.16);
}

:root.dark .ee-callouts-input,
:root.dark .ee-callouts-textarea {
  border-color: #334155;
  background: #0f172a;
  color: #f8fafc;
}

.ee-callouts-textarea {
  min-height: 88px;
  resize: vertical;
  font-family: inherit;
}

.ee-callouts-segmented {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ee-callouts-seg-btn {
  padding: 6px 10px;
  border-radius: 7px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.ee-callouts-seg-btn[data-active="true"] {
  border-color: #16a06e;
  background: rgba(22, 160, 110, 0.12);
  color: #047857;
  font-weight: 600;
}

:root.dark .ee-callouts-seg-btn {
  border-color: #334155;
  background: #1e293b;
  color: #cbd5e1;
}

:root.dark .ee-callouts-seg-btn[data-active="true"] {
  border-color: #34d399;
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}

.ee-callouts-code-preview {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #334155;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

:root.dark .ee-callouts-code-preview {
  border-color: #334155;
  background: #0f172a;
  color: #cbd5e1;
}

/* Explorer cards */
.ee-callouts-explorer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ee-callouts-explorer-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(var(--ee-callout-rgb, 100, 116, 139), 0.24);
  border-left: 4px solid rgb(var(--ee-callout-rgb, 100, 116, 139));
  background: rgba(var(--ee-callout-rgb, 100, 116, 139), 0.05);
}

:root.dark .ee-callouts-explorer-card {
  background: rgba(var(--ee-callout-rgb, 100, 116, 139), 0.12);
}

.ee-callouts-explorer-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ee-callouts-explorer-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: rgb(var(--ee-callout-rgb, 100, 116, 139));
  font-weight: 650;
  font-size: 13.5px;
}

.ee-callouts-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(var(--ee-callout-rgb, 100, 116, 139), 0.14);
  color: rgb(var(--ee-callout-rgb, 100, 116, 139));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  font-weight: 600;
}

.ee-callouts-explorer-body {
  font-size: 12.5px;
  line-height: 1.5;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
}

:root.dark .ee-callouts-explorer-body {
  color: #cbd5e1;
}

.ee-callouts-explorer-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11.5px;
  color: #64748b;
}

:root.dark .ee-callouts-explorer-foot {
  color: #94a3b8;
}

.ee-callouts-open-btn {
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.ee-callouts-open-btn:hover {
  border-color: #16a06e;
  color: #047857;
}

:root.dark .ee-callouts-open-btn {
  border-color: #334155;
  background: #1e293b;
  color: #f8fafc;
}

.ee-callouts-embed-root {
  padding: 8px;
}
`;

// src/types.ts
var BUILTIN_CALLOUT_TYPES = [
  {
    id: "note",
    label: "Note",
    aliases: [],
    rgb: "68, 138, 255",
    icon: "pencil",
    category: "info",
    description: "General notes and default fallback for unrecognized types."
  },
  {
    id: "abstract",
    label: "Abstract",
    aliases: ["summary", "tldr"],
    rgb: "0, 176, 255",
    icon: "clipboard-list",
    category: "info",
    description: "High-level summary, abstract, or TL;DR."
  },
  {
    id: "info",
    label: "Info",
    aliases: [],
    rgb: "2, 132, 199",
    icon: "info",
    category: "info",
    description: "Contextual background and reference details."
  },
  {
    id: "todo",
    label: "Todo",
    aliases: [],
    rgb: "2, 132, 199",
    icon: "circle-check",
    category: "tips",
    description: "Action items, checklists, and pending tasks."
  },
  {
    id: "tip",
    label: "Tip",
    aliases: ["hint", "important"],
    rgb: "16, 185, 129",
    icon: "flame",
    category: "tips",
    description: "Helpful advice, hints, and important takeaways."
  },
  {
    id: "success",
    label: "Success",
    aliases: ["check", "done"],
    rgb: "22, 163, 74",
    icon: "check",
    category: "tips",
    description: "Completed steps, confirmations, and positive outcomes."
  },
  {
    id: "question",
    label: "Question",
    aliases: ["help", "faq"],
    rgb: "217, 119, 6",
    icon: "circle-help",
    category: "alerts",
    description: "Open questions, help prompts, and FAQ entries."
  },
  {
    id: "warning",
    label: "Warning",
    aliases: ["caution", "attention"],
    rgb: "234, 88, 12",
    icon: "triangle-alert",
    category: "alerts",
    description: "Warnings, caveats, and points requiring caution."
  },
  {
    id: "failure",
    label: "Failure",
    aliases: ["fail", "missing"],
    rgb: "225, 29, 72",
    icon: "x",
    category: "alerts",
    description: "Failed checks, unsuccessful attempts, or missing items."
  },
  {
    id: "danger",
    label: "Danger",
    aliases: ["error"],
    rgb: "220, 38, 38",
    icon: "zap",
    category: "alerts",
    description: "Critical hazards, breaking errors, and destructive alerts."
  },
  {
    id: "bug",
    label: "Bug",
    aliases: [],
    rgb: "225, 29, 72",
    icon: "bug",
    category: "alerts",
    description: "Known defects, regressions, and diagnostic notes."
  },
  {
    id: "example",
    label: "Example",
    aliases: [],
    rgb: "124, 58, 237",
    icon: "list",
    category: "structure",
    description: "Worked examples, demonstrations, and sample snippets."
  },
  {
    id: "quote",
    label: "Quote",
    aliases: ["cite"],
    rgb: "100, 116, 139",
    icon: "quote",
    category: "structure",
    description: "Excerpts, citations, and attributed quotations."
  }
];
var BUILTIN_ALIAS_MAP = new Map;
for (const entry of BUILTIN_CALLOUT_TYPES) {
  BUILTIN_ALIAS_MAP.set(entry.id, entry);
  for (const alias of entry.aliases) {
    BUILTIN_ALIAS_MAP.set(alias, entry);
  }
}
var CALLOUT_ICONS = {
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  "clipboard-list": '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  "circle-check": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  "circle-help": '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  "triangle-alert": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  bug: '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
  list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  quote: '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
  "book-open": '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'
};
var iconUrlCache = new Map;
var iconToSvgMarkup = (iconName, size = 16) => {
  const inner = CALLOUT_ICONS[iconName] ?? CALLOUT_ICONS.pencil;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
};
var iconToCssUrl = (iconName) => {
  const cached = iconUrlCache.get(iconName);
  if (cached)
    return cached;
  const inner = CALLOUT_ICONS[iconName] ?? CALLOUT_ICONS.pencil;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const value = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  iconUrlCache.set(iconName, value);
  return value;
};
var formatDefaultCalloutTitle = (rawType) => {
  const cleaned = rawType.trim().replace(/[_-]+/g, " ");
  if (!cleaned)
    return "Note";
  return cleaned.split(/\s+/).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};
var HEX_COLOR_PATTERN = /^#([0-9a-f]{6})$/i;
var TYPE_NAME_PATTERN = /^[a-z0-9][a-z0-9_-]*$/i;
var hexToRgbTriplet = (hex) => {
  const match = HEX_COLOR_PATTERN.exec(hex.trim());
  if (!match)
    return null;
  const digits = match[1];
  const r = Number.parseInt(digits.slice(0, 2), 16);
  const g = Number.parseInt(digits.slice(2, 4), 16);
  const b = Number.parseInt(digits.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};
var isKnownIcon = (value) => Object.prototype.hasOwnProperty.call(CALLOUT_ICONS, value);
var parseCustomTypesSetting = (raw) => {
  const result = new Map;
  if (!raw || typeof raw !== "string")
    return result;
  const entries = raw.split(/[;\n]+/);
  for (const entry of entries) {
    const trimmed = entry.trim();
    if (!trimmed)
      continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0)
      continue;
    const rawId = trimmed.slice(0, eqIndex).trim().toLowerCase();
    if (!TYPE_NAME_PATTERN.test(rawId))
      continue;
    const rhs = trimmed.slice(eqIndex + 1).trim();
    const [rawColor, rawIcon] = rhs.split(",").map((part) => part.trim());
    const rgb = hexToRgbTriplet(rawColor ?? "");
    if (!rgb)
      continue;
    const normalizedIcon = (rawIcon ?? "").toLowerCase();
    const icon = isKnownIcon(normalizedIcon) ? normalizedIcon : "pencil";
    result.set(rawId, { id: rawId, rgb, icon });
  }
  return result;
};
var resolveCalloutType = (rawType, customTypes) => {
  const normalized = rawType.trim().toLowerCase();
  const custom = customTypes?.get(normalized);
  if (custom) {
    return {
      id: normalized,
      canonicalId: custom.id,
      rgb: custom.rgb,
      icon: custom.icon,
      isCustom: true,
      isFallback: false
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
      isFallback: false
    };
  }
  const fallback = BUILTIN_CALLOUT_TYPES[0];
  return {
    id: normalized || fallback.id,
    canonicalId: fallback.id,
    rgb: fallback.rgb,
    icon: fallback.icon,
    isCustom: false,
    isFallback: true
  };
};
var detectUiLocale = () => {
  const lang = (typeof document !== "undefined" ? document.documentElement.lang : "") || (typeof navigator !== "undefined" ? navigator.language : "");
  const lower = lang.toLowerCase();
  if (lower.startsWith("zh"))
    return "zh-CN";
  if (lower.startsWith("vi"))
    return "vi";
  return "en";
};
var EN_COPY = {
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
  foldCycledNotice: (fold) => fold === "+" ? "Callout set to foldable expanded (+)." : fold === "-" ? "Callout set to foldable collapsed (-)." : "Callout set to static (non-foldable).",
  noActiveCalloutNotice: "Place the cursor inside a callout first.",
  normalizedNotice: (count) => count > 0 ? `Normalized ${count} compact callout${count === 1 ? "" : "s"} for rich-text separation.` : "All callouts in this note are already normalized.",
  toggledAllNotice: (collapsed, count) => `${collapsed ? "Collapsed" : "Expanded"} ${count} foldable callout${count === 1 ? "" : "s"}.`,
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
  lineBadge: (line) => `Line ${line}`
};
var ZH_COPY = {
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
  foldCycledNotice: (fold) => fold === "+" ? "已设为默认展开 (+)。" : fold === "-" ? "已设为默认折叠 (-)。" : "已设为静态不可折叠。",
  noActiveCalloutNotice: "请先将光标移至一个 Callout 提示块内。",
  normalizedNotice: (count) => count > 0 ? `已规范化 ${count} 个紧凑 Callout 的段落分隔。` : "当前笔记中的 Callout 均已规范。",
  toggledAllNotice: (collapsed, count) => `已${collapsed ? "折叠" : "展开"} ${count} 个可折叠 Callout。`,
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
  lineBadge: (line) => `第 ${line} 行`
};
var VI_COPY = {
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
  foldCycledNotice: (fold) => fold === "+" ? "Đã đặt callout thành mở sẵn (+)." : fold === "-" ? "Đã đặt callout thành thu gọn sẵn (-)." : "Đã đặt callout ở dạng tĩnh.",
  noActiveCalloutNotice: "Hãy đặt con trỏ vào bên trong một callout trước.",
  normalizedNotice: (count) => count > 0 ? `Đã chuẩn hóa ${count} callout rút gọn.` : "Tất cả callout trong ghi chú đã đúng chuẩn.",
  toggledAllNotice: (collapsed, count) => `Đã ${collapsed ? "thu gọn" : "mở rộng"} ${count} callout có thể thu gọn.`,
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
  lineBadge: (line) => `Dòng ${line}`
};
var getUiCopy = (locale = detectUiLocale()) => {
  if (locale === "zh-CN")
    return ZH_COPY;
  if (locale === "vi")
    return VI_COPY;
  return EN_COPY;
};

// src/parser.ts
var CALLOUT_HEADER_PATTERN = /^[ \t]*(\\)?\[!([a-zA-Z0-9_-]+)(\\)?\]([+-])?(?:[ \t]+(.*))?$/;
var FENCE_OPEN_PATTERN = /^ {0,3}(`{3,}|~{3,})/;
var parseCalloutHeaderLine = (line) => {
  const cleaned = line.replace(/\r$/, "");
  const match = CALLOUT_HEADER_PATTERN.exec(cleaned);
  if (!match)
    return null;
  const escapedBrackets = Boolean(match[1] || match[3]);
  const rawType = match[2];
  const fold = match[4] ?? "";
  const rawTitle = (match[5] ?? "").trim();
  const normalizedType = rawType.toLowerCase();
  const effectiveTitle = rawTitle || formatDefaultCalloutTitle(rawType);
  return {
    rawType,
    normalizedType,
    fold,
    customTitle: rawTitle,
    effectiveTitle,
    escapedBrackets
  };
};
var snapToUtf16Boundary = (text, offset) => {
  let clamped = Math.max(0, Math.min(offset, text.length));
  if (clamped > 0 && clamped < text.length) {
    const prev = text.charCodeAt(clamped - 1);
    const curr = text.charCodeAt(clamped);
    if (prev >= 55296 && prev <= 56319 && curr >= 56320 && curr <= 57343) {
      clamped -= 1;
    }
  }
  return clamped;
};
var stripBlockquotePrefix = (line, maxDepth) => {
  let index = 0;
  let depth = 0;
  while (depth < maxDepth && index < line.length) {
    let probe = index;
    let spaces = 0;
    while (probe < line.length && spaces < 3 && line[probe] === " ") {
      probe += 1;
      spaces += 1;
    }
    if (line[probe] === ">") {
      depth += 1;
      index = probe + 1;
      if (line[index] === " ")
        index += 1;
    } else {
      break;
    }
  }
  return { depth, rest: line.slice(index) };
};
var countBlockquoteDepth = (line) => stripBlockquotePrefix(line, Number.MAX_SAFE_INTEGER);
var splitLinesWithOffsets = (markdown) => {
  const lines = [];
  let start = 0;
  let lineNumber = 1;
  while (start <= markdown.length) {
    const nlIndex = markdown.indexOf(`
`, start);
    if (nlIndex === -1) {
      lines.push({
        text: markdown.slice(start),
        start,
        end: markdown.length,
        lineNumber
      });
      break;
    }
    const rawLine = markdown.slice(start, nlIndex);
    const text = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
    const end = start + text.length;
    lines.push({ text, start, end, lineNumber });
    start = nlIndex + 1;
    lineNumber += 1;
  }
  return lines;
};
var detectFrontMatterEndLine = (lines) => {
  if (lines.length < 3 || lines[0]?.text.trim() !== "---")
    return -1;
  for (let i = 1;i < lines.length; i += 1) {
    const trimmed = lines[i].text.trim();
    if (trimmed === "---" || trimmed === "...") {
      return i;
    }
  }
  return -1;
};
var extractCalloutsFromMarkdown = (markdown) => {
  if (!markdown)
    return [];
  const lines = splitLinesWithOffsets(markdown);
  const frontMatterEnd = detectFrontMatterEndLine(lines);
  const results = [];
  const stack = [];
  let activeFenceChar = null;
  let activeFenceLength = 0;
  let activeFenceDepth = 0;
  const closeFramesAboveDepth = (targetDepth) => {
    while (stack.length > 0 && stack[stack.length - 1].depth > targetDepth) {
      const frame = stack.pop();
      const bodyRaw = frame.bodyLines.join(`
`).replace(/^\n+|\n+$/g, "");
      results[frame.index] = {
        index: frame.index,
        depth: frame.depth,
        from: frame.from,
        to: frame.lastLineEnd,
        headerFrom: frame.headerFrom,
        headerTo: frame.headerTo,
        lineNumber: frame.lineNumber,
        rawType: frame.header.rawType,
        normalizedType: frame.header.normalizedType,
        fold: frame.header.fold,
        customTitle: frame.header.customTitle,
        effectiveTitle: frame.header.effectiveTitle,
        bodyMarkdown: bodyRaw,
        rawMarkdown: markdown.slice(frame.from, frame.lastLineEnd),
        hasCompactBody: frame.hasCompactBody
      };
    }
  };
  for (let i = 0;i < lines.length; i += 1) {
    if (i <= frontMatterEnd)
      continue;
    const line = lines[i];
    const { depth, rest } = countBlockquoteDepth(line.text);
    if (activeFenceChar) {
      const fenceCheckText = stripBlockquotePrefix(line.text, activeFenceDepth).rest;
      const closePattern = new RegExp(`^ {0,3}${activeFenceChar}{${activeFenceLength},}[ \\t]*$`);
      if (closePattern.test(fenceCheckText)) {
        activeFenceChar = null;
        activeFenceLength = 0;
        activeFenceDepth = 0;
        continue;
      }
      if (depth < activeFenceDepth) {
        activeFenceChar = null;
        activeFenceLength = 0;
        activeFenceDepth = 0;
      } else {
        for (const frame of stack) {
          frame.lastLineEnd = line.end;
          frame.bodyLines.push(stripBlockquotePrefix(line.text, frame.depth).rest);
        }
        continue;
      }
    }
    const fenceMatch = FENCE_OPEN_PATTERN.exec(rest);
    if (fenceMatch) {
      const fence = fenceMatch[1];
      activeFenceChar = fence[0];
      activeFenceLength = fence.length;
      activeFenceDepth = depth;
      closeFramesAboveDepth(depth);
      for (const frame of stack) {
        frame.lastLineEnd = line.end;
        frame.bodyLines.push(stripBlockquotePrefix(line.text, frame.depth).rest);
      }
      continue;
    }
    if (depth === 0) {
      closeFramesAboveDepth(0);
      continue;
    }
    closeFramesAboveDepth(depth);
    const topDepth = stack.length > 0 ? stack[stack.length - 1].depth : 0;
    const header = depth > topDepth ? parseCalloutHeaderLine(rest) : null;
    if (header) {
      for (const parent of stack) {
        parent.lastLineEnd = line.end;
        parent.bodyLines.push(stripBlockquotePrefix(line.text, parent.depth).rest);
      }
      const index = results.length;
      results.push(null);
      stack.push({
        index,
        depth,
        from: line.start,
        headerFrom: line.start,
        headerTo: line.end,
        lineNumber: line.lineNumber,
        header,
        lastLineEnd: line.end,
        bodyLines: [],
        hasCompactBody: false
      });
      continue;
    }
    for (const frame of stack) {
      if (frame.bodyLines.length === 0) {
        const stripped = stripBlockquotePrefix(line.text, frame.depth).rest;
        if (stripped.trim().length > 0) {
          frame.hasCompactBody = true;
        }
      }
      frame.lastLineEnd = line.end;
      frame.bodyLines.push(stripBlockquotePrefix(line.text, frame.depth).rest);
    }
  }
  closeFramesAboveDepth(0);
  return results.filter(Boolean);
};
var serializeCalloutMarkdown = (input) => {
  const depth = Math.max(1, input.quoteDepth ?? 1);
  const type = (input.type.trim() || "note").replace(/[\r\n[\]]/g, "");
  const fold = input.fold ?? "";
  const title = (input.title ?? "").replace(/\r?\n/g, " ").trim();
  const body = (input.body ?? "").replace(/\r\n?/g, `
`).trim();
  const prefix = "> ".repeat(depth);
  const emptyPrefix = Array.from({ length: depth }, () => ">").join(" ");
  const header = `${prefix}[!${type}]${fold}${title ? ` ${title}` : ""}`;
  if (!body) {
    return header;
  }
  const bodyLines = body.split(`
`).map((line) => {
    if (!line.trim())
      return emptyPrefix;
    return `${prefix}${line}`;
  });
  return `${header}
${emptyPrefix}
${bodyLines.join(`
`)}`;
};
var ensureBlockReplacement = (markdown, from, to, blockMarkdown) => {
  const safeFrom = snapToUtf16Boundary(markdown, from);
  const safeTo = snapToUtf16Boundary(markdown, to);
  const before = markdown.slice(0, safeFrom);
  const after = markdown.slice(safeTo);
  const prefix = before.length === 0 || before.endsWith(`

`) ? "" : before.endsWith(`
`) ? `
` : `

`;
  const suffix = after.length === 0 || after.startsWith(`

`) ? "" : after.startsWith(`
`) ? `
` : `

`;
  return [{
    from: safeFrom,
    to: safeTo,
    insert: `${prefix}${blockMarkdown}${suffix}`
  }];
};
var stripSingleQuoteLevel = (text) => text.replace(/\r\n?/g, `
`).split(`
`).map((line) => line.replace(/^ {0,3}> ?/, "")).join(`
`).trim();
var buildWrapOrInsertEdit = (markdown, options) => {
  const callouts = extractCalloutsFromMarkdown(markdown);
  const targetIndex = options.activeCalloutIndex ?? options.cursorHint?.activeCalloutIndex ?? null;
  if (options.mode === "update" && targetIndex !== null) {
    const existing = callouts.find((item) => item.index === targetIndex);
    if (existing) {
      const replacement = serializeCalloutMarkdown({
        ...options.callout,
        quoteDepth: existing.depth
      });
      return [{
        from: snapToUtf16Boundary(markdown, existing.from),
        to: snapToUtf16Boundary(markdown, existing.to),
        insert: replacement
      }];
    }
  }
  const blockMarkdown = serializeCalloutMarkdown(options.callout);
  const candidateSelection = options.selectionMarkdown?.trim() || options.selectionText?.trim() || options.cursorHint?.sourceSelectionText?.trim() || "";
  if (options.mode === "wrap" && candidateSelection) {
    const candidates = [candidateSelection, options.selectionText?.trim() ?? ""].filter(Boolean);
    for (const needle of candidates) {
      const foundIndex = markdown.indexOf(needle);
      if (foundIndex !== -1) {
        const cleanBody = options.callout.body ?? stripSingleQuoteLevel(needle);
        const wrapped = serializeCalloutMarkdown({
          ...options.callout,
          body: cleanBody
        });
        return ensureBlockReplacement(markdown, foundIndex, foundIndex + needle.length, wrapped);
      }
    }
  }
  const activeBlockText = options.cursorHint?.activeBlockText?.trim();
  if (activeBlockText && markdown) {
    const blockIdx = markdown.indexOf(activeBlockText);
    if (blockIdx !== -1) {
      const lineEndIdx = markdown.indexOf(`
`, blockIdx + activeBlockText.length);
      const insertAt = lineEndIdx === -1 ? markdown.length : lineEndIdx;
      return ensureBlockReplacement(markdown, insertAt, insertAt, blockMarkdown);
    }
  }
  if (!markdown.trim()) {
    return [{ from: 0, to: markdown.length, insert: blockMarkdown }];
  }
  const trimmedEnd = markdown.replace(/[ \t\r\n]+$/, "").length;
  return ensureBlockReplacement(markdown, trimmedEnd, markdown.length, blockMarkdown);
};
var cycleCalloutFoldAtTarget = (markdown, targetIndex) => {
  const callouts = extractCalloutsFromMarkdown(markdown);
  if (callouts.length === 0)
    return null;
  const target = (targetIndex != null ? callouts.find((item) => item.index === targetIndex) : undefined) ?? callouts[0];
  if (!target)
    return null;
  const nextFold = target.fold === "" ? "+" : target.fold === "+" ? "-" : "";
  const headerLine = markdown.slice(target.headerFrom, target.headerTo);
  const updatedHeaderLine = headerLine.replace(/(\\*\[![a-zA-Z0-9_-]+\\?\])([+-])?/, (_whole, marker) => `${marker}${nextFold}`);
  return {
    edits: [{
      from: snapToUtf16Boundary(markdown, target.headerFrom),
      to: snapToUtf16Boundary(markdown, target.headerTo),
      insert: updatedHeaderLine
    }],
    nextFold,
    callout: target
  };
};
var normalizeCompactCalloutsInMarkdown = (markdown) => {
  const callouts = extractCalloutsFromMarkdown(markdown);
  const compactOnes = callouts.filter((item) => item.hasCompactBody);
  if (compactOnes.length === 0) {
    return { edits: [], count: 0 };
  }
  const edits = [];
  for (const item of compactOnes) {
    const emptyPrefix = Array.from({ length: item.depth }, () => ">").join(" ");
    const at = snapToUtf16Boundary(markdown, item.headerTo);
    edits.push({
      from: at,
      to: at,
      insert: `
${emptyPrefix}`
    });
  }
  return {
    edits,
    count: compactOnes.length
  };
};

// src/dom-renderer.ts
var TARGET_CONTAINER_SELECTOR = ".ProseMirror, .markdown-content, .edgeever-phone-stage, .edgeever-print-content, .edgeever-html-content, .ee-callouts-preview-host";
var CALLOUT_DATA_ATTRS = [
  "data-ee-callout",
  "data-ee-callout-type",
  "data-ee-callout-foldable",
  "data-ee-callout-collapsed",
  "data-ee-callout-title-only",
  "data-ee-callout-header-clean",
  "data-ee-callout-single-para-body",
  "data-ee-callout-editing"
];
var FOLD_STORAGE_KEY = "fold-states.v1";
var MAX_STORED_FOLD_ENTRIES = 300;
var setAttrIfChanged = (el, name, value) => {
  if (el.getAttribute(name) !== value) {
    el.setAttribute(name, value);
  }
};
var removeAttrIfPresent = (el, name) => {
  if (el.hasAttribute(name)) {
    el.removeAttribute(name);
  }
};
var setCssVarIfChanged = (el, name, value) => {
  if (el.style.getPropertyValue(name) !== value) {
    el.style.setProperty(name, value);
  }
};
var removeCssVarIfPresent = (el, name) => {
  if (el.style.getPropertyValue(name)) {
    el.style.removeProperty(name);
  }
};
var getFirstParagraphChild = (blockquote) => {
  const first = blockquote.firstElementChild;
  if (!first)
    return null;
  return first.tagName?.toLowerCase() === "p" ? first : null;
};
var extractFirstLineDetails = (paragraph) => {
  let firstLine = "";
  let seenBreak = false;
  let hasInlineBody = false;
  const visit = (node) => {
    if (node.nodeType === 3) {
      const value = node.nodeValue ?? "";
      if (!seenBreak) {
        const nlIndex = value.indexOf(`
`);
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
      const el = node;
      const tag = el.tagName?.toLowerCase();
      if (tag === "br") {
        seenBreak = true;
        return;
      }
      for (let i = 0;i < el.childNodes.length; i += 1) {
        visit(el.childNodes[i]);
      }
    }
  };
  for (let i = 0;i < paragraph.childNodes.length; i += 1) {
    visit(paragraph.childNodes[i]);
  }
  return { firstLine, hasInlineBody };
};
var hasInteractiveHeaderContent = (paragraph) => Boolean(paragraph.querySelector("a, img, [data-type], svg, input, button"));
var stripCalloutDecoration = (blockquote) => {
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

class CalloutDomController {
  context;
  settings;
  foldOverrides = new Map;
  observer = null;
  themeObserver = null;
  rafHandle = null;
  timeoutHandle = null;
  disposed = false;
  lastCursorHint = {
    activeCalloutIndex: null,
    activeBlockText: null,
    sourceSelectionText: null
  };
  constructor(context, initialSettings) {
    this.context = context;
    this.settings = initialSettings;
  }
  async start() {
    if (this.disposed)
      return;
    await this.loadFoldOverrides();
    this.applyRootSettingsAttributes();
    this.scanAll();
    this.attachObservers();
    this.attachEventListeners();
  }
  updateSettings(nextSettings) {
    this.settings = nextSettings;
    if (this.disposed)
      return;
    this.applyRootSettingsAttributes();
    this.scanAll();
  }
  getLastCursorHint() {
    return { ...this.lastCursorHint };
  }
  decoratePreviewElement(blockquote) {
    this.decorateBlockquote(blockquote, "preview:0", true);
  }
  scanAll() {
    if (this.disposed || typeof document === "undefined" || typeof document.querySelectorAll !== "function") {
      return;
    }
    const containers = document.querySelectorAll(TARGET_CONTAINER_SELECTOR);
    containers.forEach((container) => {
      if (container.parentElement?.closest(TARGET_CONTAINER_SELECTOR))
        return;
      this.scanContainer(container);
    });
  }
  scheduleScan() {
    if (this.disposed)
      return;
    if (typeof requestAnimationFrame !== "function") {
      this.scanAll();
      return;
    }
    if (this.rafHandle !== null)
      return;
    this.rafHandle = requestAnimationFrame(() => {
      this.rafHandle = null;
      this.scanAll();
    });
  }
  scheduleDeferredScan() {
    if (this.disposed || typeof setTimeout !== "function")
      return;
    if (this.timeoutHandle !== null && typeof clearTimeout === "function") {
      clearTimeout(this.timeoutHandle);
    }
    this.timeoutHandle = setTimeout(() => {
      this.timeoutHandle = null;
      this.scanAll();
    }, 0);
  }
  toggleCalloutElement(blockquote) {
    if (blockquote.getAttribute("data-ee-callout-foldable") !== "true")
      return false;
    const nextCollapsed = blockquote.getAttribute("data-ee-callout-collapsed") !== "true";
    setAttrIfChanged(blockquote, "data-ee-callout-collapsed", nextCollapsed ? "true" : "false");
    const key = blockquote.getAttribute("data-ee-callout-key");
    const sourceFold = blockquote.getAttribute("data-ee-callout-source-fold") === "-" ? "-" : "+";
    if (key) {
      this.foldOverrides.set(key, {
        collapsed: nextCollapsed,
        sourceFold,
        updatedAt: Date.now()
      });
      this.persistFoldOverrides();
    }
    return nextCollapsed;
  }
  toggleAllFoldable() {
    if (typeof document === "undefined")
      return { count: 0, collapsed: false };
    const targets = [];
    const containers = document.querySelectorAll(TARGET_CONTAINER_SELECTOR);
    containers.forEach((container) => {
      if (container.classList.contains("ee-callouts-preview-host"))
        return;
      if (container.parentElement?.closest(TARGET_CONTAINER_SELECTOR))
        return;
      container.querySelectorAll('blockquote[data-ee-callout][data-ee-callout-foldable="true"]').forEach((el) => {
        targets.push(el);
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
          updatedAt: Date.now()
        });
      }
    }
    this.persistFoldOverrides();
    return { count: targets.length, collapsed: nextCollapsed };
  }
  dispose() {
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
        stripCalloutDecoration(el);
        removeAttrIfPresent(el, "data-ee-callout-source-fold");
      });
    }
  }
  applyRootSettingsAttributes() {
    if (typeof document === "undefined")
      return;
    const root = document.documentElement;
    setAttrIfChanged(root, "data-ee-callouts-style", this.settings.visualStyle);
    setAttrIfChanged(root, "data-ee-callouts-live-preview", String(this.settings.livePreviewHeader));
  }
  scanContainer(container) {
    const scopeTitle = container.closest("[data-note-title]")?.getAttribute("data-note-title")?.trim() || (container.classList.contains("markdown-content") ? "markdown-content" : "editor");
    const blockquotes = container.querySelectorAll("blockquote");
    let calloutOrder = 0;
    blockquotes.forEach((el) => {
      const bq = el;
      const isCallout = this.decorateBlockquote(bq, `${scopeTitle}:${calloutOrder}`, container.classList.contains("ee-callouts-preview-host"));
      if (isCallout) {
        calloutOrder += 1;
      }
    });
  }
  decorateBlockquote(blockquote, keyPrefix, isPreviewHost) {
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
      const sourceFold = parsed.fold;
      setAttrIfChanged(blockquote, "data-ee-callout-foldable", "true");
      setAttrIfChanged(blockquote, "data-ee-callout-source-fold", sourceFold);
      const override = !isPreviewHost && this.settings.rememberFoldState ? this.foldOverrides.get(foldKey) : undefined;
      const shouldCollapse = override && override.sourceFold === sourceFold ? override.collapsed : sourceFold === "-";
      const sessionOverride = this.foldOverrides.get(foldKey);
      const effectiveCollapsed = sessionOverride && sessionOverride.sourceFold === sourceFold ? sessionOverride.collapsed : shouldCollapse;
      setAttrIfChanged(blockquote, "data-ee-callout-collapsed", effectiveCollapsed ? "true" : "false");
    } else {
      removeAttrIfPresent(blockquote, "data-ee-callout-foldable");
      removeAttrIfPresent(blockquote, "data-ee-callout-collapsed");
      removeAttrIfPresent(blockquote, "data-ee-callout-source-fold");
    }
    return true;
  }
  async loadFoldOverrides() {
    if (!this.settings.rememberFoldState)
      return;
    try {
      const stored = await this.context.storage.get(FOLD_STORAGE_KEY);
      if (!stored || typeof stored !== "object")
        return;
      for (const [key, entry] of Object.entries(stored)) {
        if (entry && typeof entry === "object" && typeof entry.collapsed === "boolean" && (entry.sourceFold === "+" || entry.sourceFold === "-")) {
          this.foldOverrides.set(key, entry);
        }
      }
    } catch {}
  }
  async persistFoldOverrides() {
    if (!this.settings.rememberFoldState)
      return;
    try {
      const entries = Array.from(this.foldOverrides.entries()).sort((a, b) => (b[1].updatedAt ?? 0) - (a[1].updatedAt ?? 0)).slice(0, MAX_STORED_FOLD_ENTRIES);
      await this.context.storage.set(FOLD_STORAGE_KEY, Object.fromEntries(entries));
    } catch {}
  }
  attachObservers() {
    if (typeof MutationObserver === "undefined" || typeof document === "undefined" || !document.body) {
      return;
    }
    this.observer = new MutationObserver((mutations) => {
      const hasStructuralChange = mutations.some((m) => m.type === "childList" || m.type === "characterData");
      if (hasStructuralChange) {
        this.scheduleScan();
      }
    });
    this.observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    });
    this.themeObserver = new MutationObserver(() => {
      this.applyRootSettingsAttributes();
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }
  attachEventListeners() {
    if (typeof document === "undefined")
      return;
    document.addEventListener("mousedown", this.handleMouseDownCapture, true);
    document.addEventListener("selectionchange", this.handleSelectionChange);
    document.addEventListener("focusin", this.handleSelectionChange);
  }
  detachEventListeners() {
    if (typeof document === "undefined")
      return;
    document.removeEventListener("mousedown", this.handleMouseDownCapture, true);
    document.removeEventListener("selectionchange", this.handleSelectionChange);
    document.removeEventListener("focusin", this.handleSelectionChange);
  }
  handleMouseDownCapture = (event) => {
    const rawTarget = event.target;
    const targetEl = rawTarget instanceof Element ? rawTarget : rawTarget && typeof rawTarget.parentElement === "object" ? rawTarget.parentElement : null;
    if (!targetEl)
      return;
    const calloutEl = targetEl.closest("blockquote[data-ee-callout]");
    if (!calloutEl)
      return;
    const firstP = getFirstParagraphChild(calloutEl);
    const inEditableProseMirror = Boolean(calloutEl.closest('.ProseMirror[contenteditable="true"]'));
    if (calloutEl.getAttribute("data-ee-callout-foldable") === "true") {
      const rect = calloutEl.getBoundingClientRect?.() ?? {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0
      };
      const pRect = firstP?.getBoundingClientRect?.();
      const headerBottom = pRect && pRect.height > 0 ? pRect.bottom + 8 : rect.top + 42;
      const inChevronZone = rect.width > 0 && event.clientX >= rect.right - 44 && event.clientY >= rect.top - 4 && event.clientY <= headerBottom;
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
  markEditingCallout(activeCallout) {
    if (typeof document === "undefined")
      return;
    document.querySelectorAll('blockquote[data-ee-callout-editing="true"]').forEach((el) => {
      if (el !== activeCallout) {
        removeAttrIfPresent(el, "data-ee-callout-editing");
      }
    });
    if (activeCallout) {
      setAttrIfChanged(activeCallout, "data-ee-callout-editing", "true");
    }
  }
  handleSelectionChange = () => {
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
      const calloutEl = anchorEl.closest("blockquote[data-ee-callout]");
      const calloutIndex = calloutEl ? callouts.indexOf(calloutEl) : -1;
      const blockEl = anchorEl.closest("p, h1, h2, h3, h4, h5, h6, li");
      this.lastCursorHint = {
        activeCalloutIndex: calloutIndex >= 0 ? calloutIndex : null,
        activeBlockText: blockEl?.textContent?.trim() || null,
        sourceSelectionText: null
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
        sourceSelectionText: selected || null
      };
      this.markEditingCallout(null);
      return;
    }
    this.markEditingCallout(null);
  };
}

// src/panels.ts
var isStructuredNoteError = (error) => Boolean(error && typeof error === "object" && "code" in error && error.code === "STRUCTURED_NOTE_REQUIRED");
var resolveFallbackCalloutIndex = (markdown, hint) => {
  if (!hint)
    return null;
  if (hint.activeCalloutIndex !== null)
    return hint.activeCalloutIndex;
  const blockText = hint.activeBlockText?.trim();
  if (!blockText)
    return null;
  const callouts = extractCalloutsFromMarkdown(markdown);
  const found = callouts.find((item) => item.rawMarkdown.includes(blockText) || item.effectiveTitle === blockText || `[!${item.rawType}]${item.fold}${item.customTitle ? ` ${item.customTitle}` : ""}` === blockText);
  return found ? found.index : null;
};
var applyEditorCalloutOperation = async ({
  context,
  controller,
  mode,
  callout,
  activeCalloutIndex
}) => {
  const copy = getUiCopy();
  const doc = await context.editor.getDocument();
  if (!doc) {
    context.ui.showNotice(copy.noActiveEditorNotice);
    return false;
  }
  const selection = await context.editor.getSelection();
  const cursorHint = controller.getLastCursorHint();
  const resolvedIndex = activeCalloutIndex ?? resolveFallbackCalloutIndex(doc.contentMarkdown, cursorHint);
  const hasSelection = Boolean(selection && !selection.empty && (selection.contentMarkdown || selection.text) || cursorHint.sourceSelectionText);
  const effectiveMode = mode === "update" && resolvedIndex !== null ? "update" : mode === "wrap" || mode === "insert" && hasSelection && !(callout.body ?? "").trim() ? "wrap" : mode;
  const edits = buildWrapOrInsertEdit(doc.contentMarkdown, {
    mode: effectiveMode,
    callout,
    selectionText: selection?.text ?? "",
    selectionMarkdown: selection?.contentMarkdown ?? "",
    cursorHint,
    activeCalloutIndex: resolvedIndex
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
var defaultFoldFromSetting = (setting) => {
  if (setting === "expanded")
    return "+";
  if (setting === "collapsed")
    return "-";
  return "";
};
var copyTextSafely = async (text) => {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
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
var renderPreviewBlockquote = (controller, host, data) => {
  host.replaceChildren();
  const blockquote = document.createElement("blockquote");
  const headerP = document.createElement("p");
  const typeToken = (data.type.trim() || "note").replace(/[\r\n[\]]/g, "");
  const cleanTitle = data.title.trim();
  headerP.textContent = `[!${typeToken}]${data.fold}${cleanTitle ? ` ${cleanTitle}` : ""}`;
  blockquote.appendChild(headerP);
  const bodyLines = data.body.replace(/\r\n?/g, `
`).split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  for (const block of bodyLines) {
    const p = document.createElement("p");
    p.textContent = block;
    blockquote.appendChild(p);
  }
  host.appendChild(blockquote);
  controller.decoratePreviewElement(blockquote);
  return blockquote;
};
var MAX_EXPLORER_PAGES = 5;
var EXPLORER_PAGE_SIZE = 100;
var scanWorkspaceCallouts = async (context, settings) => {
  const collected = [];
  let offset = 0;
  let pages = 0;
  while (offset !== null && pages < MAX_EXPLORER_PAGES) {
    const page = await context.notes.queryContent({
      sort: "updated-desc",
      limit: EXPLORER_PAGE_SIZE,
      offset
    });
    pages += 1;
    for (const note of page.notes) {
      if (note.kind !== "text" || !note.contentMarkdown)
        continue;
      const callouts = extractCalloutsFromMarkdown(note.contentMarkdown);
      if (callouts.length === 0)
        continue;
      const noteTitle = note.title?.trim() || note.excerpt?.trim() || "Untitled";
      for (const callout of callouts) {
        const spec = resolveCalloutType(callout.rawType, settings.customTypes);
        const searchTerm = callout.customTitle || callout.bodyMarkdown.split(`
`)[0]?.trim() || `[!${callout.rawType}]`;
        collected.push({
          noteId: note.id,
          noteTitle,
          updatedAt: note.updatedAt,
          callout,
          canonicalId: spec.canonicalId,
          rgb: spec.rgb,
          icon: spec.icon,
          searchTerm: searchTerm.slice(0, 120)
        });
      }
    }
    offset = page.nextOffset;
  }
  return collected;
};
var registerCalloutPanels = (context, controller, getSettings) => {
  const copy = getUiCopy();
  const disposeComposer = context.ui.panels.register({
    id: "callout-composer",
    title: copy.panelComposerTitle,
    purpose: "workflow",
    presentation: "dialog",
    async mount(container, { shell, requestClose, state }) {
      const uiCopy = getUiCopy();
      const settings = getSettings();
      const stateRecord = state && typeof state === "object" && !Array.isArray(state) ? state : null;
      let doc = null;
      let selection = null;
      try {
        [doc, selection] = await Promise.all([
          context.editor.getDocument(),
          context.editor.getSelection()
        ]);
      } catch {
        doc = null;
        selection = null;
      }
      const cursorHint = controller.getLastCursorHint();
      const targetCalloutIndex = typeof stateRecord?.calloutIndex === "number" ? stateRecord.calloutIndex : doc ? resolveFallbackCalloutIndex(doc.contentMarkdown, cursorHint) : null;
      const existingCallout = doc && targetCalloutIndex !== null ? extractCalloutsFromMarkdown(doc.contentMarkdown).find((c) => c.index === targetCalloutIndex) ?? null : null;
      const isEditMode = stateRecord?.mode === "edit" && existingCallout !== null ? true : stateRecord?.mode === undefined && existingCallout !== null;
      let activeCategory = "all";
      let searchQuery = "";
      let selectedType = typeof stateRecord?.type === "string" && stateRecord.type.trim() ? stateRecord.type.trim().toLowerCase() : isEditMode && existingCallout ? existingCallout.normalizedType : settings.defaultType;
      let fold = stateRecord?.fold === "+" || stateRecord?.fold === "-" || stateRecord?.fold === "" ? stateRecord.fold : isEditMode && existingCallout ? existingCallout.fold : defaultFoldFromSetting(settings.defaultFold);
      let customTitle = typeof stateRecord?.title === "string" ? stateRecord.title : isEditMode && existingCallout ? existingCallout.customTitle : "";
      let bodyText = typeof stateRecord?.body === "string" ? stateRecord.body : isEditMode && existingCallout ? existingCallout.bodyMarkdown : (selection && !selection.empty ? selection.contentMarkdown || selection.text : "") || cursorHint.sourceSelectionText || "";
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
      root.append(typeGridSection, aliasRow, formGrid, titleWrap, bodyWrap, previewWrap, markdownWrap);
      const syncShell = () => {
        const currentSettings = getSettings();
        const tabOptions = [
          { value: "all", label: uiCopy.allCategory },
          { value: "info", label: "Info" },
          { value: "tips", label: "Tips" },
          { value: "alerts", label: "Alerts" },
          { value: "structure", label: "Structure" }
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
                disabled: busy
              }
            ]
          },
          toolbar: [
            { type: "tabs", key: "category", value: activeCategory, options: tabOptions },
            {
              type: "search",
              key: "q",
              placeholder: uiCopy.searchTypesPlaceholder,
              value: searchQuery
            }
          ],
          onAction(actionId) {
            if (disposed || busy)
              return;
            if (actionId === "copy") {
              const md = serializeCalloutMarkdown({
                type: selectedType,
                fold,
                title: customTitle,
                body: bodyText
              });
              copyTextSafely(md).then(() => {
                context.ui.showNotice(uiCopy.copiedNotice);
              });
              return;
            }
            if (actionId === "apply") {
              busy = true;
              syncShell();
              applyEditorCalloutOperation({
                context,
                controller,
                mode: isEditMode ? "update" : selection && !selection.empty ? "wrap" : "insert",
                callout: {
                  type: selectedType,
                  fold,
                  title: customTitle,
                  body: bodyText
                },
                activeCalloutIndex: isEditMode ? existingCallout?.index ?? null : null
              }).then(async (applied) => {
                if (applied && !disposed) {
                  await requestClose();
                }
              }).finally(() => {
                busy = false;
                if (!disposed)
                  syncShell();
              });
            }
          },
          onChange(key, value) {
            if (key === "category")
              activeCategory = value;
            if (key === "q")
              searchQuery = value;
            renderTypePicker();
          }
        });
      };
      const renderFoldButtons = () => {
        foldGroup.replaceChildren();
        const options = [
          { value: "", label: uiCopy.foldNone },
          { value: "+", label: uiCopy.foldExpanded },
          { value: "-", label: uiCopy.foldCollapsed }
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
        if (!def || def.aliases.length === 0)
          return;
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
        const cards = [
          ...Array.from(currentSettings.customTypes.values()).map((custom) => ({
            id: custom.id,
            label: formatDefaultCalloutTitle(custom.id),
            rgb: custom.rgb,
            icon: custom.icon,
            category: "custom",
            aliases: []
          })),
          ...BUILTIN_CALLOUT_TYPES.map((builtin) => ({
            id: builtin.id,
            label: builtin.label,
            rgb: builtin.rgb,
            icon: builtin.icon,
            category: builtin.category,
            aliases: builtin.aliases
          }))
        ];
        for (const item of cards) {
          if (activeCategory !== "all" && item.category !== activeCategory)
            continue;
          if (query && !item.id.includes(query) && !item.label.toLowerCase().includes(query) && !item.aliases.some((alias) => alias.includes(query))) {
            continue;
          }
          const card = document.createElement("button");
          card.type = "button";
          card.className = "ee-callouts-type-card";
          card.style.setProperty("--ee-callout-rgb", item.rgb);
          const isSelected = selectedType.toLowerCase() === item.id || activeSpec.canonicalId === item.id;
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
          body: bodyText || "Preview body text…"
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
          body: bodyText
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
    }
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
      let items = [];
      const root = document.createElement("div");
      root.className = "ee-callouts-panel";
      container.replaceChildren(root);
      const syncExplorerChrome = (filteredCount) => {
        const isEmpty = !loading && filteredCount === 0;
        shell.set({
          header: {
            title: uiCopy.explorerTitle,
            description: uiCopy.explorerDescription,
            actions: [
              { id: "refresh", label: uiCopy.refreshAction, variant: "default", disabled: loading },
              { id: "compose", label: uiCopy.insertAction, variant: "primary" }
            ]
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
                { value: "danger", label: "Danger" }
              ]
            },
            {
              type: "search",
              key: "q",
              placeholder: uiCopy.searchExplorerPlaceholder,
              value: searchQuery
            }
          ],
          empty: isEmpty ? {
            title: uiCopy.emptyExplorerTitle,
            description: uiCopy.emptyExplorerDescription
          } : null,
          onAction(actionId) {
            if (disposed)
              return;
            if (actionId === "refresh") {
              load();
              return;
            }
            if (actionId === "compose") {
              requestClose().then(() => context.ui.panels.open("callout-composer"));
            }
          },
          onChange(key, value) {
            if (key === "typeFilter")
              typeFilter = value;
            if (key === "q")
              searchQuery = value;
            renderList();
          }
        });
      };
      const renderList = () => {
        if (disposed)
          return;
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
          if (typeFilter !== "all" && item.canonicalId !== typeFilter)
            return false;
          if (!q)
            return true;
          return item.callout.effectiveTitle.toLowerCase().includes(q) || item.callout.rawType.toLowerCase().includes(q) || item.callout.bodyMarkdown.toLowerCase().includes(q) || item.noteTitle.toLowerCase().includes(q);
        });
        syncExplorerChrome(filtered.length);
        if (filtered.length === 0)
          return;
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
            body.textContent = item.callout.bodyMarkdown.length > 260 ? `${item.callout.bodyMarkdown.slice(0, 260)}…` : item.callout.bodyMarkdown;
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
            context.ui.openNote(item.noteId, { search: item.searchTerm }).then(() => requestClose());
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
      load();
      return () => {
        disposed = true;
        container.replaceChildren();
      };
    }
  });
  const disposeEmbed = context.editor.embeds.register({
    type: "callout",
    mount(container, embed) {
      const data = embed.data && typeof embed.data === "object" && !Array.isArray(embed.data) ? embed.data : {};
      const type = typeof data.type === "string" && data.type.trim() ? data.type.trim() : "note";
      const fold = data.fold === "+" || data.fold === "-" ? data.fold : "";
      const title = typeof data.title === "string" ? data.title : embed.title || "";
      const body = typeof data.body === "string" ? data.body : "";
      const wrapper = document.createElement("div");
      wrapper.className = "ee-callouts-preview-host ee-callouts-embed-root";
      const blockquote = renderPreviewBlockquote(controller, wrapper, {
        type,
        fold,
        title,
        body
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
    }
  });
  return [disposeComposer, disposeExplorer, disposeEmbed];
};

// src/index.ts
var loadPluginSettings = async (context) => {
  const [
    defaultTypeVal,
    defaultFoldVal,
    visualStyleVal,
    livePreviewVal,
    rememberFoldVal,
    customTypesVal
  ] = await Promise.all([
    context.settings.get("default-type").catch(() => null),
    context.settings.get("default-fold").catch(() => null),
    context.settings.get("visual-style").catch(() => null),
    context.settings.get("live-preview-header").catch(() => null),
    context.settings.get("remember-fold-state").catch(() => null),
    context.settings.get("custom-types").catch(() => null)
  ]);
  const defaultType = typeof defaultTypeVal === "string" && defaultTypeVal.trim() ? defaultTypeVal.trim().toLowerCase() : "note";
  const defaultFold = defaultFoldVal === "expanded" || defaultFoldVal === "collapsed" || defaultFoldVal === "none" ? defaultFoldVal : "none";
  const visualStyle = visualStyleVal === "minimal" || visualStyleVal === "bordered" || visualStyleVal === "obsidian" ? visualStyleVal : "obsidian";
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
    customTypes: parseCustomTypesSetting(customTypesRaw)
  };
};
var foldFromDefaultSetting = (setting) => {
  if (setting === "expanded")
    return "+";
  if (setting === "collapsed")
    return "-";
  return "";
};
var ensureFallbackStylesheet = (pluginId) => {
  if (typeof document === "undefined" || !document.head) {
    return () => {};
  }
  const existingHostStyle = document.head.querySelector(`style[data-edgeever-plugin-style="${pluginId}"]`);
  if (existingHostStyle) {
    return () => {};
  }
  const styleEl = document.createElement("style");
  styleEl.dataset.edgeeverPluginStyleFallback = pluginId;
  styleEl.textContent = styles_default;
  document.head.appendChild(styleEl);
  return () => {
    styleEl.remove();
  };
};
var plugin = {
  async activate(context) {
    let settings = await loadPluginSettings(context);
    const disposeFallbackStyle = ensureFallbackStylesheet(context.pluginId);
    const controller = new CalloutDomController(context, settings);
    await controller.start();
    const copy = getUiCopy();
    const disposers = [
      disposeFallbackStyle,
      () => controller.dispose(),
      ...registerCalloutPanels(context, controller, () => settings)
    ];
    disposers.push(context.events.on("settings.changed", async () => {
      settings = await loadPluginSettings(context);
      controller.updateSettings(settings);
    }), context.events.on("note.updated", () => controller.scheduleScan()), context.events.on("workspace.synced", () => controller.scheduleScan()));
    disposers.push(context.commands.register({
      id: "insert-callout",
      title: copy.cmdInsertCallout,
      listed: true,
      menu: true,
      async run() {
        await context.ui.panels.open("callout-composer");
      }
    }), context.commands.register({
      id: "open-callout-explorer",
      title: copy.cmdOpenExplorer,
      listed: true,
      menu: true,
      async run() {
        await context.ui.panels.open("callout-explorer");
      }
    }), context.commands.register({
      id: "wrap-selection",
      title: copy.cmdWrapSelection,
      listed: true,
      menu: true,
      async run() {
        const selection = await context.editor.getSelection();
        const hint = controller.getLastCursorHint();
        const hasSelection = Boolean(selection && !selection.empty && (selection.contentMarkdown || selection.text) || hint.sourceSelectionText);
        await applyEditorCalloutOperation({
          context,
          controller,
          mode: hasSelection ? "wrap" : "insert",
          callout: {
            type: settings.defaultType,
            fold: foldFromDefaultSetting(settings.defaultFold),
            title: "",
            ...hasSelection ? {} : { body: "Callout content" }
          }
        });
      }
    }), context.commands.register({
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
          context.ui.showNotice(isStructuredNoteError(error) ? uiCopy.structuredNoteUnsupportedNotice : error instanceof Error ? error.message : String(error));
        }
      }
    }), context.commands.register({
      id: "toggle-all-foldable",
      title: copy.cmdToggleAll,
      listed: false,
      menu: true,
      run() {
        const uiCopy = getUiCopy();
        const { count, collapsed } = controller.toggleAllFoldable();
        context.ui.showNotice(count > 0 ? uiCopy.toggledAllNotice(collapsed, count) : uiCopy.noFoldableCalloutsNotice);
      }
    }), context.commands.register({
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
          context.ui.showNotice(isStructuredNoteError(error) ? uiCopy.structuredNoteUnsupportedNotice : error instanceof Error ? error.message : String(error));
        }
      }
    }), context.commands.register({
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
            body: "Helpful tip"
          }
        });
      }
    }), context.commands.register({
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
            body: "Watch out for this edge case."
          }
        });
      }
    }), context.commands.register({
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
            body: "Add the answer here."
          }
        });
      }
    }));
    return () => {
      for (const dispose of disposers.reverse()) {
        try {
          dispose();
        } catch {}
      }
    };
  }
};
var src_default = plugin;
export {
  src_default as default
};
