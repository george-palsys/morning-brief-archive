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
  // Consume comments and raw/RCDATA elements whole, including embedded < or >.
  // The stack also makes an already wrapped CVE span idempotent.
  // If a tag has an unterminated quoted value, preserve the entire remaining tail.
  // Never interpret its CVE text as a text node and insert markup into an attribute.
  const tokens = /<!--[\s\S]*?(?:-->|$)|<(title|script|style|textarea)\b(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?(?:<\/\1\s*>|$)|<(?:"[^"]*"|'[^']*'|[^'">])*>|<[a-z!/][\s\S]*$/gi;
  const stack = [];
  let cursor = 0;
  let output = '';
  const text = value => stack.some(entry => entry.skip) ? value : value.replace(/(?<![A-Za-z0-9_-])CVE-\d{4}-\d{4,}(?![A-Za-z0-9_-])/g, id => `<span class="cve-id">${id}</span>`);
  for (const match of html.matchAll(tokens)) {
    output += text(html.slice(cursor, match.index)) + match[0];
    const tag = match[0];
    const name = /^<\/?([a-z][a-z0-9:-]*)\b/i.exec(tag)?.[1].toLowerCase();
    if (name && !/^(?:title|script|style|textarea)$/.test(name)) {
      if (/^<\//.test(tag)) {
        const index = stack.map(entry => entry.name).lastIndexOf(name);
        if (index >= 0) stack.length = index;
      } else if (!/\/\s*>$/.test(tag) && !/^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(name)) {
        const classes = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag);
        stack.push({name, skip: /^(?:code|pre)$/.test(name) || (classes?.[1] || classes?.[2] || '').split(/\s+/).includes('cve-id')});
      }
    }
    cursor = match.index + tag.length;
  }
  return output + text(html.slice(cursor));
}
