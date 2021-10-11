require("dotenv").config();
const { build } = require("esbuild");
const define = {};

for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const buildBackgroundOpts = {
  entryPoints: ["./src/background.ts"],
  outfile: "./dist/background.js",
  bundle: true,
  define,
};

build(buildBackgroundOpts).catch(() => process.exit(1));

const buildContentOpts = {
  entryPoints: ["./src/content.ts"],
  outfile: "./dist/content.js",
  bundle: true,
};

build(buildContentOpts).catch(() => process.exit(1));
