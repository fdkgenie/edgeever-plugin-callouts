export type PluginJsonValue =
  | null
  | boolean
  | number
  | string
  | PluginJsonValue[]
  | { [key: string]: PluginJsonValue };

export type PluginNoteKind =
  | "text"
  | "mind-map"
  | "flowchart"
  | "architecture"
  | "table"
  | "poster"
  | "infographic"
  | "video";

export interface PluginContentNode {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  content?: PluginContentNode[];
}

export interface PluginContentDocument {
  type: "doc";
  content: PluginContentNode[];
}

export interface PluginNoteSummary {
  kind: PluginNoteKind;
  id: string;
  notebookId: string;
  title: string | null;
  excerpt: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PluginNote extends PluginNoteSummary {
  contentJson: PluginContentDocument;
  revision: number;
  contentMarkdown: string;
  contentText: string;
  contentHash: string;
}

export interface PluginMarkdownEdit {
  from: number;
  to: number;
  insert: string;
}

export interface PluginNoteQuery {
  notebookId?: string;
  text?: string;
  tags?: string[];
  sort?: "updated-desc" | "created-desc" | "title-asc" | "title-desc";
  limit?: number;
  offset?: number;
}

export interface PluginNoteQueryResult {
  notes: PluginNoteSummary[];
  totalCount: number;
  nextOffset: number | null;
}

export interface PluginNoteContentQueryResult {
  notes: PluginNote[];
  totalCount: number;
  nextOffset: number | null;
}

export type PluginSettingValue = string | number | boolean;

export interface PluginEditorSelection {
  noteId: string;
  from: number;
  to: number;
  empty: boolean;
  text: string;
  contentMarkdown: string;
}

export interface PluginEditorDocument {
  noteId: string;
  contentMarkdown: string;
  hasUnsavedChanges: boolean;
}

export interface PluginOpenNoteOptions {
  search?: string;
}

export type PluginPanelPresentation = "dialog" | "fullscreen";
export type PluginPanelPurpose = "workflow" | "dashboard" | "preview" | "onboarding";

export interface PluginPanelOpenOptions {
  state?: PluginJsonValue;
}

export type PluginPanelActionVariant = "default" | "primary" | "ghost";

export interface PluginPanelAction {
  id: string;
  label: string;
  variant?: PluginPanelActionVariant;
  disabled?: boolean;
}

export interface PluginPanelSelectOption {
  value: string;
  label: string;
}

export type PluginPanelToolbarItem =
  | { type: "search"; key: string; placeholder?: string; value?: string }
  | { type: "tabs"; key: string; value?: string; options: PluginPanelSelectOption[] }
  | { type: "select"; key: string; label?: string; value?: string; options: PluginPanelSelectOption[] }
  | { type: "button"; key: string; label: string; variant?: PluginPanelActionVariant; disabled?: boolean };

export interface PluginPanelEmptyState {
  title: string;
  description?: string;
  action?: PluginPanelAction;
}

export interface PluginPanelChrome {
  header?: {
    title?: string;
    description?: string | null;
    actions?: PluginPanelAction[];
  };
  toolbar?: PluginPanelToolbarItem[];
  empty?: PluginPanelEmptyState | null;
  onAction?: (id: string) => void;
  onChange?: (key: string, value: string) => void;
}

export interface PluginPanelShell {
  set(chrome: PluginPanelChrome): void;
}

export interface PluginPanelMountContext {
  state: PluginJsonValue | null;
  requestClose(): Promise<void>;
  shell: PluginPanelShell;
}

export type PluginPanelCloseDecision =
  | boolean
  | {
      title: string;
      message: string;
      confirmLabel?: string;
    };

export interface PluginPanel {
  id: string;
  title: string;
  purpose: PluginPanelPurpose;
  presentation?: PluginPanelPresentation;
  mount(
    container: HTMLElement,
    context: PluginPanelMountContext,
  ): void | (() => void) | Promise<void | (() => void)>;
  beforeClose?(): PluginPanelCloseDecision | Promise<PluginPanelCloseDecision>;
}

export interface PluginEmbedInput {
  type: string;
  resourceId: string;
  previewResourceId?: string;
  title?: string;
  data?: PluginJsonValue;
}

export interface PluginEmbedInstance extends PluginEmbedInput {
  id: string;
  pluginId: string;
  previewResourceId: string;
  title: string;
  data: PluginJsonValue;
}

export interface PluginEmbedRenderer {
  type: string;
  mount(
    container: HTMLElement,
    embed: PluginEmbedInstance,
  ): void | (() => void) | Promise<void | (() => void)>;
}

export interface PluginCommand {
  id: string;
  title: string;
  listed?: boolean;
  menu?: boolean;
  run: () => void | Promise<void>;
}

export type PluginEventMap = {
  "settings.changed": { key: string };
  "note.created": { note: PluginNote };
  "note.updated": { note: PluginNote };
  "note.deleted": { noteId: string };
  "workspace.synced": { bootstrapped: boolean; changed: number };
};

export interface PluginContext {
  pluginId: string;
  notes: {
    query(input?: PluginNoteQuery): Promise<PluginNoteQueryResult>;
    queryContent(input?: PluginNoteQuery): Promise<PluginNoteContentQueryResult>;
    get(noteId: string): Promise<PluginNote>;
  };
  commands: {
    register(command: PluginCommand): () => void;
  };
  events: {
    on<K extends keyof PluginEventMap>(
      event: K,
      listener: (payload: PluginEventMap[K]) => void | Promise<void>,
    ): () => void;
  };
  storage: {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
  };
  editor: {
    getSelection(): Promise<PluginEditorSelection | null>;
    getDocument(): Promise<PluginEditorDocument | null>;
    editMarkdown(edits: PluginMarkdownEdit[]): Promise<PluginEditorDocument>;
    insertEmbed(input: PluginEmbedInput): Promise<PluginEmbedInstance>;
    embeds: {
      register(renderer: PluginEmbedRenderer): () => void;
    };
    replaceSelection(contentMarkdown: string): Promise<void>;
    insertAtCursor(contentMarkdown: string): Promise<void>;
  };
  settings: {
    get(key: string): Promise<PluginSettingValue | null>;
    set(key: string, value: PluginSettingValue): Promise<void>;
    remove(key: string): Promise<void>;
  };
  ui: {
    showNotice(message: string): void;
    openNote(noteId: string, options?: PluginOpenNoteOptions): Promise<void>;
    panels: {
      register(panel: PluginPanel): () => void;
      open(panelId: string, options?: PluginPanelOpenOptions): Promise<void>;
    };
  };
}

export interface EdgeEverPlugin {
  activate(context: PluginContext): void | (() => void) | Promise<void | (() => void)>;
  deactivate?(): void | Promise<void>;
}
