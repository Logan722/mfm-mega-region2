//@@meta
{"ch":"noah-1","name":"Noah and the Flood","num":1,"ctitle":"Two by Two","ref":"Genesis 6–9","min":8,"event":1,"desc":"Play the story of Noah from Genesis 6 to 9 as an animated storybook: the ark of gopher wood, the animals two and two, forty days and forty nights of rain, the dove with the olive leaf, and God’s bow in the cloud. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#c8312b','#e9a826','#2f6fd0','#2e9b57','#7a3fa0','#e8662a'];
const LOOK={
 noah:{name:'Noah',age:1,brow:'#e6e2da',skin:'#b07a52',robe:'#7a5230',sash:'#e9a826',wrap:'#efe3c8',band:'#5a3d22',beard:'long',bc:'#eceae4',staff:1},
 wife:{name:'Noah’s wife',lash:1,skin:'#a87550',robe:'#2f6f8f',sash:'#e9a826',wrap:'#efe3c8',band:'#c9952c',cls:'b2'},
 shem:{name:'Shem',skin:'#b07a52',robe:'#c46a2b',sash:'#2f4f8f',wrap:'#e2d6b8',band:'#4a3420',beard:'short',bc:'#2a1a10',cls:'b1'},
 ham:{name:'Ham',skin:'#8f603f',robe:'#3e6b46',sash:'#e9d9b0',wrap:'#d2c19a',band:'#2a1d12',beard:'short',bc:'#1d130c',cls:'b3'},
 japheth:{name:'Japheth',skin:'#c08a5f',robe:'#7a3fa0',sash:'#e9a826',wrap:'#d9c9a3',band:'#3b2a1a',beard:'short',bc:'#3a2414',cls:'b4'}
};
const DEFS_X=`<radialGradient id="godL" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#fff6d0" stop-opacity=".95"/><stop offset=".5" stop-color="#ffe08a" stop-opacity=".45"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>
<linearGradient id="skyR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#44506a"/><stop offset="1" stop-color="#7d889c"/></linearGradient>
<linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f86b8"/><stop offset="1" stop-color="#22507a"/></linearGradient>`;
const END={num:1,verse:'“I do set my bow in the cloud, and it shall be for a token of a covenant between me and the earth.”',cite:'GENESIS 9:13 · KJV',
 q:'has God ever kept a promise to you?',a:['Yes, many times','I am waiting on one'],
 r:['Then thank Him, as Noah did when he built an altar. Every time you see the rainbow, remember: God keeps His word.','Keep trusting. Noah waited many days in the ark, but God remembered Noah. He remembers you too.'],
 pray:'Father, thank You for keeping Your promises. As You remembered Noah in the ark, remember me and my household. Shut us in with You, and bring us out into a new beginning, in the name of Jesus.',
 next:null,more:'More Great Events are coming. New Bible Stories come every Monday.'};
//@@scenes
/* Noah props */
const voice=(id)=>`<g id="${id}" style="opacity:0;transition:opacity 1.4s"><ellipse cx="640" cy="200" rx="560" ry="330" fill="url(#godL)"/>${[...Array(9)].map((_,i)=>`<path d="M640 -40 L${360+i*70} 760" stroke="#fff1b8" stroke-width="10" opacity=".18"/>`).join('')}</g>`;
const ark=(id,x,y,s=1,door=1)=>`<g id="${id}" style="transform:translate(${x}px,${y}px) scale(${s});transition:transform 3s ease-in-out"><g class="bob">
 <path d="M-330 -40 L330 -40 L270 60 L-270 60Z" fill="#8a5a35" ${ol}/>${[-20,4,28].map(b=>`<path d="M-318 ${b} L318 ${b}" stroke="#6b4428" stroke-width="5"/>`).join('')}
 <rect x="-220" y="-150" width="440" height="110" fill="#a0703c" ${ol}/><path d="M-250 -150 L0 -210 L250 -150Z" fill="#7a4a2b" ${ol}/>
 ${[-160,-80,80,160].map(a=>`<rect x="${a-16}" y="-128" width="32" height="22" rx="4" fill="#3b2a1a" ${sk(3)}/>`).join('')}
 <rect id="${id}-win" x="-16" y="-200" width="32" height="24" rx="4" fill="#3b2a1a" ${sk(3)}/>
 <g id="${id}-door" style="transition:transform 1s;transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(${door})"><rect x="-38" y="-118" width="76" height="78" rx="6" fill="#5a3d22" ${ol}/></g></g></g>`;
const plank=(id,x,y,w=160)=>`<g id="${id}" style="transition:transform 1s cubic-bezier(.45,.05,.25,1),opacity .4s"><rect x="${x-w/2}" y="${y-12}" width="${w}" height="24" rx="6" fill="#a0703c" ${ol}/><path d="M${x-w/2+14} ${y} H${x+w/2-14}" stroke="#7a5230" stroke-width="3"/></g>`;
const ANIM={
 elephant:(c='#9aa3ad')=>`<ellipse cx="0" cy="-58" rx="56" ry="38" fill="${c}" ${ol}/><circle cx="52" cy="-74" r="26" fill="${c}" ${ol}/><path d="M72 -66 Q90 -30 80 -8" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M72 -66 Q90 -30 80 -8" stroke="${OL}" stroke-width="3" fill="none" opacity=".5"/><ellipse cx="36" cy="-76" rx="16" ry="22" fill="${shade(c,-18)}" ${sk(3)}/><circle cx="60" cy="-80" r="3.5" fill="${OL}"/>${[-36,-14,14,32].map(a=>`<rect x="${a}" y="-30" width="16" height="32" rx="5" fill="${c}" ${sk(3)}/>`).join('')}`,
 giraffe:(c='#e9b45f')=>`<ellipse cx="0" cy="-70" rx="44" ry="24" fill="${c}" ${ol}/><path d="M30 -84 L52 -190 L70 -186 L50 -78Z" fill="${c}" ${ol}/><ellipse cx="66" cy="-196" rx="22" ry="13" fill="${c}" ${ol}/><circle cx="70" cy="-200" r="3" fill="${OL}"/><path d="M58 -208 L56 -222 M68 -208 L70 -222" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>${[[-20,-74],[6,-64],[20,-80],[44,-130],[56,-160]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="7" fill="#a0703c"/>`).join('')}${[-32,-14,14,30].map(a=>`<rect x="${a}" y="-50" width="10" height="52" rx="4" fill="${c}" ${sk(3)}/>`).join('')}`,
 lion:(c='#e9a826')=>`<ellipse cx="0" cy="-46" rx="44" ry="24" fill="${c}" ${ol}/><circle cx="46" cy="-62" r="30" fill="#b8681f" ${ol}/><circle cx="50" cy="-62" r="19" fill="${c}" ${sk(3)}/><circle cx="56" cy="-66" r="3" fill="${OL}"/><path d="M-44 -50 Q-64 -60 -60 -78" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>${[-30,-12,14,30].map(a=>`<rect x="${a}" y="-28" width="11" height="30" rx="4" fill="${c}" ${sk(3)}/>`).join('')}`,
 sheep:()=>`<ellipse cx="0" cy="-40" rx="40" ry="26" fill="#f6f1e4" ${ol}/>${[-24,-6,12,28].map(a=>`<circle cx="${a}" cy="-60" r="13" fill="#f6f1e4" ${sk(3)}/>`).join('')}<ellipse cx="40" cy="-46" rx="16" ry="13" fill="#3b2a1a" ${sk(3)}/><circle cx="46" cy="-48" r="2.5" fill="#fff"/>${[-22,-6,12,24].map(a=>`<rect x="${a}" y="-20" width="8" height="22" rx="3" fill="#3b2a1a" ${sk(2.4)}/>`).join('')}`
};
const pair=(id,kind,x,y,s=1)=>`<g id="${id}" style="transition:transform 1.4s cubic-bezier(.45,.05,.25,1),opacity .5s;transform:translate(${x}px,${y}px) scale(${s})"><g transform="translate(-40 0)">${ANIM[kind]()}</g><g transform="translate(60 6) scale(.9)">${ANIM[kind](kind==='elephant'?'#a8b1bb':kind==='giraffe'?'#efc06a':kind==='lion'?'#efb43a':undefined)}</g></g>`;
const bird=(id,c,x,y)=>`<g id="${id}" style="opacity:0;transition:transform 2.2s ease-in-out,opacity .5s;transform:translate(${x}px,${y}px)"><g class="flap"><path d="M0 0 Q-24 -26 -44 -8 Q-22 -6 0 0 Q22 -6 44 -8 Q24 -26 0 0Z" fill="${c}" ${sk(3)}/><ellipse cx="0" cy="2" rx="13" ry="9" fill="${c}" ${sk(3)}/><path d="M12 0 L22 4 L12 6Z" fill="#e9a826"/></g><g class="leaf" style="opacity:0"><path d="M18 8 Q34 2 40 14 Q28 20 18 8Z" fill="#5fae3a" ${sk(2)}/></g></g>`;
const rain=`<g id="rain" style="opacity:0;transition:opacity 1s">${[...Array(46)].map((_,i)=>`<path class="drop" d="M${(i*29)%1300} ${(i*67)%600} l-10 34" stroke="#cfe6ff" stroke-width="4" stroke-linecap="round" opacity=".75" style="animation:fall ${0.7+(i%5)*0.12}s linear infinite;animation-delay:-${(i%9)*0.1}s"/>`).join('')}</g>`;
const bow=`<g id="bow" style="opacity:0;transition:opacity 2s">${['#c8312b','#e8662a','#e9a826','#2e9b57','#2f6fd0','#7a3fa0'].map((c,i)=>`<path d="M80 ${560} A560 470 0 0 1 1200 560" transform="translate(0 ${i*16})" fill="none" stroke="${c}" stroke-width="16" opacity=".85"/>`).join('')}</g>`;
document.head.insertAdjacentHTML('beforeend','<style>@keyframes fall{to{transform:translate(-40px,180px)}}.bob{animation:bob 3s ease-in-out infinite}@keyframes bob{50%{transform:translateY(8px) rotate(.6deg)}}.flap{animation:flap .4s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}@keyframes flap{to{transform:scaleY(.6)}}</style>');

S({id:'build',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1100,120)}${cloud(150,.8,-20)}${cloud(250,.6,-40)}${hills(DAY,660)}${tree(110,650,.9)}${tree(1220,650,.8)}
 ${voice('vc')}<g id="arkF" style="opacity:.35;transition:opacity .6s">${ark('a0',700,560,.85,1)}</g>
 ${plank('p1',300,690)}${plank('p2',470,700)}${plank('p3',900,700)}${plank('p4',1080,690)}
 ${put([['noah',{x:300,y:664,s:1.24,f:1}],['shem',{x:1080,y:660,s:1.04,f:-1}],['ham',{x:1180,y:662,s:1.02,f:-1}]])}`,
 run:async()=>{
  $('vc').style.opacity=1;
  await narr('“…Noah found grace in the eyes of the LORD.”','GENESIS 6:8 · KJV',3600);
  await narr('“…Noah was a just man and perfect in his generations, and Noah walked with God.”','GENESIS 6:9 · KJV',4600);
  pose('noah','pray');
  await narr('“Make thee an ark of gopher wood; rooms shalt thou make in the ark, and shalt pitch it within and without with pitch.”','GENESIS 6:14 · KJV',5600);
  $('vc').style.opacity=.25;pose('noah','stand');
  await ask({tag:'Bible question',q:'What did God tell Noah to make?',o:['A tower of brick','An ark of gopher wood','A city with high walls'],a:1,
   yes:'Right! “Make thee an ark of gopher wood…”',ref:'Genesis 6:14'});
  let built=.35;
  await tapGame({ids:['p1','p2','p3','p4'],hint:'Help Noah build the ark: tap each plank.',fx:700,
   onTap:(el)=>{el.style.transform='translate(0,-160px)';setTimeout(()=>el.style.opacity=0,800);built+=.16;$('arkF').style.opacity=Math.min(1,built);burstAt(700,520)}});
  $('arkF').style.opacity=1;
  await narr('“…The length of the ark shall be three hundred cubits, the breadth of it fifty cubits, and the height of it thirty cubits.”','GENESIS 6:15 · KJV',5400);
  await narr('“Thus did Noah; according to all that God commanded him, so did he.”','GENESIS 6:22 · KJV',4000);
 }});

