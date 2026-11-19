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
