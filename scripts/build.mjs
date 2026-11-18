import { copyFile, existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(pluginRoot, "manifest.json");
const stylesPath = path.join(pluginRoot, "styles.css");
const entryPath = path.join(pluginRoot, "src/index.ts");
const mainOutPath = path.join(pluginRoot, "main.js");
const monorepoExtensionsRoot = path.resolve(pluginRoot, "../../apps/web/public/extensions");
const monorepoCalloutsDir = path.join(monorepoExtensionsRoot, "callouts");

const MAX_MAIN_JS_BYTES = 5 * 1024 * 1024;
const MAX_STYLES_CSS_BYTES = 1024 * 1024;
const ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)+$/;
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const SETTING_KEY_PATTERN = /^[a-z][a-z0-9._-]*$/;

const validateManifest = (manifest) => {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error("manifest.json must be a JSON object.");
  }
  if (manifest.type !== "plugin") {
    throw new Error("manifest.json must declare type: 'plugin'.");
  }
  if (typeof manifest.id !== "string" || !ID_PATTERN.test(manifest.id)) {
    throw new Error(`Invalid plugin id: ${String(manifest.id)}`);
  }
  if (manifest.id === "org.edgeever" || manifest.id.startsWith("org.edgeever.")) {
    throw new Error(`Plugin id '${manifest.id}' cannot use reserved org.edgeever namespace.`);
  }
  if (typeof manifest.name !== "string" || !manifest.name.trim()) {
    throw new Error("manifest.json name is required.");
  }
  if (typeof manifest.version !== "string" || !VERSION_PATTERN.test(manifest.version)) {
    throw new Error(`manifest.json version must use SemVer: ${String(manifest.version)}`);
  }
  if (manifest.apiVersion !== "2") {
    throw new Error(`manifest.json apiVersion must be '2', got ${String(manifest.apiVersion)}`);
  }
  if (manifest.settingsUi !== "host") {
    throw new Error(`manifest.json settingsUi must be 'host', got ${String(manifest.settingsUi)}`);
  }
  if (manifest.entry !== "./main.js") {
    throw new Error(`manifest.json entry must be './main.js', got ${String(manifest.entry)}`);
  }
  if (manifest.settings?.fields) {
    if (!Array.isArray(manifest.settings.fields)) {
      throw new Error("manifest.json settings.fields must be an array.");
    }
    for (const field of manifest.settings.fields) {
      if (typeof field?.key !== "string" || !SETTING_KEY_PATTERN.test(field.key)) {
        throw new Error(`Invalid setting key: ${String(field?.key)}`);
      }
    }
  }
};

const manifestRaw = await readFile(manifestPath, "utf8");
const manifest = JSON.parse(manifestRaw);
validateManifest(manifest);

const buildResult = await Bun.build({
  entrypoints: [entryPath],
  target: "browser",
  format: "esm",
  minify: false,
  splitting: false,
  sourcemap: "none",
  loader: {
    ".css": "text",
  },
});

if (!buildResult.success) {
  for (const log of buildResult.logs) {
    console.error(log);
  }
  throw new Error("Bun.build failed for src/index.ts");
}

if (buildResult.outputs.length !== 1) {
  throw new Error(`Expected exactly 1 bundle output, got ${buildResult.outputs.length}.`);
}

const bundledCode = await buildResult.outputs[0].text();

if (/^\s*(?:import|export)\s+[^;\n]*from\s+["']\.\.?\//m.test(bundledCode)) {
  throw new Error("Bundled main.js must not contain relative imports or re-exports.");
}

const mainBytes = Buffer.byteLength(bundledCode, "utf8");
if (mainBytes > MAX_MAIN_JS_BYTES) {
  throw new Error(`Bundled main.js (${mainBytes} bytes) exceeds 5 MB limit.`);
}

const stylesRaw = await readFile(stylesPath, "utf8");
const stylesBytes = Buffer.byteLength(stylesRaw, "utf8");
if (stylesBytes > MAX_STYLES_CSS_BYTES) {
  throw new Error(`styles.css (${stylesBytes} bytes) exceeds 1 MB limit.`);
}

await writeFile(mainOutPath, bundledCode, "utf8");

let syncedMonorepoDir = null;
if (existsSync(monorepoExtensionsRoot)) {
  await mkdir(monorepoCalloutsDir, { recursive: true });
  await Promise.all([
    new Promise((resolve, reject) =>
      copyFile(manifestPath, path.join(monorepoCalloutsDir, "manifest.json"), (err) => (err ? reject(err) : resolve())),
    ),
    new Promise((resolve, reject) =>
      copyFile(mainOutPath, path.join(monorepoCalloutsDir, "main.js"), (err) => (err ? reject(err) : resolve())),
    ),
    new Promise((resolve, reject) =>
      copyFile(stylesPath, path.join(monorepoCalloutsDir, "styles.css"), (err) => (err ? reject(err) : resolve())),
    ),
  ]);
  syncedMonorepoDir = "apps/web/public/extensions/callouts";
}

console.log(
  JSON.stringify({
    ok: true,
    pluginId: manifest.id,
    version: manifest.version,
    mainJsBytes: mainBytes,
    stylesCssBytes: stylesBytes,
    ...(syncedMonorepoDir ? { syncedMonorepoDir } : {}),
  }),
);