S({id:'animals',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyE)"/>${sun(1080,150)}${cloud(120,.7,-20)}${hills(DAY,660)}
 ${ark('a1',880,560,.85,0)}<path d="M820 600 L700 668" stroke="#8a5a35" stroke-width="22" stroke-linecap="round"/><path d="M820 600 L700 668" stroke="${OL}" stroke-width="3" opacity=".5"/>
 ${pair('pE','elephant',150,600,1.1)}${pair('pG','giraffe',400,600,1.0)}${pair('pS','sheep',130,700,1.0)}${pair('pL','lion',420,700,1.05)}
 ${put([['noah',{x:640,y:670,s:1.18,f:-1}],['wife',{x:1180,y:664,s:1.0,f:-1}],['japheth',{x:1080,y:664,s:1.0,f:-1}]])}`,
 run:async()=>{
  await narr('“And the LORD said unto Noah, Come thou and all thy house into the ark; for thee have I seen righteous before me in this generation.”','GENESIS 7:1 · KJV',5600);
  pose('noah','point');
  await tapGame({ids:['pE','pG','pL','pS'],hint:'“There went in two and two unto Noah into the ark”: tap each pair to lead them in.',fx:500,
   onTap:(el)=>{el.style.transform='translate(800px,600px) scale(.3)';setTimeout(()=>el.style.opacity=0,1200)}});
  pose('noah','stand');
  await narr('“There went in two and two unto Noah into the ark, the male and the female, as God had commanded Noah.”','GENESIS 7:9 · KJV',5000);
  await narr('“Of every clean beast thou shalt take to thee by sevens, the male and his female: and of beasts that are not clean by two…”','GENESIS 7:2 · KJV',5400);
  await ask({tag:'Bible question',q:'How did the animals go in unto Noah into the ark?',o:['One at a time, alone','Two and two, the male and the female','In one great crowd'],a:1,
   yes:'Right! “There went in two and two unto Noah into the ark, the male and the female…”',ref:'Genesis 7:9'});
  ['noah','wife','japheth'].forEach((id,i)=>walkTo(id,860,600,1800+i*300));await wait(2200,true);
  ['noah','wife','japheth'].forEach(id=>$('mv-'+id).style.opacity=0);
  $('a1-door').style.transform='scaleY(1.0)';
  await narr('“…and the LORD shut him in.”','GENESIS 7:16 · KJV',3400,880);
 }});

S({id:'flood',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyR)"/>${cloud(80,1.1,-10)}${cloud(150,.9,-40)}${cloud(60,.8,-70)}${rain}
 <g id="sea" style="transition:transform 6s ease-in-out;transform:translateY(160px)"><path d="M-40 560 Q160 530 320 560 T640 560 T960 560 T1320 560 V900 H-40Z" fill="url(#seaG)" ${ol}/></g>
 ${ark('a2',640,600,.8,1)}`,
 run:async()=>{
  $('rain').style.opacity=1;
  await narr('“And the rain was upon the earth forty days and forty nights.”','GENESIS 7:12 · KJV',4400);
  $('sea').style.transform='translateY(0)';$('a2').style.transform='translate(640px,450px) scale(.8)';
  await narr('“…and the waters increased, and bare up the ark, and it was lift up above the earth.”','GENESIS 7:17 · KJV',5000);
  await narr('“…and the ark went upon the face of the waters.”','GENESIS 7:18 · KJV',3400);
  await ask({tag:'Bible question',q:'How long was the rain upon the earth?',o:['Seven days','Forty days and forty nights','One whole year'],a:1,
   yes:'Right! “And the rain was upon the earth forty days and forty nights.”',ref:'Genesis 7:12'});
  $('rain').style.opacity=0;
  await narr('“And God remembered Noah, and every living thing, and all the cattle that was with him in the ark: and God made a wind to pass over the earth, and the waters asswaged…”','GENESIS 8:1 · KJV',6800);
 }});

