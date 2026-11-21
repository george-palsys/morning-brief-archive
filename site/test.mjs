import { pathToFileURL } from 'node:url';
import { fullSentences, readVisualAsset } from './visual-kit.mjs';
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
function copyFixtureSearchIndex(dir) {
 const source = fs.readFileSync('items.jsonl', 'utf8');
 const selected = source.split(/\r?\n/).filter(line => line && JSON.parse(line).date === '2026-11-19');
 fs.writeFileSync(path.join(dir, 'items.jsonl'), selected.join('\n') + '\n');
}
function legacyFixture() {
 const dir=newDir('legacy-');
 for (const name of ['products.yaml','README.md']) fs.copyFileSync(name,path.join(dir,name));
 copyFixtureSearchIndex(dir);
 fs.mkdirSync(path.join(dir,'daily'),{recursive:true});
 fs.copyFileSync('daily/2026-11-19.md',path.join(dir,'daily/2026-11-19.md'));
 return dir;
}
function importedFixture() {
 const dir=legacyFixture();fs.cpSync('daily/2026-11-19',path.join(dir,'daily/2026-11-19'),{recursive:true});return dir;
}
function fixture() {
 const dir = newDir('input-');
 for (const name of ['products.yaml','README.md']) fs.copyFileSync(name,path.join(dir,name));
 copyFixtureSearchIndex(dir);
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
    const [target, anchor] = href.slice(result.basePath.length).split("#");
    assert.ok(result.pages.has(target) || fs.existsSync(path.join(result.output,target)),`${file}: missing ${target}`);
    if (anchor) assert.ok(result.pages.get(target)?.includes(`id="${anchor}"`), `${file}: missing ${target}#${anchor}`);
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
 assert.ok(result.pages.get('products/index.html').includes('第一份新版晨報'));
 assert.equal(slugs.filter(s => result.pages.has(`products/${s}.html`)).length,26);
 assert.ok(!result.pages.get('daily/2026-11-19.html').includes('aria-label="相鄰日期"'),'R6: single date has no empty navigation');
 assert.ok(!/製作與審查角色|Security Code Review|本次變更已通過審查/.test(result.pages.get('about.html')),'about role block removed');
 assert.ok(!result.pages.get('about.html').includes('每天半夜 2:00'),'G1: removed automation attribution sentence');
 assert.match(result.pages.get('search/index.html'),/<ol id="results" hidden><\/ol>/,'G2: initial empty results are hidden');
 validatePages(result);
});
test('G2: search results appear only for rendered matches and hide on empty/error states',async()=>{
 class Element {
  constructor(){this.listeners={};this.children=[];this.hidden=true;this.value='';this.textContent='';}
  replaceChildren(){this.children=[];}
  append(...items){this.children.push(...items);}
  get childElementCount(){return this.children.length;}
  addEventListener(name, handler){this.listeners[name]=handler;}
 }
 function setup(fail=false){
  const elements=Object.fromEntries(['search-ui','query','search-status','results','range','all'].map(id=>[id,new Element()]));
  elements.range.value='all';
  elements['search-ui'].querySelectorAll=selector=>selector.includes(':checked')?[{value:'product'}]:[];
  const context=vm.createContext({document:{documentElement:{classList:{add(){}}},querySelector:selector=>elements[selector.slice(1)],querySelectorAll:()=>[],createElement:()=>new Element()},matchMedia:()=>({matches:false,addEventListener(){}}),window:{addEventListener(){}},fetch:async()=>{
   if(fail)throw Error('offline');
   return {ok:true,json:async()=>({months:[],products:[{date:'',category:'product',title:'Vault',summary:'Vault preview <img src=x onerror=alert(1)>',products:['Vault'],cve_ids:[],file:'products/vault.html'}]})};
  }});
  vm.runInContext(fs.readFileSync('site/assets/app.js','utf8'),context);
  return {elements,context};
 }
 const {elements,context}=setup();
 await elements.query.listeners.input();
 assert.equal(elements.results.hidden,true);
 elements.query.value='Vault';await elements.query.listeners.input();
 assert.equal(elements.results.hidden,false);assert.equal(elements.results.childElementCount,1);
 assert.equal(elements.results.children[0].children[2].textContent,'Vault preview <img src=x onerror=alert(1)>');
 assert.equal(elements.results.children[0].children[2].className,'search-excerpt');
 elements.query.value='no-match';await elements.query.listeners.input();
 assert.equal(elements.results.hidden,true);assert.equal(elements.results.childElementCount,0);
 assert.ok(elements['search-status'].textContent.includes('沒有符合'));
 elements.query.value='';await elements.query.listeners.input();assert.equal(elements.results.hidden,true);
 const offline=setup(true);await offline.elements.query.listeners.input();
 assert.equal(offline.elements.results.hidden,true);assert.equal(offline.elements.results.childElementCount,0);
 assert.equal(offline.elements['search-status'].textContent,'搜尋索引載入失敗，請重新整理');
});
test('G3: tabs become a Tab stop only while overflowing, including resize and observation',()=>{
 const tab={clientWidth:900,scrollWidth:900,tabIndex:-1};const details={open:false};
 const handlers={};let observed=0;let observeCallback;
 const media={matches:true,addEventListener:(name,fn)=>{handlers.media=fn;}};
 const context=vm.createContext({matchMedia:()=>media,document:{documentElement:{classList:{add(){}}},querySelector:()=>null,querySelectorAll:selector=>selector==='.tabs-scroll'?[tab]:[details]},window:{addEventListener:(name,fn)=>{handlers[name]=fn;}},ResizeObserver:class{constructor(fn){observeCallback=fn;}observe(){observed++;}}});
 vm.runInContext(fs.readFileSync('site/assets/app.js','utf8'),context);
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
test('home and search reject unlisted story paths and keep legacy original links', () => {
 const dir = legacyFixture();
 const indexFile = path.join(dir, 'items.jsonl');
 const original = JSON.parse(fs.readFileSync(indexFile,'utf8').trim().split('\n')[0]);
 fs.writeFileSync(indexFile, [
  { ...original, id:'valid', category:'cve', title:'Verified legacy story', file:'2026-11-19.md' },
  { ...original, id:'invalid', category:'cve', title:'Unlisted story', file:'daily/../SPEC.md' },
  { ...original, id:`oversize-${'x'.repeat(400)}`, category:'cve', title:'Oversize story', file:`daily/${'a'.repeat(400)}.md` },
 ].map(item=>JSON.stringify(item)).join('\n'));
 const result = run(dir);
 const home = result.pages.get('index.html');
 assert.match(home, /https:\/\/github\.com\/george-palsys\/morning-brief-archive\/blob\/main\/daily\/2026-11-19\.md/);
 assert.ok(home.includes('Verified legacy story'));
 assert.ok(!home.includes('Unlisted story'));
 assert.ok(result.warnings.some(warning=>warning.includes('invalid')));
 const oversize = result.warnings.find(warning=>warning.includes('oversize'));
 assert.equal(oversize?.split(' 指向不存在的頁面 ')[0], '搜尋項目 oversize-'+'x'.repeat(190)+'…');
 assert.equal(oversize?.split('指向不存在的頁面 ')[1]?.split('，')[0].length, 200);
 const index = JSON.parse(fs.readFileSync(path.join(result.output,'search/index-2026-11.json'),'utf8'));
 assert.deepEqual(index.map(item=>item.id), ['valid']);
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
    const css = body.match(/<link rel="stylesheet" href="([^"]+\/site\.css)"/)[1];
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
 assert.match(css, /@media \(max-width:680px\)[\s\S]*?tr\{[^}]*border:1px solid var\(--line\)[^}]*border-radius:var\(--r-md\)/);
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
 assert.match(css, /\.breadcrumbs a\{[^}]*min-height:28px/);
 assert.match(css, /\.site-footer a[^\n]*padding-block:12px/);
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
  assert.equal((html.match(/<nav[^>]*aria-label="主選單"/g)||[]).length,1,file);
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,file);
  for(const [,attributes] of html.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g)) assert.match(attributes,/rel="[^"]*noopener[^"]*"/);
  const nav = html.match(/<nav class="side-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
  const current = [...nav.matchAll(/aria-current="(?:page|true)">[\s\S]*?<\/svg>([^<]+)/g)].map(match => match[1]);
  if (file.startsWith('daily/')) assert.equal(current.length, 1, file);
  if (file.startsWith('products/')) assert.deepEqual(current, ['產品追蹤'], file);
  if (file === 'index.html') assert.deepEqual(current, ['今日晨報'], file);
 }
 const home = result.pages.get('index.html');
 assert.equal((home.match(/class="admonition archive /g)||[]).length, 1);
 assert.ok(home.match(/class="admonition archive [\s\S]*?<\/div><\/div>/)[0].includes('未建立產品總表'));
 assert.ok(!home.includes('<p class="notice">'));
 assert.ok(home.indexOf('class="home-entry"') < home.indexOf('class="attention"'));
 assert.match(home, /<aside class="attention"><details open><summary>[^<]+<span class="attention-preview">：NGINX[\s\S]*?<\/span><\/summary>/);

 const cve=result.pages.get('daily/2026-11-19/cve.html');
 const toc = cve.match(/<details class="page-toc">[\s\S]*?<\/details>/)[0];
 for (const [, title, label] of toc.matchAll(/<a href="#[^"]+" title="([^"]+)"><span>([^<]+)<\/span>/g)) assert.equal(title, label);
 assert.equal((toc.match(/ title="/g)||[]).length, 5);
 assert.equal((cve.match(/class="admonition archive /g)||[]).length,1);
 assert.ok(!cve.includes('&gt; 歷史演練分檔'));
 assert.ok(!/<h2[^>]*>[^<]*【與我們的產品線相關】/.test(cve));
 const desktopTree=cve.match(/<nav class="side-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
 assert.equal((desktopTree.match(/<a /g)||[]).length, 8);
 assert.ok(cve.includes("TODAY'S EDITION"));
 assert.match(cve, /href="https:\/\/github\.com\/george-palsys\/morning-brief-archive\/blob\/main\/daily\/2026-11-19\/cve\.md"[^>]*>GitHub 原始檔/);
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

test('search controls and source badges can shrink without clipping', () => {
 const css = fs.readFileSync(new URL('./assets/site.css', import.meta.url), 'utf8');
 assert.match(css, /#search-ui\{[^}]*grid-template-columns:minmax\(0,1fr\);min-width:0/);
 assert.match(css, /#search-ui fieldset\{[^}]*min-width:0;flex-wrap:wrap/);
 assert.match(css, /#results\{[^}]*grid-template-columns:minmax\(0,1fr\);overflow-wrap:anywhere/);
 assert.match(css, /td:has\(> \.source-warning\)\{min-width:7em\}/);
 assert.match(css, /\.source-warning\{display:inline-block;box-sizing:border-box;max-width:100%;[^}]*word-break:keep-all;overflow-wrap:anywhere/);
});

test('reading CSS retains mobile typography, nested indent and desktop navigation', () => {
 const css = fs.readFileSync(new URL('./assets/site.css', import.meta.url), 'utf8');
 assert.match(css, /h2\{font-size:var\(--fs-24\)/);
 assert.match(css, /@media \(max-width:920px\)[\s\S]*?\.sidebar\{display:none\}/);
 assert.match(css, /\.page-toc a\{display:block/);
 assert.match(css, /\.prose ul,\.prose ol\{padding-left:1\.3em/);
 assert.match(css, /\.tabs-scroll\{overflow-x:auto/);
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
  document: { documentElement:{classList:{add(){}}}, querySelector: selector => selector === '.attention details' ? attention : null, querySelectorAll: () => [] },
  window: { addEventListener: (type, listener) => { listeners[type] = listener; } },
 });
 vm.runInContext(fs.readFileSync(new URL('./assets/app.js', import.meta.url), 'utf8'), context);
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

test('score bars are static in either motion preference', () => {
 const script = fs.readFileSync(new URL('./assets/app.js', import.meta.url), 'utf8');
 for (const reduceMotion of [true, false]) {
  let observers = 0;
  vm.runInNewContext(script, {
   matchMedia: query => ({ matches: query === '(prefers-reduced-motion: reduce)' && reduceMotion, addEventListener() {} }),
   document: { documentElement:{classList:{add(){}}}, querySelectorAll: () => [], querySelector: () => null },
   window: { addEventListener() {} },
   IntersectionObserver: class { constructor() { observers++; } },
  });
  assert.equal(observers, 0);
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
 assert.ok(overview.includes(`<p>${base.products_updated.length} 項產品、${example.display.products.length} 則更新</p>`));
 assert.ok(ai.includes('>回到今日摘要</a>'));
 assert.ok(ai.includes('<span class="lead-in">影響：</span>'));
 assert.ok(ai.includes('Google 官方部落格（2026-11-17）<span class="sr-only">（在新分頁開啟）</span></a>（blog.google）'));
 assert.match(cve, /<span aria-hidden="true">●<\/span> 已遭利用/);
 assert.match(cve, /<span aria-hidden="true">✓<\/span> 有修補/);
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

function v4CaseFixture() {
 const dir = fixture();
 const daily = path.join(dir, 'daily/2026-11-19');
 fs.cpSync('daily/2026-11-19', daily, { recursive: true });
 const metaFile = path.join(daily, 'meta.yaml');
 const meta = { ...parse(fs.readFileSync(metaFile, 'utf8')),
   ...parse(fs.readFileSync('site/fixtures/meta.example.yaml', 'utf8')) };
 const edit = (name, change) => {
  const file = path.join(daily, name);
  fs.writeFileSync(file, change(fs.readFileSync(file, 'utf8')));
 };
 return { dir, meta, edit, run: () => {
  fs.writeFileSync(metaFile, stringify(meta));
  const result = build({ input:dir, output:newDir('v4-edge-') });
  validatePages(result);
  return name => result.pages.get('daily/2026-11-19/' + name + '.html');
 } };
}

test('v4 accepts the product inventory summary and preserves Friday supplements', () => {
 const f = v4CaseFixture();
 f.edit('README.md', source => source.replace('6 則，3 項產品。', '26 項：'));
 f.edit('knowledge.md', source => source + '\n\n## 本週回顧\n\n回顧內容。\n\n## 本週動手題\n\n驗證內容。\n');
 const page = f.run();
 const knowledge = page('knowledge');
 assert.equal((knowledge.match(/class="news-card v4-entry"/g) || []).length, f.meta.display.knowledge.length + 2);
 assert.equal((knowledge.match(/class="item-title"/g) || []).length, f.meta.display.knowledge.length);
 assert.match(knowledge, /<\/article>\s*<article class="news-card v4-entry"><h2[^>]*>本週回顧<\/h2>[^]*?<article class="news-card v4-entry"><h2[^>]*>本週動手題<\/h2>/);
 assert.equal((knowledge.match(/class="weekly-title"/g) || []).length, 2);
 assert.doesNotMatch(knowledge, /class="v4-keyword"/);
 assert.match(page('index'), /href="products.html"><strong>6 <small>則<\/small><\/strong><span class="lab">產品動態<\/span><\/a>/);
 f.edit('README.md', source => source.replace(/^\| \[CI\/CD\/Argo CD\][^\n]*\n/m, ''));
 assert.throws(() => f.run(), /products：摘要則數、段落標題與 display 則數不一致/);
});

for (const colon of [':', '：']) {
 test('product state totals remain consistent with inventory ' + colon, () => {
  const f = v4CaseFixture();
  f.edit('README.md', s => s.replace(/6 則(?=[^\n]*products\.md)/, `26 項${colon}有更新 10、無更新 14、無法確認 1、無公開來源 1。`));
  f.run();
  f.edit('README.md', s => s.replace('無更新 14', '無更新 13'));
  assert.throws(() => f.run(), /產品狀態項數加總與總項數不一致/);
 });
}

test('v4 E1: empty AI section has zero count and no wave', () => {
 const f = v4CaseFixture();
 f.meta.display.ai = [];
 delete f.meta.display.ai_summary;
 f.edit('ai.md', source => source.split('\n')[0] + '\n');
 f.edit('README.md', source => source.replace('4 則。→ [完整內容](ai.md)', '0 則。→ [完整內容](ai.md)'));
 const page = f.run();
 assert.match(page('index'), /0 則/);
 assert.match(page('ai'), /今天沒有/);
 assert.doesNotMatch(page('ai'), /class="v4-wave"|class="news-card v4-entry"/);
});
test('v4 E2: twelve CVEs have twelve articles and twelve reachable overview entries', () => {
 const f = v4CaseFixture();
 for (let i = 6; i <= 12; i++) {
  f.meta.display.cve.push({short:'測試 ' + i,keyword:'TEST',cve_ids:[],cvss:[],exploited:'unknown',patch:'unknown',related:false});
  f.edit('cve.md', source => source + '\n\n### 測試 ' + i + '\n\n- 發生什麼事：測試內容。\n');
 }
 f.edit('README.md', source => source.replace('5 則。→ [完整內容](cve.md)', '12 則。→ [完整內容](cve.md)'));
 const page = f.run();
 assert.equal((page('cve').match(/class="news-card v4-entry"/g) || []).length, 12);
 assert.match(page('cve'), /href="#item-12"/);
 const panel = page('index').split('class="v4-panel v4-panel-cve"')[1].split('</section>')[0];
 assert.equal((panel.match(/<h3>/g) || []).length, 12);
 assert.equal((panel.match(/12 則/g) || []).length, 1);
 assert.ok(panel.includes('<summary>再顯示 10 則</summary>'));
 const visible = panel.split('<details')[0];
 const folded = panel.split('<details')[1];
 const visibleCount = (visible.match(/<h3>/g) || []).length;
 const foldedCount = (folded.match(/<h3>/g) || []).length;
 assert.equal(visibleCount, 2);
 assert.equal(foldedCount, 10);
 assert.equal(visibleCount + foldedCount, f.meta.display.cve.length);
 assert.match(panel, /class="v4-score v4-score-empty"><span class="v4-track" aria-hidden="true"><\/span>/);
});
for (const [id,state] of [['E3','有更新'],['E4','無更新']]) {
 test('v4 ' + id + ': all 26 products are ' + state, () => {
  const f = v4CaseFixture();
  const file = path.join(f.dir,'products/README.md');
  const names=[];
  const lines=fs.readFileSync(file,'utf8').split('\n').map(line => {
   if (!/^\|\s*\d+\s*\|/.test(line)) return line;
   const cols=line.split('|');
   names.push(cols[2].trim().split('](')[0].slice(1));
   cols[4]=' ' + state + ' ';
   return cols.join('|');
  });
  fs.writeFileSync(file,lines.join('\n'));
  f.meta.products_updated = state === '有更新' ? names : [];
  f.meta.products_unconfirmed = [];
  const page=f.run()('index');
  assert.equal((page.match(/class="v4-tile(?: updated)?"/g)||[]).length,26);
  assert.equal((page.match(/class="v4-tile updated"/g)||[]).length,state==='有更新'?26:0);
 });
}
test('v4 E5: 80-character article title is preserved', () => {
 const f=v4CaseFixture();
 const title='長'.repeat(80);
 f.edit('knowledge.md', source => source.replace(/^### .+$/m,'### '+title));
 const page=f.run();
 assert.ok(page('knowledge').includes(title));
 assert.ok(page('index').includes(title) === !f.meta.display.knowledge[0].digest);
});
test('v4 E6: three CVSS scores retain all three labels and widths', () => {
 const f=v4CaseFixture();
 f.meta.display.cve[0].cvss=[
  {score:9.2,version:'4.0',source:'Fixture A'},
  {score:7.5,version:'3.1',source:'Fixture B'},
  {score:3.1,version:null,source:'Fixture C'},
 ];
 const cve=f.run()('cve');
 assert.match(cve,/w-90[^]*?CVSS 4\.0（Fixture A）[^]*?w-75[^]*?CVSS 3\.1（Fixture B）[^]*?w-30[^]*?CVSS（Fixture C）/);
});
test('v4 E7: omitted attention facts leave no empty column', () => {
 const f=v4CaseFixture();
 delete f.meta.attention.facts;
 assert.doesNotMatch(f.run()('index'), /v4-attention with-facts/);
});
test('v4 E8: v3 without display retains the legacy text view', () => {
 const f=v4CaseFixture();
 f.meta.spec_version=3;
 delete f.meta.display;
 delete f.meta.attention;
 assert.doesNotMatch(f.run()('index'), /v4-overview|v4-score/);
});

test('visual preview publishes only allowlisted binary assets and adds preview paths', () => {
 const input = legacyFixture();
 const standard = run(input);
 const preview = run(input, {visualPreview:true,basePath:'/morning-brief-preview/'});
 assert.doesNotMatch(standard.pages.get('index.html'), /noindex|assets\/visuals/);
 assert.match(preview.pages.get('index.html'), /<meta name="robots" content="noindex, nofollow">/);
 assert.match(preview.pages.get('404.html'), /href="\/morning-brief-preview\/assets\/site.css"/);
 assert.match(preview.pages.get('products/index.html'), /\.\.\/assets\/visuals\/hero-infrastructure-mobile\.webp/);
 const directory = preview.pages.get('products/index.html');
 const logos = html => [...html.matchAll(/<div class="dir-logo" aria-hidden="true">([^<]*)<\/div>/g)].map(match => match[1]);
 const baseline = logos(standard.pages.get('products/index.html'));
 assert.equal(baseline.length, 26);
 assert.deepEqual(logos(directory), baseline);
 assert.doesNotMatch(directory, /icon-document\.svg/);
 assert.equal(fs.existsSync(path.join(standard.output, 'assets/visuals')), false);
 const asset = 'assets/visuals/hero-cybersecurity.webp';
 assert.deepEqual(fs.readFileSync(path.join(preview.output, asset)), fs.readFileSync(new URL(asset, import.meta.url)));
 assert.match(fs.readFileSync(path.join(preview.output, 'assets/app.js'), 'utf8'), /Visual preview motion/);
 assert.doesNotMatch(fs.readFileSync(path.join(standard.output, 'assets/app.js'), 'utf8'), /Visual preview motion/);
});

test('preview excerpts keep full sentences without changing source text', () => {
 assert.equal(fullSentences('第一句。第二句！第三句？', 8), '第一句。第二句！');
 const long = '甲'.repeat(200) + '。';
 assert.equal(fullSentences(long + '不截斷。'), long);
 assert.equal(fullSentences('無句號的原文'), '無句號的原文');
});

test('visual asset copying rejects linked directories and non-files', () => {
 const dir = newDir('visual-assets-');
 const root = pathToFileURL(dir + path.sep);
 const assets = path.join(dir, 'assets');
 const external = newDir('external-assets-');
 const visuals = path.join(assets, 'visuals');
 fs.mkdirSync(assets);
 fs.writeFileSync(path.join(external, 'icon-ai.svg'), 'external');
 fs.symlinkSync(external, visuals, process.platform === 'win32' ? 'junction' : 'dir');
 assert.throws(() => readVisualAsset(root, 'icon-ai.svg'), /directory must not be a symbolic link/);
 fs.unlinkSync(visuals);
 fs.mkdirSync(visuals);
 fs.mkdirSync(path.join(visuals, 'icon-ai.svg'));
 assert.throws(() => readVisualAsset(root, 'icon-ai.svg'), /must be a regular file/);
});
