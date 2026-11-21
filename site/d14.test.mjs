import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {build, markdown} from './build.mjs';
import {renderOverview} from './display-v4.mjs';
import {wrapCveText} from './visual-kit.mjs';

test('Round 4: dynamic CVE labels use text nodes without interpreting search content',()=>{
 const helper=fs.readFileSync('site/assets/app.js','utf8').split("document.documentElement.classList.add('js');")[0];
 const context=vm.createContext({document:{createElement:()=>({}),createTextNode:text=>({text})}});
 vm.runInContext(helper,context);
 const element={children:[],append(node){this.children.push(node)}};
 context.setCveText(element,'<img src=x> CVE-2026-12345 text');
 assert.equal(element.children[0].text,'<img src=x> ');
 assert.equal(element.children[1].className,'cve-id');
 assert.equal(element.children[1].textContent,'CVE-2026-12345');
 assert.equal(element.children[2].text,' text');
});

test('Round 4: CVE text markup never rewrites attributes or raw head content',()=>{
 const source='<title>CVE-2026-12345</title><a href="/CVE-2026-12345">CVE-2026-12345</a>';
 assert.equal(wrapCveText(source),'<title>CVE-2026-12345</title><a href="/CVE-2026-12345"><span class="cve-id">CVE-2026-12345</span></a>');
});

test('Round 4: pre-CSS preference accepts only light/dark and handles blocked storage',()=>{
 const script=fs.readFileSync('site/assets/theme-init.js','utf8');
 for(const value of [null,'light','dark','unexpected']){
  const root={dataset:{}};
  vm.runInNewContext(script,{document:{documentElement:root},localStorage:{getItem:()=>value}});
  assert.equal(root.dataset.theme,['light','dark'].includes(value)?value:undefined);
 }
 const root={dataset:{}};
 vm.runInNewContext(script,{document:{documentElement:root},localStorage:{getItem(){throw Error('blocked')}}});
 assert.deepEqual(root.dataset,{});
});

test('Round 4: manual theme cycles auto/light/dark and removes preference for auto',()=>{
 const script=fs.readFileSync('site/assets/app.js','utf8').split('/* Local theme preference:')[1];
 const handlers={},values=new Map(),root={dataset:{}};
 const button={hidden:true,setAttribute(k,v){this[k]=v},addEventListener(k,v){handlers[k]=v}};
 vm.runInNewContext('/* Local theme preference:'+script,{document:{documentElement:root,querySelector:()=>button},window:{addEventListener(k,v){handlers[k]=v}},localStorage:{setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}});
 assert.equal(button.textContent,'自動');assert.equal(button.hidden,false);
 handlers.click();assert.equal(root.dataset.theme,'light');assert.equal(values.get('mb-theme'),'light');
 handlers.click();assert.equal(root.dataset.theme,'dark');assert.equal(values.get('mb-theme'),'dark');
 handlers.click();assert.equal(root.dataset.theme,undefined);assert.equal(values.has('mb-theme'),false);
 handlers.storage({key:'mb-theme',newValue:'dark'});assert.equal(root.dataset.theme,'dark');
 handlers.storage({key:'mb-theme',newValue:null});assert.equal(root.dataset.theme,undefined);
});

