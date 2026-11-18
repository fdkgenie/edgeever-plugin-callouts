# Callouts Plugin for EdgeEver

Obsidian-compatible Markdown callouts (`> [!note]`, `> [!tip]`, `> [!warning]`, etc.) for EdgeEver Web and Desktop (`Plugin API v2`).

## Installation

Open **Plugin Marketplace** in EdgeEver and install from GitHub:

```text
https://github.com/fdkgenie/edgeever-plugin-callouts
```

Or during EdgeEver monorepo development, install the local manifest:

```text
/extensions/callouts/manifest.json
```

## Features

- **Full Obsidian Syntax**:
  - Supports all **13 canonical callout types** (`note`, `abstract`, `info`, `todo`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`) and **14 official aliases** (`summary`, `tldr`, `hint`, `important`, `check`, `done`, `help`, `faq`, `caution`, `attention`, `fail`, `missing`, `error`, `cite`).
  - Case-insensitive `[!TYPE]` matching with automatic fallback to `note` for unrecognized types.
  - Custom titles (`> [!tip] Custom Title`), title-only callouts (`> [!info] One-liner`), and default capitalized titles when omitted.
  - **Foldable callouts**: `[!faq]+` (expanded by default) and `[!faq]-` (collapsed by default) with interactive expand/collapse toggles and optional per-device local state persistence.
  - **Nested callouts**: Supports `>> [!success]` and multi-level blockquotes inside callouts.
  - **Live Preview clean headers**: Hides raw `[!type]` markers when the cursor is outside the callout header and reveals the raw Markdown syntax immediately when editing the header line.
- **Custom Callout Types**: Define custom `[!type]` tokens, colors, and icons in Plugin Settings (`type=#RRGGBB[,icon]`).
- **Visual Callout Composer (`callout-composer`)**: Searchable type/alias picker, foldability selector, live interactive preview, and one-click insertion or in-place editing of the active callout.
- **Workspace Callout Explorer (`callout-explorer`)**: Search and filter all callouts across Markdown notes in your workspace and jump directly to the note.
- **Custom Block Embed (`callout`)**: Renders structured `edgeever-plugin-embed` callout cards.
- **100% Portable Markdown**: Notes remain standard CommonMark blockquotes (`> [!type]`).

## Commands

- `Insert / Edit Callout…`
- `Open Callout Explorer`
- `Wrap Selection in Callout`
- `Cycle Callout Fold (+ / - / None)`
- `Collapse / Expand All Foldable Callouts`
- `Normalize Compact Callouts in Note`
- Quick inserts: `[!tip]`, `[!warning]`, `[!faq]+`

## Development & Verification

```bash
bun install
bun run check
```

Individual scripts:

```bash
bun run typecheck
bun run test
bun run build
bun run verify:release
```

## License

MIT — see [LICENSE](./LICENSE).
