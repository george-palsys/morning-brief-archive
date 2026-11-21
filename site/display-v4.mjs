import MarkdownIt from 'markdown-it';
import { copy } from './display-v4-copy.mjs';

const md = new MarkdownIt({ html: false });
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const width = value => Array.from(value).reduce((n, c) => n + (c.codePointAt(0) > 127 ? 2 : 1), 0);
const text = (value, max = Infinity) => typeof value === 'string' && value.trim() && width(value) <= max;
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const list = (value, check, max = Infinity) => Array.isArray(value) && value.length <= max && value.every(item => check(item));
const optional = (value, check) => value === undefined || check(value);
const pair = value => object(value) && text(value.label) && text(value.value);
const inlineText = token => (token?.children ?? []).filter(child =>
  ['text', 'code_inline', 'image', 'softbreak', 'hardbreak'].includes(child.type))
  .map(child => child.content || ' ').join('').trim();
const linkToken = (token, href) => token?.children?.findIndex(child =>
  child.type === 'link_open' && child.attrGet('href') === href) ?? -1;
const relatedLabel = '【與我們的產品線相關】';

export function readDisplay(meta, overview, read, sections) {
  const error = (where, reason) => { throw Error(`${meta.date} ${where}：${reason}`); };
  const summary = md.parse(overview, {});
  const groups = {};
  const attention = meta.attention;
  if (!object(meta.display) || !object(attention)) error('meta.yaml', '缺少 attention 或 display');
  if (!sections.some(([key]) => key === attention.section) || !text(attention.title, 40) ||
    !text(attention.summary, 200) || !optional(attention.facts, value =>
      list(value, fact => pair(fact) && optional(fact.source, text), 4))) error('attention', '欄位或長度無效');
  if (!optional(meta.drill, value => typeof value === 'boolean') ||
    !optional(meta.display.ai_summary, value => text(value, 60))) error('meta.yaml', 'drill 或 ai_summary 無效');
  const alert = summary.find(token => token.type === 'inline' &&
    token.children?.some((child, i) => child.type === 'strong_open' && token.children[i + 1]?.content === copy.attention));
  if (linkToken(alert, `${attention.section}.md`) < 0) error('attention.section', '與摘要連結不一致');

  for (const [key, label] of sections) {
    const tokens = md.parse(read(key), {});
    const h1 = tokens.findIndex(token => token.type === 'heading_open' && token.tag === 'h1');
    const heading = h1 >= 0 ? inlineText(tokens[h1 + 1]) : '';
    const titles = tokens.flatMap((token, i) =>
      token.type === 'heading_open' && token.tag === 'h3' ? [inlineText(tokens[i + 1])] : []);
    const headingIndex = summary.findIndex((token, i) => token.type === 'heading_open' &&
      token.tag === 'h2' && inlineText(summary[i + 1]).includes(label));
    const declaration = summary[headingIndex + 4]; // h2 open, inline, close, paragraph open, inline
    const inventory = key === 'products' && /^(\d+)\s*項\s*[：:]\s*有更新\s*(\d+)、\s*無更新\s*(\d+)、\s*無法確認\s*(\d+)、\s*無公開來源\s*(\d+)。/u.exec(inlineText(declaration));
    if (inventory && inventory.slice(2).reduce((sum, value) => sum + Number(value), 0) !== Number(inventory[1])) {
      error(key, '產品狀態項數加總與總項數不一致');
    }
    const count = /^(\d+)\s*則/u.exec(inlineText(declaration));
    // SPEC §6 declares the product inventory separately from update rows.
    const productInventory = key === 'products' && /^26\s*項[：:]/u.test(inlineText(declaration));
    const nextSection = summary.findIndex((token, i) => i > headingIndex && token.type === 'heading_open' && token.tag === 'h2');
    const productRows = productInventory ? summary.slice(headingIndex, nextSection < 0 ? undefined : nextSection)
      .reduce((total, token, i, block) => total + (token.type === 'tr_open' && block[i + 1]?.type === 'td_open' ? 1 : 0), 0) : 0;
    const declaredCount = productInventory ? productRows : count ? Number(count[1]) : null;
    const more = linkToken(declaration, `${key}.md`);
    const entries = meta.display[key];
    if (!heading || headingIndex < 0 || more < 0 || !Array.isArray(entries) ||
      declaredCount !== titles.length || entries.length !== titles.length) {
      error(key, '摘要則數、段落標題與 display 則數不一致');
    }
    entries.forEach((entry, index) => {
      const invalid = reason => error(`${key} #${index + 1}`, reason);
      if (!object(entry) || !text(entry.short, 24) || typeof entry.keyword !== 'string' ||
        !/^[a-z0-9]{1,8}$/i.test(entry.keyword) || !optional(entry.date, date) ||
        !optional(entry.figures, value => list(value, pair, 3)) ||
        !optional(entry.caveat, text) || !optional(entry.digest, text)) invalid('顯示欄位無效');
      if (key === 'taiwan' && !copy.kinds.includes(entry.kind)) invalid('kind 無效');
      if (key === 'cve') {
        const score = value => object(value) && Number.isFinite(value.score) &&
          value.score >= 0 && value.score <= 10 && (value.version === null || ['3.1', '4.0'].includes(value.version)) &&
          text(value.source);
        const kev = value => object(value) && text(value.cve_id) && text(value.product) && date(value.due);
        if (!list(entry.cve_ids, text) || !list(entry.cvss, score) ||
          !Object.hasOwn(copy.exploited, entry.exploited) || !Object.hasOwn(copy.patch, entry.patch) ||
          !optional(entry.exploited_detail, text) || !optional(entry.patch_detail, text) ||
          !optional(entry.kev, value => list(value, kev)) ||
          entry.related !== titles[index].includes(relatedLabel)) invalid('CVE 顯示欄位或相關標記無效');
      }
    });
    groups[key] = {
      name: inlineText(summary[headingIndex + 1]), heading, countText: count?.[0] ?? copy.entryCount(declaredCount),
      more: inlineText({ children: declaration.children.slice(more + 1,
        declaration.children.findIndex((token, i) => i > more && token.type === 'link_close')) }),
      entries, titles: titles.map(title => title.replace(relatedLabel, '').trim())
    };
  }
  return { groups, attention, aiSummary: meta.display.ai_summary };
}