test('D14: eight page types, 26 source pages and real filter inputs retain their content', () => {
 fs.mkdirSync('.site-test',{recursive:true});
 const result=build({output:fs.mkdtempSync(path.resolve('.site-test/d14-'))});
 const types=new Set();
 for(const [file,html] of result.pages){
  const type=/data-page-type="([^"]+)"/.exec(html)?.[1];
  if(type) types.add(type);
  assert.doesNotMatch(html, /class="legacy"|<span class="field">/,file);
  assert.equal((html.match(/<script\b/g)||[]).length,2,file);
  assert.match(html, /<script src="[^"]*assets\/theme-init\.js"><\/script>/,file);
  assert.ok(html.indexOf('assets/theme-init.js') < html.indexOf('<link rel="stylesheet"'),file);
  assert.match(html,/default-src 'none'; style-src 'self'; script-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'/,file);
  assert.match(html,/assets\/visuals\/visual.css/,file);
  for (const anchor of html.match(/<a\b[^>]*>回到今日摘要<\/a>/g)||[]) assert.match(anchor,/class="btn back-to-overview"/,file);
  if(type==='legacy' && html.includes('同日演練分檔')) assert.match(html,/class="btn alternate-edition">同日演練分檔/,file);
 }
 assert.deepEqual([...types].sort(), ['about','archive','legacy','notfound','overview','product','reading','search']);
 const products=[...result.pages].filter(([file])=>/^products\/(?!index\.html)[^/]+\.html$/.test(file));
 assert.equal(products.length,26);
 for(const [file,html] of products){
  assert.match(html,/data-page-type="product"/,file);
  const productHeader=html.split('</h1>')[1].split('class="reading-layout"')[0];
  assert.doesNotMatch(productHeader,/<p><span class="st /,file);
  if(html.includes('各來源目前看到的最新一筆')){
   assert.match(html, /class="product-meta factbox"[^]*?<dt>原廠<\/dt>[^]*?<dt>最後檢查<\/dt>[^]*?<dt>當天狀態<\/dt>/,file);
   const meta=html.match(/<dl class="product-meta factbox">[^]*?<\/dl>/)[0];
   assert.equal((meta.match(/class="st st--/g)||[]).length,1,file);
   assert.match(html,/class="card d14-section"/,file);
   if (html.includes('<table')) {
    assert.match(html,/role="region"[^>]*tabindex="0"/,file);
    assert.match(html, /class="product-sources"><colgroup><col><col><col><col><col><col><\/colgroup>/,file);
   }
   else assert.match(html,/沒有來源/,file);
  }
 }
 const directory=result.pages.get('products/index.html');
 const fields=[...directory.matchAll(/<([a-z]+)\b[^>]*class="field"[^>]*>([^]*?)<\/\1>/g)];
 assert.equal(fields.length,1);
 assert.equal(fields[0][1],'label');
 assert.match(fields[0][2],/<input id="product-search" type="search"/);
 const overview=[...result.pages.values()].find(html=>html.includes('class="v4-counts"'));
 if(overview){
  const stats=overview.split('class="v4-counts"')[1].split('</ul>')[0];
  assert.equal((stats.match(/<a class="overview-stat"/g)||[]).length,5);
  assert.equal((stats.match(/<small>則<\/small>/g)||[]).length,5);
 }
 const search=result.pages.get('search/index.html');
 assert.match(search,/class="search-filterbar filterbar card"/);
 assert.match(search,/id="search-empty" class="empty-state" hidden/);
 assert.equal((search.match(/<label class="chip"><input type="checkbox"/g)||[]).length,5);
 assert.match(result.pages.get('404.html'),/class="card notfound-actions"/);
 assert.match(result.pages.get('about.html'),/class="prose card about-body"/);
});

test('D14 v3: every rendered code block has bounded scrolling and keyboard access',()=>{
 fs.mkdirSync('.site-test',{recursive:true});
 const result=build({output:fs.mkdtempSync(path.resolve('.site-test/d14-code-'))});
 const css=fs.readFileSync('site/assets/site.css','utf8');
 const prePages=[...result.pages].filter(([,html])=>/<pre\b/.test(html));
 assert.ok(prePages.length>0,'formal archive includes code blocks');
 for(const [file,html] of prePages){
  assert.match(css,/\.d14 \.prose pre\{[^}]*max-width:100%;[^}]*overflow-x:auto/,file);
  assert.match(css,/\.d14 \.prose pre code\{[^}]*white-space:pre/,file);
  for(const opening of html.match(/<pre\b[^>]*>/g)||[]) assert.match(opening,/tabindex="0"/,file);
 }
});

test('D14 review: scroll hints follow actual overflow, resize and mobile cards',()=>{
 let mobile=false;
 const hint={hidden:false,classList:{contains:name=>name==='scroll-hint'}};
 const table={scrollWidth:100,clientWidth:100,previousElementSibling:hint};
 const handlers={};
 const context=vm.createContext({
  document:{documentElement:{classList:{add(){}}},querySelector:()=>null,querySelectorAll:selector=>selector==='.table-scroll,.table-stack'?[table]:[]},
  matchMedia:query=>({matches:query==='(max-width:680px)'?mobile:false,addEventListener(){}}),
  window:{addEventListener:(name,fn)=>{handlers[name]=fn;}}
 });
 vm.runInContext(fs.readFileSync('site/assets/app.js','utf8'),context);
 assert.equal(hint.hidden,true);
 table.scrollWidth=300;handlers.resize();assert.equal(hint.hidden,false);
 table.clientWidth=300;handlers.resize();assert.equal(hint.hidden,true);
 table.clientWidth=100;mobile=true;handlers.resize();assert.equal(hint.hidden,true);
});

test('D14 review: overview count targets escape attribute quotes',()=>{
 const group={name:'段落',entries:[],titles:[],heading:'段落',countText:'0 則',more:'完整內容'};
 const groups=Object.fromEntries(['cve','products','knowledge','taiwan','ai','evil" data-test="x'].map(key=>[key,group]));
 const day={base:'daily/2026-11-21',meta:{date:'2026-11-21',weekday:'星期六',products_updated:[],products_unconfirmed:[]},display:{groups,attention:{section:'cve',title:'注意',summary:'摘要'}}};
 const html=renderOverview(day,[],'index.html',()=>'', '09:00');
 const counts=html.split('class="v4-counts"')[1].split('</ul>')[0];
 assert.match(counts,/href="evil&quot; data-test=&quot;x.html"/);
 assert.doesNotMatch(counts,/ data-test="/);
 console.log('D14 HREF PROBE: escaped=1; injected attributes=0');
});

test('D14: seven lead-in labels remain text, never form fields',()=>{
 const css=fs.readFileSync('site/assets/site.css','utf8');
 assert.match(css,/\.d14 \.lead-in\{[^}]*font-size:var\(--fs-16\);[^}]*font-weight:700/);
 const labels=['發生什麼事','受影響產品與版本','嚴重度','是否已有修補','攻擊現況','影響','來源'];
 const html=markdown(labels.map(label=>`- ${label}：內容`).join('\n')).html;
 for(const label of labels) assert.ok(html.includes(`<span class="lead-in">${label}：</span>`));
 assert.doesNotMatch(html,/class="field"/);
 const quoted=markdown('## 內容\n\n> ## 引用內標題\n>\n> 內容保留。\n\n## 第二節',{cards:true}).html;
 assert.equal((quoted.match(/class="card d14-section"/g)||[]).length,2);
 assert.match(quoted,/<blockquote>[^]*?引用內標題[^]*?<\/blockquote>/);
});
