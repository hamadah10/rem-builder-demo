import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const probe = `<script>
(() => {
 const e = id => document.getElementById(id);
 const o = {};
 try {
   o.sections = e('sections').children.length;
   o.modes = e('modes').children.length;
   o.full = e('side-count').textContent;
   e('mode-summer').click(); o.summer = e('side-count').textContent;
   e('mode-placement').click(); o.placement = e('side-count').textContent;
   e('mode-full').click(); e('example').click();
   o.slides = e('dots').children.length;
   e('slides-dialog').close();
   const check = document.querySelector('.file input[type="checkbox"]');
   if (!check) throw Error('Missing file checkbox');
   e('protect-dependencies').checked=false;
   e('protect-dependencies').dispatchEvent(new Event('change',{bubbles:true}));
   check.checked = false;
   check.dispatchEvent(new Event('change',{bubbles:true}));
   o.custom = e('side-count').textContent;
   o.customLabel = e('current-mode').textContent;
   e('review').click();
   o.review = e('review-dialog').open;
   o.reviewItems = e('review-body').querySelectorAll('li').length;
   e('review-dialog').close();
   e('save').click();
   e('mode-summer').click();
   e('resume').click();
   o.resumed = e('side-count').textContent;
 } catch (ex) {o.error = String(ex.stack || ex);}
 const tag=document.createElement('pre');
 tag.id='rem-qa-probe';
 tag.textContent=btoa(unescape(encodeURIComponent(JSON.stringify(o))));
 document.body.append(tag);
})();
</script>`;
test('Real Chromium smoke: full UI startup and primary controls',{timeout:45000},()=>{
 const candidates=[process.env.CHROME_BIN,'google-chrome','google-chrome-stable','chromium']
  .filter(Boolean);
 const browser=candidates.find(cmd=>{
   const p=spawnSync(cmd,['--version'],{encoding:'utf8',timeout:4000});
   return p.status===0;
 });
 assert.ok(browser,'Chromium or Google Chrome executable must be installed');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'rem-browser-'));
 try {
  const filename=path.join(tmp,'qa.html');
  fs.writeFileSync(filename,html.replace('</body>',probe+'\n</body>'));
  const result=spawnSync(browser,[
    '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
    '--disable-background-networking','--disable-extensions',
    '--no-first-run','--virtual-time-budget=1500',
    '--dump-dom','file://'+filename
  ],{encoding:'utf8',timeout:35000,maxBuffer:12*1024*1024});
  assert.equal(result.status,0, 'Browser failed: '+String(result.stderr).slice(-800));
  const encoded=result.stdout.match(/<pre id="rem-qa-probe">([^<]+)<\/pre>/)?.[1];
  assert.ok(encoded,'Browser did not complete UI smoke probe');
  const o=JSON.parse(Buffer.from(encoded,'base64').toString('utf8'));
  assert.ok(!o.error,o.error||'');
  assert.equal(o.sections,7);
  assert.equal(o.modes,4);
  assert.equal(o.full,'31 files');
  assert.equal(o.summer,'25 files');
  assert.equal(o.placement,'16 files');
  assert.equal(o.slides,2);
  assert.equal(o.custom,'30 files');
  assert.equal(o.customLabel,'Custom — from Full REM');
  assert.equal(o.review,true);
  assert.equal(o.reviewItems,30);
  assert.equal(o.resumed,'30 files');
 } finally {
  fs.rmSync(tmp,{recursive:true,force:true});
 }
});