function scores(entry) {
  if (!entry.cvss.length) return `<p class="v4-score v4-score-empty"><span class="v4-track" aria-hidden="true"></span><span>${copy.unavailable}</span></p>`;
  return entry.cvss.map(({ score, version, source }) => {
    const band = score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low';
    const level = score >= 9 ? 'Critical' : score >= 7 ? 'High' : score >= 4 ? 'Medium' : score > 0 ? 'Low' : 'None';
    return `<p class="v4-score"><strong>${score.toFixed(1)}</strong><span class="v4-track" aria-hidden="true"><span class="v4-fill ${band} w-${Math.round(score * 2) * 5}"></span></span><span>${esc(copy.cvss(version, source))} · ${level}</span></p>`;
  }).join('');
}

function badges(entry, section) {
  const values = [entry.date, entry.kind];
  if (section === 'cve') values.push(...entry.cve_ids, entry.related ? '與我們的產品線相關' : '');
  return values.filter(Boolean).map(value => `<span class="tag">${esc(value)}</span>`).join('');
}

const statusSymbols = {
  exploited: { confirmed: '●', poc: '▲', none_seen: '○', unknown: '？' },
  patch: { released: '✓', hotfix: '▲', pending: '▲', none: '●', unknown: '？' },
};
function status(entry, field, showDetail = true) {
  const value = entry[field];
  const detail = showDetail && entry[`${field}_detail`];
  return `<div><span class="tag ${value === 'released' ? 'tag--mint' : `tag--${value}`}"><span aria-hidden="true">${statusSymbols[field][value]}</span> ${esc(copy[field][value])}</span>${detail ? ` <span>${esc(detail)}</span>` : ''}</div>`;
}

const facts = values => `<dl class="v4-facts">${values.map(value =>
  `<div><dt>${esc(value.label)}</dt><dd><strong>${esc(value.value)}</strong>${value.source ? `<small>${esc(value.source)}</small>` : ''}</dd></div>`
).join('')}</dl>`;

export function renderDrill(day, time) {
  return day.meta.drill ? `<p class="v4-drill">${esc(copy.drill(day.date, time))}</p>` : '';
}

export function renderEntry(heading, body, entry, section, impact, sources) {
  if (!entry) throw Error(`display.${section} 項目與輸出標題不一致`);
  const cve = section === 'cve';
  const kev = entry.kev?.length ? `<ul>${entry.kev.map(row =>
    `<li>${esc(copy.kev(row))}</li>`).join('')}</ul>` : '';
  const details = `${body}${entry.figures?.length ? facts(entry.figures) : ''}${entry.caveat ? `<blockquote>${esc(entry.caveat)}</blockquote>` : ''}${impact ? `<ul class="v4-impact">${impact}</ul>` : ''}${sources ? `<ul class="v4-sources">${sources}</ul>` : ''}`;
  const content = cve
    ? `${heading}<aside class="design-cve-rail">${badges(entry, section)}${scores(entry)}${status(entry, 'exploited')}${status(entry, 'patch')}${kev}</aside><div class="design-cve-content">${details}</div>`
    : `${heading}<div>${badges(entry, section)}</div>${details}`;
  return `<article class="news-card v4-entry">${content}</article>`;
}

