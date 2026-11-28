//@@meta
{"ch":"joseph-1","name":"Joseph","num":1,"ctitle":"The Coat and the Pit","ref":"Genesis 37","min":6,"desc":"Play Joseph’s story from Genesis 37 as an animated storybook: the coat of many colours, the dreams, the pit and the caravan. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#c8312b','#e9a826','#2f6fd0','#2e9b57','#7a3fa0','#e8662a'];
const LOOK={
 jacob:{name:'Jacob',skin:'#b9825a',robe:'#2f4f8f',sash:'#c9952c',wrap:'#efe3c8',band:'#6b4a2b',beard:'long',bc:'#ece8e0',staff:1},
 joseph:{name:'Joseph',skin:'#c08a5f',robe:'#efe6d2',sash:'#8a5a2b',hair:'#2a1a12',coatable:1},
 reuben:{name:'Reuben',skin:'#a87550',robe:'#8a3b2a',sash:'#3b2a1a',wrap:'#d9c9a3',band:'#3b2a1a',beard:'short',bc:'#24170f',cls:'b1'},
 judah:{name:'Judah',skin:'#9c6a47',robe:'#3e6b46',sash:'#c9952c',wrap:'#c9b78e',band:'#2a1d12',beard:'short',bc:'#1d130c',cls:'b2'},
 simeon:{name:'Simeon',skin:'#b07a52',robe:'#5b4a7a',sash:'#2a1d12',wrap:'#e2d6b8',band:'#4a3420',beard:'short',bc:'#2a1a10',cls:'b3'},
 levi:{name:'Levi',skin:'#a26f4b',robe:'#3d6f8a',sash:'#e9d9b0',wrap:'#d2c19a',band:'#2a1d12',beard:'short',bc:'#20150d',cls:'b4'},
 man:{name:'A man in the field',skin:'#b78457',robe:'#8a6a3e',sash:'#3b2a1a',wrap:'#bfb39a',band:'#5a4026',beard:'short',bc:'#3a2a1a',cls:'b2'},
 trader1:{name:'Trader',skin:'#8f603f',robe:'#c46a2b',sash:'#2f4f8f',turban:'#f1ece0',beard:'short',bc:'#1d130c',cls:'b1'},
 trader2:{name:'Trader',skin:'#9a6844',robe:'#2b7d78',sash:'#e9a826',turban:'#c8312b',beard:'short',bc:'#1d130c',cls:'b3'}
};
const DEFS_X='';
const END={num:1,verse:'“But as for you, ye thought evil against me; but God meant it unto good…”',cite:'GENESIS 50:20 · KJV',
 q:'has anyone ever hated you, or laughed at your dream?',a:['Yes, I have','Not that I know of'],
 r:['The pit is not the end of your story. What they meant for evil, God can turn for good.','When trouble comes, remember Joseph: God is with you in every place.'],
 pray:'Father, every pit dug against my destiny, turn it into a stepping stone to my palace. As You were with Joseph, be with me in every place, in the name of Jesus.',
 next:{ch:'joseph-2',label:'Chapter 2',title:'Potiphar’s House',ready:1}};
//@@scenes
S({id:'coat',focus:540,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1060,140)}${cloud(120,1,0)}${cloud(210,.75,-30)}${cloud(90,.6,-50)}${hills(DAY,650)}${tent(300,560,.55)}${tent(130,640)}${well(805,640,.8)}${flock([[300,600,.8],[345,610,.75],[262,612,.7]])}${tree(1222,600,.9)}
 ${put([['simeon',{x:1150,y:640,s:1.0,f:-1}],['judah',{x:1045,y:634,s:1.05,f:-1}],['reuben',{x:935,y:628,s:1.08,f:-1}],['jacob',{x:410,y:656,s:1.28,f:1,expr:'smile'}],['joseph',{x:665,y:656,s:1.17,f:-1,expr:'smile'}]])}
 <g id="fly" style="opacity:0;transform:translate(548px,420px) scale(.7);transition:transform 1.2s cubic-bezier(.45,.05,.25,1),opacity .4s"><g transform="translate(-34 -24)"><rect width="68" height="48" rx="9" fill="url(#cp)" ${ol}/><path d="M6 24 H62" stroke="rgba(0,0,0,.25)" stroke-width="3"/></g></g>${sparks(655,490)}`,
 run:async()=>{
  await narr('“Now Israel loved Joseph more than all his children… and he made him a coat of many colours.”','GENESIS 37:3 · KJV',3800);
  pose('jacob','give');setTimeout(()=>$('fly').style.opacity=1,450);await wait(1500,true);
  $('fly').style.transform='translate(652px,470px) scale(1)';await wait(1150,true);$('fly').style.opacity=0;cls('joseph','coat',1);burst();pose('jacob','stand');await wait(700,true);
  expr('joseph','happy');pose('joseph','joy');hop('joseph');await wait(1800,true);pose('joseph','stand');
  ['reuben','judah','simeon'].forEach(b=>{expr(b,'jealous');pose(b,'cross')});place('judah',cast.judah.x-38,cast.judah.y);place('simeon',cast.simeon.x-52,cast.simeon.y);await wait(1400,true);
  await narr('“…they hated him, and could not speak peaceably unto him.”','GENESIS 37:4 · KJV',3800,1010);
 }});
S({id:'dream',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyN)"/>${[...Array(46)].map((_,i)=>star((i*137)%1280,(i*61)%330+20,3+(i%3)*2,'tw',(i%7)*.3)).join('')}<circle cx="1120" cy="110" r="44" fill="#fff4c9" ${ol}/><circle cx="1140" cy="98" r="40" fill="#0d1838"/>
 ${hills(['#2d4a6e','#264262','#3b4f6a','#2c3b52'],650)}${tent(170,640)}
 <g transform="translate(470 640)"><path d="M-30 0 L0 -18 L30 0Z" fill="#5a3d22" ${ol}/><g class="fl"><path d="M-22 -10 Q-26 -60 0 -88 Q26 -60 22 -10Z" fill="#ff8a2a" ${ol}/><path d="M-10 -12 Q-12 -40 0 -56 Q12 -40 10 -12Z" fill="#ffd23f"/></g></g><circle cx="470" cy="600" r="150" fill="#ffb24a" opacity=".12"/>
 <ellipse cx="690" cy="652" rx="210" ry="14" fill="#000" opacity=".25"/><rect x="760" y="600" width="110" height="46" rx="20" fill="#f3ead6" ${ol}/>
 <g transform="translate(548 604) rotate(90)">${person('joseph',{x:0,y:0,s:1,f:-1,expr:'sleep',coat:1})}</g>
 <g transform="translate(655 652)"><path d="M-130 -2 Q-128 -78 -40 -84 L120 -80 Q140 -60 136 -2 Z" fill="#7a3fa0" ${ol}/><path d="M-112 -42 Q0 -62 126 -48" stroke="#e9a826" stroke-width="6" fill="none" stroke-dasharray="14 12"/></g>
 <g id="dreamB" style="opacity:0;transition:opacity .8s"><circle cx="610" cy="520" r="10" fill="#fff" ${ol}/><circle cx="640" cy="470" r="18" fill="#fff" ${ol}/>
 <path d="M380 420 Q300 400 330 320 Q300 220 420 210 Q470 120 600 160 Q700 90 800 170 Q930 150 930 260 Q1000 320 920 400 Q900 460 780 440 Q700 480 620 440 Q520 470 470 430 Q400 460 380 420Z" fill="url(#dreamG)" ${sk(5)}/>
 <g id="dream1">${[...Array(11)].map((_,i)=>{const a=(i*360/11+90)*Math.PI/180;return [640+Math.cos(a)*230,350+Math.sin(a)*58]}).sort((p,q)=>p[1]-q[1]).map(([x,y])=>sheaf(x.toFixed(0),y.toFixed(0),.6,'sh')).join('')}${sheaf(640,345,.82,'me')}</g>
 <g id="dream2" style="display:none"><circle cx="440" cy="330" r="38" fill="#ffd23f" ${ol}/><g transform="translate(842 330)"><circle r="34" fill="#fff4c9" ${ol}/><circle cx="15" cy="-10" r="30" fill="#16224f"/></g>${[...Array(11)].map((_,i)=>{const a=(205+i*13)*Math.PI/180;return `<g transform="translate(${(640+Math.cos(a)*200).toFixed(0)} ${(410+Math.sin(a)*180).toFixed(0)})"><g class="bow st">${star(0,0,13,'')}</g></g>`}).join('')}<g transform="translate(640 432) scale(.36)">${person('joseph',{x:0,y:0,s:1,f:1,expr:'smile',coat:1}).replace('id="mv-joseph"','id="mv-mini"').replace('id="p-joseph"','id="p-mini"')}</g></g></g>`,
 run:async()=>{
  await narr('“And Joseph dreamed a dream…”','GENESIS 37:5 · KJV',2600);
  $('dreamB').style.opacity=1;await wait(1100,true);
  document.querySelectorAll('#dream1 .sh').forEach((e,i)=>{const x=+e.parentNode.dataset.x;e.style.transform=`rotate(${x<640?22:-22}deg)`});
  await narr('“…my sheaf arose, and also stood upright; and, behold, your sheaves stood round about, and made obeisance to my sheaf.”','GENESIS 37:7 · KJV',4800);
  await ask({tag:'Bible question',q:'What did Joseph do with his dream?',o:['He told his brothers','He kept it a secret','He wrote it on a scroll'],a:0,
   yes:'Right! “Joseph dreamed a dream, and he told it his brethren: and they hated him yet the more.”',ref:'Genesis 37:5'});
  $('dream1').style.display='none';$('dream2').style.display='';await wait(500,true);
  document.querySelectorAll('#dream2 .st').forEach(e=>e.style.transform='translateY(22px) scale(.9)');['#dream2 > circle','#dream2 > g:nth-child(2)'].forEach(s=>{const el=document.querySelector(s);if(el){el.style.transition='transform 1.2s';el.style.transform='translateY(26px)'}});
  await narr('“And he dreamed yet another dream…”','GENESIS 37:9 · KJV',2600);
  await ask({tag:'Bible question',q:'In Joseph’s second dream, what bowed down to him?',o:['Twelve sheaves of wheat','The sun, the moon and eleven stars','Seven fat cows'],a:1,
   yes:'Yes! “…the sun and the moon and the eleven stars made obeisance to me.”',ref:'Genesis 37:9'});
  $('dreamB').style.opacity=0;
  await narr('“And his brethren envied him; but his father observed the saying.”','GENESIS 37:11 · KJV',3800);
 }});
