import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('./assets/design-tokens.css', import.meta.url), 'utf8');
const parse = text => Object.fromEntries([...text.matchAll(/--([a-z0-9-]+):\s*(#[a-f\d]{6})\b/gi)].map(([, name, hex]) => [name, hex]));
const light = parse(source.match(/:root\{([^}]+)\}/)[1]);
const dark = parse(source.match(/:root\[data-theme=dark\]\{([^}]+)\}/)[1]);
const system = parse(source.match(/@media \(prefers-color-scheme:dark\)\{\s*:root:not\(\[data-theme=light\]\)\{([^}]+)\}/)[1]);
assert.deepEqual(system, dark, 'OS and manual dark tokens must stay identical');
function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
const pairs = [
  ['selected-ink', 'selected-bg', 4.5],
  // A solid selected control may share its border and fill. Check its boundary
  // against both surrounding surfaces and its fill against unselected controls.
  ['selected-border', 'paper', 3], ['selected-border', 'canvas', 3],
  ['selected-border', 'wash', 3],
  ['selected-bg', 'paper', 3], ['selected-bg', 'canvas', 3],
  ['ink', 'source-warning-bg', 4.5],
  ['ink-2', 'factbox-bg', 4.5], ['muted', 'factbox-bg', 4.5],
  ['ink-2', 'directory-head-bg', 4.5], ['muted', 'directory-head-bg', 4.5],
  ...['paper', 'canvas', 'wash'].flatMap(bg => ['ink', 'ink-2', 'muted', 'accent'].map(fg => [fg, bg, 4.5])),
  ['subtle', 'paper', 4.5], ['subtle', 'canvas', 4.5], ['faded', 'canvas', 4.5],
  ['accent', 'accent-soft', 4.5], ['line-strong', 'paper', 3], ['line-strong', 'canvas', 3],
  ['on-dark', 'ink-deep', 4.5], ['on-dark-2', 'ink-deep', 4.5], ['on-dark-3', 'ink-deep', 4.5],
  ['mint', 'ink-deep', 4.5], ['dark-line', 'ink-deep', 3], ['on-mint', 'mint', 4.5],
  ...['updated', 'unchanged', 'unknown', 'nosource'].flatMap(key => [
    ['st-' + key, 'st-' + key + '-bg', 4.5], ['meter-' + key, 'paper', 3],
  ]),
  ['sev-critical', 'sev-critical-bg', 4.5], ['expl-poc', 'expl-poc-bg', 4.5],
  ['expl-confirmed', 'expl-confirmed-bg', 4.5],
];
for (const [theme, tokens] of [['light',light],['dark',dark]]) {
for (const [fg, bg, min] of pairs) {
  assert.ok(tokens[fg] && tokens[bg], `${fg}/${bg}: missing token`);
  const a = luminance(tokens[fg]), b = luminance(tokens[bg]);
  const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  assert.ok(ratio >= min, `${fg}/${bg} ${ratio.toFixed(2)} < ${min}`);
  if (bg === 'source-warning-bg' || bg === 'selected-bg' || (fg === 'selected-border' && bg === 'wash')) console.log(`CONTRAST D14: ${fg}/${bg} ${tokens[bg]} = ${ratio.toFixed(2)}:1 (minimum ${min}:1)`);
}
}
console.log(`CONTRAST OK: ${pairs.length} pairs × 2 themes`);
