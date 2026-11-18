import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { TextEncoder, TextDecoder } from 'node:util';
import { Blob } from 'node:buffer';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const catalog=JSON.parse(fs.readFileSync(new URL('../catalog.json',import.meta.url),'utf8'));
const matches=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script=matches.at(-1)?.[1];
assert.ok(script,'application script must be embedded');
const inline=script.match(/const REM_PREVIEW_DATA = (\{.*?\});\s*\n(?=\(\(\) =>)/s);
assert.ok(inline,'inline catalog must exist');

class El {
 constructor(tag='div'){
  this.tag=tag;this.children=[];this.listeners={};this.dataset={};
  this.disabled=false;this.hidden=false;this.open=false;
  this.classList={toggle:()=>{},add:()=>{},remove:()=>{}};
 }
 set textContent(v){this._text=v}get textContent(){return this._text??''}
 append(...x){this.children.push(...x)}
 replaceChildren(...x){this.children=x}
 addEventListener(name,cb){(this.listeners[name]??=[]).push(cb)}
 setAttribute(k,v){this[k]=v}
 removeAttribute(k){delete this[k]}
 click(){for(const cb of this.listeners.click||[])cb()}
 change(){for(const cb of this.listeners.change||[])cb()}
 input(){for(const cb of this.listeners.input||[])cb()}
 focus(){}scrollIntoView(){}
 showModal(){this.open=true}close(){this.open=false}
 remove(){}
}
function app(store=new Map()){
 const nodes=new Map(),files=[];
 for(const m of html.matchAll(/id="([^"]+)"/g)){
  const el=new El();el.id=m[1];nodes.set(el.id,el);
 }
 const document={
  getElementById:id=>nodes.get(id)||null,
  createElement:tag=>{
   const el=new El(tag);
   if(tag==='a')el.click=()=>files.push({filename:el.download,href:el.href});
   return el;
  },
  querySelectorAll:()=>[],body:new El('body')
 };
 const blobs=[];
 const url={
  createObjectURL:obj=>{blobs.push(obj);return 'blob:mock-'+blobs.length;},
  revokeObjectURL:()=>{}
 };
 const localStorage={
  getItem:key=>store.get(key)??null,
  setItem:(key,value)=>store.set(key,value)
 };
 vm.runInNewContext(script,{document,localStorage,URL:url,TextEncoder,TextDecoder,
  Uint8Array,DataView,Blob,setTimeout:()=>{},atob:t=>Buffer.from(t,'base64').toString('binary')},
  {timeout:3500});
 const el=id=>nodes.get(id);
 const mode=key=>el('modes').children.find(x=>x.id==='mode-'+key);
 const checkbox=()=>{
  for(const section of el('phases').children){
   for(const details of section.children[1].children){
    const row=details.children[1]?.children.find(x=>x.tag==='label');
    if(row)return row.children[0];
   }
  }
  throw Error('No file checkbox');
 };
 return {el,mode,checkbox,files,blobs,store};
}
function crc32(bytes){
 let crc=0xffffffff;
 for(const b of bytes){
  crc^=b;
  for(let j=0;j<8;j++)crc=(crc&1)?(0xedb88320^(crc>>>1)):(crc>>>1);
 }
 return (crc^0xffffffff)>>>0;
}
function unzipStored(bytes){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const dec=new TextDecoder(),entries=[];let pos=0;
 while(pos+30<=bytes.length && view.getUint32(pos,true)===0x04034b50){
  const flags=view.getUint16(pos+6,true),method=view.getUint16(pos+8,true);
  assert.equal(method,0,'Stored ZIP required');
  assert.ok(flags&0x800,'UTF-8 filename flag required');
  const len=view.getUint32(pos+18,true),n=view.getUint16(pos+26,true),ext=view.getUint16(pos+28,true);
  const name=dec.decode(bytes.subarray(pos+30,pos+30+n));
  const content=bytes.subarray(pos+30+n+ext,pos+30+n+ext+len);
  assert.equal(content.length,len,'entry size '+name);
  assert.equal(crc32(content),view.getUint32(pos+14,true),'CRC '+name);
  entries.push({name,content});
  pos+=30+n+ext+len;
 }
 const eocd=bytes.length-22;
 assert.equal(view.getUint32(eocd,true),0x06054b50,'ZIP end record');
 assert.equal(view.getUint16(eocd+10,true),entries.length,'ZIP entry count');
 assert.equal(view.getUint32(eocd+16,true),pos,'ZIP central directory location');
 return entries;
}
test('catalog mirrors embedded data, no repeats or excluded files',()=>{
 assert.deepEqual(JSON.parse(inline[1]),catalog);
 assert.equal(catalog.assets.length,31);
 assert.equal(catalog.modules.length,28);
 assert.equal(catalog.phases.length,7);
 assert.equal(new Set(catalog.assets.map(a=>a.id)).size,31);
 assert.equal(new Set(catalog.assets.map(a=>a.packagePath.toLowerCase())).size,31);
 assert.equal(catalog.assets.filter(a=>a.reviewStatus==='proposed-pending-approval').length,9);
 for(const id of ['outreach-guide','project-readiness','sample-bootcamp-schedule','host-agreement','student-contract','mentor-syllabus','financial-business','summer-storyboard','research-presentation','ern-abstract','ern-poster','ern-oral'])
  assert.ok(catalog.assets.some(a=>a.id===id),id);
 for(const a of catalog.assets)
  assert.match(a.fileName,/\.(pdf|xlsx|docx)$/);
});
test('app starts and all presets show correct counts',()=>{
 const a=app();
 assert.equal(a.el('sections').children.length,7);
 assert.equal(a.el('modes').children.length,4);
 assert.equal(a.el('side-count').textContent,'31 files');
 for(const [key,count] of [['summer',25],['placement',16],['custom',0],['full',31]]){
  a.mode(key).click();
  assert.equal(a.el('side-count').textContent,count+' files',key);
 }
});
test('file-level edit changes preset to custom and draft survives reload',()=>{
 const a=app(),checkbox=a.checkbox();
 checkbox.checked=false;checkbox.change();
 assert.equal(a.el('side-count').textContent,'30 files');
 assert.equal(a.el('current-mode').textContent,'Custom — from Full REM');
 a.el('save').click();
 const restarted=app(a.store);
 assert.equal(restarted.el('resume').disabled,false);
 restarted.el('resume').click();
 assert.equal(restarted.el('side-count').textContent,'30 files');
});
test('search finds conference resources',()=>{
 const a=app();
 a.el('search').value='ERN27';a.el('search').input();
 assert.match(a.el('search-status').textContent,/1 matching components/);
 assert.equal(a.el('phases').children.filter(p=>!p.hidden).length,1);
 a.el('search').value='';a.el('search').input();
 assert.equal(a.el('phases').children.filter(p=>!p.hidden).length,7);
});
test('complete original walkthroughs navigate to last slide',()=>{
 const a=app();
 for(const [kind,count] of [['full',6],['summer',5],['placement',2]]){
  a.mode(kind).click();a.el('example').click();
  assert.equal(a.el('dots').children.length,count,kind);
  for(let i=1;i<count;i++)a.el('next-slide').click();
  assert.equal(a.el('next-slide').disabled,true,kind);
 }
});
test('ZIPs contain correct names, CRCs and readable-format fictional samples',()=>{
 const a=app();
 for(const [kind,n] of [['full',31],['summer',25],['placement',16]]){
  a.mode(kind).click();a.el('review').click();a.el('download').click();
  const blob=a.blobs.at(-1);
  const zip=unzipStored(blob.parts[0]);
  assert.equal(zip.length,n,kind);
  const expected=new Set(catalog.assets.filter(asset=>asset.presets[kind]).map(asset=>asset.packagePath));
  assert.deepEqual(new Set(zip.map(entry=>entry.name)),expected);
  for(const entry of zip){
   const bytes=entry.content,name=entry.name;
   if(name.endsWith('.pdf')){
    assert.match(new TextDecoder().decode(bytes.subarray(0,8)),/^%PDF-1/);
    assert.match(new TextDecoder().decode(bytes.subarray(-20)),/%%EOF/);
   }else {
    const inner=unzipStored(bytes);
    const paths=new Set(inner.map(x=>x.name));
    assert.ok(paths.has('[Content_Types].xml'),name);
    if(name.endsWith('.docx'))assert.ok(paths.has('word/document.xml'),name);
    if(name.endsWith('.xlsx'))assert.ok(paths.has('xl/worksheets/sheet1.xml'),name);
    assert.ok(inner.some(x=>new TextDecoder().decode(x.content).includes('SAMPLE ONLY')),name);
   }
  }
 }
});
