import type { PluginMarkdownEdit } from "./edgeever.ts";
import {
  formatDefaultCalloutTitle,
  type CalloutFoldModifier,
} from "./types.ts";

export interface ParsedCalloutHeader {
  rawType: string;
  normalizedType: string;
  fold: CalloutFoldModifier;
  customTitle: string;
  effectiveTitle: string;
  escapedBrackets: boolean;
}

export interface ParsedMarkdownCallout {
  index: number;
  depth: number;
  from: number;
  to: number;
  headerFrom: number;
  headerTo: number;
  lineNumber: number;
  rawType: string;
  normalizedType: string;
  fold: CalloutFoldModifier;
  customTitle: string;
  effectiveTitle: string;
  bodyMarkdown: string;
  rawMarkdown: string;
  hasCompactBody: boolean;
}

export interface SerializeCalloutInput {
  type: string;
  fold?: CalloutFoldModifier;
  title?: string;
  body?: string;
  quoteDepth?: number;
}

export interface EditorCursorHint {
  activeCalloutIndex: number | null;
  activeBlockText: string | null;
  sourceSelectionText: string | null;
}

export interface BuildEditOptions {
  mode: "insert" | "wrap" | "update";
  callout: SerializeCalloutInput;
  selectionText?: string;
  selectionMarkdown?: string;
  cursorHint?: EditorCursorHint | null;
  activeCalloutIndex?: number | null;
}

// Supports both standard `[!type]` and TipTap-escaped `\[!type\]` header syntax,
// while intentionally rejecting Markdown links like `[!note](https://...)`.
const CALLOUT_HEADER_PATTERN =
  /^[ \t]*(\\)?\[!([a-zA-Z0-9_-]+)(\\)?\]([+-])?(?:[ \t]+(.*))?$/;
