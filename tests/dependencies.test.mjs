import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync(new URL('../catalog.json',import.meta.url),'utf8'));
const h=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const linked=d.assets.filter(a=>(a.dependsOn||[]).length);
const byId=new Map(d.assets.map(a=>[a.id,a]));
test('exactly nine documented suggested relationships',()=>{
 assert.equal(linked.length,9);
 for(const a of linked){assert.ok(a.dependencyNote);for(const id of a.dependsOn){assert.ok(byId.has(id));assert.notEqual(id,a.id);}}
});
test('all presets are dependency-closed',()=>{
 for(const mode of ['full','summer','placement']){
  const chosen=new Set(d.assets.filter(a=>a.presets[mode]).map(a=>a.id));
  for(const id of chosen)for(const dep of byId.get(id).dependsOn||[])assert.ok(chosen.has(dep),mode+': '+id+' requires '+dep);
 }
});
test('dependency links do not cycle',()=>{
 const seen=new Set(),visiting=new Set();
 function visit(id){if(visiting.has(id))throw Error('cycle '+id);if(seen.has(id))return;visiting.add(id);for(const dep of byId.get(id).dependsOn||[])visit(dep);visiting.delete(id);seen.add(id);}
 for(const id of byId.keys())visit(id);
});
test('visible guard, resolver check, and embedded catalog parity',()=>{
 const m=h.match(/const REM_PREVIEW_DATA = (\{.*?\});\s*\n(?=\(\(\) =>)/s);
 assert.ok(m);assert.deepEqual(JSON.parse(m[1]),d);
 for(const key of ['id="protect-dependencies"','id="dependency-map-list"','remIncludeDependencies','remMissingDependencies','enforceDependencies:protectDependencies'])assert.ok(h.includes(key),key);
 assert.ok(h.includes('Ahmed Alhamadah'));
});