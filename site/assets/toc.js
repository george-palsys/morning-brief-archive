// Native details remains useful without JavaScript. Desktop expands the same DOM.
const wide = matchMedia('(min-width:840px)');
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