const FENCE_OPEN_PATTERN = /^ {0,3}(`{3,}|~{3,})/;

export const parseCalloutHeaderLine = (line: string): ParsedCalloutHeader | null => {
  const cleaned = line.replace(/\r$/, "");
  const match = CALLOUT_HEADER_PATTERN.exec(cleaned);
  if (!match) return null;

  const escapedBrackets = Boolean(match[1] || match[3]);
  const rawType = match[2];
  const fold = (match[4] ?? "") as CalloutFoldModifier;
  const rawTitle = (match[5] ?? "").trim();

  const normalizedType = rawType.toLowerCase();
  const effectiveTitle = rawTitle || formatDefaultCalloutTitle(rawType);
  return {
    rawType,
    normalizedType,
    fold,
    customTitle: rawTitle,
    effectiveTitle,
    escapedBrackets,
  };
};

export const snapToUtf16Boundary = (text: string, offset: number): number => {
  let clamped = Math.max(0, Math.min(offset, text.length));
  if (clamped > 0 && clamped < text.length) {
    const prev = text.charCodeAt(clamped - 1);
    const curr = text.charCodeAt(clamped);
    if (prev >= 0xd800 && prev <= 0xdbff && curr >= 0xdc00 && curr <= 0xdfff) {
      clamped -= 1;
    }
  }
  return clamped;
};

const stripBlockquotePrefix = (line: string, maxDepth: number): { depth: number; rest: string } => {
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
      if (line[index] === " ") index += 1;
    } else {
      break;
    }
  }
  return { depth, rest: line.slice(index) };
};

const countBlockquoteDepth = (line: string): { depth: number; rest: string } =>
  stripBlockquotePrefix(line, Number.MAX_SAFE_INTEGER);

const splitLinesWithOffsets = (markdown: string) => {
  const lines: Array<{ text: string; start: number; end: number; lineNumber: number }> = [];
  let start = 0;
  let lineNumber = 1;
  while (start <= markdown.length) {
    const nlIndex = markdown.indexOf("\n", start);
    if (nlIndex === -1) {
      lines.push({
        text: markdown.slice(start),
        start,
        end: markdown.length,
        lineNumber,
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

const detectFrontMatterEndLine = (lines: ReturnType<typeof splitLinesWithOffsets>): number => {
  if (lines.length < 3 || lines[0]?.text.trim() !== "---") return -1;
  for (let i = 1; i < lines.length; i += 1) {
    const trimmed = lines[i].text.trim();
    if (trimmed === "---" || trimmed === "...") {
      return i;
    }
  }
  return -1;
};

interface OpenCalloutFrame {
  index: number;
  depth: number;
  from: number;
  headerFrom: number;
  headerTo: number;
  lineNumber: number;
  header: ParsedCalloutHeader;
  lastLineEnd: number;
  bodyLines: string[];
  hasCompactBody: boolean;
}

export const extractCalloutsFromMarkdown = (markdown: string): ParsedMarkdownCallout[] => {
  if (!markdown) return [];
  const lines = splitLinesWithOffsets(markdown);
  const frontMatterEnd = detectFrontMatterEndLine(lines);
  const results: ParsedMarkdownCallout[] = [];
  const stack: OpenCalloutFrame[] = [];

  let activeFenceChar: "`" | "~" | null = null;
  let activeFenceLength = 0;
  let activeFenceDepth = 0;

  const closeFramesAboveDepth = (targetDepth: number) => {
    while (stack.length > 0 && stack[stack.length - 1].depth > targetDepth) {
      const frame = stack.pop()!;
      const bodyRaw = frame.bodyLines.join("\n").replace(/^\n+|\n+$/g, "");
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
        hasCompactBody: frame.hasCompactBody,
      };
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    if (i <= frontMatterEnd) continue;
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
      activeFenceChar = fence[0] as "`" | "~";
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
      results.push(null as unknown as ParsedMarkdownCallout);
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
        hasCompactBody: false,
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

export const serializeCalloutMarkdown = (input: SerializeCalloutInput): string => {
  const depth = Math.max(1, input.quoteDepth ?? 1);
  const type = (input.type.trim() || "note").replace(/[\r\n[\]]/g, "");
  const fold = input.fold ?? "";
  const title = (input.title ?? "").replace(/\r?\n/g, " ").trim();
  const body = (input.body ?? "").replace(/\r\n?/g, "\n").trim();

  const prefix = "> ".repeat(depth);
  const emptyPrefix = Array.from({ length: depth }, () => ">").join(" ");
  const header = `${prefix}[!${type}]${fold}${title ? ` ${title}` : ""}`;

  if (!body) {
    return header;
  }

  const bodyLines = body.split("\n").map((line) => {
    if (!line.trim()) return emptyPrefix;
    return `${prefix}${line}`;
  });

  // Include a clean `>` blank line between header and body so EdgeEver's
  // TipTap parser splits header <p> and body block nodes cleanly while staying
  // 100% compatible with Obsidian.
  return `${header}\n${emptyPrefix}\n${bodyLines.join("\n")}`;
};

export const findCalloutAtOffset = (
  callouts: readonly ParsedMarkdownCallout[],
  offset: number,
): ParsedMarkdownCallout | null => {
  let match: ParsedMarkdownCallout | null = null;
  for (const callout of callouts) {
    if (offset >= callout.from && offset <= callout.to) {
      if (!match || callout.depth >= match.depth) {
        match = callout;
      }
    }
  }
  return match;
};

const ensureBlockReplacement = (
  markdown: string,
  from: number,
  to: number,
  blockMarkdown: string,
): PluginMarkdownEdit[] => {
  const safeFrom = snapToUtf16Boundary(markdown, from);
  const safeTo = snapToUtf16Boundary(markdown, to);
  const before = markdown.slice(0, safeFrom);
  const after = markdown.slice(safeTo);

  const prefix = before.length === 0 || before.endsWith("\n\n")
    ? ""
    : before.endsWith("\n")
      ? "\n"
      : "\n\n";
  const suffix = after.length === 0 || after.startsWith("\n\n")
    ? ""
    : after.startsWith("\n")
      ? "\n"
      : "\n\n";

  return [{
    from: safeFrom,
    to: safeTo,
    insert: `${prefix}${blockMarkdown}${suffix}`,
  }];
};

const stripSingleQuoteLevel = (text: string): string =>
  text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/^ {0,3}> ?/, ""))
    .join("\n")
    .trim();