S({id:'dove',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyE)"/>${sun(1100,140)}${cloud(150,.7,-30)}
 <path d="M300 560 L520 330 L640 420 L760 300 L1000 560Z" fill="#8a8f80" ${ol}/><path d="M740 320 L760 300 L790 330 L770 340Z" fill="#fff"/>
 <path d="M-40 560 Q160 540 320 560 T640 560 T960 560 T1320 560 V760 H-40Z" fill="url(#seaG)" ${ol}/>
 ${ark('a3',640,330,.45,1)}${bird('raven','#2b2b33',650,250)}${bird('dove','#f6f6f2',650,250)}`,
 run:async()=>{
  await narr('“And the ark rested in the seventh month, on the seventeenth day of the month, upon the mountains of Ararat.”','GENESIS 8:4 · KJV',5400);
  $('a3-win').setAttribute('fill','#ffe08a');
  await narr('“And it came to pass at the end of forty days, that Noah opened the window of the ark which he had made…”','GENESIS 8:6 · KJV',5000);
  const r=$('raven');r.style.opacity=1;r.style.transform='translate(1400px,160px)';
  await narr('“And he sent forth a raven, which went forth to and fro, until the waters were dried up from off the earth.”','GENESIS 8:7 · KJV',5000);
  await tapOnce('Send forth the dove','40%',8000);
  const d=$('dove');d.style.opacity=1;d.style.transform='translate(1000px,160px)';await wait(2200,true);d.style.transform='translate(650px,250px)';await wait(2200,true);
  await narr('“But the dove found no rest for the sole of her foot, and she returned unto him into the ark…”','GENESIS 8:9 · KJV',4600);
  d.style.transform='translate(1000px,180px)';await wait(2300,true);d.querySelector('.leaf').style.opacity=1;d.style.transform='translate(650px,250px)';await wait(2300,true);
  await narr('“And the dove came in to him in the evening; and, lo, in her mouth was an olive leaf pluckt off: so Noah knew that the waters were abated from off the earth.”','GENESIS 8:11 · KJV',6600);
  await ask({tag:'Bible question',q:'What did the dove bring back to Noah in her mouth?',o:['A fish from the waters','An olive leaf','A twig of gold'],a:1,
   yes:'Right! “…lo, in her mouth was an olive leaf pluckt off…”',ref:'Genesis 8:11'});
 }});

S({id:'rainbow',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1120,120)}${bow}${hills(DAY,660)}
 ${ark('a4',1020,560,.55,0)}<g transform="translate(560 664)">${[[-60,0],[-20,0],[20,0],[60,0],[-40,-34],[0,-34],[40,-34]].map(([a,b])=>`<rect x="${a-22}" y="${b-34}" width="44" height="34" rx="8" fill="#9a8f80" ${ol}/>`).join('')}<g class="fl"><path d="M-30 -68 Q-34 -120 0 -150 Q34 -120 30 -68Z" fill="#ff8a2a" ${sk(3)}/><path d="M-14 -68 Q-14 -100 0 -116 Q14 -100 14 -68Z" fill="#ffd23f"/></g></g>
 ${voice('vc')}${put([['noah',{x:400,y:668,s:1.2,f:1}],['wife',{x:280,y:664,s:1.0,f:1}],['shem',{x:740,y:664,s:1.04,f:-1}],['ham',{x:850,y:664,s:1.02,f:-1}],['japheth',{x:950,y:666,s:1.0,f:-1}]])}
 ${pair('pE2','elephant',150,640,.85)}${pair('pS2','sheep',1160,650,.8)}`,
 run:async()=>{
  await narr('“Go forth of the ark, thou, and thy wife, and thy sons, and thy sons’ wives with thee.”','GENESIS 8:16 · KJV',4600);
  pose('noah','pray');['wife','shem','ham','japheth'].forEach(id=>pose(id,'pray'));
  await narr('“And Noah builded an altar unto the LORD…”','GENESIS 8:20 · KJV',3400);
  $('vc').style.opacity=1;$('bow').style.opacity=1;['noah','wife','shem','ham','japheth'].forEach(id=>{pose(id,'stand');expr(id,'happy')});
  await narr('“I do set my bow in the cloud, and it shall be for a token of a covenant between me and the earth.”','GENESIS 9:13 · KJV',5000);
  await narr('“And I will remember my covenant, which is between me and you and every living creature of all flesh; and the waters shall no more become a flood to destroy all flesh.”','GENESIS 9:15 · KJV',6800);
  await ask({tag:'Bible question',q:'What is the bow in the cloud a token of?',o:['A storm that is coming','God’s covenant: the waters shall no more become a flood','The end of the harvest'],a:1,
   yes:'Right! “…it shall be for a token of a covenant… and the waters shall no more become a flood to destroy all flesh.”',ref:'Genesis 9:13–15'});
  burst();
  await narr('“And God blessed Noah and his sons, and said unto them, Be fruitful, and multiply, and replenish the earth.”','GENESIS 9:1 · KJV',5000);
 }});
//@@moments
