import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readJson = path => JSON.parse(readFileSync(resolve(path), "utf8"));
const en = readJson("src/i18n/en.json");
const ny = readJson("src/i18n/ny.json");
const enKeys = Object.keys(en).sort();
const nyKeys = Object.keys(ny).sort();
const missingNy = enKeys.filter(key => !(key in ny));
const missingEn = nyKeys.filter(key => !(key in en));
const empty = [...new Set(enKeys.concat(nyKeys))].filter(key => !String(en[key] ?? "").trim() || !String(ny[key] ?? "").trim());
if (missingNy.length || missingEn.length || empty.length) {
  console.error(JSON.stringify({ missingNy, missingEn, empty }, null, 2));
  process.exit(1);
}
console.log(`Translation parity passed: ${enKeys.length} English and ${nyKeys.length} Chichewa keys.`);
