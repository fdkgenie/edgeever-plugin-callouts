import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(__dirname, "..");

const MAX_MAIN_JS_BYTES = 5 * 1024 * 1024;
const MAX_STYLES_CSS_BYTES = 1024 * 1024;

const requiredFiles = ["manifest.json", "package.json", "main.js", "styles.css"];
for (const file of requiredFiles) {
  if (!existsSync(path.join(pluginRoot, file))) {
    throw new Error(`Missing required release file: ${file}`);
  }
}

const manifest = JSON.parse(await readFile(path.join(pluginRoot, "manifest.json"), "utf8"));
const pkg = JSON.parse(await readFile(path.join(pluginRoot, "package.json"), "utf8"));

if (manifest.version !== pkg.version) {
  throw new Error(
    `Version mismatch: manifest.json (${manifest.version}) !== package.json (${pkg.version}).`,
  );
}

const tagArg = process.argv[2]?.trim();
if (tagArg) {
  const normalizedTag = tagArg.replace(/^v/, "");
  if (normalizedTag !== manifest.version) {
    throw new Error(
      `Release tag '${tagArg}' does not match manifest.json version '${manifest.version}'.`,
    );
  }
}

const mainJsText = await readFile(path.join(pluginRoot, "main.js"), "utf8");
const stylesCssText = await readFile(path.join(pluginRoot, "styles.css"), "utf8");
const mainBytes = Buffer.byteLength(mainJsText, "utf8");
const stylesBytes = Buffer.byteLength(stylesCssText, "utf8");

if (mainBytes > MAX_MAIN_JS_BYTES) {
  throw new Error(`main.js (${mainBytes} bytes) exceeds 5 MB limit.`);
}
if (stylesBytes > MAX_STYLES_CSS_BYTES) {
  throw new Error(`styles.css (${stylesBytes} bytes) exceeds 1 MB limit.`);
}
if (/^\s*(?:import|export)\s+[^;\n]*from\s+["']\.\.?\//m.test(mainJsText)) {
  throw new Error("main.js contains relative imports.");
}

const loaded = await import(pathToFileURL(path.join(pluginRoot, "main.js")).href);
const plugin = loaded.default && typeof loaded.default === "object" && "default" in loaded.default
  ? loaded.default.default
  : loaded.default;

if (!plugin || typeof plugin.activate !== "function") {
  throw new Error("main.js must default-export an object with an activate(context) method.");
}

console.log(
  JSON.stringify({
    ok: true,
    pluginId: manifest.id,
    version: manifest.version,
    ...(tagArg ? { tag: tagArg } : {}),
    mainJsBytes: mainBytes,
    stylesCssBytes: stylesBytes,
  }),
);
