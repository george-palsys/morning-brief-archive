import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { build, markdown, url, slugs } from './build.mjs';
import { parse, stringify } from 'yaml';

const root = path.resolve('.');
const work = path.join(root, '.site-test'); fs.mkdirSync(work, { recursive:true });
const newDir = prefix => fs.mkdtempSync(path.join(work, prefix));
function legacyFixture() {
 const dir=newDir('legacy-');
 for (const name of ['products.yaml','README.md','items.jsonl']) fs.copyFileSync(name,path.join(dir,name));
 fs.mkdirSync(path.join(dir,'daily'),{recursive:true});
 fs.copyFileSync('daily/2026-11-19.md',path.join(dir,'daily/2026-11-19.md'));
 return dir;
}
function importedFixture() {
 const dir=legacyFixture();fs.cpSync('daily/2026-11-19',path.join(dir,'daily/2026-11-19'),{recursive:true});return dir;
}
function fixture() {
 const dir = newDir('input-');
 for (const name of ['products.yaml','README.md','items.jsonl']) fs.copyFileSync(name,path.join(dir,name));
 // Preview snapshot deliberately pinned. Never copied to production content paths.
 const snapshot = JSON.parse(fs.readFileSync(new URL('./fixtures/preview.json',import.meta.url),'utf8'));
 assert.equal(Object.keys(snapshot.files).length,35,'preview snapshot has 8 daily files + 27 product files');
 for (const [name,content] of Object.entries(snapshot.files)) {
  const target = path.join(dir,name);
  fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,content);
 }
 fs.mkdirSync(path.join(dir,'daily'),{recursive:true});
 fs.copyFileSync('daily/2026-11-19.md',path.join(dir,'daily/2026-11-19.md'));
 return dir;
}
function run(input, opts = {}) { return build({input,output:newDir('output-'),allowRehearsal:true,...opts}); }
function validatePages(result) {
 for (const [file,html] of result.pages) {
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${file}: one h1`);
  assert.ok(!/<(?:script|style)\b[^>]*>\s*[^<\s]/.test(html),`${file}: no inline script/style`);
  assert.ok(!/\son\w+=|\sstyle=/.test(html),`${file}: no event/style attributes`);
  assert.ok(html.includes('Content-Security-Policy'));
  for (const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
   if (/^https?:/.test(href)) continue;
   if (file === '404.html' && href.startsWith('/')) {
    assert.ok(href.startsWith(result.basePath),`${file}: base path ${href}`);
    const target = href.slice(result.basePath.length);
    assert.ok(result.pages.has(target) || fs.existsSync(path.join(result.output,target)),`${file}: missing ${target}`);
    continue;
   }
   assert.ok(!href.startsWith('/'),`${file}: relative ${href}`);
   const [target,anchor] = href.split('#');
   const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file),target || path.posix.basename(file)));
   if (!target || target.endsWith('.html')) {
    assert.ok(result.pages.has(resolved),`${file}: missing ${resolved}`);
    if (anchor) assert.ok(result.pages.get(resolved).includes(`id="${anchor}"`),`${file}: missing ${resolved}#${anchor}`);
   } else assert.ok(fs.existsSync(path.join(result.output,resolved)),`${file}: missing asset ${resolved}`);
  }
 }
}
test('production: legacy banner, no-data state, 26 product pages and valid relative links', () => {
 const result = build({input:legacyFixture(),output:newDir('production-')});
 assert.equal(result.pages.size,33);
 assert.ok(result.pages.get('daily/2026-11-19.html').includes('舊版單檔格式'));
 assert.ok(result.pages.get('index.html').includes('第一份新版晨報'));
 assert.equal(slugs.filter(s => result.pages.has(`products/${s}.html`)).length,26);
 assert.ok(!result.pages.get('daily/2026-11-19.html').includes('aria-label="相鄰日期"'),'R6: single date has no empty navigation');
 assert.ok(!/製作與審查角色|Security Code Review|本次變更已通過審查/.test(result.pages.get('about.html')),'about role block removed');
 assert.ok(!result.pages.get('about.html').includes('每天半夜 2:00'),'G1: removed automation attribution sentence');
 assert.match(result.pages.get('search/index.html'),/<ol id="results" hidden><\/ol>/,'G2: initial empty results are hidden');
 validatePages(result);
});
test('G2: search results appear only for rendered matches and hide on empty/error states',async()=>{
 class Element {
  constructor(){this.children=[];this.hidden=true;this.value='';this.textContent='';}
  replaceChildren(){this.children=[];}
  append(...items){this.children.push(...items);}
  get childElementCount(){return this.children.length;}
  addEventListener(){}
 }
 function setup(fail=false){
  const elements=Object.fromEntries(['search-ui','query','search-status','results','range','all'].map(id=>[id,new Element()]));
  elements.range.value='all';
  elements['search-ui'].querySelectorAll=selector=>selector.includes(':checked')?[{value:'product'}]:[];
  const context=vm.createContext({document:{querySelector:selector=>elements[selector.slice(1)],createElement:()=>new Element()},fetch:async()=>{
   if(fail)throw Error('offline');
   return {ok:true,json:async()=>({months:[],products:[{date:'',category:'product',title:'Vault',summary:'Vault preview <img src=x onerror=alert(1)>',products:['Vault'],cve_ids:[],file:'products/vault.html'}]})};
  }});
  vm.runInContext(fs.readFileSync('site/assets/search.js','utf8'),context);
  return {elements,context};
 }
 const {elements,context}=setup();
 await vm.runInContext('update()',context);
 assert.equal(elements.results.hidden,true);
 elements.query.value='Vault';await vm.runInContext('update()',context);
 assert.equal(elements.results.hidden,false);assert.equal(elements.results.childElementCount,1);
 assert.equal(elements.results.children[0].children[2].textContent,'Vault preview <img src=x onerror=alert(1)>');
 assert.equal(elements.results.children[0].children[2].className,'search-excerpt');
 elements.query.value='no-match';await vm.runInContext('update()',context);
 assert.equal(elements.results.hidden,true);assert.equal(elements.results.childElementCount,0);
 assert.ok(elements['search-status'].textContent.includes('沒有符合'));
 elements.query.value='';await vm.runInContext('update()',context);assert.equal(elements.results.hidden,true);
 const offline=setup(true);await vm.runInContext('update()',offline.context);
 assert.equal(offline.elements.results.hidden,true);assert.equal(offline.elements.results.childElementCount,0);
 assert.equal(offline.elements['search-status'].textContent,'搜尋索引載入失敗，請重新整理');
});
test('G3: tabs become a Tab stop only while overflowing, including resize and observation',()=>{
 const tab={clientWidth:900,scrollWidth:900,tabIndex:-1};const details={open:false};
 const handlers={};let observed=0;let observeCallback;
 const media={matches:true,addEventListener:(name,fn)=>{handlers.media=fn;}};
 const context=vm.createContext({matchMedia:()=>media,document:{querySelectorAll:selector=>selector==='.tabs-scroll'?[tab]:[details]},window:{addEventListener:(name,fn)=>{handlers[name]=fn;}},ResizeObserver:class{constructor(fn){observeCallback=fn;}observe(){observed++;}}});
 vm.runInContext(fs.readFileSync('site/assets/toc.js','utf8'),context);
 assert.equal(details.open,true);assert.equal(tab.tabIndex,-1);assert.equal(observed,1);
 tab.clientWidth=320;tab.scrollWidth=740;handlers.resize();assert.equal(tab.tabIndex,0);
 tab.clientWidth=900;tab.scrollWidth=900;observeCallback();assert.equal(tab.tabIndex,-1);
 media.matches=false;handlers.media();assert.equal(details.open,false);assert.equal(tab.tabIndex,-1);
});
test('v3 preview: 26 products, all status counts, sections, search and relative links', () => {
 const dir = fixture(); const result = run(dir);
 assert.deepEqual(Object.fromEntries(['有更新','無更新','無法確認','無公開來源'].map(s => [s,result.rows.filter(r=>r.state===s).length])),{'有更新':3,'無更新':20,'無法確認':2,'無公開來源':1});
 assert.equal(result.warnings.length,0);
 assert.equal(result.pages.size,40);
 assert.ok(result.pages.get('daily/2026-11-19/knowledge.html').includes('<dl class="knowledge">'));
 assert.ok(!result.pages.get('daily/2026-11-19/maintenance.html').match(/<nav aria-label="本頁目錄">[\s\S]*?<\/nav>/)?.[0].includes('`'),'R5: no Markdown backticks in TOC');
 const attention = result.pages.get('index.html').match(/<aside class="attention">([\s\S]*?)<\/aside>/)?.[1];
 assert.equal((attention.match(/今天最需要注意的一件事/g)||[]).length,1,'R9: one attention label');
 assert.ok(attention.includes('daily/2026-11-19/cve.html'),'R9: original destination retained');
 validatePages(result);
 console.log('V3 PRODUCT EVIDENCE: '+slugs.map(s=>`products/${s}.html`).join(', '));
 console.log('V3 FIXTURE OUTPUT: '+result.output);
});
test('missing meta.yaml fails before writing output', () => {
 const dir = fixture(); fs.unlinkSync(path.join(dir,'daily/2026-11-19/meta.yaml'));
 assert.throws(()=>run(dir),/meta.yaml 缺檔/);
});
test('missing section fails before writing output', () => {
 const dir = fixture(); fs.unlinkSync(path.join(dir,'daily/2026-11-19/ai.md'));
 assert.throws(()=>run(dir),/ai.md 缺檔/);
});
test('missing required meta field fails', () => {
 const dir = fixture(); const name=path.join(dir,'daily/2026-11-19/meta.yaml');
 fs.writeFileSync(name,fs.readFileSync(name,'utf8').replace(/^collected_at:.*\n/m,''));
 assert.throws(()=>run(dir),/缺欄位 collected_at/);
});
test('malformed metadata types fail', () => {
 const dir=fixture(); const name=path.join(dir,'daily/2026-11-19/meta.yaml');
 fs.writeFileSync(name,fs.readFileSync(name,'utf8').replace('products_checked: 26','products_checked: 25'));
 assert.throws(()=>run(dir),/日期、版本或檢查數無效/);
});
test('meta/table mismatch warns in build and homepage', () => {
 const dir=fixture(); const name=path.join(dir,'daily/2026-11-19/meta.yaml');
 fs.writeFileSync(name,fs.readFileSync(name,'utf8').replace('  - Concert\n',''));
 const result=run(dir); assert.ok(result.warnings.some(s=>s.includes('products_updated')));
 assert.ok(result.pages.get('index.html').includes('資料不一致，請看原始檔'));
});
test('25-row table warns visibly but still emits all 26 products', () => {
 const dir=fixture(); const name=path.join(dir,'products/README.md');
 fs.writeFileSync(name,fs.readFileSync(name,'utf8').replace(/^\| 26 .*\n/m,''));
 const result=run(dir); assert.ok(result.warnings.some(s=>s.includes('25 列')));
 assert.ok(result.pages.get('products/index.html').includes('25 列'));
 assert.equal(slugs.filter(s=>result.pages.has(`products/${s}.html`)).length,26);
});
test('missing product page fails; rehearsal is blocked by default', () => {
 const dir=fixture(); assert.throws(()=>run(dir,{allowRehearsal:false}),/演練資料/);
 fs.unlinkSync(path.join(dir,'products/vault.md')); assert.throws(()=>run(dir),/vault.md 缺檔/);
});
test('raw HTML, script, event handlers, images and dangerous URLs stay inert', () => {
 const rendered=markdown('# Test\n\n<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n\n[x](javascript:alert(1))\n\n![tracker](https://tracker.example/pixel)\n\n<a href="x" onclick="alert(1)">click</a>').html;
 assert.ok(!/<script|<img|<a[^>]+onclick|href="javascript:/i.test(rendered));
 assert.ok(rendered.includes('&lt;script&gt;'));
 assert.equal(url('//evil.example'),'#'); assert.equal(url('data:text/html,a'),'#'); assert.equal(url('/root'),'#');
 assert.equal(url('../../products/README.md#main'),'../../products/index.html#main');
});
test('workflow has SHA pins, read-only build, isolated gated deployment, no privileged PR trigger',()=>{
 const text=fs.readFileSync('.github/workflows/pages.yml','utf8'); const flow=parse(text);
 assert.deepEqual(flow.permissions,{contents:'read'});
 assert.equal(flow.jobs.build.permissions,undefined);
 assert.deepEqual(flow.jobs.deploy.permissions,{pages:'write','id-token':'write'});
 assert.ok(!Object.keys(flow.on).includes('pull_request_target'));
 assert.ok(flow.jobs.deploy.if.includes("github.ref == 'refs/heads/main'"));
 assert.ok(flow.jobs.build.steps.some(step=>step.run === 'npm run build -- --base-path /morning-brief-archive/'));
 for (const job of Object.values(flow.jobs)) for (const step of job.steps) if (step.uses) assert.match(step.uses,/@[a-f0-9]{40}$/);
});
test('R1: 404 resources and navigation resolve at deeply missing request URLs', async () => {
 const { createServer } = await import('node:http');
 for (const basePath of ['/morning-brief-archive/','/custom-site/','/']) {
  const result = build({input:legacyFixture(),output:newDir('404-'),basePath});
  const html = result.pages.get('404.html');
  assert.ok(!/<base\b/.test(html),'404 needs no base element');
  assert.ok(html.includes("base-uri 'none'"));
  assert.ok(!html.includes('unsafe-inline'));
  const server = createServer((req,res)=>{
   const pathname = new URL(req.url,'http://localhost').pathname;
   const name = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : '';
   const target = path.join(result.output,name);
   if (name && fs.existsSync(target) && fs.statSync(target).isFile()) {
    res.writeHead(200,{'Content-Type':name.endsWith('.css') ? 'text/css' : 'text/html'}); res.end(fs.readFileSync(target));
   } else { res.writeHead(404,{'Content-Type':'text/html'}); res.end(html); }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
   const origin = `http://127.0.0.1:${server.address().port}`;
   for (const missing of ['nope.html','daily/2099/zz/nope.html','a/b/c/d/e/nope.html']) {
    const requestURL = new URL(basePath+missing,origin);
    const response = await fetch(requestURL); assert.equal(response.status,404);
    const body = await response.text();
    const css = body.match(/<link rel="stylesheet" href="([^"]+)"/)[1];
    assert.equal(new URL(css,requestURL).pathname,`${basePath}assets/site.css`);
    const stylesheet = await fetch(new URL(css,requestURL));
    assert.equal(stylesheet.status,200); assert.match(stylesheet.headers.get('content-type'),/^text\/css/);
    for (const [,href] of body.matchAll(/href="([^"]+)"/g)) {
     if (/^https?:|^#/.test(href)) continue;
     assert.equal((await fetch(new URL(href,requestURL))).status,200,`${requestURL}: ${href}`);
    }
   }
  } finally { await new Promise(resolve=>server.close(resolve)); }
 }
 assert.throws(()=>build({basePath:'//evil.example/'}),/base-path/);
 assert.throws(()=>build({basePath:'/site/../'}),/base-path/);
 assert.throws(()=>build({basePath:'/site/" onclick="'}),/base-path/);
});
test('R2: summary cards have no false scroll hint; wide tables retain it',()=>{
 const summary=markdown('# 摘要\n\n| 產品 | 更新 | 要不要動作 |\n|---|---|---|\n| Vault | 版本更新 | 盤點 |',{summary:true}).html;
 assert.ok(summary.includes('table-stack'));
 assert.ok(!summary.includes('可左右捲動'));
 assert.match(summary,/<div class="table-stack"><table/,'N4: non-scrolling summary wrapper has no extra border class or tabindex');
 assert.ok(!/class="table-stack"[^>]*(?:tabindex|role="region")/.test(summary));
 const wide=markdown('| 來源 | 日期 |\n|---|---|\n| 官方 | 未記錄 |').html;
 assert.match(wide,/<div class="table-scroll table-wide" role="region" aria-label="來源、日期" tabindex="0">/,'N4: wide table keeps named keyboard-scrollable region');
 assert.ok(markdown('| 來源 | 日期 |\n|---|---|\n| 官方 | 未記錄 |').html.includes('可左右捲動'));
 const css=fs.readFileSync('site/assets/site.css','utf8');
 assert.match(css,/\.table-stack tbody tr\s*\{[^}]*border:1px solid var\(--color-border\)[^}]*border-radius:var\(--radius-md\)[^}]*margin-block:var\(--space-3\)/);
});
test('R3/R5: CVE badge survives inline code; TOC labels strip Markdown',()=>{
 const result=markdown('# CVE\n\n### 【與我們的產品線相關】CVE-2026-1234 的 `Java` **修正**\n\n內容',{section:'cve'});
 assert.match(result.html,/<h2[^>]*><code>CVE-2026-1234<\/code> 的 <code>Java<\/code> <strong>修正<\/strong><\/h2><span class="type-tag">與我們的產品線相關<\/span>/);
 assert.equal(result.toc[0].title,'CVE-2026-1234 的 Java 修正');
 assert.ok(!markdown('### CVE-2026-1234 其他新聞',{section:'cve'}).html.includes('type-tag'));
});
test('R7: empty maintenance shows fallback without empty TOC and keeps meaningful prose',()=>{
 const dir=fixture(); const file=path.join(dir,'daily/2026-11-19/maintenance.md');
 fs.writeFileSync(file,'# 清單維護\n\n');
 const result=run(dir); const html=result.pages.get('daily/2026-11-19/maintenance.html');
 assert.equal((html.match(/今天沒有清單維護項目/g)||[]).length,1);
 assert.ok(!html.includes('class="page-toc"'));
 assert.ok(markdown('# 清單維護\n\n今天完成來源確認。',{section:'maintenance'}).html.includes('今天完成來源確認。'));
});
test('R8: breadcrumbs and footer links have minimum touch height',()=>{
 const css=fs.readFileSync('site/assets/site.css','utf8');
 assert.match(css,/\.breadcrumbs a,footer a\s*\{[^}]*display:inline-flex[^}]*align-items:center[^}]*min-height:var\(--tap-min\)/);
 assert.match(css,/\.breadcrumbs li\s*\{[^}]*display:flex[^}]*align-items:center[^}]*min-height:var\(--tap-min\)/,'N1: current breadcrumb uses same alignment and height');
});
test('published historical import: 26 stories, explicit collection time, same-date primary and legacy links',()=>{
 const dir=importedFixture();const result=build({input:dir,output:newDir('import-')});
 assert.equal(result.pages.size,40);assert.equal(result.warnings.length,1);
 assert.ok(!result.pages.get('index.html').includes('資料不一致，請看原始檔'));
 assert.ok(result.pages.get('index.html').includes('未建立產品總表'));
 assert.ok(!result.pages.get('products/index.html').includes('資料不一致，請看原始檔'));
 const list=result.pages.get('daily/index.html').match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
 assert.equal((list.match(/href="2026-11-19\/index.html"/g)||[]).length,1);
 assert.equal((list.match(/href="2026-11-19.html"/g)||[]).length,1);
 const current=result.pages.get('daily/2026-11-19/index.html'),legacy=result.pages.get('daily/2026-11-19.html');
 assert.ok(current.includes('歷史演練歸檔：2026-11-19 13:19'));
 assert.ok(current.includes('同日舊版單檔（02:25 蒐集）'));
 assert.ok(legacy.includes('同日演練分檔（13:19 蒐集）'));
 assert.ok(!current.includes('aria-label="相鄰日期"'));assert.ok(!legacy.includes('aria-label="相鄰日期"'));
 let total=0;
 for (const [part,count] of [['products',6],['knowledge',6],['cve',5],['taiwan',5],['ai',4]]) {
  const source=fs.readFileSync(`daily/2026-11-19/${part}.md`,'utf8');
  const headings=source.match(/^### /gm)||[];assert.equal(headings.length,count);total+=headings.length;
  assert.ok(result.pages.get(`daily/2026-11-19/${part}.html`).includes('13:19'));
 }
 assert.equal(total,26);
 assert.ok(result.pages.get('products/index.html').includes('未建立產品總表'));
 validatePages(result);
});
test('published rehearsal exception is exact; ordinary missing product snapshots still fail',()=>{
 const dir=importedFixture();const file=path.join(dir,'daily/2026-11-19/meta.yaml');const meta=parse(fs.readFileSync(file,'utf8'));
 meta.collected_at='2026-11-19T13:20:00+08:00';fs.writeFileSync(file,stringify(meta));
 assert.throws(()=>build({input:dir,output:newDir('unapproved-')}),/演練資料/);
 meta.type='morning-brief';fs.writeFileSync(file,stringify(meta));
 assert.throws(()=>build({input:dir,output:newDir('missing-products-')}),/缺 products/);
});
test('next-day timeline uses calendar days and matching section, never a same-date previous day',()=>{
 const dir=fixture();const next=path.join(dir,'daily/2026-11-20');fs.cpSync(path.join(dir,'daily/2026-11-19'),next,{recursive:true});
 const file=path.join(next,'meta.yaml');const meta=parse(fs.readFileSync(file,'utf8'));Object.assign(meta,{date:'2026-11-20',weekday:'星期五',type:'morning-brief',collected_at:'2026-11-20T02:00:00+08:00'});fs.writeFileSync(file,stringify(meta));
 const result=run(dir);
 const current=result.pages.get('daily/2026-11-20/products.html');
 assert.ok(current.includes('href="../2026-11-19/products.html">← 2026-11-19'));
 assert.ok(!result.pages.get('daily/2026-11-19/products.html').includes('>← 2026-11-19'));
 assert.ok(result.pages.get('daily/2026-11-19.html').includes('href="2026-11-20/index.html">2026-11-20 →'));
 validatePages(result);
});


test('reading layout: semantic shell, one archive notice, correct daily current item and safe links',()=>{
 const result=build({input:importedFixture(),output:newDir('reading-')});
 for(const [file,html] of result.pages) {
  assert.equal((html.match(/<main\b[^>]*id="main"/g)||[]).length,1,file);
  assert.equal((html.match(/<nav[^>]*aria-label="主要導覽"/g)||[]).length,1,file);
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,file);
  for(const [,attributes] of html.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g)) assert.match(attributes,/rel="[^"]*noopener[^"]*"/);
  const nav = html.match(/<nav class="top-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
  const current = [...nav.matchAll(/aria-current="page">([^<]+)/g)].map(match => match[1]);
  if (file.startsWith('daily/')) assert.deepEqual(current, ['每日'], file);
  if (file.startsWith('products/')) assert.deepEqual(current, ['產品'], file);
  if (file === 'index.html') assert.deepEqual(current, [], file);
 }
 const home = result.pages.get('index.html');
 assert.equal((home.match(/class="admonition archive /g)||[]).length, 1);
 assert.ok(home.match(/class="admonition archive [\s\S]*?<\/div><\/div>/)[0].includes('未建立產品總表'));
 assert.ok(!home.includes('<p class="notice">'));
 assert.ok(home.indexOf('class="home-entry"') < home.indexOf('class="attention"'));
 assert.match(home, /<aside class="attention"><details open><summary>[^<]+<span class="attention-preview">：NGINX[\s\S]*?<\/span><\/summary>/);

 const cve=result.pages.get('daily/2026-11-19/cve.html');
 const side = cve.match(/<aside class="toc-side">[\s\S]*?<\/aside>/)[0];
 for (const [, title, label] of side.matchAll(/<a href="#[^"]+" title="([^"]+)"><span>([^<]+)<\/span>/g)) assert.equal(title, label);
 assert.equal((side.match(/ title="/g)||[]).length, 5);
 assert.equal((cve.match(/class="admonition archive /g)||[]).length,1);
 assert.ok(!cve.includes('&gt; 歷史演練分檔'));
 assert.ok(!/<h2[^>]*>[^<]*【與我們的產品線相關】/.test(cve));
 const desktopTree=cve.match(/<nav class="side-nav site-tree"[^>]*>([\s\S]*?)<\/nav>/)[1];
 assert.ok(desktopTree.includes('最近 7 天')); assert.ok(desktopTree.includes('各分頁'));
 assert.ok(!desktopTree.includes('>關於</a>')); assert.ok(!desktopTree.includes('>搜尋</a>'));
 validatePages(result);
});

test('maintenance presentation retains source details without changing Markdown',()=>{
 const source='# 清單維護\n\n本次未蒐集。\n\n### 來源\n\n本次未蒐集。';
 const result=markdown(source,{section:'maintenance'});
 assert.match(result.html,/<p>本次未蒐集。<\/p><details class="maintenance-record">/);
 assert.match(result.html,/<summary>查看維護紀錄<\/summary>/);
 assert.ok(result.html.includes('來源')); assert.equal(result.toc.length,0);
 assert.equal(source,'# 清單維護\n\n本次未蒐集。\n\n### 來源\n\n本次未蒐集。');
});

test('reading CSS retains mobile typography, nested indent and desktop navigation', () => {
 const css = fs.readFileSync(new URL('./assets/site.css', import.meta.url), 'utf8');
 assert.match(css, /h2,\.news-card h2\s*\{[^}]*font-size:1\.5rem/);
 assert.match(css, /@media\(min-width:960px\)\s*\{[\s\S]*?\.tabs-scroll\s*\{\s*display:none;/);
 assert.match(css, /\.toc-side a span\s*\{[^}]*-webkit-line-clamp:2/);
 assert.match(css, /--indent:1\.25rem/);
 assert.match(css, /\.prose ul,\.prose ol\s*\{[^}]*padding-left:var\(--indent\)/);
 const nested = markdown('- 第一層\n  - 第二層\n    - 第三層').html;
 assert.match(nested, /<ul>[\s\S]*?<ul>[\s\S]*?<ul>[\s\S]*?第三層/);
});

test('home attention defaults by width while preserving manual toggles between breakpoints', () => {
 const attention = { open: true };
 const desktop = { matches: false, addEventListener(type, listener) { this.change = listener; } };
 const wide = { matches: false, addEventListener() {} };
 const listeners = {};
 const context = vm.createContext({
  matchMedia: query => query === '(min-width:640px)' ? desktop : wide,
  document: { querySelector: selector => selector === '.attention details' ? attention : null, querySelectorAll: () => [] },
  window: { addEventListener: (type, listener) => { listeners[type] = listener; } },
 });
 vm.runInContext(fs.readFileSync(new URL('./assets/toc.js', import.meta.url), 'utf8'), context);
 assert.equal(attention.open, false);
 attention.open = true;
 listeners.resize();
 assert.equal(attention.open, true);
 desktop.matches = true;
 attention.open = false;
 desktop.change();
 assert.equal(attention.open, true);
 desktop.matches = false;
 desktop.change();
 assert.equal(attention.open, false);
});

test('home attention preview never cuts through a version at the 48-character boundary', () => {
 const dir = importedFixture();
 const source = path.join(dir, 'daily/2026-11-19/README.md');
 const prefix = '甲'.repeat(44);
 const sentence = `${prefix} 1.9.5 到 1.31.8 還需要確認。`;
 const original = fs.readFileSync(source, 'utf8');
 fs.writeFileSync(source, original.replace(/(?<=\*\*今天最需要注意的一件事\*\*[：:])[^\r\n]+/, sentence));
 const result = build({input:dir,output:newDir('attention-preview-')});
 const html = result.pages.get('index.html');
 const attention = html.match(/<aside class="attention">([\s\S]*?)<\/aside>/)[1];
 assert.ok(attention.includes(`<span class="attention-preview">：${prefix}…</span>`));
 assert.ok(attention.includes(sentence));
});

test('daily metadata accepts numeric v3 and v4, rejects unsupported versions', () => {
 const dir = fixture();
 const file = path.join(dir, 'daily/2026-11-19/meta.yaml');
 const meta = parse(fs.readFileSync(file, 'utf8'));
 for (const version of [3, 4]) {
  fs.writeFileSync(file, stringify({ ...meta, spec_version: version }));
  assert.ok(run(dir).pages.has('daily/2026-11-19/index.html'));
 }
 for (const version of [2, 5, '4']) {
  fs.writeFileSync(file, stringify({ ...meta, spec_version: version }));
  assert.throws(() => run(dir), /meta.yaml 日期、版本或檢查數無效/);
 }
});

test('v4 fixture builds structured panels, source-specific scores and optional fallbacks', () => {
 const dir = fixture();
 const daily = path.join(dir, 'daily/2026-11-19');
 fs.cpSync('daily/2026-11-19', daily, { recursive: true });
 const source = path.join(daily, 'meta.yaml');
 const base = parse(fs.readFileSync(source, 'utf8'));
 const example = parse(fs.readFileSync('site/fixtures/meta.example.yaml', 'utf8'));
 fs.writeFileSync(source, stringify({ ...base, ...example }));
 const result = build({ input: dir, output: newDir('production-v4-') });
 const overview = result.pages.get('daily/2026-11-19/index.html');
 const cve = result.pages.get('daily/2026-11-19/cve.html');
 const ai = result.pages.get('daily/2026-11-19/ai.html');
 assert.ok(overview.includes(example.attention.title));
 assert.ok(overview.includes(example.attention.summary));
 assert.ok(overview.includes(example.display.knowledge[0].digest));
 assert.ok(overview.includes(example.display.ai_summary));
 assert.equal((overview.match(/class="v4-tile/g) || []).length, 26);
 assert.match(cve, /w-100[^]*?CVSS 3\.1（The Hacker News）[^]*?w-95[^]*?CVSS 4\.0（The Hacker News）/);
 assert.ok(cve.includes(example.display.cve[0].exploited_detail));
 assert.ok(cve.includes(example.display.cve[2].patch_detail));
 assert.ok(ai.includes(example.display.ai[2].caveat));
 assert.match(overview, /class="v4-drill"/);
 validatePages(result);
 console.log('V4 FIXTURE OUTPUT: ' + result.output);
 example.drill = false;
 delete example.attention.facts;
 delete example.display.ai_summary;
 fs.writeFileSync(source, stringify({ ...base, ...example }));
 const fallback = build({ input: dir, output: newDir('fallback-v4-') }).pages.get('daily/2026-11-19/index.html');
 assert.ok(!fallback.includes('class="v4-drill"'));
 assert.ok(!fallback.includes('with-facts'));
 assert.ok(fallback.includes('4 則'));
 example.display.cve.pop();
 fs.writeFileSync(source, stringify({ ...base, ...example }));
 assert.throws(() => build({ input: dir, output: newDir('invalid-v4-') }), /2026-11-19 cve：摘要則數/);
});
