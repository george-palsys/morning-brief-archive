import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
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
 validatePages(result);
});
test('v3 preview: 26 products, all status counts, sections, search and relative links', () => {
 const dir = fixture(); const result = run(dir);
 assert.deepEqual(Object.fromEntries(['有更新','無更新','無法確認','無公開來源'].map(s => [s,result.rows.filter(r=>r.state===s).length])),{'有更新':3,'無更新':20,'無法確認':2,'無公開來源':1});
 assert.equal(result.warnings.length,0);
 assert.equal(result.pages.size,40);
 assert.ok(result.pages.get('daily/2026-11-19/knowledge.html').includes('<dl class="knowledge">'));
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
 for (const job of Object.values(flow.jobs)) for (const step of job.steps) if (step.uses) assert.match(step.uses,/@[a-f0-9]{40}$/);
});
