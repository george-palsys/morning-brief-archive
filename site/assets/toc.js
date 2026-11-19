// Native details remains useful without JavaScript. Desktop expands the same DOM.
const wide = matchMedia('(min-width:840px)');
function adapt() { document.querySelectorAll('.page-toc').forEach(el => { el.open = wide.matches; }); }
adapt();
wide.addEventListener('change', adapt);
