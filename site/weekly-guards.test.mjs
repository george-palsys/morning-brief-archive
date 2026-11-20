import test from 'node:test';
import assert from 'node:assert/strict';
import {markdown} from './build.mjs';
import {renderOverview} from './display-v4.mjs';
const entry = {short:'測試',keyword:'TEST'};
for (const [name, source, display, expected] of [
 ['before', '## 本週回顧\n\n回顧\n\n### 條目\n\n內容', [entry], /必須放在所有條目之後/],
 ['between', '### 條目\n\n內容\n\n## 本週回顧\n\n回顧\n\n### 第二則\n\n內容', [entry,entry], /之後不得再有條目標題/],
 ['across-h2', '### 條目\n\n內容\n\n## 本週回顧\n\n回顧\n\n## 其他\n\n### 第二則\n\n內容', [entry,entry], /之後不得再有條目標題/],
 ['missing', '# 新知識\n\n一般文字', [entry], /項目數與輸出條目數不一致/],
]) test('weekly guard: ' + name, () => assert.throws(() => markdown(source,{section:'knowledge',display}), expected));

test('overview: all ten product updates remain reachable and dates leave section tabs', () => {
 const group = (name, entries) => ({name,entries,titles:entries.map(e=>e.short),heading:name,countText:entries.length+' 則',more:'完整內容'});
 const groups = Object.fromEntries(['cve','products','knowledge','taiwan','ai'].map(key => [key,group(key,key==='products'?Array.from({length:10},()=>entry):[])]));
 const day={base:'daily/2026-11-20',meta:{date:'2026-11-20',weekday:'星期五',products_updated:[],products_unconfirmed:[]},display:{groups,attention:{section:'products',title:'注意',summary:'摘要'}}};
 const link=(_file,href,label)=>`<a href="${href}">${label}</a>`;
 const html=renderOverview(day,[],'index.html',link,'09:00',{date:'2026-11-19',href:'previous.html'},{date:'2026-11-21',href:'next.html'});
 const products=html.split('class="v4-panel v4-panel-products"')[1].split('</section>')[0];
 assert.equal((products.match(/<h3>/g)||[]).length,10);
 assert.match(products, />0 項產品、10 則更新</);
 assert.match(products, /<summary>再顯示 4 則<\/summary>/);
 const jump=html.split('aria-label="段落導覽"')[1].split('</nav>')[0];
 assert.doesNotMatch(jump,/previous.html|next.html|26 項產品現況/);
 assert.match(html,/aria-label="相鄰日期"[^]*?previous.html[^]*?next.html/);
});
