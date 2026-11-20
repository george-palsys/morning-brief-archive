// Native details remains useful without JavaScript. Desktop expands the same DOM.
const wide = matchMedia('(min-width:1280px)');
function adaptTabs() {
 document.querySelectorAll('.tabs-scroll').forEach(el => { el.tabIndex = el.scrollWidth > el.clientWidth ? 0 : -1; });
}
function adapt() { document.querySelectorAll('.page-toc').forEach(el => { el.open = wide.matches; }); adaptTabs(); }
adapt();
wide.addEventListener('change', adapt);
window.addEventListener('resize', adaptTabs);
if (typeof ResizeObserver === 'function') {
 const observer = new ResizeObserver(adaptTabs);
 document.querySelectorAll('.tabs-scroll').forEach(el => observer.observe(el));
}

const menu = document.querySelector?.('.site-menu');
if (menu) {
 const summary = menu.querySelector('summary');
 document.addEventListener('click', event => {
  if (menu.open && !menu.contains(event.target)) {
   if (menu.contains(document.activeElement)) summary.focus();
   menu.open = false;
  }
 });
 document.addEventListener('keydown', event => {
  if (!menu.open || event.key !== 'Escape') return;
  event.preventDefault();
  menu.open = false;
  summary.focus();
 });
}

const attention = document.querySelector?.('.attention details');
if (attention) {
 const desktop = matchMedia('(min-width:640px)');
 const setAttentionDefault = () => { attention.open = desktop.matches; };
 setAttentionDefault();
 desktop.addEventListener('change', setAttentionDefault);
}

if (typeof IntersectionObserver === 'function') {
 const scores = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) if (entry.isIntersecting) {
   entry.target.classList.add('in');
   observer.unobserve(entry.target);
  }
 });
 document.querySelectorAll('.v4-fill').forEach(fill => scores.observe(fill));
}
const wave = document.querySelector?.('.v4-wave');
if (wave && typeof IntersectionObserver === 'function') {
 const articles = [...document.querySelectorAll('.v4-entry')];
 const peaks = [...wave.children];
 const active = new Set();
 let selected = -1;
 const readings = new IntersectionObserver(entries => {
  for (const entry of entries) {
   const index = articles.indexOf(entry.target);
   if (entry.isIntersecting) active.add(index);
   else active.delete(index);
  }
  if (!active.size) return;
  const next = Math.min(...active);
  if (next === selected) return;
  peaks[selected]?.classList.remove('current');
  peaks[next]?.classList.add('current');
  selected = next;
 }, { rootMargin: '-20% 0px -50% 0px' });
 articles.forEach(article => readings.observe(article));
}
