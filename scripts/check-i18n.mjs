// Checks that every locale file has exactly the same keys as en.json, and
// that every {{placeholder}} in English also appears in the translation.
// Run with: npm run check:i18n
import { readFileSync } from 'node:fs';

const dir = new URL('../src/i18n/locales/', import.meta.url);
const load = (lang) => JSON.parse(readFileSync(new URL(`${lang}.json`, dir), 'utf8'));

function flatten(obj, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') flatten(value, path, out);
    else out[path] = String(value);
  }
  return out;
}

const placeholders = (s) => (s.match(/\{\{\s*\w+\s*\}\}/g) ?? []).sort().join(',');

const en = flatten(load('en'));
let problems = 0;

for (const lang of ['tl', 'ceb']) {
  const other = flatten(load(lang));
  for (const key of Object.keys(en)) {
    if (!(key in other)) {
      console.error(`${lang}: missing ${key}`);
      problems++;
    } else if (!other[key].trim()) {
      console.error(`${lang}: empty ${key}`);
      problems++;
    } else if (placeholders(en[key]) !== placeholders(other[key])) {
      console.error(`${lang}: placeholders differ in ${key}`);
      problems++;
    }
  }
  for (const key of Object.keys(other)) {
    if (!(key in en)) {
      console.error(`${lang}: extra key ${key} (not in en.json)`);
      problems++;
    }
  }
}

if (problems) {
  console.error(`\n${problems} problem(s) found.`);
  process.exit(1);
}
console.log(`OK: ${Object.keys(en).length} keys, all locales match.`);
