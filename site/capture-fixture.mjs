// Maintainer-only capture command; normal tests have no network/git dependency.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const commit = 'e1944ffbc1626e02e5f127360bdacadac6ee8fae';
const files = execFileSync('git',['ls-tree','-r','--name-only',commit,'preview/daily/','preview/products/'],{encoding:'utf8'}).trim().split('\n');
if (files.length !== 35) throw Error('Expected 35 preview files');
const snapshot = { repository:'george-palsys/morning-brief-archive', commit, rehearsal:true, files:Object.fromEntries(files.map(file => [file.replace(/^preview\//,''),execFileSync('git',['show',`${commit}:${file}`],{encoding:'utf8'})])) };
fs.mkdirSync(new URL('./fixtures/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('./fixtures/preview.json',import.meta.url),JSON.stringify(snapshot,null,2)+'\n');
console.log(`Captured ${files.length} rehearsal files from ${commit} into site/fixtures/preview.json (test only)`);
