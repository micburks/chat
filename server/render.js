import fs from 'fs';
import path from 'path';

// server-side render
// - get html template
// - replace {{path/to/module.js}} with string returned from this module's default export
export default async function renderHtml(filePath) {
  let file = await fs.promises.readFile(filePath, 'utf-8');
  let match = file.match(/{{(.+)}}/);
  let rendered = '';
  let resolved = path.resolve(match[1]);
  if (fs.existsSync(resolved)) {
    const mod = await import(resolved);
    if (mod.default) {
      rendered = await mod.default();
    }
  }
  file = file.replace(match[0], rendered);
  return file;
}