S({id:'walk',focus:560,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1080,130)}${cloud(110,.9,-10)}${cloud(200,.7,-40)}
 <defs><linearGradient id="fadeM" gradientUnits="userSpaceOnUse" x1="2300" x2="2900" y1="0" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="greenM"><rect x="-40" y="0" width="5300" height="760" fill="url(#fadeM)"/></mask></defs>
 <g id="world" style="transform:translateX(0)">${hills(DRY,650,5200)}<g mask="url(#greenM)">${hills(DAY,650,5200)}</g>
 <path d="M2140 650 Q2180 680 2150 720 L2330 720 Q2300 680 2330 650Z" fill="#6cc3f0" ${ol}/><path d="M2170 670 q30 6 60 0 M2190 700 q30 6 60 0" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/>${[2190,2240,2290].map((x,i)=>`<ellipse cx="${x}" cy="${676+i*8}" rx="18" ry="8" fill="#a89a86" ${sk(3)}/>`).join('')}
 ${rocks(2900,652,.7)}${acacia(3550,650,.9)}${bush(3150,652,.9,'#9aa24f')}${rocks(4400,654,.6,'#b3a48c')}${bush(4650,652,.8,'#9aa24f')}
 ${tent(170,640)}${tree(700,610,.8)}${tree(1900,605,.9)}${tree(3300,610,.8)}${flock([[1500,600,.7],[1540,606,.65],[4100,600,.8],[4150,610,.75],[4060,612,.7]])}
 <g transform="translate(96 650)"><rect x="-6" y="-120" width="12" height="120" fill="#6b4a2b" ${ol}/><rect x="-80" y="-140" width="160" height="50" rx="10" fill="#f6e3b4" ${ol}/><text x="0" y="-106" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="26" fill="${OL}">Hebron</text></g><g transform="translate(1250 650)"><rect x="-6" y="-120" width="12" height="120" fill="#6b4a2b" ${ol}/><rect x="-80" y="-140" width="160" height="50" rx="10" fill="#f6e3b4" ${ol}/><text x="0" y="-106" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="28" fill="${OL}">Shechem</text></g>
 <g transform="translate(3900 650)"><rect x="-6" y="-120" width="12" height="120" fill="#6b4a2b" ${ol}/><rect x="-80" y="-140" width="160" height="50" rx="10" fill="#f6e3b4" ${ol}/><text x="0" y="-106" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="28" fill="${OL}">Dothan</text></g>
 <g id="manG">${person('man',{x:1700,y:652,s:1.1,f:-1,expr:'smile'})}</g>${put([['jacob',{x:330,y:652,s:1.2,f:1,expr:'smile'}]])}</g>
 ${person('joseph',{x:560,y:656,s:1.15,f:1,expr:'smile',coat:1})}`,
 run:async()=>{cast.joseph={x:560,y:656,s:1.15,f:1};cast.man={x:1700,y:652,s:1.1,f:-1};
  await say('jacob','Do not thy brethren feed the flock in Shechem? come, and I will send thee unto them.',{ref:'GENESIS 37:13'});
  await say('joseph','Here am I.',{ref:'GENESIS 37:13'});
  pose('jacob','point');await say('jacob','Go, I pray thee, see whether it be well with thy brethren, and well with the flocks; and bring me word again.',{ref:'GENESIS 37:14'});pose('jacob','stand');
  await walkGame();
 }});
S({id:'plot',focus:640,draw:()=>`<rect width="1280" height="720" fill="#8fd0f2"/><rect y="300" width="1280" height="200" fill="#f6e2b0" opacity=".55"/>${sun(1100,120)}${cloud(100,.8,-20)}${hills(DRY,470)}${rocks(180,468,.9)}${acacia(1180,470,.9)}${bush(300,470,.8,'#9aa24f')}${rocks(960,462,.5,'#b3a48c')}${flock([[1060,452,.7],[1105,460,.65],[1020,462,.6]])}${pit(640,470)}
 ${put([['levi',{x:1040,y:470,s:.95,f:-1}],['simeon',{x:930,y:466,s:.98,f:-1}],['judah',{x:830,y:472,s:1.0,f:-1}],['reuben',{x:400,y:474,s:1.0,f:1}],['joseph',{x:-80,y:476,s:.9,f:1,coat:1,expr:'smile'}]])}
 <g id="coatHeld" style="opacity:0;transition:opacity .4s,transform 1s;transform:translate(560px,330px)"><g transform="translate(-36 -26)"><rect width="72" height="52" rx="9" fill="url(#cp)" ${ol}/></g></g>
 <g id="beam" class="beam"><polygon points="590,-10 690,-10 740,720 540,720" fill="url(#beamG)"/></g>`,
 run:async()=>{
  await narr('“And Joseph went after his brethren, and found them in Dothan.”','GENESIS 37:17 · KJV',3200);
  ['simeon','judah','levi'].forEach(b=>expr(b,'angry'));
  await narr('“And when they saw him afar off, even before he came near unto them, they conspired against him…”','GENESIS 37:18 · KJV',3800,940);
  await say('simeon','Behold, this dreamer cometh.',{name:'His brothers',ref:'GENESIS 37:19'});
  await ask({tag:'Bible question',q:'Which brother said, “Let us not kill him”?',o:['Judah','Reuben','Simeon'],a:1,
   yes:'Right! Reuben said, “Shed no blood, but cast him into this pit…” He planned to rescue Joseph and bring him back to their father.',ref:'Genesis 37:21–22'});
  expr('reuben','sad');await say('reuben','Shed no blood, but cast him into this pit that is in the wilderness, and lay no hand upon him.',{ref:'GENESIS 37:22'});
  walkTo('joseph',560,476,2200);await wait(2300,true);expr('joseph','surprised');
  cls('joseph','coat',0);const ch=$('coatHeld');ch.style.opacity=1;ch.style.transform='translate(880px,380px)';await wait(900,true);
  await narr('“…they stript Joseph out of his coat, his coat of many colours that was on him.”','GENESIS 37:23 · KJV',3400);
  expr('joseph','sad');place('joseph',640,712,.72);await wait(1200,true);
  await narr('“…and they took him, and cast him into a pit…”','GENESIS 37:24 · KJV',3000);
  await ask({tag:'Bible question',q:'What was in the pit?',o:['Deep water','Nothing. It was empty','Hungry lions'],a:1,
   yes:'Yes! “…the pit was empty, there was no water in it.”',ref:'Genesis 37:24'});
  await prayMoment();
 }});
S({id:'sold',focus:560,draw:()=>`<rect width="1280" height="720" fill="url(#skyE)"/>${cloud(110,.8,-15)}<circle cx="1050" cy="300" r="92" fill="#ffd27a" opacity=".45"/><circle cx="1050" cy="300" r="62" fill="#ffd27a" ${ol}/>${hills(DRYE,470)}${road(470,'#e8b97f')}${rocks(180,468,.9,'#9c7f68')}${acacia(1180,470,.9)}${pit(640,470)}
 ${camel('camel1',-300,450,1,.82,1)}${camel('camel2',-560,450,1,.78,1)}
 ${put([['trader1',{x:-180,y:470,s:.95,f:1}],['trader2',{x:-440,y:470,s:.92,f:1}],['reuben',{x:1420,y:470,s:1.0,f:-1}],['levi',{x:1100,y:470,s:.95,f:-1,expr:'jealous'}],['simeon',{x:1000,y:466,s:.98,f:-1,expr:'jealous'}],['judah',{x:880,y:472,s:1.0,f:-1}],['joseph',{x:640,y:712,s:.9,k:.72,f:1,expr:'sad'}]])}
 <g id="coins">${[...Array(20)].map((_,i)=>`<g class="coin" style="opacity:0;transform:translate(560px,330px)"><circle r="8" fill="#e3e7ec" ${sk(2.5)}/><circle r="3.5" fill="none" stroke="#9aa3ad" stroke-width="1.8"/></g>`).join('')}</g>`,
 run:async()=>{
  ['camel1','camel2','trader1','trader2'].forEach((id,i)=>{const t=[{x:330,y:450},{x:80,y:450},{x:520,y:470},{x:245,y:470}][i];walkTo(id,t.x,t.y,3600)});
  await narr('“…behold, a company of Ishmeelites came from Gilead with their camels bearing spicery and balm and myrrh, going to carry it down to Egypt.”','GENESIS 37:25 · KJV',4600,360);
  ['camel1','camel2'].forEach(id=>$('c-'+id).parentNode.classList.add('still'));
  pose('judah','point');await say('judah','What profit is it if we slay our brother, and conceal his blood? Come, and let us sell him to the Ishmeelites, and let not our hand be upon him; for he is our brother and our flesh.',{ref:'GENESIS 37:26–27'});pose('judah','stand');
  await ask({tag:'Bible question',q:'How many pieces of silver did they sell Joseph for?',o:['Thirty pieces','Twenty pieces','Fifty pieces'],a:1,
   yes:'Right! “…and sold Joseph to the Ishmeelites for twenty pieces of silver…”',ref:'Genesis 37:28'});
  place('joseph',600,470,1);expr('joseph','sad');await wait(1100,true);
  pose('trader1','give');document.querySelectorAll('.coin').forEach((c,i)=>{c.style.opacity=1;setTimeout(()=>c.style.transform=`translate(${900+(i%10)*15}px,${458-Math.floor(i/10)*12}px)`,i*55)});await wait(1800,true);
  pose('trader1','stand');
  ['camel1','camel2','trader1','trader2'].forEach(id=>{const el=$('c-'+id);if(el)el.parentNode.classList.remove('still')});
  ['camel1','camel2','trader1','trader2','joseph'].forEach((id,i)=>{flip(id,-1);walkTo(id,-400-i*120,id.startsWith('camel')?450:470,5200)});
  await narr('“…and they brought Joseph into Egypt.”','GENESIS 37:28 · KJV',4200,300);
  walkTo('reuben',760,470,2600);await wait(2700,true);expr('reuben','sad');
  await narr('“And Reuben returned unto the pit; and, behold, Joseph was not in the pit; and he rent his clothes.”','GENESIS 37:29 · KJV',4200,760);
  await say('reuben','The child is not; and I, whither shall I go?',{ref:'GENESIS 37:30'});
 }});
S({id:'mourn',focus:560,draw:()=>`<defs><pattern id="tentP" patternUnits="userSpaceOnUse" width="120" height="720"><rect width="120" height="720" fill="#8a4630"/><rect width="60" height="720" fill="#9c5638"/><rect x="58" width="4" height="720" fill="#6e3524"/></pattern><pattern id="rugP" patternUnits="userSpaceOnUse" width="80" height="40"><rect width="80" height="40" fill="#b83a2e"/><path d="M0 20 L20 6 L40 20 L60 6 L80 20 L60 34 L40 20 L20 34Z" fill="#e9a826"/><circle cx="40" cy="20" r="5" fill="#2f4f8f"/></pattern></defs>
 <rect width="1280" height="720" fill="url(#tentP)"/><path d="M-40 -10 Q320 90 640 40 Q960 90 1320 -10 V0 H-40Z" fill="#6e3524"/><path d="M-40 30 Q320 120 640 70 Q960 120 1320 30" fill="none" stroke="${OL}" stroke-width="5"/><path d="M-40 30 Q320 120 640 70 Q960 120 1320 30 L1320 -10 L-40 -10Z" fill="#7a3b27" opacity=".85"/>
 <path d="M80 640 L80 330 Q150 250 220 330 L220 640Z" fill="url(#skyE)" ${ol}/><path d="M80 640 L80 330 Q150 250 220 330 L220 640" fill="none" stroke="#e9a826" stroke-width="6" stroke-dasharray="3 16"/>
 <rect x="632" y="40" width="22" height="620" rx="8" fill="#6b4a2b" ${ol}/>
 <rect y="640" width="1280" height="80" fill="#6e4a2e"/><path d="M190 660 L1120 660 L1230 716 L80 716Z" fill="url(#rugP)" ${ol}/>
 <ellipse cx="1170" cy="630" rx="70" ry="26" fill="#2f6fd0" ${ol}/><ellipse cx="1080" cy="640" rx="56" ry="22" fill="#e9a826" ${ol}/>${lamp(330,640,1.1)}${lamp(1210,600,.9)}
 ${put([['reuben',{x:900,y:648,s:1.12,f:-1,expr:'sad'}],['judah',{x:1030,y:640,s:1.06,f:-1,expr:'sad'}],['jacob',{x:560,y:656,s:1.28,f:1,expr:'sad',pose:'hold'}]])}
 <g id="torn" style="transform:translate(668px,470px)"><rect x="-40" y="-30" width="80" height="58" rx="9" fill="url(#cp)" ${ol}/><path d="M-34 0 H34" stroke="rgba(0,0,0,.25)" stroke-width="3"/></g>`,
 run:async()=>{
  await narr('“And they sent the coat of many colours, and they brought it to their father…”','GENESIS 37:32 · KJV',3800);
  await say('jacob','It is my son’s coat; an evil beast hath devoured him; Joseph is without doubt rent in pieces.',{ref:'GENESIS 37:33'});
  await narr('“And Jacob rent his clothes… and mourned for his son many days.”','GENESIS 37:34 · KJV',3800);
  await narr('“And the Midianites sold him into Egypt unto Potiphar, an officer of Pharaoh’s, and captain of the guard.”','GENESIS 37:36 · KJV',4400);
  await narr('But Joseph was not forgotten.','',2400);
  await narr('“And the LORD was with Joseph…”','GENESIS 39:2 · KJV',3400);
 }});

//@@moments
async function walkGame(){
 const W=$('world'),prog=$('prog'),pi=$('progI');let off=0,held=false,last=performance.now(),idle=0,said1=false,done=false;const END=3360;
 act.innerHTML='Hold to walk';act.classList.add('on');act.style.bottom='4cqw';prog.classList.add('on');prog.style.top='3cqw';
 const down=e=>{e.preventDefault();e.stopPropagation();held=true;idle=0},up=e=>{held=false};
 act.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
 const key=e=>{if(e.code==='Space'||e.code==='ArrowRight'){held=e.type==='keydown';e.preventDefault()}};window.addEventListener('keydown',key);window.addEventListener('keyup',key);
 await new Promise(res=>{function tick(t){const dt=Math.min(50,t-last);last=t;idle+=dt;
   const auto=idle>5000;const v=held?0.32:(auto?0.16:0);if(auto&&!held)act.innerHTML='Hold to walk faster';
   if(v>0){off+=v*dt;P('joseph').classList.add('walk')}else P('joseph').classList.remove('walk');
   off=Math.min(off,END);W.style.transform=`translateX(${-off}px)`;pi.style.width=(off/END*100)+'%';
   if(!said1&&off>900){said1=true;held=false;P('joseph').classList.remove('walk');act.classList.remove('on');cast.man.x=1700-off;
     (async()=>{const ox=off;cast.man.x=1700-ox;await say('man','What seekest thou?',{ref:'GENESIS 37:15'});await say('joseph','I seek my brethren: tell me, I pray thee, where they feed their flocks.',{ref:'GENESIS 37:16'});await say('man','They are departed hence; for I heard them say, Let us go to Dothan.',{ref:'GENESIS 37:17'});act.classList.add('on');idle=0;requestAnimationFrame(tick)})();return}
   if(off>=END){done=true;P('joseph').classList.remove('walk');res();return}
   requestAnimationFrame(tick)}requestAnimationFrame(tick)});
 act.classList.remove('on');prog.classList.remove('on');act.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('keydown',key);window.removeEventListener('keyup',key);
 addPts(50);pop('+50',50,30);await narr('Joseph reached Dothan.','',1800);
}
async function prayMoment(){
 await narr('Years later his brothers remembered “the anguish of his soul, when he besought us, and we would not hear…”','GENESIS 42:21 · KJV',4400);
 await narr('Before the story goes on, take a moment to pray.','',2200);
 act.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-4 3-6 4-9z" fill="#ff8a2a" stroke="#2b1a10" stroke-width="2" stroke-linejoin="round"/></svg> Pray';act.style.bottom='46%';act.classList.add('on');cap.innerHTML='';
 await new Promise(res=>{let t=setTimeout(go,9000);function go(){clearTimeout(t);act.removeEventListener('click',go);res()}act.addEventListener('click',e=>{e.stopPropagation();go()},{once:true})});
 act.classList.remove('on');$('beam').classList.add('on');addPts(50);pop('+50',50,26);
 await narr('“The LORD is nigh unto all them that call upon him, to all that call upon him in truth.”','PSALM 145:18 · KJV',4400);
}
