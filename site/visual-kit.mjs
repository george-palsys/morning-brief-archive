import fs from 'node:fs';

export function readSiteAsset(siteRoot, name, visual = false) {
  const allowed = visual
    ? /^[-a-z]+\.(?:webp|svg|css)$/.test(name)
    : ['site.css', 'design-tokens.css', 'app.js', 'theme-init.js'].includes(name);
  if (!allowed) throw Error('Invalid site asset');
  const folders = visual ? ['assets', 'assets/visuals'] : ['assets'];
  for (const folder of folders) {
    if (!fs.lstatSync(new URL(folder, siteRoot)).isDirectory()) {
      throw Error(`Site asset directory must not be a symbolic link: ${folder}`);
    }
  }
  const file = new URL(`${folders.at(-1)}/${name}`, siteRoot);
  if (!fs.lstatSync(file).isFile()) throw Error(`Site asset must be a regular file: ${name}`);
  return fs.readFileSync(file);
}

export function visualIcon(root, name, size, lazy = false) {
  return `<img class="mb-motion-art mb-icon-${name}" src="${root}icon-${name}.svg" width="${size}" height="${size}" alt=""${lazy ? ' loading="lazy"' : ''}>`;
}

export function visualPicture(root, topic, hideOnMobile = false) {
  return `<picture class="mb-art"><source media="(prefers-reduced-data: reduce)" srcset="${root}blank.svg"><source media="(max-width: 640px)" srcset="${root}${hideOnMobile ? 'blank.svg' : `hero-${topic}-mobile.webp`}" width="640" height="320"><img class="mb-motion-art" src="${root}hero-${topic}.webp" width="1440" height="320" alt=""></picture>`;
}

export function fullSentences(value, limit = 160) {
  const sentences = String(value).match(/[^。！？]*[。！？]+|[^。！？]+$/gu) || [];
  let excerpt = '';
  for (const sentence of sentences) {
    if (excerpt && excerpt.length + sentence.length > limit) break;
    if (excerpt && !/[。！？]$/u.test(sentence)) break;
    excerpt += sentence;
  }
  return excerpt;
}

// Input is builder-owned HTML: esc/escape encode &, <, > and quotes in values.
// This is not a parser for arbitrary untrusted HTML. Keep that escaping contract.
// Quote-aware tag splitting also preserves a literal > inside a quoted value.
// Match text nodes only: never rewrite hrefs, attributes, or raw input data.
export function wrapCveText(html) {
  let raw = false;
  return html.split(/(<(?:"[^"]*"|'[^']*'|[^'">])*>)/g).map(part => {
    if (part.startsWith('<')) {
      if (/^<(?:title|script|style)\b/i.test(part)) raw = true;
      if (/^<\/(?:title|script|style)>/i.test(part)) raw = false;
      return part;
    }
    return raw ? part : part.replace(/CVE-\d{4}-\d{4,}/g, id => `<span class="cve-id">${id}</span>`);
  }).join('');
}
