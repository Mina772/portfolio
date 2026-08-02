// Static import validator: resolves every relative and "@/"-aliased import
// across the frontend src tree and reports any that cannot be found on disk.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const exts = [".js", ".jsx", ".json", ".mjs"];

function walk(dir) {
  let files = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files = files.concat(walk(p));
    else if (/\.(jsx?|mjs)$/.test(name)) files.push(p);
  }
  return files;
}

function resolveImport(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = join(srcDir, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return true; // bare package import — assume provided by node_modules

  if (existsSync(base) && statSync(base).isFile()) return true;
  for (const e of exts) if (existsSync(base + e)) return true;
  for (const e of exts) if (existsSync(join(base, "index" + e))) return true;
  return false;
}

const importRe = /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
let problems = 0;
for (const file of walk(srcDir)) {
  const code = readFileSync(file, "utf8");
  let m;
  while ((m = importRe.exec(code))) {
    const spec = m[1] || m[2];
    if (!spec) continue;
    if (!resolveImport(spec, file)) {
      problems += 1;
      console.log(`MISSING: ${spec}\n   in ${file.replace(root + "/", "")}`);
    }
  }
}
console.log(problems === 0 ? "\nAll local imports resolve." : `\n${problems} unresolved import(s).`);
process.exit(problems === 0 ? 0 : 1);
