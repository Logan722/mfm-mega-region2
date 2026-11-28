//@@meta
{"ch":"david-2","name":"David","num":2,"ctitle":"David and Goliath","ref":"1 Samuel 17","min":8,"desc":"Play David’s story from 1 Samuel 17 as an animated storybook: Goliath defies the armies of Israel for forty days, David remembers the lion and the bear, chooses five smooth stones, and comes in the name of the LORD of hosts. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#c8312b','#e9a826','#2f6fd0','#2e9b57','#7a3fa0','#e8662a'];
const LOOK={
 david:{name:'David',skin:'#c98a5e',robe:'#c8a36a',sash:'#7a5230',hair:'#6b2e16',cls:'b1'},
 jesse:{name:'Jesse',age:1,brow:'#d8d2c6',skin:'#a87550',robe:'#3e6b46',sash:'#c9952c',wrap:'#e2d6b8',band:'#3b2a1a',beard:'long',bc:'#cfc8bb'},
 saul:{name:'King Saul',skin:'#a87550',robe:'#7a1f2a',sash:'#e9a826',hair:'#2a1a10',crown:1,beard:'short',bc:'#2a1a10',cls:'b3'},
 goliath:{name:'Goliath of Gath',skin:'#b07a52',robe:'#8d939b',sash:'#b8862a',turban:'#b8862a',beard:'short',bc:'#2a1a10',cls:'b2'},
 s1:{name:'A soldier of Israel',skin:'#a26f4b',robe:'#2f4f8f',sash:'#e9d9b0',wrap:'#d2c19a',band:'#2a1d12',beard:'short',bc:'#20150d',cls:'b4'},
 s2:{name:'A soldier of Israel',skin:'#b07a52',robe:'#3e6b46',sash:'#e9a826',wrap:'#d9c9a3',band:'#3b2a1a',beard:'short',bc:'#2a1a10',cls:'b1'},
 eliab:{name:'Eliab',skin:'#a26f4b',robe:'#8a3b2a',sash:'#e9d9b0',wrap:'#d2c19a',band:'#2a1d12',beard:'short',bc:'#20150d',cls:'b2'}
};
const DEFS_X=`<linearGradient id="brookG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd0f0"/><stop offset="1" stop-color="#3f9fd0"/></linearGradient>`;
const END={num:2,verse:'“And all this assembly shall know that the LORD saveth not with sword and spear: for the battle is the LORD’s, and he will give you into our hands.”',cite:'1 SAMUEL 17:47 · KJV',
 q:'is there a giant you are facing right now?',a:['Yes, there is','Not right now'],
 r:['David did not face Goliath in his own strength. Bring your giant to the LORD of hosts: the battle is His.','Then remember what God has already done for you, as David remembered the lion and the bear, and keep trusting Him.'],
 pray:'Father, the battle is Yours. Every giant that defies Your name in my life, let it fall before me, as Goliath fell before David. I come against it in the name of the LORD of hosts, in the name of Jesus.',
 next:{ch:'david-3',label:'Chapter 3',title:'Jonathan, a True Friend',ready:1}};
//@@scenes
/* David chapter 2 props */
const spear=(id,x,y)=>`<g id="${id}" style="transition:opacity .8s"><rect x="${x-6}" y="${y-430}" width="12" height="430" rx="5" fill="#7a5230" ${ol}/><path d="M${x} ${y-480} L${x+16} ${y-428} L${x-16} ${y-428}Z" fill="#b8bfc8" ${ol}/></g>`;
const shield=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="44" ry="58" fill="#b8862a" ${ol}/><ellipse rx="26" ry="36" fill="none" stroke="#7a5a1a" stroke-width="5"/><circle r="8" fill="#e9c860" ${sk(3)}/></g>`;
const banner=(x,y,c)=>`<g transform="translate(${x} ${y})"><rect x="-4" y="-130" width="8" height="130" fill="#7a5230" ${sk(3)}/><path d="M4 -128 L70 -112 L4 -92Z" fill="${c}" ${ol}/></g>`;
const stone=(id,x,y,r=13)=>`<g id="${id}"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.78}" fill="#b8b0a2" ${sk(3)}/><ellipse cx="${x-r*.3}" cy="${y-r*.3}" rx="${r*.3}" ry="${r*.2}" fill="#e6e1d8"/></g>`;
const loaf=(id,x,y)=>`<g id="${id}"><ellipse cx="${x}" cy="${y}" rx="30" ry="17" fill="#d9a05a" ${sk(3)}/><path d="M${x-16} ${y-6} Q${x-8} ${y-12} ${x} ${y-6} M${x+2} ${y-6} Q${x+10} ${y-12} ${x+18} ${y-6}" stroke="#9c6a32" stroke-width="3" fill="none"/></g>`;
const fly=`<g id="flyS" style="opacity:0;transform:translate(560px,470px);transition:transform .55s cubic-bezier(.3,.0,.7,1),opacity .2s"><circle r="11" fill="#b8b0a2" ${sk(3)}/></g>`;
const helm=(id,x,y)=>`<g id="${id}" style="opacity:0;transition:opacity .4s;transform:translate(${x}px,${y}px)"><path d="M-30 0 Q-32 -40 0 -44 Q32 -40 30 0Z" fill="#c9a24a" ${ol}/><rect x="-34" y="-6" width="68" height="12" rx="5" fill="#a88432" ${ol}/></g>`;

