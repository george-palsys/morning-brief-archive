const ui = document.querySelector('#search-ui');
const query = document.querySelector('#query');
const status = document.querySelector('#search-status');
const results = document.querySelector('#results');
const normalize = value => String(value).normalize('NFKC').toLowerCase();
let manifest, entries = [], pending;
const loaded = new Set();
ui.hidden = false;
async function json(file) {
 const response = await fetch(file, { credentials:'omit' });
 if (!response.ok) throw Error('index');
 return response.json();
}
async function load(all = false) {
 if (pending) await pending;
 pending = (async () => {
  if (!manifest) { manifest = await json('index.json'); entries.push(...manifest.products); }
  const months = all ? manifest.months : manifest.months.slice(0,3);
  for (const month of months) if (!loaded.has(month)) { entries.push(...await json(month)); loaded.add(month); }
 })();
 try { await pending; } finally { pending = undefined; }
}
function render() {
 results.replaceChildren();
 results.hidden = true;
 const terms = normalize(query.value).trim().split(/\s+/).filter(Boolean);
 if (!terms.length) { status.textContent = '輸入關鍵字搜尋，預設載入最近 3 個月。'; return; }
 const categories = [...ui.querySelectorAll('[name=category]:checked')].map(el => el.value);
 const recent = document.querySelector('#range').value === '30';
 const cutoff = new Date(Date.now() - 30 * 86400000).toLocaleDateString('en-CA', { timeZone:'Asia/Taipei' });
 const matches = entries.filter(item => categories.includes(item.category) && (!recent || item.date && item.date >= cutoff) && terms.every(term => normalize([item.title,item.summary,...item.products,...item.cve_ids].join(' ')).includes(term)));
 const exact = item => terms.some(term => [...item.products,...item.cve_ids].some(v => normalize(v) === term)) ? 1 : 0;
 matches.sort((a,b) => exact(b)-exact(a) || b.date.localeCompare(a.date));
 for (const item of matches.slice(0,50)) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  // Only builder-produced relative page paths can become result destinations.
  if (!/^(?:daily|products)\/[a-zA-Z0-9/_-]+\.html(?:#item-\d+)?$/.test(item.file)) continue;
  a.href = '../' + item.file; a.textContent = item.title;
  const meta = document.createElement('p');
  meta.textContent = `${item.date} · ${{cve:'CVE','taiwan-it':'台灣 IT',ai:'AI',product:'產品',knowledge:'新知識'}[item.category]} · ${item.products.join('、')}`;
  li.append(a,meta); results.append(li);
 }
 results.hidden = results.childElementCount === 0;
 status.textContent = matches.length ? `找到 ${matches.length} 筆${matches.length > 50 ? `，還有 ${matches.length-50} 筆，請縮小條件` : ''}` : `沒有符合『${query.value}』的結果；請換關鍵字或取消類別篩選。`;
}
async function update(all = false) {
 try { await load(all); render(); } catch { results.replaceChildren(); results.hidden = true; status.textContent = '搜尋索引載入失敗，請重新整理'; }
}
query.addEventListener('focus', () => update(), { once:true });
query.addEventListener('input', () => update());
ui.querySelectorAll('input[type=checkbox],select').forEach(el => el.addEventListener('change', () => update()));
document.querySelector('#all').addEventListener('click', () => update(true));