export const buildWrapOrInsertEdit = (
  markdown: string,
  options: BuildEditOptions,
): PluginMarkdownEdit[] => {
  const callouts = extractCalloutsFromMarkdown(markdown);
  const targetIndex = options.activeCalloutIndex ?? options.cursorHint?.activeCalloutIndex ?? null;

  if (options.mode === "update" && targetIndex !== null) {
    const existing = callouts.find((item) => item.index === targetIndex);
    if (existing) {
      const replacement = serializeCalloutMarkdown({
        ...options.callout,
        quoteDepth: existing.depth,
      });
      return [{
        from: snapToUtf16Boundary(markdown, existing.from),
        to: snapToUtf16Boundary(markdown, existing.to),
        insert: replacement,
      }];
    }
  }

  const blockMarkdown = serializeCalloutMarkdown(options.callout);
  const candidateSelection =
    options.selectionMarkdown?.trim() ||
    options.selectionText?.trim() ||
    options.cursorHint?.sourceSelectionText?.trim() ||
    "";

  if (options.mode === "wrap" && candidateSelection) {
    const candidates = [candidateSelection, options.selectionText?.trim() ?? ""].filter(Boolean);
    for (const needle of candidates) {
      const foundIndex = markdown.indexOf(needle);
      if (foundIndex !== -1) {
        const cleanBody = options.callout.body ?? stripSingleQuoteLevel(needle);
        const wrapped = serializeCalloutMarkdown({
          ...options.callout,
          body: cleanBody,
        });
        return ensureBlockReplacement(markdown, foundIndex, foundIndex + needle.length, wrapped);
      }
    }
  }

  // If the cursor is sitting in a known block (e.g. a paragraph) and mode is insert,
  // append cleanly right after that block; otherwise append to the end of the note.
  const activeBlockText = options.cursorHint?.activeBlockText?.trim();
  if (activeBlockText && markdown) {
    const blockIdx = markdown.indexOf(activeBlockText);
    if (blockIdx !== -1) {
      const lineEndIdx = markdown.indexOf("\n", blockIdx + activeBlockText.length);
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

export const cycleCalloutFoldAtTarget = (
  markdown: string,
  targetIndex?: number | null,
): { edits: PluginMarkdownEdit[]; nextFold: CalloutFoldModifier; callout: ParsedMarkdownCallout } | null => {
  const callouts = extractCalloutsFromMarkdown(markdown);
  if (callouts.length === 0) return null;

  const target =
    (targetIndex != null ? callouts.find((item) => item.index === targetIndex) : undefined) ??
    callouts[0];
  if (!target) return null;

  const nextFold: CalloutFoldModifier =
    target.fold === "" ? "+" : target.fold === "+" ? "-" : "";

  const headerLine = markdown.slice(target.headerFrom, target.headerTo);
  const updatedHeaderLine = headerLine.replace(
    /(\\*\[![a-zA-Z0-9_-]+\\?\])([+-])?/,
    (_whole, marker: string) => `${marker}${nextFold}`,
  );

  return {
    edits: [{
      from: snapToUtf16Boundary(markdown, target.headerFrom),
      to: snapToUtf16Boundary(markdown, target.headerTo),
      insert: updatedHeaderLine,
    }],
    nextFold,
    callout: target,
  };
};

export const normalizeCompactCalloutsInMarkdown = (
  markdown: string,
): { edits: PluginMarkdownEdit[]; count: number } => {
  const callouts = extractCalloutsFromMarkdown(markdown);
  const compactOnes = callouts.filter((item) => item.hasCompactBody);
  if (compactOnes.length === 0) {
    return { edits: [], count: 0 };
  }

  const edits: PluginMarkdownEdit[] = [];
  for (const item of compactOnes) {
    const emptyPrefix = Array.from({ length: item.depth }, () => ">").join(" ");
    const at = snapToUtf16Boundary(markdown, item.headerTo);
    edits.push({
      from: at,
      to: at,
      insert: `\n${emptyPrefix}`,
    });
  }

  return {
    edits,
    count: compactOnes.length,
  };
};