export function renderOverview(day, rows, file, link, time, previous, next) {
  const { groups, attention, aiSummary } = day.display;
  const target = key => `${day.base}/${key}.html`;
  const counts = Object.entries(groups).map(([key, group]) =>
    `<li><a class="overview-stat" href="${esc(target(key).split('/').pop())}"><strong>${esc(group.countText.replace(/\s*則$/, ''))} <small>則</small></strong><span class="lab">${esc(group.name)}</span></a></li>`).join('');
  function panel(key, max) {
    const group = groups[key];
    const items = (['products', 'cve'].includes(key) ? group.entries : group.entries.slice(0, max)).map((entry, index) =>
      `<li><h3>${esc(entry.short)}</h3><div class="v4-badges">${badges(entry, key)}</div>${['knowledge','taiwan','ai'].includes(key) ? `<p>${esc(entry.digest || group.titles[index])}</p>` : ''}${key === 'cve' ? scores(entry) + '<div class="v4-panel-status">' + status(entry, 'exploited', false) + status(entry, 'patch', false) + '</div>' : ''}</li>`);
    const limit = key === 'cve' ? 2 : key === 'products' ? max : items.length;
    const visible = items.slice(0, limit);
    const remaining = items.length > limit
      ? `<details class="v4-more"><summary>${esc(copy.moreCve(items.length - limit))}</summary><ul>${items.slice(limit).join('')}</ul></details>`
      : '';
    return `<section class="v4-panel v4-panel-${key}"><h2>${esc(group.name)}</h2>${key === 'products' ? `<p>${esc(copy.productCount(day.meta.products_updated.length, group.entries.length))}</p>` : ''}${key === 'ai' ? `<p>${esc(aiSummary || group.countText)}</p>` : ''}${items.length ? `<ul>${visible.join('')}</ul>` : `<p>${copy.empty}</p>`}<div class="v4-panel-footer">${link(file, target(key), group.more)} <small>${esc(group.countText)}</small>${remaining}</div></section>`;
  }
  const tiles = rows.map(row =>
    `<li class="v4-tile${row.state === '有更新' ? ' updated' : ''}"><a href="../../products/${esc(row.slug)}.html" title="${esc(row.name)}" aria-label="${esc(`${row.name}，${row.state}，${row.version}`)}"><strong>${esc(row.name)}</strong><em class="st ${row.state === '有更新' ? 'st--updated' : row.state === '無法確認' ? 'st--unknown' : row.state === '無公開來源' ? 'st--nosource' : 'st--unchanged'}">${esc(row.state)}</em></a></li>`).join('');
  const unconfirmed = day.meta.products_unconfirmed.map(name => ({
    name, reason: rows.find(row => row.name === name)?.reason ?? ''
  }));
  const alertLink = groups[attention.section].heading.split('｜')[0].trim();
  return `<div class="v4-page v4-overview"><div class="v4-overview-top"><div class="v4-date"><div class="kicker">晨報</div><h1>${esc(day.meta.date)} ${esc(day.meta.weekday)}</h1><p class="v4-time">${esc(time)}</p></div><nav class="v4-jump" aria-label="段落導覽">${Object.entries(groups).map(([key, group]) => link(file, target(key), group.name)).join('')}${link(file, target('maintenance'), copy.maintenance)}</nav></div><nav class="adjacent" aria-label="相鄰日期">${previous ? link(file, previous.href, `← ${previous.date}`) : ''}${next ? link(file, next.href, `${next.date} →`) : ''}</nav>${renderDrill(day, time)}<aside class="v4-attention${attention.facts?.length ? ' with-facts' : ''}"><div><p class="v4-alert-label">${copy.attention}</p><h2>${esc(attention.title)}</h2><p>${esc(attention.summary)}</p>${link(file, target(attention.section), alertLink)}</div>${attention.facts?.length ? facts(attention.facts) : ''}</aside><ul class="v4-counts">${counts}</ul><div class="v4-panels v4-lead">${panel('cve', 4)}${panel('products', 6)}</div>${tiles ? `<section><h2>${copy.productGrid}</h2><ul class="v4-products">${tiles}</ul></section>` : ''}<div class="v4-panels">${panel('knowledge',4)}${panel('taiwan',4)}${panel('ai',4)}</div>${unconfirmed.length ? `<section><h2>${copy.unconfirmed}</h2><ul>${unconfirmed.map(row => `<li>${esc(row.name)} ${esc(row.reason)}</li>`).join('')}</ul></section>` : ''}</div>`;
}
