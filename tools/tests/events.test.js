/* Fixed-clock tests for js/events-data.js (A-03 exit gate). Run: node tests/events.test.js */
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../../js/events-data.js','utf8');
function load(nowISO){ const RealDate=Date; const fixed=new RealDate(nowISO).getTime();
  class FakeDate extends RealDate{ constructor(...a){ if(a.length===0) super(fixed); else super(...a);} static now(){return fixed;} }
  const ctx={window:{},Date:FakeDate,Intl,Math,String,Number,Array,encodeURIComponent}; vm.createContext(ctx); vm.runInContext(src,ctx); return ctx.window; }
let n=0; function t(name,fn){ fn(); n++; console.log('ok',name); }
const w=load('2026-10-08T15:00:00Z'), U=w.MFM_EVT, E=w.MFM_EVENTS, by=a=>E.find(e=>e.anchor===a);
t('CDT offset in October', ()=>assert.equal(U.zoned('2026-10-10T09:00','America/Chicago').toISOString(),'2026-10-10T14:00:00.000Z'));
t('CST offset after Nov 1', ()=>assert.equal(U.zoned('2026-11-21T16:00','America/Chicago').toISOString(),'2026-11-21T22:00:00.000Z'));
t('EDT offset Oct 30 (flyer says EST)', ()=>assert.equal(U.zoned('2026-10-30T20:00','America/New_York').toISOString(),'2026-10-31T00:00:00.000Z'));
t('DST boundary Nov 1 01:30 CT resolves', ()=>assert.ok(!isNaN(U.zoned('2026-11-01T01:30','America/Chicago'))));
t('ISO offsets', ()=>{ assert.equal(U.isoOffset('2026-10-10T09:00','America/Chicago'),'2026-10-10T09:00:00-05:00'); assert.equal(U.isoOffset('2026-12-12T10:00','America/Chicago'),'2026-12-12T10:00:00-06:00'); });
t('no past events in data on Oct 8', ()=>assert.deepEqual(E.filter(e=>U.isPast(e)).map(e=>e.anchor),[]));
t('movie night present & upcoming', ()=>{ const e=by('movie-night-agbara-nla'); assert.ok(e && !U.isPast(e)); });
t('timed gcal with ctz', ()=>{ const g=U.gcal(by('womens-retreat')); assert.ok(g.includes('dates=20261010T090000/20261010T160000&ctz=America%2FChicago'),g); });
t('all-day gcal for prayer battle', ()=>assert.ok(U.gcal(by('prayer-battle-7')).includes('dates=20260803/20261012')));
t('ticketUrl only real URLs', ()=>{ assert.equal(U.ticketUrl({link:'#'}),''); assert.equal(U.ticketUrl({}),''); assert.ok(U.ticketUrl(by('dallas-deliverance-crusade')).startsWith('https://')); });
t('schema has offset + attendance', ()=>{ const s=U.schema(by('dallas-deliverance-crusade')); assert.equal(s.startDate,'2026-11-21T16:00:00-06:00'); assert.ok(s.eventAttendanceMode.includes('Offline')); });
t('Open Heaven Thursday Oct 8 (before 7:30 PM CT)', ()=>{ const e=by('open-heaven-encounter'); assert.equal(e.date,'2026-10-08'); });
t('Open Heaven schedule correct in CDT (UK 12:00 AM, Ghana 11:00 PM)', ()=>{ const s=by('open-heaven-encounter').schedule.map(x=>x.when).join('|'); assert.ok(s.includes('12:00 AM UK time')&&s.includes('11:00 PM GMT')&&s.includes('7:00 PM ET'),s); });
t('HDH next Tuesday Oct 13', ()=>assert.equal(by('healing-deliverance-hour').date,'2026-10-13'));
t('Weekend Deliverance Oct 9-11', ()=>{ const e=by('weekend-deliverance'); assert.equal(e.date+'/'+e.endDate,'2026-10-09/2026-10-11'); });
const w2=load('2026-10-09T01:00:00Z'); // Thu 8:00 PM CDT, after Open Heaven ended
t('Open Heaven rolls to next Thursday after it ends', ()=>assert.equal(w2.MFM_EVENTS.find(e=>e.anchor==='open-heaven-encounter').date,'2026-10-15'));
const w3=load('2026-10-10T21:30:00Z'); // Sat 4:30 PM CT
t('Womens retreat past after 4 PM CT', ()=>assert.ok(w3.MFM_EVT.isPast(w3.MFM_EVENTS.find(e=>e.anchor==='womens-retreat'))));
t('Gen218 (no end time) still current same evening', ()=>assert.ok(!w3.MFM_EVT.isPast(w3.MFM_EVENTS.find(e=>e.anchor==='gen218-regional-conference'))));
const w4=load('2026-12-03T15:00:00Z'); // winter
t('Open Heaven schedule correct in CST (UK/Ghana 12:00 AM, Nigeria 1:00 AM)', ()=>{ const s=w4.MFM_EVENTS.find(e=>e.anchor==='open-heaven-encounter').schedule.map(x=>x.when).join('|'); assert.ok(s.includes('12:00 AM UK time')&&s.includes('12:00 AM GMT')&&s.includes('1:00 AM WAT'),s); });
t('Weekend Deliverance skips first weekend of December', ()=>{ const e=w4.MFM_EVENTS.find(e=>e.anchor==='weekend-deliverance'); assert.equal(e.date,'2026-12-11'); });
console.log(n,'tests passed');
