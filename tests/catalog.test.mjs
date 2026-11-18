import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync(new URL('../catalog.json',import.meta.url),'utf8'));
const h=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('scope',()=>{assert.equal(d.assets.length,31);assert.equal(d.modules.length,28);assert.equal(d.phases.length,7);assert.equal(new Set(d.assets.map(a=>a.id)).size,31);assert.equal(new Set(d.assets.map(a=>a.packagePath.toLowerCase())).size,31);});
test('presets',()=>{for(const [k,n] of Object.entries({full:31,summer:25,placement:16}))assert.equal(d.assets.filter(a=>a.presets[k]).length,n,k);});
test('canonical paths',()=>{const m=new Map(d.modules.map(x=>[x.id,x]));const p=new Map(d.phases.map(x=>[x.name,x]));for(const a of d.assets){const mod=m.get(a.moduleId),ph=p.get(mod?.phase);assert.ok(mod&&ph);assert.equal(a.packagePath,[ph.number+' '+ph.name,mod.name,a.fileName].join('/'));assert.match(a.fileName,/\.(docx|xlsx|pdf)$/i);}});
test('demo files without originals',()=>{assert.match(h,/function remDemoSampleBytes/);assert.match(h,/SAMPLE ONLY/);assert.doesNotMatch(h,/previewBytes/);});
