import { handle, Q_MS, REVEAL_MS, LEAD_MS, pickQs } from '../../../../netlify/functions/live.mjs';
const mem=new Map();const store={async get(k){const v=mem.get(k);return v===undefined?null:JSON.parse(v)},async setJSON(k,v){mem.set(k,JSON.stringify(v))},async list({prefix}){return{blobs:[...mem.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))}},async delete(k){mem.delete(k)}};
let T=1_000_000;const realNow=Date.now;Date.now=()=>T;
import fs from 'node:fs';const load=async(p)=>p==='/js/quiz/bible.json'&&globalThis.FIX?FIX:JSON.parse(fs.readFileSync(new URL('../../../..'+p, import.meta.url),'utf8'));
const post=async(b)=>(await handle(new Request('http://x/',{method:'POST',body:JSON.stringify(b)}),store,{load})).json();
const get=async(c,p)=>(await handle(new Request(`http://x/?r=${c}&p=${p||''}`),store)).json();
let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m)}};
const qs=[{q:'Q1?',o:['a','b','c','d'],a:1,x:'x1'},{q:'Q2?',o:['a','b'],a:0,x:'x2'},{q:'Q3?',o:['a','b','c'],a:2}];
// bad create
for(const lv of ['easy','normal','hard','kids']){const q=await pickQs('quiz',10,lv,load);ok(q.length===10&&q.every(x=>x.o[x.a]&&x.o.length>=2),'bank '+lv)}
{const q=await pickQs('whoami',15,'',load);ok(q.length===15&&q.every(x=>x.c.length>=3&&x.o.length===4&&x.o[x.a]),'whoami bank')}
{const b=await post({act:'create',qs:[{q:'HACK',o:['a','b'],a:0}],n:5,game:'quiz'});const m=JSON.parse(mem.get('r/'+b.code+'/m'));ok(m.qs.length===5&&!m.qs.some(q=>q.q==='HACK'),'client questions ignored')}
const c=await post({act:'create',game:'quiz',teams:true,qs,hostName:'Dawn'});ok(c.ok&&/^[A-Z2-9]{5}$/.test(c.code),'create');
const C=c.code,H=c.host;{const m=JSON.parse(mem.get('r/'+C+'/m'));m.qs=qs;mem.set('r/'+C+'/m',JSON.stringify(m))}
let v=await get(C);ok(v.phase==='lobby'&&v.n===3,'lobby');
ok((await post({act:'join',code:C,pid:'pa000000000001',name:'Ann'})).reason==='team','team required');
ok((await post({act:'join',code:C,pid:'pa000000000001',name:'Ann',team:'Lions'})).ok,'join ann');
ok((await post({act:'join',code:C,pid:'pb000000000002',name:'ann',team:'Eagles'})).reason==='taken','dup name');
ok((await post({act:'join',code:C,pid:'pb000000000002',name:'Ben',team:'lions'})).team==='Lions','team merge case');
ok((await post({act:'join',code:C,pid:'pc000000000003',name:'Cy',team:'Eagles'})).ok,'join cy');
ok((await post({act:'join',code:C,pid:'pt000000000009',tv:true,host:H})).ok,'tv join');
v=await get(C,'pa000000000001');ok(v.nPlayers===3&&v.me.team==='Lions','players 3, tv excluded');
ok((await post({act:'start',code:C,host:'nope'})).reason==='host','start needs host');
ok((await post({act:'start',code:C,host:H})).ok,'start');
v=await get(C);ok(v.phase==='count'&&v.startIn===LEAD_MS,'count '+v.startIn);
ok((await post({act:'answer',code:C,pid:'pa000000000001',q:0,c:1})).reason==='closed','answer before start closed');
T+=LEAD_MS+1000; v=await get(C,'pa000000000001');ok(v.phase==='q'&&v.qi===0&&!('a' in v.q),'q0 no answer leak');
ok((await post({act:'answer',code:C,pid:'pa000000000001',q:0,c:1})).ok,'ann right');
T+=4000; ok((await post({act:'answer',code:C,pid:'pb000000000002',q:0,c:2})).ok,'ben wrong');
ok((await post({act:'answer',code:C,pid:'pa000000000001',q:0,c:3})).again,'second answer ignored');
v=await get(C);ok(v.phase==='q'&&v.answered===2&&v.eligible===3,'2 of 3');
T+=1000; ok((await post({act:'answer',code:C,pid:'pc000000000003',q:0,c:1})).ok,'cy right');T+=700;
v=await get(C,'pa000000000001');ok(v.phase==='reveal'&&v.q.a===1&&v.dist.join()==='0,2,1,0','early reveal when all answered '+v.phase+' '+(v.dist||[]).join());
ok(v.me.score===975&&v.me.ans.ok===true,'ann pts '+v.me.score); // answered at 1000ms of 20000 → 500+475=975? check
const cy=v.players.find(p=>p.name==='Cy');ok(cy.score>500&&cy.score<v.me.score,'cy less (slower)');
ok(v.teamList.length===2,'teams');
T+=REVEAL_MS; v=await get(C);ok(v.phase==='q'&&v.qi===1,'q1 '+v.phase+v.qi);
T+=Q_MS.quiz+10; v=await get(C);ok(v.phase==='reveal'&&v.qi===1,'q1 timeout reveal');
T+=REVEAL_MS; v=await get(C);ok(v.phase==='q'&&v.qi===2,'q2');
ok((await post({act:'answer',code:C,pid:'pb000000000002',q:1,c:0})).reason==='closed','late answer to q1 closed');
T+=Q_MS.quiz+REVEAL_MS+10; v=await get(C);ok(v.phase==='final','final '+v.phase);
ok((await post({act:'restart',code:C,host:H,game:'whoami',n:5})).ok,'restart');
v=await get(C,'pa000000000001');ok(v.phase==='lobby'&&v.game==='whoami'&&v.me.score===0&&v.nPlayers===3,'restart lobby keeps players, scores reset '+v.me.score);
ok((await post({act:'end',code:C,host:H})).ok,'end');v=await get(C);ok(v.phase==='ended','ended');
T+=9*3600e3;ok((await get(C)).reason==='gone','ttl');
console.log('pass',pass,'fail',fail);
