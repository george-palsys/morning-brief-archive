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
 pairs.push(['color-link-visited','color-bg',4.5],['color-link-visited','color-surface',4.5],['color-border-strong','color-bg',3],['color-focus','color-bg',3],['color-skip-text','color-skip-bg',4.5]);
 for (const status of ['updated','none','unknown','nosource']) pairs.push([`status-${status}-fg`,`status-${status}-bg`,4.5],[`status-${status}-bd`,'color-bg',3]);
 for (const [fg,bg,min] of pairs) {
  assert.ok(colors[fg] && colors[bg], `${mode}: missing ${fg}/${bg}`);
  const a = luminance(colors[fg]), b = luminance(colors[bg]); const ratio = (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  assert.ok(ratio >= min, `${mode}: ${fg}/${bg} ${ratio.toFixed(2)} < ${min}`); count++;
 }
}
console.log(`CONTRAST OK: ${count} CSS color pairs (light + dark)`);
