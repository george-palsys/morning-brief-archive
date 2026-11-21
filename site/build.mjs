import fs from 'node:fs';
import { pageContent, productMeta } from './d14.mjs';
import { readSiteAsset, visualPicture, wrapCveText } from './visual-kit.mjs';
import { shell, directory, homepage } from './round3.mjs';
import { copy } from './display-v4-copy.mjs';
import { readDisplay, renderOverview, renderEntry, renderDrill } from './display-v4.mjs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import { parse } from 'yaml';
import { fileURLToPath } from 'node:url';

export const slugs = 'websphere-application-server websphere-liberty mq instana turbonomic black-duck-sca coverity seeker srm neuvector appscan jboss-eap cicd concert gcm qse vault bob openshift 3scale jbcs-httpd rancher-rke2 nkp confluent-platform palsys-one cmc'.split(' ');
const sections = [['index', '摘要'], ['products', '產品動態'], ['knowledge', '新知識'], ['cve', 'CVE'], ['taiwan', '台灣 IT'], ['ai', 'AI'], ['maintenance', '清單維護']];
const states = { '有更新': 'updated', '無更新': 'none', '無法確認': 'unknown', '無公開來源': 'nosource' };
// Reviewed historical imports only. Other rehearsal/preview inputs stay blocked.
const publishedRehearsals = JSON.parse(fs.readFileSync(new URL('./published-rehearsals.json', import.meta.url), 'utf8'));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const newTabHint = '<span class="sr-only">（在新分頁開啟）</span>';
function externalLinks(html) {
  return html.replace(/<a\b([^>]*\bhref="https?:\/\/[^"]+"[^>]*)>([\s\S]*?)<\/a>/gi,
    (link, attrs, label) => attrs.includes('target="_blank"') ? link :
      `<a${attrs.replace(/ rel="[^"]*"/g, '')} target="_blank" rel="noopener noreferrer">${label}${newTabHint}</a>`);
}
const plain = s => String(s).replace(/<[^>]*>/g, '').replace(/[*`]/g, '');
export function url(s) {
  s = String(s).trim();
  if (/^[\u0000-\u0020]*$/.test(s) || /[\u0000-\u0020\\]/.test(s) || s.startsWith('/') || /^[^/?#]*:/.test(s) && !/^https?:\/\//i.test(s)) return '#';
  if (/^https?:\/\//i.test(s)) return s;
  return s.replace(/(^|\/)README\.md(?=$|[?#])/g, '$1index.html').replace(/\.md(?=$|[?#])/g, '.html');
}
export function markdown(source, { section = '', summary = false, display, cards = false, visualStatus = false } = {}) {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: false });
  for (const rule of ['fence', 'code_block']) {
    const original = md.renderer.rules[rule];
    md.renderer.rules[rule] = (tokens, i, options, env, renderer) => original(tokens, i, options, env, renderer)
      .replace('<pre>', '<pre tabindex="0" role="region" aria-label="程式碼區塊">');
  }
  const closes = md.renderer.rules.link_close || ((t, i, o, e, r) => r.renderToken(t, i, o));
  let external = false;
  md.renderer.rules.link_close = (t, i, o, e, r) => {
    const suffix = external ? newTabHint : '';
    external = false;
    return suffix + closes(t, i, o, e, r);
  };
  const links = md.renderer.rules.link_open || ((t, i, o, e, r) => r.renderToken(t, i, o));
  md.renderer.rules.link_open = (t, i, o, e, r) => {
    const raw = t[i].attrGet('href') || '';
    t[i].attrSet('href', url(raw));
    external = /^https?:\/\//i.test(t[i].attrGet('href'));
    if (external) {
      t[i].attrSet('rel', 'noopener noreferrer');
      t[i].attrSet('target', '_blank');
    }
    return links(t, i, o, e, r);
  };
  // Images from source content never make network requests (including tracking pixels).
  md.renderer.rules.image = (t, i) => esc(t[i].content);
  md.renderer.rules.text = (t, i) => esc(t[i].content).replace(/\bCVE-\d{4}-\d+\b/g, '<code>$&</code>');
  source = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .split(/\r?\n/).filter(line => !/^\[← (?:今日摘要|26 項產品現況)\]/.test(line)).join('\n');
  source = source.replace(/^> 歷史演練分檔：[^\n]*(?:\n|$)/gm, '');
  const tokens = md.parse(source, {});
  const toc = []; let n = 0; let headers = []; let tableN = 0; let weeklyStarted = false; let articleHeadings = 0;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'heading_open') {
      let level = Number(t.tag.slice(1));
      const weekly = section === 'knowledge' && level === 2 &&
        ['本週回顧', '本週動手題'].includes(plain(tokens[i + 1].content));
      if (display && weekly) {
        if (!articleHeadings) throw Error('knowledge：週五小節必須放在所有條目之後');
        weeklyStarted = true;
        t.attrSet('class', 'weekly-title');
      }
      if (display && section === 'knowledge' && weeklyStarted && level >= 3) {
        throw Error('knowledge：週五小節之後不得再有條目標題');
      }
      if (level === 3) articleHeadings++;
      if (section && level >= 3) level--;
      if (level === 1) { tokens[i + 1].content = ''; tokens[i + 1].children = []; t.hidden = true; tokens[i + 2].hidden = true; continue; }
      if (section === 'cve' && level === 2) {
        const inline = tokens[i + 1];
        inline.meta = { productRelated: inline.content.includes('【與我們的產品線相關】') };
        inline.content = inline.content.replaceAll('【與我們的產品線相關】', '');
        for (const child of inline.children || []) if (child.type === 'text') child.content = child.content.replaceAll('【與我們的產品線相關】', '');
        if (inline.meta.productRelated) t.attrSet('data-product-related', 'true');
      }
      if (section && level === 2 && (!display || t.tag === 'h3')) t.attrSet('class', 'item-title');
      t.tag = `h${level}`; tokens[i + 2].tag = t.tag;
      if (level === 2) {
        const title = plain(tokens[i + 1].content);
        let id = `item-${++n}`;
        if (summary) {
          const key = sections.find(([, label]) => title.includes(label))?.[0];
          if (key && key !== 'index') id = `section-${key}`;
        }
        t.attrSet('id', id); toc.push({ id, title });
      }
    }
    if (t.type === 'table_open') {
      headers = []; tableN++;
      const close = tokens.findIndex((v, j) => j > i && v.type === 'table_close');
      const headEnd = tokens.findIndex((v, j) => j > i && v.type === 'thead_close');
      for (let j = i; j < headEnd; j++) if (tokens[j].type === 'inline') headers.push(tokens[j].content);
      const cls = summary && headers.length === 3 ? 'table-stack' : 'table-wide';
      t.meta = { cls, caption: headers.join('、'), tableN };
      tokens[close].meta = t.meta;
      let col = 0;
      for (let j = i; j <= close; j++) {
        if (tokens[j].type === 'tr_open') col = 0;
        if (tokens[j].type === 'th_open') tokens[j].attrSet('scope', 'col');
        if (tokens[j].type === 'td_open') tokens[j].attrSet('data-label', plain(headers[col++]));
      }
    }
  }
  md.renderer.rules.table_open = (t, i) => {
    const { cls, caption } = t[i].meta;
    const wrapper = cls === 'table-wide'
      ? `<p class="scroll-hint" hidden>可左右捲動</p><div class="table-scroll table-wide" role="region" aria-label="${esc(caption)}" tabindex="0">`
      : '<div class="table-stack">';
    return `${wrapper}<table role="table"><caption class="sr-only">${esc(caption)}</caption>\n`;
  };
  md.renderer.rules.table_close = () => '</table></div>\n';
  if (display) {
    const render = part => md.renderer.render(part, md.options, {});
    const starts = tokens.flatMap((token, i) => token.type === 'heading_open' && token.tag === 'h2' ? [i] : []);
    let entryIndex = 0;
    const html = starts.map((start, index) => {
      const end = starts[index + 1];
      if (tokens[start].attrGet('class') === 'weekly-title') return `<article class="news-card v4-entry">${render(tokens.slice(start, end))}</article>`;
      if (tokens[start].attrGet('class') !== 'item-title') return render(tokens.slice(start, end));
      const part = tokens.slice(start + 3, end);
      const body = [], impact = [], sources = [];
      for (let i = 0; i < part.length; i++) {
        const token = part[i];
        if (token.type !== 'list_item_open' || token.level !== 1) { body.push(token); continue; }
        const lead = part[i + 2]?.children?.[0]?.content ?? '';
        const hasLabel = label => lead.startsWith(label + '：') || lead.startsWith(label + ':');
        const target = hasLabel('來源') ? sources : hasLabel('影響') || hasLabel('對我們的影響') ? impact : null;
        if (!target) { body.push(token); continue; }
        const end = part.findIndex((item, j) => j > i && item.type === 'list_item_close' && item.level === token.level);
        if (end < 0) throw Error('Markdown list item is not closed');
        if (target === impact) {
          const children = part[i + 2].children;
          const label = hasLabel('影響') ? '影響' : '對我們的影響';
          const field = new children[0].constructor('html_inline', '', 0);
          field.content = `<span class="lead-in">${esc(lead.slice(0, label.length + 1))}</span>`;
          children[0].content = lead.slice(label.length + 1);
          children.unshift(field);
        }
        target.push(...part.slice(i, end + 1)); i = end;
      }
      const main = render(body).replaceAll('<ul>\n</ul>\n', '');
      for (const token of sources) {
        const children = token.children ?? [];
        const i = children.findIndex(child => child.type === 'link_open');
        if (i !== 1 || children.length !== 4 || children[0].type !== 'text' ||
          children[3].type !== 'link_close' || children[2].content !== children[i].attrGet('href')) continue;
        let label = children[0].content.trim();
        if (label.startsWith('來源：')) label = label.slice(3).trim();
        if (label.endsWith('：') || label.endsWith(':')) label = label.slice(0, -1).trim();
        if (label) { children[2].content = label; children.shift(); }
      }
      for (const { children } of sources) {
        if (!children) continue;
        let hostname = '';
        let linkText = '';
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.type === 'link_open') {
            const target = URL.parse(child.attrGet('href'));
            hostname = target && ['https:', 'http:'].includes(target.protocol) ? target.hostname : '';
            linkText = '';
          } else if (child.type === 'link_close' && hostname) {
            if (linkText !== hostname && URL.parse(linkText)?.hostname !== hostname) {
              const domain = new child.constructor('text', '', 0);
              domain.content = `（${hostname}）`;
              children.splice(++i, 0, domain);
            }
            hostname = '';
          } else if (hostname && (child.type === 'text' || child.type === 'code_inline')) {
            linkText += child.content;
          }
        }
      }
      return renderEntry(render(tokens.slice(start, start + 3)), main, display[entryIndex++], section,
        impact.length ? render(impact) : '', sources.length ? render(sources) : '', visualStatus);
    }).join('');
    if (entryIndex !== display.length) throw Error(`display.${section} 項目數與輸出條目數不一致`);
    return { html, toc };
  }
  const renderTokens = part => md.renderer.render(part, md.options, {});
  const starts = cards ? tokens.flatMap((token, i) => token.type === 'heading_open' && token.tag === 'h2' && token.level === 0 ? [i] : []) : [];
  let html = starts.length ? renderTokens(tokens.slice(0, starts[0])) + starts.map((start, i) =>
    `<section class="card d14-section">${renderTokens(tokens.slice(start, starts[i + 1]))}</section>`).join('') : renderTokens(tokens);
  // Explicit visual emphasis while preserving original wording.
  html = html.replace(/<li>(對我們的影響[：:][\s\S]*?)<\/li>/g, '<li class="impact">$1</li>');
  html = html.replace(/<li>類別[：:]([^<]+)<\/li>/g, '<li class="type-tag">類別：$1</li>');
  html = html.replace(/(<td[^>]*>)(無法開啟|需要登入|頁面沒有可比對的清單|已轉址)(<\/td>)/g, '$1<span class="source-warning"><span aria-hidden="true">△ </span>$2</span>$3');
  html = html.replace(/(<li>[^<\n]*[：:])(有更新|無更新|無法確認|無公開來源)/g, (_, start, state) => start + badge(state));
  if (section === 'knowledge') html = html.replace(/<ul>\n((?:<li>(?:這是什麼|原理|用在哪裡|原文)[：:][\s\S]*?<\/li>\n){4})<\/ul>/g, (_, body) => '<dl class="knowledge">' + body.replace(/<li>([^：:]+)[：:]([\s\S]*?)<\/li>/g, '<dt>$1</dt><dd>$2</dd>') + '</dl>');
  if (section) html = html.replace(/(<h2[^>]*>[\s\S]*?)(?=<h2|$)/g, '<article class="news-card">$1</article>');
  if (section === 'cve' && !display) html = html.replace(/<h2\b[^>]*data-product-related="true"[^>]*>[\s\S]*?<\/h2>/g, heading => heading + '<span class="type-tag">與我們的產品線相關</span>');
  if (section === 'maintenance' && !html.trim()) html = '<p>今天沒有清單維護項目</p>\n';
  html = html.replace(/(<li(?: class="[^"]*")?>)(發生什麼事|受影響產品與版本|嚴重度|是否已有修補|攻擊現況|影響|來源|對我們的影響)([：:])/g, '$1<span class="lead-in">$2$3</span>');
  if (section === 'maintenance' && html.trim() !== '<p>今天沒有清單維護項目</p>') {
    const first = html.match(/^\s*<p>([\s\S]*?)<\/p>/)?.[0] || '<p>本日清單維護紀錄如下。</p>';
    html = `${first}<details class="maintenance-record"><summary>查看維護紀錄</summary>${html.replace(first, '')}</details>`;
    toc.length = 0;
  }
  return { html, toc };
}
function badge(state) {
  const key = states[state] || 'unknown';
  const shapes = { updated: '<circle cx="8" cy="8" r="6.5"/><path d="M5 8l3-3 3 3M8 5v7"/>', none: '<circle cx="8" cy="8" r="6.5"/><path d="M4 8l3 3 5-6"/>', unknown: '<path d="M8 1L15 14H1Z M8 5v4 M8 11v1"/>', nosource: '<circle cx="8" cy="8" r="6.5" stroke-dasharray="2 2"/><path d="M4 8h8"/>' };
  return `<span class="st st--${key === 'none' ? 'unchanged' : key}"><svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75">${shapes[key]}</svg>${esc(state)}</span>`;
}
function front(source) {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? parse(m[1]) : {};
}
function relative(from, to) { return path.posix.relative(path.posix.dirname(from), to) || path.posix.basename(to); }
export function build({ input = '.', output = '_site', allowRehearsal = false, basePath = '/morning-brief-archive/', visualPreview = false } = {}) {
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(basePath)) throw Error('base-path 必須是 / 或以 / 開頭、結尾的站台路徑（只允許英數字、底線、連字號）');
  input = path.resolve(input); output = path.resolve(output);
  if (input === output || input.startsWith(output + path.sep)) throw Error('輸出不得覆寫來源資料夾');
  const read = file => fs.readFileSync(path.join(input, file), 'utf8');
  const exists = file => fs.existsSync(path.join(input, file));
  const warnings = []; const warn = s => { warnings.push(s); console.warn(`WARNING: ${s}`); };
  const catalog = parse(read('products.yaml')).products;
  if (!Array.isArray(catalog) || catalog.length !== 26 || catalog.some((p, i) => p.id !== i + 1)) throw Error('products.yaml 必須依 id 1–26 列出產品');
  const days = [];
  if (exists('daily')) for (const name of fs.readdirSync(path.join(input, 'daily'))) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(name) && fs.statSync(path.join(input, 'daily', name)).isDirectory()) {
      const base = `daily/${name}`;
      for (const file of ['README.md', 'products.md', 'knowledge.md', 'cve.md', 'taiwan.md', 'ai.md', 'maintenance.md', 'meta.yaml']) if (!exists(`${base}/${file}`)) throw Error(`${base}/${file} 缺檔，停止建置`);
      const meta = parse(read(`${base}/meta.yaml`));
      for (const key of ['title', 'date', 'weekday', 'type', 'collected_at', 'cve_ids', 'products', 'tags', 'spec_version', 'products_checked', 'products_updated', 'products_unconfirmed', 'cicd_tools_updated']) if (meta?.[key] === undefined || meta[key] === null) throw Error(`${base}/meta.yaml 缺欄位 ${key}`);
      if (meta.date !== name || ![3, 4].includes(meta.spec_version) || meta.products_checked !== 26 || !Number.isFinite(Date.parse(meta.collected_at))) throw Error(`${base}/meta.yaml 日期、版本或檢查數無效`);
      for (const key of ['cve_ids', 'products', 'tags', 'products_updated', 'products_unconfirmed', 'cicd_tools_updated']) if (!Array.isArray(meta[key]) || meta[key].some(x => typeof x !== 'string')) throw Error(`${base}/meta.yaml ${key} 必須是字串陣列`);
      for (const key of ['title', 'date', 'weekday', 'type', 'collected_at']) if (typeof meta[key] !== 'string' || !meta[key].trim()) throw Error(`${base}/meta.yaml ${key} 必須是非空字串`);
      const publishedRehearsal = publishedRehearsals.some(record => ['date', 'type', 'title', 'collected_at'].every(key => record[key] === meta[key]));
      if (/rehearsal|preview/i.test(meta.type) && !allowRehearsal && !publishedRehearsal) throw Error(`${base} 是演練資料，正式建置禁止發布`);
      days.push({ date: name, meta, base, href: `${base}/index.html`, legacy: false, publishedRehearsal });
    } else if (/^\d{4}-\d{2}-\d{2}\.md$/.test(name)) days.push({ date: name.slice(0, -3), meta: front(read(`daily/${name}`)), base: `daily/${name}`, href: `daily/${name.slice(0, -3)}.html`, legacy: true });
  }
  days.sort((a, b) => b.date.localeCompare(a.date) || Number(a.legacy) - Number(b.legacy));
  const calendarDays = days.filter((day, index) => days.findIndex(other => other.date === day.date) === index);
  const stories = exists('items.jsonl') ? read('items.jsonl').split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)) : [];
  const latest = days[0]; const v3 = days.find(d => !d.legacy);
  let rows = [];
  if (exists('products')) {
    if (!exists('products/README.md')) throw Error('products/README.md 缺檔');
    for (const line of read('products/README.md').split(/\r?\n/)) {
      if (!/^\|\s*\d+\s*\|/.test(line)) continue;
      const cols = line.split('|').slice(1, -1).map(x => x.trim());
      const link = cols[1].match(/^\[(.+)\]\(([^)]+)\)$/);
      const id = Number(cols[0]); const state = Object.keys(states).find(s => cols[3].startsWith(s));
      if (!link || !state || !catalog[id - 1] || link[2] !== `${slugs[id - 1]}.md`) throw Error(`產品總表第 ${id} 列格式或 slug 錯誤`);
      rows.push({ id, name: link[1], slug: slugs[id - 1], vendor: cols[2], state, reason: cols[3].slice(state.length), version: cols[4], checked: cols[5] });
    }
    if (rows.length !== 26 || new Set(rows.map(r => r.id)).size !== 26) warn(`產品總表只讀到 ${rows.length} 列（預期 26），資料不一致，請看原始檔`);
    rows.sort((a, b) => a.id - b.id);
    for (const slug of slugs) if (!exists(`products/${slug}.md`)) throw Error(`products/${slug}.md 缺檔`);
    if (v3) for (const [field, state] of [['products_updated', '有更新'], ['products_unconfirmed', '無法確認']]) {
      const a = rows.filter(r => r.state === state).map(r => r.name).sort(); const b = [...v3.meta[field]].sort();
      if (JSON.stringify(a) !== JSON.stringify(b)) warn(`${field} 與產品總表不一致，請看原始檔`);
    }
  } else if (days.some(day => !day.legacy && !day.publishedRehearsal)) throw Error('有 v3 晨報但缺 products/');
  else if (v3) warn('歷史演練分檔未附 26 項產品來源快照，產品總表未建立；不能視為目前產品現況。');
  const pages = new Map();
  // A Pages 404 is served at the failed request URL, not necessarily /404.html.
  const sitePath = (from, to) => from === '404.html' ? `${basePath}${to}` : relative(from, to);
  const link = (from, to, label, current = false) => {
    const klass = label === copy.backToOverview ? 'btn back-to-overview'
      : /^daily\/\d{4}-\d{2}-\d{2}\.html$/.test(from) && label.startsWith('同日') ? 'btn alternate-edition' : '';
    return `<a href="${esc(sitePath(from, to))}"${current ? ' aria-current="page"' : ''}${klass ? ` class="${klass}"` : ''}>${esc(label)}</a>`;
  };
  const crumbs = (file, area, title) => `<nav aria-label="目前位置"><ol class="breadcrumbs"><li>${link(file, 'index.html', '首頁')}</li><li>${link(file, `${area}/index.html`, area === 'daily' ? '每日' : '產品')}</li><li aria-current="page">${esc(title)}</li></ol></nav>`;
  const storyTitles = new Map();
  const titles = new MarkdownIt().utils;
  const normalizeTitle = text => text.replace(/\s+/gu, ' ').trim();
  const visualCve = file => /^daily\/[^/]+\/cve\.html$/.test(file);
  const visualPage = () => true;
  function page(file, title, body, area = '', source = '') {
    let content = (allowRehearsal ? '<p role="note" class="notice">演練資料，非正式晨報</p>' : '') +
      (file === 'index.html' || file === 'products/index.html' ? body : pageContent(file, body, (to, label) => link(file, to, label)));
    if (/class="d14 d14-reading/.test(content) && !content.includes('class="mb-banner"')) {
      const topic = /\/ai\.html$/.test(file) ? 'ai' : /\/(?:cve|taiwan)\.html$/.test(file) ? 'cybersecurity' : 'infrastructure';
      const root = sitePath(file, 'assets/visuals/blank.svg').replace(/blank\.svg$/, '');
      content = content.replace(/(<div class="d14 d14-reading"[^>]*>)/, `$1<figure class="mb-banner">${visualPicture(root, topic)}<figcaption>概念插畫，非事件現場</figcaption></figure>`);
    }
    if (content.includes('d14-legacy')) content = content.replace(/(<div class="d14 d14-legacy"[^>]*>)/, '$1<p class="type-tag">舊版</p>');
    const chrome = shell({file, area, today:latest, time:latest ? collectionTime(latest) : '', url:sitePath, source, content});
    if (area === 'daily') {
      const entries = new Map();
      for (const [, id, markup] of body.matchAll(/<h2\b[^>]*\bid="(item-\d+)"[^>]*>([\s\S]*?)<\/h2>/g)) {
        const key = normalizeTitle(titles.unescapeAll(markup.replace(/<[^>]+>/g, '')));
        const matches = entries.get(key) || [];
        matches.push(id);
        entries.set(key, matches);
      }
      storyTitles.set(file, entries);
    }
    pages.set(file, wrapCveText(externalLinks(`<!doctype html>\n<html lang="zh-Hant-TW"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light">${visualPreview ? '<meta name="robots" content="noindex, nofollow">' : ''}<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; script-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'"><title>${esc(title)} – 晨報歸檔</title><link rel="stylesheet" href="${esc(sitePath(file, 'assets/design-tokens.css'))}"><link rel="stylesheet" href="${esc(sitePath(file, 'assets/site.css'))}">${visualPage(file) ? `<link rel="stylesheet" href="${esc(sitePath(file, 'assets/visuals/visual.css'))}">` : ''}<script src="${esc(sitePath(file, 'assets/app.js'))}" defer></script></head>` + `<body>${chrome}</body></html>\n`)));
  }
  function tocBody(rendered) {
    if (!rendered.toc.length) return `<div class="prose">${rendered.html}</div>`;
    return `<div class="reading-layout"><details class="page-toc"><summary>本頁 ${rendered.toc.length} 則</summary><nav aria-label="本頁目錄"><ul>${rendered.toc.map(t => `<li><a href="#${t.id}" title="${esc(t.title)}"><span>${esc(t.title)}</span></a></li>`).join('')}</ul></nav></details><div class="prose">${rendered.html}</div></div>`;
  }
  function timeline(day, part, file) {
    const i = calendarDays.findIndex(other => other.date === day.date); const adjacent = [calendarDays[i + 1], calendarDays[i - 1]];
    if (!adjacent.some(Boolean)) return '';
    return `<nav class="adjacent" aria-label="相鄰日期">${adjacent.map((d, j) => d ? link(file, d.legacy ? d.href : `${d.base}/${part}.html`, `${j ? '' : '← '}${d.date}${j ? ' →' : ''}`) : '').join('')}</nav>`;
  }
  const collectionTime = day => Number.isFinite(Date.parse(day.meta.collected_at)) ? new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(day.meta.collected_at)) : '';
  const archiveNotice = (day, file = 'index.html', extra = '') => day?.publishedRehearsal ? `<div class="admonition archive nosource" role="note"><p class="title"><svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="6.5"/><path d="M8 7v5 M8 4v1"/></svg>歷史演練歸檔：${esc(day.date)} ${esc(collectionTime(day))} 蒐集</p><div class="body"><p>僅搬移原文，未重新蒐集或查證。</p>${alternateEdition(day, file)}${extra}</div></div>` : '';
  function alternateEdition(day, file) {
    const other = days.find(candidate => candidate.date === day.date && candidate.legacy !== day.legacy);
    return other ? `<p>${link(file, other.href, `同日${other.legacy ? '舊版單檔' : other.publishedRehearsal ? '演練分檔' : '新版摘要'}${collectionTime(other) ? `（${collectionTime(other)} 蒐集）` : ''}`)}</p>` : '';
  }
  for (const d of days) {
    if (d.meta.spec_version === 4 && d.meta.display !== undefined) {
      d.display = readDisplay(d.meta, read(`${d.base}/README.md`),
        key => read(`${d.base}/${key}.md`), sections.slice(1, 6));
    }
    const parts = d.legacy ? [['index', '舊版格式']] : sections;
    for (const [part, label] of parts) {
      const source = d.legacy ? d.base : `${d.base}/${part === 'index' ? 'README' : part}.md`;
      const file = d.legacy ? d.href : `${d.base}/${part}.html`;
      const title = `${d.date} ${label}`;
      const tabs = d.legacy ? '<p role="note" class="notice">這一天是舊版單檔格式：只有 CVE、台灣 IT、AI 三段，沒有產品動態與新知識。</p>' : `<div class="tabs-scroll" role="region" aria-label="段落導覽" tabindex="-1"><nav class="section-tabs" aria-label="本日段落">${sections.map(([key, name]) => link(file, `${d.base}/${key}.html`, name, part === key)).join('')}${link(file, 'products/index.html', '26 項產品現況')}</nav></div>`;
      const rendered = markdown(read(source), { section: !d.legacy && part !== 'index' ? part : '',
        summary: !d.legacy && part === 'index', visualStatus: visualCve(file), display: d.display?.groups[part]?.entries,
        cards: d.legacy || (!d.display && part === 'index') });
      if (d.display && part === 'index') {
        page(file, `${d.meta.date} 摘要`, renderOverview(d, rows, file, link, collectionTime(d), days.find(day => !day.legacy && Date.parse(d.date) - Date.parse(day.date) === 86400000), days.find(day => !day.legacy && Date.parse(day.date) - Date.parse(d.date) === 86400000)), 'daily', source);
        continue;
      }
      if (d.display?.groups[part]) {
        const group = d.display.groups[part];
        const yesterday = new Date(Date.parse(d.date + 'T00:00:00Z') - 86400000).toISOString().slice(0,10);
        const previous = days.find(day => day.date === yesterday && !day.legacy);
        const sectionHeading = `<nav class="crumbs" aria-label="所在位置">${link(file, 'index.html', '首頁')}<span aria-hidden="true">/</span><span aria-current="page">${esc(group.name)}</span></nav><div class="kicker">${esc(group.name)} · ${esc(d.date)}</div><h1 class="section-title">${esc(group.name)}</h1><p class="subhead">${esc(d.date)} 晨報，共 ${esc(group.countText)}。</p>${part === 'ai' && d.display.aiSummary ? `<p class="subhead">${esc(d.display.aiSummary)}</p>` : ''}`;
        page(file, `${group.name}－${d.date} 晨報`,
          `<div class="v4-page" data-section="${part}">${renderDrill(d, collectionTime(d))}${visualCve(file) ? `<figure class="mb-banner">${visualPicture('../../assets/visuals/', 'cybersecurity')}<figcaption>概念插畫，非事件現場</figcaption></figure>` : ''}${sectionHeading}${tabs}${group.entries.length ? tocBody(rendered) : '<p class="empty-state">今天沒有</p>'}<nav class="adjacent" aria-label="相鄰日期">${previous ? link(file, `${previous.base}/${part}.html`, `← ${previous.date}`) : ''}${link(file, d.href, copy.backToOverview)}</nav></div>`, 'daily', source);
        continue;
      }
      page(file, title, `${crumbs(file, 'daily', d.date)}<h1>${d.legacy && d.meta.title ? esc(d.meta.title) : `晨報 ${esc(d.date)}（${esc(d.meta.weekday || '')}）｜${label}`}</h1>${archiveNotice(d, file)}${d.publishedRehearsal ? '' : alternateEdition(d, file)}${tabs}${tocBody(rendered)}${timeline(d, part, file)}${!d.legacy && part !== 'index' ? link(file, d.href, copy.backToOverview) : ''}`, 'daily', source);
    }
  }
  const missingSnapshot = '本次是歷史演練分檔，未建立產品總表或產品頁來源快照；產品版本與各來源狀態本次未蒐集。';
  const empty = v3?.publishedRehearsal && !exists('products') ? `<p class="notice">${missingSnapshot}</p>` : '<p class="notice">產品現況會在第一份新版晨報（預計 2026-11-20）產出後出現</p>';
  const pageWarnings = warnings.filter(message => !message.startsWith('歷史演練分檔未附 26 項產品來源快照，'));
  const warningHtml = () => pageWarnings.length ? `<p role="alert" class="notice">資料不一致，請看原始檔：${pageWarnings.map(esc).join('；')}</p>` : '';
  for (const [i, product] of catalog.entries()) {
    const slug = slugs[i]; const file = `products/${slug}.html`; const source = `products/${slug}.md`;
    const r = rows.find(r => r.id === product.id);
    const renderedProduct = exists(source) ? markdown(read(source), { cards: true }) : null;
    if (renderedProduct) renderedProduct.html = productMeta(renderedProduct.html);
    const content = renderedProduct ? tocBody(renderedProduct) : empty;
    page(file, `${product.name} – 產品現況`, `${crumbs(file, 'products', product.name)}<h1>${esc(product.name)}${r ? badge(r.state) : ''}</h1>${link(file, 'products/index.html', '← 26 項產品現況')}${r?.reason ? `<p class="product-status-note">${esc(r.reason)}</p>` : ''}${content}<nav class="adjacent" aria-label="相鄰產品">${i ? link(file, `products/${slugs[i - 1]}.html`, `← ${catalog[i - 1].name}`) : ''}${i < 25 ? link(file, `products/${slugs[i + 1]}.html`, `${catalog[i + 1].name} →`) : ''}</nav>`, 'products', exists(source) ? source : 'products.yaml');
  }
  const directoryFile = 'products/index.html';
  const boundLink = file => (target,label,klass,decoration = '') => `<a${klass ? ` class="${klass}"` : ''} href="${esc(sitePath(file,target))}">${esc(label)}${decoration}</a>`;
  page(directoryFile, '26 項產品追蹤', directory({
    rows, catalog:catalog.map((product,i)=>({ ...product, slug:slugs[i] })), link:boundLink(directoryFile),
    badge, warnings:warningHtml(), empty, visuals:true, warn,
  }), 'products', exists('products/README.md') ? 'products/README.md' : 'products.yaml');
  const dayList = (file, list) => `<ul class="day-list">${list.map(d => `<li>${link(file, d.href, `${d.date} ${d.meta.weekday || ''}${d.publishedRehearsal ? `｜${collectionTime(d)} 演練分檔` : ''}`)} ${d.legacy ? '<span class="type-tag">舊版</span>' : `<span>${d.publishedRehearsal ? '原演練記錄：' : ''}有更新 ${d.meta.products_updated.length} 項產品</span>`}${alternateEdition(d, file)}${d.legacy ? '' : `<span class="day-sections"><span class="type-tag">${sections.length} 分頁</span>${sections.slice(1).map(([part,label]) => link(file,`${d.base}/${part}.html`,label)).join('')}</span>`}</li>`).join('')}</ul>`;
  page('daily/index.html', '每日清單', `<h1>每日清單</h1>${dayList('daily/index.html', calendarDays)}`, 'daily');
  let attention = ''; let summaryCards = '';
  if (latest) {
    const text = read(latest.legacy ? latest.base : `${latest.base}/README.md`);
    const important = latest.display ? null : text.match(/\*\*今天最需要注意的一件事\*\*[：:][^\n]*(?:\n(?!\n)[^\n]+)*/)?.[0];
    if (important && !latest.legacy) {
      const source = important.replace(/^\*\*今天最需要注意的一件事\*\*[：:]\s*/, '');
      const rendered = markdown(source).html;
      const previewTokens = new MarkdownIt().parseInline(source, {})[0].children;
      const firstSentence = previewTokens.map(token => token.type === 'softbreak' ? ' ' : token.content).join('').trim().split(/(?<=[。！？!?]|\.)\s+|(?<=[。！？])/u)[0];
      const preview = Array.from(firstSentence);
      const limit = 48;
      let end = Math.min(limit, preview.length);
      while (end > 0 && !/[，、；\s]/u.test(preview[end] ?? '')) end--;
      const short = preview.length > limit && end > 0
        ? preview.slice(0, end).join('').trimEnd() + '…'
        : firstSentence;
      const safePreview = esc(short).replace(/\b(?:CVE-\d{4}-\d+|v?\d+(?:\.\d+)+)\b/gi,
        identifier => `<span class="attention-id">${identifier}</span>`);
      const body = rendered.replace(/href="(?!https?:|#)([^"]+)"/g, (_, href) => `href="${latest.base}/${href}"`);
      attention = `<aside class="attention"><details open><summary>今天最需要注意的一件事<span class="attention-preview">：${safePreview}</span></summary>${body}</details></aside>`;
    }
    if (latest.display) summaryCards = link('index.html', latest.href, latest.meta.title);
    else if (latest.legacy) summaryCards = `<p>最新一天是舊版格式，只有 CVE、台灣 IT、AI 三段。</p>${link('index.html', latest.href, '閱讀最新一天晨報')}`;
    else summaryCards = `<div class="summary-grid">${sections.slice(1).map(([part, label]) => {
      const rendered = markdown(read(`${latest.base}/${part}.md`), { section: part });
      const block = text.split(/^## /m).find(b => b.startsWith(label));
      const declared = block?.match(/(?:^|\n)\s*(\d+) 則/);
      const count = declared ? Number(declared[1]) : rendered.toc.length;
      return `<section class="card"><h3>${label}</h3><p>${count} ${declared ? '則' : '個小節'}</p><ul>${rendered.toc.slice(0, 3).map(t => `<li>${esc(t.title)}</li>`).join('')}</ul>${link('index.html', `${latest.base}/${part}.html`, `${label}看全部 →`)}</section>`;
    }).join('')}</div>`;
  }
  const mergedSnapshotNotice = latest?.publishedRehearsal && !exists('products');
  const homeFile = 'index.html';
  const dateLink = latest ? `<p class="home-entry">${link(homeFile, latest.href, '閱讀最新一天晨報 →')}</p>` : '';
  const fallback = dateLink + attention + (summaryCards || '<p>目前沒有晨報資料。</p>');
  const index = [];
  const linkedStories = [];
  for (const item of stories) {
    let source = typeof item.file === 'string' ? item.file : '';
    if (/^\d{4}-\d{2}-\d{2}\.md$/.test(source)) source = `daily/${source}`;
    const file = url(source);
    if (!/^(?:daily|products)\/[A-Za-z0-9_/-]+\.md$/.test(source) || !pages.has(file) || !exists(source)) {
      const truncate = value => value.length > 200 ? value.slice(0, 199) + '…' : value;
      warn(`搜尋項目 ${truncate(String(item.id))} 指向不存在的頁面 ${truncate(file)}，不加入索引`);
      if (/^(?:daily|products)\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.md$/.test(source)) linkedStories.push({ ...item, source });
      continue;
    }
    linkedStories.push({ ...item, source });
    index.push({ id:item.id, date:item.date, category:item.category, title:item.title,
      products:item.products || [], cve_ids:item.cve_ids || [], summary:String(item.summary || '').slice(0, 160), file });
  }
  const storyTarget = item => {
    const file = url(item.source);
    const ids = storyTitles.get(file)?.get(normalizeTitle(item.title)) || [];
    if (ids.length > 1) warn(`首頁新聞標題重複：${file} 取第一個錨點`);
    if (ids.length) return `${file}#${ids[0]}`;
    if (pages.has(file)) {
      warn(`首頁新聞錨點缺失：${file}，退回段落頁`);
      return file;
    }
    warn('首頁新聞段落頁缺失，退回 GitHub 原始檔');
    return '';
  };
  page(homeFile, '今日晨報', archiveNotice(latest, homeFile, mergedSnapshotNotice ? `<p>${missingSnapshot}</p>` : '') + warningHtml() +
    homepage({day:latest, time:latest ? collectionTime(latest) : '', rows, catalog, stories:linkedStories, link:boundLink(homeFile), badge, fallback, visuals:true, storyTarget}));
  page('about.html', '關於與產生規則', `<h1>關於晨報歸檔</h1><p>內容為彙整，以原廠頁面為準。</p><p><a href="https://github.com/george-palsys/morning-brief-archive/blob/main/SPEC.md" rel="noopener noreferrer">晨報產生規則 SPEC.md</a></p><div class="prose">${markdown(read('README.md')).html.replace(/href="(SPEC|products)\.html"/g, (_, name) => name === 'SPEC' ? 'href="https://github.com/george-palsys/morning-brief-archive/blob/main/SPEC.md" rel="noopener noreferrer"' : 'href="products/index.html"')}</div>`, 'about', 'README.md');
  page('404.html', '找不到頁面', `<h1>找不到頁面</h1><p>這個網址可能已變更，或這一天還沒有晨報。可以從下面三個入口繼續。</p><p class="actions"><a class="btn btn--primary" href="${esc(sitePath('404.html', 'index.html'))}">回到首頁</a><a class="btn" href="${esc(sitePath('404.html', 'daily/index.html'))}">每日清單</a><a class="btn" href="${esc(sitePath('404.html', 'search/index.html'))}">搜尋晨報</a></p>`);
  page('search/index.html', '搜尋晨報', `<h1>搜尋晨報</h1><noscript><p class="notice">搜尋需要 JavaScript，你也可以直接用瀏覽器的頁內搜尋或 <a href="https://github.com/george-palsys/morning-brief-archive/search" rel="noopener noreferrer">GitHub 倉庫搜尋</a>。</p></noscript><div id="search-ui" hidden><div class="search-filterbar filterbar card"><div class="search-query"><label for="query">搜尋晨報</label><input id="query" type="search" autofocus autocomplete="off" enterkeyhint="search" class="field"></div><fieldset><legend>類別</legend>${[['cve', 'CVE'], ['taiwan-it', '台灣 IT'], ['ai', 'AI'], ['product', '產品'], ['knowledge', '新知識']].map(([k, v]) => `<label class="chip"><input type="checkbox" name="category" value="${k}" checked>${v}</label>`).join('')}</fieldset><div class="search-range"><label for="range">時間範圍</label><select id="range" class="field"><option value="all">全部</option><option value="30">近 30 天</option></select></div><button id="all" class="btn" type="button">搜尋全部（較慢）</button></div><p id="search-empty" class="empty-state" hidden>找不到符合的內容</p><p id="search-status" aria-live="polite">輸入關鍵字搜尋，預設載入最近 3 個月。</p><ol id="results" hidden></ol></div>`, 'search');
  const months = [...new Set(index.map(i => i.date.slice(0, 7)))].sort().reverse();
  const productIndex = catalog.map((p, i) => ({ id: `product-${p.id}`, date: '', category: 'product', title: p.name, products: [p.name], cve_ids: [], summary: '', file: `products/${slugs[i]}.html` }));
  const files = new Map(pages);
  files.set('search/index.json', JSON.stringify({ months: months.map(m => `index-${m}.json`), products: productIndex }));
  for (const month of months) files.set(`search/index-${month}.json`, JSON.stringify(index.filter(i => i.date.startsWith(month))));
  for (const asset of ['site.css', 'design-tokens.css', 'app.js']) {
    const bytes = readSiteAsset(new URL('./', import.meta.url), asset);
    if (asset === 'app.js') {
      const boundary = bytes.indexOf('/* Visual preview motion */');
      files.set(`assets/${asset}`, bytes);
    } else {
      const targetStyles = '\n.item-title:target{scroll-margin-top:96px;box-shadow:inset 4px 0 0 var(--accent);padding-inline-start:12px}\n';
      files.set(`assets/${asset}`, asset === 'site.css' ? Buffer.concat([bytes, Buffer.from(targetStyles)]) : bytes);
    }
  }
  {
    const names = ['visual.css', 'blank.svg', 'hero-cybersecurity.webp', 'hero-cybersecurity-mobile.webp',
      'hero-infrastructure.webp', 'hero-infrastructure-mobile.webp', 'hero-ai.webp', 'hero-ai-mobile.webp',
      ...['ai','archive','book','cloud','document','layers','network','patch','radar','search','shield','spark'].map(name => `icon-${name}.svg`)];
    for (const name of names) {
      const asset = `assets/visuals/${name}`;
      files.set(asset, readSiteAsset(new URL('./', import.meta.url), name, true));
    }
  }
  files.set('.nojekyll', '');
  files.set('build-report.json', JSON.stringify({ mode: allowRehearsal ? 'rehearsal' : 'production', basePath, days: days.map(d => ({ date: d.date, legacy: d.legacy })), productPages: slugs.map(s => `products/${s}.html`), statusCounts: Object.fromEntries(Object.keys(states).map(s => [s, rows.filter(r => r.state === s).length])), warnings }, null, 2));
  // Never recursively delete an arbitrary caller-supplied output directory.
  if (fs.existsSync(output) && fs.readdirSync(output).length) throw Error(`輸出資料夾非空：${output}，請使用新的資料夾`);
  for (const [file, data] of files) { const target = path.join(output, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, data); }
  console.log(`BUILD OK: ${pages.size} HTML pages; ${slugs.length}/26 product pages; ${days.length} daily editions; ${index.length} search items; ${warnings.length} warnings; mode=${allowRehearsal ? 'rehearsal' : 'production'}`);
  console.log(`OUTPUT: ${output}`);
  return { pages, warnings, rows, output, basePath };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2); const value = key => args.includes(key) ? args[args.indexOf(key) + 1] : undefined;
  try { build({ input: value('--input'), output: value('--output'), basePath: value('--base-path') ?? process.env.SITE_BASE_PATH, visualPreview: args.includes('--visual-preview'), allowRehearsal: args.includes('--allow-rehearsal') }); } catch (error) { console.error(`BUILD FAILED: ${error.message}`); process.exitCode = 1; }
}
