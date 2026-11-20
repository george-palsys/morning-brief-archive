import fs from 'node:fs';
import assert from 'node:assert/strict';
const css = fs.readFileSync(new URL('./assets/site.css', import.meta.url), 'utf8');
const [light, dark] = css.split('@media(prefers-color-scheme:dark)');
function luminance(hex) {
 const c = hex.slice(1).match(/../g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
 return c[0]*.2126+c[1]*.7152+c[2]*.0722;
}
let count = 0;
for (const [mode, source] of [['light',light],['dark',dark]]) {
 const colors = Object.fromEntries([...source.matchAll(/--([a-z-]+):\s*(#[a-f0-9]{6})/g)].map(m => [m[1],m[2]]));
 const pairs = [];
 for (const fg of ['text','text-muted','link']) for (const bg of ['bg','surface','surface-hover']) pairs.push([`color-${fg}`,`color-${bg}`,4.5]);
 pairs.push(['color-link-visited','color-bg',4.5],['color-link-visited','color-surface',4.5],['color-focus','color-bg',3],['color-skip-text','color-skip-bg',4.5]);
 for (const bg of ['bg','surface','surface-hover']) pairs.push(['color-border-strong',`color-${bg}`,3]);
 for (const status of ['updated','none','unknown','nosource']) pairs.push([`status-${status}-fg`,`status-${status}-bg`,4.5],[`status-${status}-bd`,'color-bg',3]);
 for (const [fg, bg] of [['ink','bg'], ['ink','alt'], ['ink','panel'], ['muted','bg'], ['muted','alt'],
     ['on-red','red'], ['on-sun','sun'], ['impact-fg','impact-bg'], ['impact-label','impact-bg'],
     ['alert-fg','alert-bg'], ['alert-label','alert-bg']]) pairs.push([`v-${fg}`,`v-${bg}`,4.5]);
 for (const [fg,bg,min] of pairs) {
  assert.ok(colors[fg] && colors[bg], `${mode}: missing ${fg}/${bg}`);
  const a = luminance(colors[fg]), b = luminance(colors[bg]); const ratio = (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  assert.ok(ratio >= min, `${mode}: ${fg}/${bg} ${ratio.toFixed(2)} < ${min}`); count++;
  if (fg === 'color-border-strong') console.log(`CONTRAST ${mode}: ${fg} ${colors[fg]} / ${bg} ${colors[bg]} = ${ratio.toFixed(2)}:1 (minimum ${min}:1)`);
 }
}
console.log(`CONTRAST OK: ${count} CSS color pairs (light + dark)`);

const designCss = fs.readFileSync(new URL('./assets/design-c.css', import.meta.url), 'utf8');
const [designLight, designDark] = designCss.split('@media (prefers-color-scheme:dark)');
let designCount = 0;
for (const [mode, source] of [['light', designLight], ['dark', designDark]]) {
 const colors = Object.fromEntries([...source.matchAll(/--design-([a-z-]+):\s*(#[a-f0-9]{6})/g)].map(match => [match[1], match[2]]));
 const pairs = [
  ['ink', 'bg', 4.5], ['muted', 'bg', 4.5], ['brand', 'bg', 4.5], ['muted', 'sub', 4.5],
  ['brand', 'sub', 4.5], ['brand-ink', 'brand-soft', 4.5], ['on-brand', 'brand', 4.5],
  ['on-confirmed', 'confirmed', 4.5], ['hero-ink', 'hero', 4.5],
  ['hero-muted', 'hero', 4.5], ['hero-muted', 'hero-fact-bg', 4.5], ['hero-accent', 'hero', 4.5], ['strong', 'bg', 3],
 ];
 for (const [fg, bg, min] of pairs) {
  assert.ok(colors[fg] && colors[bg], `${mode}: missing design ${fg}/${bg}`);
  const a = luminance(colors[fg]), b = luminance(colors[bg]);
  assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= min, `${mode}: design ${fg}/${bg} < ${min}`);
  designCount++;
 }
}
console.log(`CONTRAST OK: ${designCount} Proposal C color pairs (light + dark)`);