S({id:'valley',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(640,110)}${cloud(150,.8,-30)}${cloud(240,.6,-50)}
 <path d="M-40 430 Q120 300 380 330 Q480 380 520 560 L-40 560Z" fill="#a7b35a" ${ol}/><path d="M1320 430 Q1160 300 900 330 Q800 380 760 560 L1320 560Z" fill="#c9a46e" ${ol}/>
 <path d="M-40 560 Q640 520 1320 560 V760 H-40Z" fill="#9fc46a" ${sk(4)}/><path d="M480 600 Q640 640 800 600" stroke="#7fd0f0" stroke-width="16" fill="none" stroke-linecap="round"/>
 ${tent(150,400,.4)}${tent(260,386,.35)}${banner(330,350,'#2f6fd0')}${tent(1110,392,.4)}${tent(1010,380,.35)}${banner(950,350,'#c8312b')}
 ${put([['s1',{x:200,y:470,s:.62,f:1}],['s2',{x:280,y:460,s:.6,f:1}],['saul',{x:110,y:476,s:.66,f:1,expr:'sad'}],['goliath',{x:1080,y:470,s:1.05,f:-1}]])}${spear('spr',1130,470)}`,
 run:async()=>{
  await narr('“And the Philistines stood on a mountain on the one side, and Israel stood on a mountain on the other side: and there was a valley between them.”','1 SAMUEL 17:3 · KJV',5600);
  $('spr').style.opacity=0;cast.goliath.k=1.7;walkTo('goliath',860,660,3600);
  await narr('“And there went out a champion out of the camp of the Philistines, named Goliath, of Gath, whose height was six cubits and a span.”','1 SAMUEL 17:4 · KJV',5400,860);
  pose('goliath','point');
  await say('goliath','I defy the armies of Israel this day; give me a man, that we may fight together.',{ref:'1 SAMUEL 17:10'});pose('goliath','stand');
  ['s1','s2'].forEach(id=>expr(id,'surprised'));
  await narr('“When Saul and all Israel heard those words of the Philistine, they were dismayed, and greatly afraid.”','1 SAMUEL 17:11 · KJV',4800,300);
  await narr('“And the Philistine drew near morning and evening, and presented himself forty days.”','1 SAMUEL 17:16 · KJV',4200,700);
  await ask({tag:'Bible question',q:'For how long did Goliath come out to defy Israel?',o:['Seven days','Forty days, morning and evening','One whole year'],a:1,
   yes:'Right! “…the Philistine drew near morning and evening, and presented himself forty days.”',ref:'1 Samuel 17:16'});
 }});

S({id:'errand',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyE)"/>${sun(1080,150)}${cloud(120,.7,-20)}${hills(DAY,650)}${tent(160,600,.8)}${flock([[1000,600,.8],[1060,610,.76],[960,614,.72],[1110,620,.7]])}${tree(1220,640,.8)}
 ${put([['jesse',{x:420,y:656,s:1.2,f:1}],['david',{x:620,y:660,s:1.04,f:-1}]])}
 <g id="bag" style="opacity:0;transition:opacity .4s"><path d="M640 560 Q630 600 660 610 Q700 612 696 570 Q690 548 668 550Z" fill="#a0703c" ${ol}/></g>
 ${loaf('lf1',300,690)}${loaf('lf2',380,700)}${loaf('lf3',460,692)}${loaf('lf4',540,702)}${loaf('lf5',780,694)}`,
 run:async()=>{
  pose('jesse','point');
  await say('jesse','Take now for thy brethren an ephah of this parched corn, and these ten loaves, and run to the camp to thy brethren…',{ref:'1 SAMUEL 17:17'});pose('jesse','stand');
  await tapGame({ids:['lf1','lf2','lf3','lf4','lf5'],hint:'Help David pack the loaves for his brothers: tap each loaf.',fx:540,
   onTap:(el)=>{el.style.transition='opacity .4s';el.style.opacity=0;burstAt(640,560)}});
  $('bag').style.opacity=1;flip('david',1);walkTo('david',1460,660,3800);
  await narr('“And David rose up early in the morning, and left the sheep with a keeper, and took, and went, as Jesse had commanded him…”','1 SAMUEL 17:20 · KJV',5400);
 }});

