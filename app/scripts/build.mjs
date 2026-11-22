// Bygger app/www från webbversionen i repots rot, plus det som bara behövs i iOS-appen.
import { build } from "esbuild";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(app, "..");
const www = join(app, "www");

rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

// Webbappen (samma fil som GitHub Pages serverar). Service workern behövs inte i appen.
cpSync(join(root, "icons"), join(www, "icons"), { recursive: true });
cpSync(join(root, "manifest.webmanifest"), join(www, "manifest.webmanifest"));
let html = readFileSync(join(root, "index.html"), "utf8");
if (!html.includes("</head>")) throw new Error("Hittade inte </head> i index.html");
html = html.replace("</head>", '<script src="native.js"></script>\n</head>');
writeFileSync(join(www, "index.html"), html);

// Notisljud måste ligga i roten av webbmappen för att plugin ska hitta dem.
cpSync(join(app, "sounds"), www, { recursive: true });

await build({
  entryPoints: [join(app, "src", "native.js")],
  bundle: true,
  format: "iife",
  target: "safari15",
  minify: true,
  outfile: join(www, "native.js"),
});

console.log("Klart: app/www är byggd.");
