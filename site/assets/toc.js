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
if (wave) {
 const articles = [...document.querySelectorAll('.v4-entry')];
 const headings = articles.map(article => article.querySelector('.item-title') ?? article);
 const peaks = [...wave.children];
 const header = document.querySelector('.header-inner');
 const miniWave = wave.cloneNode(true);
 miniWave.classList.add('v4-wave-mini');
 header.append(miniWave);
 const miniPeaks = [...miniWave.children];
 let selected = -1;
 let frame = 0;
 let anchorIndex = -1;
 let anchorReachedEnd = false;

 function readAnchor() {
  const fragment = window.location.hash.slice(1);
  anchorIndex = fragment ? headings.findIndex(heading => heading.id === fragment) : -1;
  anchorReachedEnd = false;
 }

 function updateWave() {
  frame = 0;
  const viewportHeight = document.documentElement.clientHeight;
  const headerBottom = header.getBoundingClientRect().bottom;
  miniWave.classList.toggle('visible', wave.getBoundingClientRect().bottom <= headerBottom);
  const atEnd = window.scrollY > 0 &&
   Math.ceil(window.scrollY + viewportHeight) >= document.documentElement.scrollHeight - 1;
  const readingLine = Math.max(headerBottom, viewportHeight * 0.30);
  if (!atEnd && anchorReachedEnd) {
   anchorIndex = -1;
   anchorReachedEnd = false;
  }
  let next = atEnd ? articles.length - 1 : 0;
  if (atEnd && anchorIndex >= 0) {
   const anchor = headings[anchorIndex];
   const scrollMargin = parseFloat(getComputedStyle(anchor).scrollMarginTop) || 0;
   if (anchor.getBoundingClientRect().top >= scrollMargin - 1) {
    next = anchorIndex;
    anchorReachedEnd = true;
   }
  }
  if (!atEnd) {
   for (const [index, heading] of headings.entries()) {
    if (heading.getBoundingClientRect().top > readingLine + 1) break;
    next = index;
   }
  }
  if (next === selected) return;
  peaks[selected]?.classList.remove('current');
  miniPeaks[selected]?.classList.remove('current');
  peaks[next]?.classList.add('current');
  miniPeaks[next]?.classList.add('current');
  selected = next;
 }

 function scheduleWave() {
  if (!frame) frame = requestAnimationFrame(updateWave);
 }
 window.addEventListener('scroll', scheduleWave, { passive: true });
 window.addEventListener('resize', scheduleWave);
 window.addEventListener('pageshow', scheduleWave);
 window.addEventListener('hashchange', () => {
  readAnchor();
  scheduleWave();
 });
 document.addEventListener('click', event => {
  const link = event.target.closest?.('a[href^="#item-"]');
  if (!event.defaultPrevented && link && link.hash === window.location.hash) {
   readAnchor();
   scheduleWave();
  }
 });
 readAnchor();
 updateWave();
}