S({id:'camp',focus:620,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1100,120)}${cloud(160,.7,-10)}${hills(DAY,650)}${tent(1120,600,.9)}${tent(980,580,.6)}${banner(860,640,'#2f6fd0')}
 ${put([['saul',{x:960,y:660,s:1.22,f:-1,expr:'sad'}],['s1',{x:760,y:656,s:1.06,f:-1}],['s2',{x:640,y:656,s:1.04,f:-1}],['eliab',{x:520,y:656,s:1.1,f:1}],['david',{x:-120,y:660,s:1.04,f:1}]])}
 ${helm('helmA',430,452)}`,
 run:async()=>{
  walkTo('david',400,660,3000);await wait(3000,true);
  await say('david','…for who is this uncircumcised Philistine, that he should defy the armies of the living God?',{ref:'1 SAMUEL 17:26'});
  ['eliab','s2','s1'].forEach(id=>walkTo(id,cast[id].x+(id==='eliab'?-260:40),656,1400));walkTo('david',700,660,1800);await wait(1800,true);
  await say('david','Let no man’s heart fail because of him; thy servant will go and fight with this Philistine.',{name:'David, to Saul',ref:'1 SAMUEL 17:32'});
  await say('saul','Thou art not able to go against this Philistine to fight with him: for thou art but a youth, and he a man of war from his youth.',{ref:'1 SAMUEL 17:33'});
  pose('david','point');
  await say('david','Thy servant kept his father’s sheep, and there came a lion, and a bear, and took a lamb out of the flock…',{ref:'1 SAMUEL 17:34'});
  await say('david','The LORD that delivered me out of the paw of the lion, and out of the paw of the bear, he will deliver me out of the hand of this Philistine.',{ref:'1 SAMUEL 17:37'});
  pose('david','stand');
  await ask({tag:'Bible question',q:'What did David say the LORD had delivered him from?',o:['A storm on the sea','The paw of the lion and the paw of the bear','The hand of the Egyptians'],a:1,
   yes:'Right! “The LORD that delivered me out of the paw of the lion, and out of the paw of the bear…”',ref:'1 Samuel 17:37'});
  expr('saul','smile');
  await say('saul','Go, and the LORD be with thee.',{ref:'1 SAMUEL 17:37'});
  const h=$('helmA');h.style.transform='translate(730px,452px)';h.style.opacity=1;
  await narr('“And Saul armed David with his armour, and he put an helmet of brass upon his head…”','1 SAMUEL 17:38 · KJV',4600,700);
  await say('david','I cannot go with these; for I have not proved them.',{ref:'1 SAMUEL 17:39'});
  h.style.opacity=0;
  await narr('“And David put them off him.”','1 SAMUEL 17:39 · KJV',2800,700);
 }});

S({id:'brook',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(160,120)}${cloud(1000,.7,-20)}${hills(DAY,600)}
 <path d="M-40 610 Q300 590 640 620 T1320 610 V700 Q900 680 640 690 T-40 690Z" fill="url(#brookG)" ${ol}/><path d="M80 640 Q160 632 240 642 M520 652 Q600 646 680 656 M960 646 Q1040 640 1120 650" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
 ${rocks(120,620,.6)}${rocks(1180,616,.7)}${bush(1040,600,.7)}
 ${put([['david',{x:300,y:640,s:1.06,f:1,staff:1}]])}${stone('st1',460,668)}${stone('st2',560,676,12)}${stone('st3',650,664,14)}${stone('st4',760,674,12)}${stone('st5',860,666,13)}`,
 run:async()=>{
  await tapGame({ids:['st1','st2','st3','st4','st5'],hint:'David “chose him five smooth stones out of the brook”: tap each stone.',fx:640,
   onTap:(el)=>{walkTo('david',(+el.querySelector('ellipse').getAttribute('cx'))-80,640,500);el.style.transition='opacity .4s';el.style.opacity=0;burstAt(+el.querySelector('ellipse').getAttribute('cx'),600)}});
  await narr('“And he took his staff in his hand, and chose him five smooth stones out of the brook, and put them in a shepherd’s bag which he had, even in a scrip; and his sling was in his hand…”','1 SAMUEL 17:40 · KJV',7400);
  await ask({tag:'Bible question',q:'How many smooth stones did David choose out of the brook?',o:['One','Five','Twelve'],a:1,
   yes:'Right! He “chose him five smooth stones out of the brook…”',ref:'1 Samuel 17:40'});
 }});

