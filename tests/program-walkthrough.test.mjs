import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=html.indexOf('const bootcampSlides =');
const end=html.indexOf('/* Small ZIP writer',start);
assert.ok(start>0 && end>start,'walkthrough block present');
const program=vm.runInNewContext(html.slice(start,end)+';({REM_SLIDES,bootcampActivityDays,summerLearning,preSummer2026,fall2026,spring2027,placementActivities})',{});
test('restore all time periods and prior slides',()=>{
 const {REM_SLIDES}=program;
 assert.equal(REM_SLIDES.full.length,15);
 assert.equal(REM_SLIDES.summer.length,11);
 assert.equal(REM_SLIDES.placement.length,3);
 for(const mode of Object.keys(REM_SLIDES)){
  assert.ok(REM_SLIDES[mode].every(s=>s.title&&s.lead&&Array.isArray(s.items)&&s.items.length>1));
 }
 assert.ok(REM_SLIDES.full.some(s=>s.tag.startsWith('BEFORE SUMMER')));
 assert.ok(REM_SLIDES.full.some(s=>s.tag.startsWith('FALL')));
 assert.ok(REM_SLIDES.full.some(s=>s.tag.startsWith('SPRING')));
 assert.ok(REM_SLIDES.placement.some(s=>s.tag.includes('DETAILED ACTIVITIES')));
});
test('original eight-week summer and academic-year hour commitments',()=>{
 assert.match(program.REM_SLIDES.full[0].lead,/35 hr\/week/);
 assert.match(program.REM_SLIDES.full[0].lead,/4 hr\/week including seminar/);
 assert.match(program.fall2026.lead,/4 hr\/week/);
 assert.match(program.spring2027.lead,/4 hr\/week/);
 assert.match(program.summerLearning.lead,/35 hr\/week/);
});
test('five historical days have correct 4.5-hour sessions and detailed activities',()=>{
 assert.equal(program.bootcampActivityDays.length,5);
 for(const day of program.bootcampActivityDays){
  let total=0;
  for(const item of day.items){
   assert.equal(item.length,3);
   assert.ok(item[1].trim().length >= 4 && item[2].trim().length >= 12);
   const qty=parseFloat(item[0]);
   assert.ok(Number.isFinite(qty));
   total+=item[0].includes('min') ? qty/60 : qty;
  }
  assert.equal(total,4.5,day.tag);
  assert.match(day.lead,/3 hr/);
  assert.match(day.lead,/1 hr lunch/);
 }
 assert.ok(program.bootcampActivityDays[3].items.some(x=>x[1].includes('TBD')));
});
test('historical activities contain no original staff or meeting credentials',()=>{
 const serialized=JSON.stringify(program);
 assert.doesNotMatch(serialized,/arizona\.zoom\.us|pwd=|meeting id|Derrick Hylton|Grant Batchelder|Yousif Kandelchy/i);
 assert.match(serialized,/STEM identity/);
 assert.match(serialized,/MATLAB/);
 assert.match(serialized,/poster/i);
});
