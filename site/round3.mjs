const menuButton = `<summary class="menu__btn" aria-label="開啟選單"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary>`;
const arrow = '<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';
const searchIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>`;
const icons = [`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/></svg>`,`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>`,`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="18" height="7" rx="1"/></svg>`,`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 1-9 9"/><path d="M12 7a5 5 0 1 1-5 5"/><path d="M12 12 19 5"/></svg>`,`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v12h14V9M10 13h4"/></svg>`,`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h18v4H3zM5 9v10h14V9M10 13h4"/></svg>`,`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>`,`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>`];
const repo = 'https://github.com/george-palsys/morning-brief-archive';
export const original = source => source ? `${repo}/blob/main/${source.split('/').map(encodeURIComponent).join('/')}` : repo;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const categories = { cve:'CVE', product:'產品動態', knowledge:'新知識', ai:'AI', 'taiwan-it':'台灣 IT' };
const status = [
  ['updated','有更新'], ['unchanged','無更新'], ['unknown','無法確認'], ['nosource','無公開來源'],
];
const dot = key => `<span class="dot dot--${key}" aria-hidden="true"></span>`;
export function shell({file, area, day, today, time, url, source, content}) {
  const cvePage = today && !today.legacy ? `${today.base}/cve.html` : today?.href || 'daily/index.html';
  const home = 'index.html';
  const nav = [[home,'今日晨報'],[cvePage,'重大 CVE'],['products/index.html','產品追蹤'],
    [home+'#news','當日重點'],[home+'#recent','重點產品'],['daily/index.html','歷史歸檔'],
    ['search/index.html','搜尋'],['about.html','關於']];
  const current = file === home ? 0 : file === cvePage ? 1 : area === 'products' ? 2 :
    area === 'daily' ? 5 : area === 'search' ? 6 : area === 'about' ? 7 : -1;
  const links = (max, withIcons = false) => nav.slice(0,max).map(([target,label],i) =>
    `<a href="${escape(url(file,target))}"${i === current ? ` aria-current="${file === target ? 'page' : 'true'}"` : ''}>${withIcons ? icons[i] : ''}${label}</a>`).join('');
  const date = today?.date;
  const short = date ? date.slice(5).split('-').map(Number).join('/') : '';
  const edition = date ? `<div class="side-date"><span class="micro">TODAY'S EDITION</span><strong>${escape(short)} ${escape(today.meta.weekday?.replace('星期','週') || '')}</strong>${time ? `<span>資料截點 ${escape(time)}</span><span>台北時間</span>` : ''}</div>` : '';
  const foot = `<footer class="site-footer"><span>© ${escape(date?.slice(0,4) || '2026')} Palsys · Morning Brief</span><span>資料來源：<a href="${repo}">morning-brief-archive</a></span></footer>`;
  const pageFoot = source ? `<div class="page-foot"><a href="${original(source)}">GitHub 原始檔</a> · <a href="#main">回到頁首</a></div>` : '';
  return `<a class="skip-link" href="#main">跳到主要內容</a><div class="topline" aria-hidden="true"></div>
<header class="site-header"><div class="header-inner"><a class="brand" href="${escape(url(file,home))}" aria-label="Morning Brief 首頁"><span class="brand__emblem" aria-hidden="true">M</span><span class="brand__text"><strong>Morning Brief</strong><small>TECH INTELLIGENCE / PALSYS</small></span></a><nav class="header-nav" aria-label="主選單">${links(4)}</nav><div class="header-tool">${date ? `<span class="issue-pill">${escape(date.replaceAll('-','.'))} 晨報</span>` : ''}<details class="menu">${menuButton}<nav class="menu__panel" aria-label="手機選單">${links(8)}</nav></details></div></div></header>
<div class="page-grid"><aside class="sidebar" aria-label="側邊欄"><div class="side-fixed"><span class="side-heading">EXPLORE / 探索</span><nav class="side-nav" aria-label="側邊導覽">${links(8,true)}</nav><div class="side-rule"></div>${edition}</div></aside><main class="content" id="main" tabindex="-1"><div class="content-inner">${content}${pageFoot}${foot}</div></main></div>`;
}
function counts(rows) {
  return status.map(([key,label]) => [key,label,rows.filter(row=>row.state===label).length]);
}
function checked(rows) {
  const dates = rows.map(row=>row.checked).filter(value=>/^\d{4}-\d{2}-\d{2}$/.test(value));
  return dates.sort().at(-1);
}
export function directory({rows, catalog, link, badge, warnings, empty}) {
  const stats = counts(rows);
  const when = checked(rows);
  const controls = [['all','全部',catalog.length],...stats].map(([key,label,total]) =>
    `<button class="chip" type="button" data-filter="${key}" aria-pressed="${key === 'all'}">${label} <span class="chip__n">${total}</span></button>`).join('');
  const products = catalog.map(product => {
    const row = rows.find(row=>row.id===product.id);
    const slug = product.slug;
    const key = status.find(([,label])=>label===row?.state)?.[0] || 'unknown';
    const name = product.name;
    const words = name.match(/[A-Za-z0-9]+/g) || [name];
    const initials = (words.length === 1 ? Array.from(words[0]).slice(0,2).join('') : words.slice(0,2).map(word=>word[0]).join('')).toUpperCase();
    const version = row?.version?.trim();
    const missing = '—<span class="sr-only">（來源未提供）</span>';
    return `<tr id="${escape(slug)}" data-status="${key}"><th scope="row"><div class="dir-product"><div class="dir-logo" aria-hidden="true">${escape(initials)}</div><div>${link(`products/${slug}.html`,name,'dir-name')}<small>${escape(product.vendor)}</small></div></div></th><td class="dir-status-cell">${badge(row?.state || '無法確認')}</td><td class="dir-version">${version && version !== '—' ? escape(version) : row && key !== 'nosource' ? '見產品頁' : missing}</td><td class="dir-date dir-date-cell">${/^\d{4}-\d{2}-\d{2}$/.test(row?.checked) ? escape(row.checked) : '—<span class="sr-only">（未提供）</span>'}</td></tr>`;
  }).join('');
  return `<nav class="crumbs" aria-label="所在位置">${link('index.html','首頁')}<span aria-hidden="true">/</span><span aria-current="page">產品追蹤</span></nav><div class="kicker">PRODUCT WATCH / 產品監測</div><h1 class="section-title">${catalog.length} 項產品追蹤</h1>${warnings}${rows.length ? `<p class="subhead">${when ? escape(when)+' 檢查' : '檢查日期未提供'}：${stats.map(([,label,total])=>label+' '+total).join('、')}。清單與 products/README.md 的 ${catalog.length} 列一一對應，點產品名稱開啟原始產品頁。</p><div class="overview-stats"><div class="overview-stat is-total"><strong>${catalog.length}</strong><span class="lab">項追蹤產品</span></div>${stats.map(([key,label,total])=>`<div class="overview-stat"><strong>${total}</strong><span class="lab">${dot(key)}${label}</span></div>`).join('')}</div>` : empty}
<div class="filterbar js-only" id="filterbar" role="group" aria-label="產品篩選"><div class="filters">${controls}</div><label class="field">${searchIcon}<span class="sr-only">搜尋產品或原廠</span><input id="product-search" type="search" placeholder="搜尋產品或原廠…" autocomplete="off"></label></div><p class="results" id="results-count" aria-live="polite">目前顯示 ${catalog.length} / ${catalog.length} 項</p><p class="empty-state" id="empty-state" hidden>沒有符合條件的產品。請清除搜尋字或改選「全部」。</p>
<div class="directory-wrap"><table class="directory"><caption class="sr-only">${catalog.length} 項追蹤產品的當天狀態、目前最新版本與最後檢查日</caption><thead><tr><th scope="col">產品／原廠</th><th scope="col" class="col-st">狀態</th><th scope="col" class="col-ver">目前最新版本</th><th scope="col" class="col-date">最後檢查</th></tr></thead><tbody>${products}</tbody></table></div>`;
}
export function homepage({day, time, rows, catalog, stories, link, badge, fallback}) {
  const date = day?.date;
  const stamp = date && new Date(date+'T00:00:00Z');
  const en = stamp ? new Intl.DateTimeFormat('en', { weekday:'long', month:'long', timeZone:'UTC' }).formatToParts(stamp) : [];
  const dayName = key => en.find(part=>part.type === key)?.value || '';
  const dateBlock = date ? `<div class="edition-info"><span class="en">${dayName('weekday').toUpperCase()} / ${dayName('month').toUpperCase()}</span><strong>${Number(date.slice(8))}<span>.</span> ${date.slice(0,4)}</strong>${time ? `<small>資料截點 ${escape(time)} · 台北時間</small>` : ''}</div>` : '';
  const intro = `<div class="kicker">DAILY BRIEFING / 每日情報</div><div class="title-row"><div><h1 class="page-title">今天的技術脈動<span class="faded">，<br>一眼掌握。</span></h1><p class="lead">從資安風險、原廠產品更新到 AI 產業趨勢。為需要快速掌握變化的技術團隊，整理每天真正重要的訊號。</p></div>${dateBlock}</div>`;
  const a = day?.display?.attention;
  const cv = day?.display?.groups.cve;
  const cvIndex = cv?.entries.findIndex((entry,i)=>entry.keyword && a?.title.toLowerCase().includes(entry.keyword.toLowerCase()) || cv.titles[i].split(/[：:]/u)[0] && a?.title.startsWith(cv.titles[i].split(/[：:]/u)[0])) ?? -1;
  const focused = cv?.entries[cvIndex];
  const cveFile = day && !day.legacy ? `${day.base}/cve.html` : day?.href || 'daily/index.html';
  const target = cvIndex >= 0 ? `${cveFile}#item-${cvIndex+1}` : cveFile;
  const details = a?.facts || [];
  const score = details.find(item=>item.label.startsWith('CVSS'));
  const poc = details.find(item=>item.label==='PoC');
  const patch = details.find(item=>item.label==='修補');
  const severity = a?.title.match(/\b(?:Critical|High|Medium|Low|Important)\b/iu)?.[0];
  const ids = focused?.cve_ids || [];
  const count = Number(a?.title.match(/(\d+)\s*個漏洞/u)?.[1]);
  const cveLabel = ids.length === 1 && count > 1 ? `${ids[0]} 等 ${count} 個` : ids.join('、');
  const emphasis = severity ? escape(a.title).replace(severity,`<em>${escape(severity)}</em>`) : escape(a?.title);
  const feature = a ? `<article class="feature on-dark"><div class="feature__top"><div class="feature__label"><i aria-hidden="true"></i>今天最需要注意的一件事</div><span class="feature__serial">晨報 ${escape(date)}</span></div><div class="feature__main"><div class="feature__badges">${severity ? `<span class="tag tag--mint">${escape(severity)}${score?.source ? ' · '+escape(score.source) : ''}</span>` : ''}${ids.length ? `<span class="tag tag--dark tag--mono">${escape(cveLabel)}</span>` : ''}${poc ? `<span class="tag tag--dark">${escape(poc.value)}</span>` : ''}</div><h2>${emphasis}</h2><p class="feature__lead">${escape(a.summary)}</p></div><dl class="facts">${[[score,'CVSS 3.1','—'],[poc,'PoC','未提供'],[patch,'修補','尚未列出']].map(([fact,label,blank])=>`<div><dt>${escape(fact?.label || label)}</dt><dd>${escape(fact?.value || blank)}${fact?.source ? `<small>${escape(fact.source)}</small>` : !fact && label==='CVSS 3.1' ? '<small>未提供</small>' : ''}</dd></div>`).join('')}</dl><div class="feature__bottom"><small>來源：${date ? escape(date)+' 晨報摘要' : '未提供'}</small>${link(target,'閱讀完整內容','btn btn--light',arrow)}</div></article>` : '';
  const stats = counts(rows);
  const when = checked(rows);
  const watch = rows.length ? `<aside class="metric-panel" aria-label="產品檢查狀態"><div class="metric-header"><span>PRODUCT WATCH / 產品監測</span><span class="when">${when ? escape(when)+' 檢查' : '檢查日期未提供'}</span></div><div class="metric-main"><strong>${catalog.length}</strong><span>項追蹤產品</span></div><p class="metric-sub">每日追蹤原廠公告、版本與安全資訊，快速識別需要關注的變更。</p><ul class="meter" aria-hidden="true">${stats.filter(([, ,n])=>n).map(([key,,n])=>`<li class="m-${key} m-count-${Math.min(n,26)}"></li>`).join('')}</ul><ul class="legend">${stats.map(([key,label,total])=>`<li><span class="l">${dot(key)}${label}</span><strong>${total}</strong></li>`).join('')}</ul>${rows.length !== catalog.length ? '<p>統計與清單筆數不符</p>' : ''}${link('products/index.html',`查看全部 ${catalog.length} 項產品狀態`,'metric-link',arrow)}</aside>` : '';
  const today = stories.filter(item=>item.date===date);
  const cveStories = today.filter(item=>item.category==='cve');
  const confirmed = new Set(cv?.entries.filter(entry=>entry.exploited==='confirmed').flatMap(entry=>entry.cve_ids));
  const leadCve = cveStories.find(item=>item.cve_ids?.some(id=>confirmed.has(id))) || cveStories[0];
  const products = today.filter(item=>item.category==='product');
  const signals = [...(leadCve ? [leadCve] : []), ...products, ...cveStories.filter(item=>item !== leadCve)].slice(0,4);
  const radar = ['knowledge','ai','taiwan-it','knowledge'].flatMap((kind,i)=>today.filter(item=>item.category===kind).slice(i===3?1:0,i===3?2:1));
  const storyLink = item => `<a href="${escape(original(item.source))}">${escape(item.title)}</a>`;
  const spotlight = rows.filter(row=>focused?.cve_ids.some(id=>today.some(item=>item.cve_ids?.includes(id)&&item.products?.includes(row.name)))).slice(0,4);
  const news = signals.length || radar.length ? `<section id="news" aria-labelledby="news-h"><div class="section-head"><div><span class="section-kicker">THE SIGNAL / 當日重點</span><h2 id="news-h">不該錯過的消息</h2></div>${link(target,'閱讀 '+(focused?.short || '完整')+' 內容 →','sub-link')}</div><div class="headline-area"><div class="news-list">${signals.map((item,i)=>`<article class="news-row"><span class="news-index" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><div class="news-meta"><span class="tx">${categories[item.category]}</span><span aria-hidden="true">·</span><span>${escape(item.cve_ids?.[0] || item.products?.[0])}</span>${item.category==='cve' && item.cve_ids?.some(id=>confirmed.has(id)) ? '<span class="tag tag--confirmed">已確認遭實際利用</span>' : ''}</div><h3 class="news-title">${storyLink(item)}</h3><p class="news-excerpt">${escape(String(item.impact || item.summary || '').slice(0,160))}</p></div></article>`).join('')}</div>${radar.length ? `<aside class="radars" aria-label="技術雷達"><div class="radars-header"><strong>TECH RADAR / 技術雷達</strong><span>${radar.length} 則</span></div>${radar.map(item=>`<div class="radar-item"><div class="topic">${categories[item.category]}</div><h3>${storyLink(item)}</h3><p>${escape(item.source_published || item.date)}</p></div>`).join('')}<a class="radar-footer" href="${original(day.base+'/README.md')}">完整晨報摘要（GitHub） ↗</a></aside>` : ''}</div></section>` : '<span id="news"></span>';
  const recent = spotlight.length ? `<section id="recent" class="product-band" aria-labelledby="recent-h"><div class="band-head"><div><h2 id="recent-h">重點產品動態</h2><p>從 ${catalog.length} 項追蹤產品中，與今天最需要注意的一件事直接相關的 ${spotlight.length} 項。</p></div>${link('products/index.html','完整產品清單','sub-link',arrow)}</div><div class="product-cards">${spotlight.map(row=>`<a class="product-card" href="products/index.html#${escape(row.slug)}"><div class="top"><span>${escape(row.vendor)}</span>${badge(row.state)}</div><strong>${escape(row.name)}</strong><small>${escape(row.version)}</small></a>`).join('')}</div></section>` : '<span id="recent"></span>';
  return intro + (feature || watch ? `<section class="hero-grid" aria-label="今日焦點">${feature || fallback}${watch}</section>` : fallback) + news + recent;
}
