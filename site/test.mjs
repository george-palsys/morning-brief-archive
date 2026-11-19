import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { build, markdown, url, slugs } from './build.mjs';
import { parse } from 'yaml';

const root = path.resolve('.');
const work = path.join(root, '.site-test'); fs.mkdirSync(work, { recursive:true });
const newDir = prefix => fs.mkdtempSync(path.join(work, prefix));
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
 const result = build({input:root,output:newDir('production-')});
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
   return {ok:true,json:async()=>({months:[],products:[{date:'',category:'product',title:'Vault',summary:'',products:['Vault'],cve_ids:[],file:'products/vault.html'}]})};
  }});
  vm.runInContext(fs.readFileSync('site/assets/search.js','utf8'),context);
  return {elements,context};
 }
 const {elements,context}=setup();
 await vm.runInContext('update()',context);
 assert.equal(elements.results.hidden,true);
 elements.query.value='Vault';await vm.runInContext('update()',context);
 assert.equal(elements.results.hidden,false);assert.equal(elements.results.childElementCount,1);
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
  const result = build({input:root,output:newDir('404-'),basePath});
  const html = result.pages.get('404.html');
  assert.ok(!/<base\b|<script\b/.test(html),'404 needs neither base element nor script');
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
 assert.match(result.html,/<h2[^>]*>【與我們的產品線相關】<code>CVE-2026-1234<\/code> 的 <code>Java<\/code> <strong>修正<\/strong><\/h2><span class="type-tag">與我們的產品線相關<\/span>/);
 assert.equal(result.toc[0].title,'【與我們的產品線相關】CVE-2026-1234 的 Java 修正');
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
