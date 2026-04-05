/**
 * Must-b ZIP Factory — generate-zips.mjs
 * Generates one .zip per skill/plugin in public/downloads/
 * Run: node generate-zips.mjs
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Ensure archiver is installed ───────────────────────────────────────────
try {
  await import("archiver");
} catch {
  console.log("📦 Installing archiver...");
  execSync("npm install archiver --save-dev", { stdio: "inherit", cwd: __dirname });
}

const { default: archiver } = await import("archiver");

// ── Load hub data ──────────────────────────────────────────────────────────
const dataPath = path.join(__dirname, "src", "data", "mustb-hub-data.json");
const hubData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const outputDir = path.join(__dirname, "public", "downloads");
fs.mkdirSync(outputDir, { recursive: true });

// ── Helpers ────────────────────────────────────────────────────────────────

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildPackageJson(item) {
  return JSON.stringify(
    {
      name: `@must-b/${slugify(item.name)}`,
      version: item.version.replace(/^v/, ""),
      description: item.summary,
      author: "Must-b Core <core@must-b.com>",
      license: "MIT",
      main: "index.js",
      keywords: ["must-b", "ai-agent", "automation", "integration"],
      repository: { type: "git", url: "https://github.com/must-b/hub" },
      bugs: { url: "https://github.com/must-b/hub/issues" },
      homepage: `https://hub.must-b.com`,
    },
    null,
    2
  );
}

function buildIndexJs(item) {
  const className = item.name.replace(/[^a-zA-Z0-9]/g, "");
  return `/**
 * ${item.name}
 * Version : ${item.version}
 * Author  : Must-b Core <core@must-b.com>
 * License : MIT
 *
 * ${item.summary}
 */

'use strict';

class ${className} {
  constructor(config = {}) {
    this.name    = '${item.name}';
    this.version = '${item.version}';
    this.config  = config;
    this._ready  = false;
  }

  /** Initialize the integration and validate credentials. */
  async initialize() {
    this._validateConfig();
    this._ready = true;
    console.log(\`[Must-b] \${this.name} initialized (v\${this.version})\`);
    return this;
  }

  /** Execute an agent task object. */
  async execute(task = {}) {
    if (!this._ready) await this.initialize();
    console.log(\`[Must-b] \${this.name} executing task: \${task.description ?? 'unnamed'}\`);
    return this._run(task);
  }

  /** Override in subclass — perform the actual work. */
  async _run(task) {
    throw new Error('_run() must be implemented by the integration.');
  }

  /** Validate required config keys. */
  _validateConfig() {
    const required = this.constructor.requiredConfig ?? [];
    for (const key of required) {
      if (!this.config[key]) {
        throw new Error(\`[Must-b] Missing required config key: \${key}\`);
      }
    }
  }

  /** Graceful shutdown. */
  async shutdown() {
    this._ready = false;
    console.log(\`[Must-b] \${this.name} shut down.\`);
  }

  static get requiredConfig() { return []; }
}

module.exports = { ${className} };
`;
}

function buildReadme(item) {
  return item.readme
    ? item.readme
    : `# ${item.name}

> ${item.summary}

**Version:** ${item.version}  
**Author:** Must-b Core  
**License:** MIT  

## Installation

Download this ZIP, extract it, and place the folder inside your Must-b agent directory.  
Then configure via \`must-b config set\` or the Must-b Hub UI.

## Quick Start

\`\`\`js
const { ${item.name.replace(/[^a-zA-Z0-9]/g, "")} } = require('./${slugify(item.name)}');

const integration = new ${item.name.replace(/[^a-zA-Z0-9]/g, "")}({
  // Add your config keys here
});

await integration.initialize();
await integration.execute({ description: 'My first task' });
\`\`\`

## Integration Guide

${item.integration_guide ?? "See the Must-b Hub documentation for setup instructions."}

---

© Must-b Core — https://must-b.com
`;
}

// ── ZIP builder ────────────────────────────────────────────────────────────

async function buildZip(item, type) {
  const fileName = `${type}-${item.id}.zip`;
  const zipPath  = path.join(outputDir, fileName);

  return new Promise((resolve, reject) => {
    const output  = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      const kb = (archive.pointer() / 1024).toFixed(1);
      console.log(`  ✓  ${fileName}  (${kb} KB)`);
      resolve(zipPath);
    });

    archive.on("warning", (err) => {
      if (err.code !== "ENOENT") reject(err);
    });
    archive.on("error", reject);

    archive.pipe(output);
    archive.append(buildPackageJson(item), { name: "package.json" });
    archive.append(buildIndexJs(item),     { name: "index.js"     });
    archive.append(buildReadme(item),      { name: "README.md"    });
    archive.finalize();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🏭  Must-b ZIP Factory\n");
  console.log(`   Output  : public/downloads/`);
  console.log(`   Skills  : ${hubData.skills.length}`);
  console.log(`   Plugins : ${hubData.plugins.length}`);
  console.log(`   Total   : ${hubData.skills.length + hubData.plugins.length}\n`);

  let count = 0;
  const total = hubData.skills.length + hubData.plugins.length;

  console.log("── Skills ─────────────────────────────────────────");
  for (const skill of hubData.skills) {
    await buildZip(skill, "skill");
    count++;
  }

  console.log("\n── Plugins ────────────────────────────────────────");
  for (const plugin of hubData.plugins) {
    await buildZip(plugin, "plugin");
    count++;
  }

  console.log(`\n✅  Done! ${count}/${total} ZIP files written to public/downloads/\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