S({id:'fight',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(640,110)}${cloud(150,.8,-30)}
 <path d="M-40 470 Q120 360 360 390 Q440 430 470 560 L-40 560Z" fill="#a7b35a" ${ol}/><path d="M1320 470 Q1160 360 920 390 Q840 430 810 560 L1320 560Z" fill="#c9a46e" ${ol}/>
 <path d="M-40 560 Q640 520 1320 560 V760 H-40Z" fill="#9fc46a" ${sk(4)}/>${banner(320,410,'#2f6fd0')}${banner(960,410,'#c8312b')}
 ${put([['s1',{x:180,y:500,s:.62,f:1}],['s2',{x:260,y:490,s:.6,f:1}],['goliath',{x:980,y:664,s:1.05,f:-1,k:1.7}],['david',{x:300,y:664,s:1.04,f:1}]])}${shield(890,560,1.2)}${fly}`,
 run:async()=>{
  expr('goliath','angry');
  await narr('“And when the Philistine looked about, and saw David, he disdained him: for he was but a youth, and ruddy, and of a fair countenance.”','1 SAMUEL 17:42 · KJV',5400);
  await say('goliath','Am I a dog, that thou comest to me with staves?',{ref:'1 SAMUEL 17:43'});
  pose('david','point');
  await say('david','Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the LORD of hosts, the God of the armies of Israel, whom thou hast defied.',{ref:'1 SAMUEL 17:45'});
  await say('david','…for the battle is the LORD’s, and he will give you into our hands.',{ref:'1 SAMUEL 17:47'});pose('david','stand');
  await ask({tag:'Bible question',q:'In whose name did David come against Goliath?',o:['In the name of King Saul','In his own strength','In the name of the LORD of hosts'],a:2,
   yes:'Right! “…I come to thee in the name of the LORD of hosts, the God of the armies of Israel…”',ref:'1 Samuel 17:45'});
  walkTo('david',520,664,1400);walkTo('goliath',900,664,1600);await wait(1500,true);
  pose('david','joy');
  await tapOnce('Sling the stone!','40%',9000);
  const f=$('flyS'),hy=headTop('goliath')+70;f.style.opacity=1;f.style.transform='translate(560px,470px)';await wait(60,true);f.style.transform=`translate(890px,${hy}px)`;await wait(600,true);f.style.opacity=0;
  pose('david','stand');const gm=$('mv-goliath');gm.style.transition='transform 1.3s cubic-bezier(.5,0,.8,.6)';gm.style.transform=`translate(${cast.goliath.x}px,${cast.goliath.y}px) scale(${cast.goliath.k}) rotate(-80deg)`;
  await narr('“And David put his hand in his bag, and took thence a stone, and slang it, and smote the Philistine in his forehead… and he fell upon his face to the earth.”','1 SAMUEL 17:49 · KJV',6000,760);
  await narr('“So David prevailed over the Philistine with a sling and with a stone… but there was no sword in the hand of David.”','1 SAMUEL 17:50 · KJV',5400);
  await ask({tag:'Bible question',q:'What did David use to prevail over Goliath?',o:['A sword and a spear','A sling and a stone','King Saul’s armour'],a:1,
   yes:'Right! “So David prevailed over the Philistine with a sling and with a stone…”',ref:'1 Samuel 17:50'});
  ['s1','s2'].forEach(id=>{expr(id,'happy');pose(id,'joy')});expr('david','happy');pose('david','joy');burst();
  await narr('“…And when the Philistines saw their champion was dead, they fled.”','1 SAMUEL 17:51 · KJV',4000);
  await narr('“And the men of Israel and of Judah arose, and shouted, and pursued the Philistines…”','1 SAMUEL 17:52 · KJV',4400);
  pose('david','stand');
 }});
//@@moments
