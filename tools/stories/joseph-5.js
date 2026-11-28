//@@meta
{"ch":"joseph-5","name":"Joseph","num":5,"ctitle":"God Meant It unto Good","ref":"Genesis 46–50","min":8,"desc":"Play the end of Joseph’s story from Genesis 46 to 50 as an animated storybook: God speaks to Jacob at Beer-sheba, Joseph meets his father in Goshen, Jacob blesses Pharaoh and Joseph’s sons, and Joseph tells his brothers, God meant it unto good. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#c8312b','#e9a826','#2f6fd0','#2e9b57','#7a3fa0','#e8662a'];
const LOOK={
 joseph:{name:'Joseph',skin:'#c08a5f',robe:'#f6f1e4',sash:'#c9952c',hair:'#2a1a12',chainable:1,ringable:1},
 jacob:{name:'Jacob',age:1,brow:'#d8d2c6',skin:'#b9825a',robe:'#2f4f8f',sash:'#c9952c',wrap:'#efe3c8',band:'#6b4a2b',beard:'long',bc:'#ece8e0',staff:1},
 reuben:{name:'Reuben',skin:'#a87550',robe:'#8a3b2a',sash:'#3b2a1a',wrap:'#d9c9a3',band:'#3b2a1a',beard:'short',bc:'#24170f',cls:'b1'},
 judah:{name:'Judah',skin:'#9c6a47',robe:'#3e6b46',sash:'#c9952c',wrap:'#c9b78e',band:'#2a1d12',beard:'short',bc:'#1d130c',cls:'b2'},
 simeon:{name:'Simeon',skin:'#b07a52',robe:'#5b4a7a',sash:'#2a1d12',wrap:'#e2d6b8',band:'#4a3420',beard:'short',bc:'#2a1a10',cls:'b3'},
 benjamin:{name:'Benjamin',skin:'#b98458',robe:'#c46a2b',sash:'#2f4f8f',wrap:'#efe3c8',band:'#8a5a2b',beard:'short',bc:'#2a1a12',cls:'b1'},
 pharaoh:{name:'Pharaoh',skin:'#9a6844',robe:'#f6f1e4',sash:'#c9952c',nemes:1,collar:'#e9a826',cls:'b3'},
 guard:{name:'Guard',skin:'#8c5d3c',robe:'#d9c9a3',sash:'#2f4f8f',wig:'#241912',cls:'b2'},
 manasseh:{name:'Manasseh',child:.86,skin:'#b07a52',robe:'#2f6f8f',sash:'#e9a826',hair:'#2a1a12',cls:'b4'},
 ephraim:{name:'Ephraim',child:.8,skin:'#b98458',robe:'#2e9b57',sash:'#e9a826',hair:'#2a1a12',cls:'b1'}
};
const DEFS_X=`<radialGradient id="godL" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#fff6d0" stop-opacity=".95"/><stop offset=".5" stop-color="#ffe08a" stop-opacity=".45"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>`;
const END={num:5,verse:'“But as for you, ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive.”',cite:'GENESIS 50:20 · KJV',
 q:'is God turning something hard in your life around for good?',a:['Yes, I am trusting Him','I have seen Him do it'],
 r:['Hold on, as Joseph did. What others meant for evil, God can still turn for good, in His time.','Then tell someone what God has done. Your testimony could strengthen them today.'],
 pray:'Father, as You turned the evil done to Joseph into life for many, turn every pit and every prison in my life into a place of testimony. Let me forgive as Joseph forgave, in the name of Jesus.',
 next:null,more:'Joseph’s story is complete. New Bible Stories come every Monday.'};
//@@scenes
/* chapter 5 props */
const throne=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-70" y="-200" width="140" height="200" rx="12" fill="#e9a826" ${ol}/><rect x="-52" y="-180" width="104" height="120" rx="8" fill="#2f4f8f" ${ol}/><rect x="-86" y="-70" width="172" height="40" rx="8" fill="#c9952c" ${ol}/><path d="M-30 -150 L0 -120 L30 -150" stroke="#e9a826" stroke-width="7" fill="none"/></g>`;
const horse=`<g transform="translate(150 0)"><rect class="leg l2" x="-62" y="-70" width="14" height="72" rx="6" fill="#7a4a24" ${ol}/><rect class="leg" x="34" y="-70" width="14" height="72" rx="6" fill="#7a4a24" ${ol}/><ellipse cx="0" cy="-96" rx="80" ry="38" fill="#9a5f2e" ${ol}/><path d="M54 -110 Q80 -170 96 -190 L126 -178 Q110 -150 86 -96Z" fill="#9a5f2e" ${ol}/><ellipse cx="118" cy="-184" rx="30" ry="16" fill="#9a5f2e" ${ol} transform="rotate(24 118 -184)"/><circle cx="114" cy="-192" r="4" fill="${OL}"/><path d="M70 -160 Q80 -190 98 -198" stroke="#2b1a10" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-78 -106 Q-110 -90 -104 -54" stroke="#2b1a10" stroke-width="12" fill="none" stroke-linecap="round"/><rect class="leg" x="-46" y="-70" width="14" height="72" rx="6" fill="#8a5a30" ${ol}/><rect class="leg l2" x="50" y="-70" width="14" height="72" rx="6" fill="#8a5a30" ${ol}/><path d="M-20 -130 L30 -130" stroke="#c8312b" stroke-width="10" stroke-linecap="round"/><path d="M90 -150 L-90 -80" stroke="#e9a826" stroke-width="5"/></g>`;
const chariot=()=>`<g class="mover" id="mv-chariot" style="transform:translate(-520px,600px)">${horse}
 <g transform="translate(-60 0)"><path d="M-70 -40 L60 -40 L76 -120 Q0 -140 -64 -120Z" fill="#e9a826" ${ol}/><path d="M-50 -60 H56" stroke="#c8312b" stroke-width="6"/>
 <path d="M-70 -40 L60 -40 L76 -120 Q0 -140 -64 -120Z" fill="none" ${ol}/><rect x="-74" y="-90" width="150" height="54" rx="8" fill="#e9a826" ${ol}/><path d="M-60 -62 H60" stroke="#2f4f8f" stroke-width="7"/>
 <g transform="translate(0 -26)"><g class="whl"><circle r="40" fill="#8a5a35" ${ol}/>${[0,60,120].map(a=>`<path d="M0 -36 V36" stroke="${OL}" stroke-width="6" transform="rotate(${a})"/>`).join('')}<circle r="10" fill="#e9a826" ${sk(3)}/></g></g></g></g>`;
const wagon=(id,x,y,s=1,load='#c46a2b')=>`<g id="${id}" style="transition:transform 2.4s cubic-bezier(.45,.05,.25,1),opacity .4s;transform:translate(${x}px,${y}px) scale(${s})"><rect x="-90" y="-96" width="180" height="56" rx="8" fill="#a0703c" ${ol}/><path d="M-90 -76 H90" stroke="#7a5230" stroke-width="5"/><path d="M-70 -96 Q-40 -150 0 -146 Q40 -150 70 -96Z" fill="${load}" ${ol}/><path d="M-40 -110 Q0 -128 40 -110" stroke="#efe3c8" stroke-width="6" fill="none"/>${[-54,54].map(a=>`<g transform="translate(${a} -30)"><circle r="30" fill="#8a5a35" ${ol}/><circle r="8" fill="#e9a826" ${sk(3)}/><path d="M0 -26 V26 M-26 0 H26" stroke="${OL}" stroke-width="5"/></g>`).join('')}<path d="M90 -60 L150 -50" stroke="#7a5230" stroke-width="8" stroke-linecap="round"/></g>`;
const altar=(x,y)=>`<g transform="translate(${x} ${y})">${[[-60,0],[-20,0],[20,0],[60,0],[-40,-34],[0,-34],[40,-34]].map(([a,b])=>`<rect x="${a-22}" y="${b-34}" width="44" height="34" rx="8" fill="#9a8f80" ${ol}/>`).join('')}<g class="fl"><path d="M-30 -68 Q-34 -120 0 -150 Q34 -120 30 -68Z" fill="#ff8a2a" ${sk(3)}/><path d="M-14 -68 Q-14 -100 0 -116 Q14 -100 14 -68Z" fill="#ffd23f"/></g></g>`;
const bed=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-150" y="-70" width="300" height="40" rx="10" fill="#8a5a35" ${ol}/><rect x="-140" y="-96" width="280" height="34" rx="14" fill="#efe3c8" ${ol}/><rect x="-158" y="-150" width="26" height="150" rx="8" fill="#7a4a2b" ${ol}/><rect x="132" y="-110" width="26" height="110" rx="8" fill="#7a4a2b" ${ol}/><ellipse cx="-110" cy="-104" rx="34" ry="16" fill="#c9952c" ${ol}/></g>`;
const cover=(id)=>`<g id="${id}" style="opacity:0;transition:opacity 1.6s"><path d="M-136 -96 Q-110 -150 -60 -140 Q40 -130 136 -100 L136 -80 L-136 -80Z" fill="#2f4f8f" ${ol}/><path d="M-120 -110 Q0 -124 120 -98" stroke="#c9952c" stroke-width="5" fill="none"/></g>`;

S({id:'beersheba',focus:620,draw:()=>`<rect width="1280" height="720" fill="url(#skyN)"/>${[[120,90],[300,150],[520,70],[760,120],[980,80],[1180,150],[1060,240],[200,260]].map(([x,y],i)=>star(x,y,7+i%3*3,'tw',i*.3)).join('')}
 ${hills(EVE,640)}${tent(170,560,.6)}${tent(1120,600,.8)}${altar(860,646)}
 <g id="voiceL" style="opacity:0;transition:opacity 1.4s"><ellipse cx="640" cy="220" rx="520" ry="320" fill="url(#godL)"/>${[...Array(9)].map((_,i)=>`<path d="M640 -40 L${360+i*70} 760" stroke="#fff1b8" stroke-width="10" opacity=".18"/>`).join('')}</g>
 ${put([['jacob',{x:600,y:656,s:1.26,f:1}],['judah',{x:330,y:650,s:1.02,f:1}],['benjamin',{x:430,y:652,s:1.0,f:1}]])}`,
 run:async()=>{
  await narr('“And Israel took his journey with all that he had, and came to Beer-sheba, and offered sacrifices unto the God of his father Isaac.”','GENESIS 46:1 · KJV',5600);
  pose('jacob','pray');$('voiceL').style.opacity=1;['judah','benjamin'].forEach(id=>expr(id,'surprised'));
  await narr('“And God spake unto Israel in the visions of the night, and said, Jacob, Jacob.”','GENESIS 46:2 · KJV',4400);
  await say('jacob','Here am I.',{ref:'GENESIS 46:2'});
  await narr('“…I am God, the God of thy father: fear not to go down into Egypt; for I will there make of thee a great nation: I will go down with thee into Egypt; and I will also surely bring thee up again…”','GENESIS 46:3–4 · KJV',7600);
  await ask({tag:'Bible question',q:'What did God tell Jacob in the visions of the night?',o:['Stay in Canaan and send only Benjamin','Fear not to go down into Egypt','Go back to the land of Haran'],a:1,
   yes:'Right! “…fear not to go down into Egypt; for I will there make of thee a great nation.”',ref:'Genesis 46:3'});
  $('voiceL').style.opacity=.35;pose('jacob','stand');expr('jacob','smile');['judah','benjamin'].forEach(id=>expr(id,'smile'));
 }});

S({id:'goshen',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(160,120)}${cloud(120,.8,-20)}${cloud(220,.6,-40)}
 ${pyramid(220,470,.5)}<rect x="-40" y="468" width="1360" height="20" fill="#9fc46a" ${sk(3)}/>${palm(80,500,.5)}${palm(330,496,.6)}
 <rect x="-40" y="486" width="1360" height="274" fill="#b7d77a" ${sk(4)}/>${road(620,'#e8d8b4')}${flock([[1120,560,.7],[1170,566,.66],[1080,572,.64]])}
 ${wagon('w1',1540,640,.9)}${wagon('w2',1800,646,.85,'#2f6f8f')}${wagon('w3',2060,652,.8,'#7a3fa0')}
 ${put([['jacob',{x:600,y:662,s:1.24,f:-1}],['judah',{x:730,y:658,s:1.04,f:-1}],['benjamin',{x:830,y:660,s:1.0,f:-1}]])}${chariot()}`,
 run:async()=>{
  await narr('“And Jacob rose up from Beer-sheba: and the sons of Israel carried Jacob their father, and their little ones, and their wives, in the wagons which Pharaoh had sent to carry him.”','GENESIS 46:5 · KJV',6600);
  [['w1',990,.8],['w2',1110,.76],['w3',1230,.72]].forEach(([id,x,k],i)=>{$(id).style.transform=`translate(${x}px,${640+i*6}px) scale(${k})`});await wait(2500,true);
  await tapGame({ids:['w1','w2','w3'],hint:'The wagons which Pharaoh had sent: tap each wagon to bring Jacob’s family into Goshen.',fx:900,
   onTap:(el,n)=>{flick(el.id);burstAt([0,990,1110,1230][n]||1100,560)}});
  walkTo('chariot',230,600,4000);
  await narr('“And Joseph made ready his chariot, and went up to meet Israel his father, to Goshen…”','GENESIS 46:29 · KJV',4600,500);
  $('mv-chariot').classList.add('still');cast.joseph={x:330,y:662,s:1.14,f:1,k:1};
  $('mv-chariot').insertAdjacentHTML('afterend',person('joseph',Object.assign({},cast.joseph,{chain:1,ring:1,expr:'happy'})));
  walkTo('joseph',490,662,2000);expr('jacob','happy');pose('jacob','reach');await wait(2000,true);
  pose('joseph','hold');pose('jacob','hold');expr('joseph','sad');
  await narr('“…and presented himself unto him; and he fell on his neck, and wept on his neck a good while.”','GENESIS 46:29 · KJV',5000,560);
  expr('joseph','happy');pose('joseph','stand');pose('jacob','stand');
  await say('jacob','Now let me die, since I have seen thy face, because thou art yet alive.',{name:'Israel (Jacob), to Joseph',ref:'GENESIS 46:30'});
 }});

S({id:'pharaoh',focus:720,draw:()=>`<rect width="1280" height="720" fill="#efe2c4"/><rect width="1280" height="80" fill="url(#egW)"/><path d="M0 80 H1280" stroke="${OL}" stroke-width="5"/>
 <rect x="0" y="80" width="1280" height="480" fill="#c9952c" opacity=".12"/>${column(300,600,440,.92)}${column(1240,600,440,.92)}
 <rect y="560" width="1280" height="200" fill="#d9c49a" ${sk(4)}/><path d="M240 600 L1220 600 L1280 700 L180 700Z" fill="#2f4f8f" opacity=".85" ${ol}/>${dais(1000,574,320)}${throne(1070,580)}
 ${put([['pharaoh',{x:990,y:574,s:1.2,f:-1}],['guard',{x:1180,y:574,s:1.04,f:-1}],['joseph',{x:-120,y:656,s:1.14,f:1,chain:1,ring:1}],['jacob',{x:-260,y:660,s:1.24,f:1}]])}`,
 run:async()=>{
  walkTo('joseph',620,656,3400);walkTo('jacob',760,660,3800);
  await narr('“And Joseph brought in Jacob his father, and set him before Pharaoh: and Jacob blessed Pharaoh.”','GENESIS 47:7 · KJV',5200,760);
  pose('jacob','give');expr('pharaoh','smile');await wait(1200,true);pose('jacob','stand');
  await say('pharaoh','How old art thou?',{ref:'GENESIS 47:8'});
  await say('jacob','The days of the years of my pilgrimage are an hundred and thirty years…',{ref:'GENESIS 47:9'});
  await ask({tag:'Bible question',q:'How old was Jacob when he stood before Pharaoh?',o:['One hundred years','One hundred and thirty years','Ninety years'],a:1,
   yes:'Right! “The days of the years of my pilgrimage are an hundred and thirty years…”',ref:'Genesis 47:9'});
  await narr('“And Joseph placed his father and his brethren, and gave them a possession in the land of Egypt, in the best of the land, in the land of Rameses, as Pharaoh had commanded.”','GENESIS 47:11 · KJV',6600);
  await narr('“And Joseph nourished his father, and his brethren, and all his father’s household, with bread…”','GENESIS 47:12 · KJV',4600);
 }});

S({id:'blessing',focus:620,draw:()=>`<rect width="1280" height="720" fill="url(#lampG)"/>
 <rect x="0" y="0" width="1280" height="560" fill="#7a4a3a" opacity=".45"/><rect width="1280" height="60" fill="url(#egW)" opacity=".85"/><path d="M0 60 H1280" stroke="${OL}" stroke-width="5"/>
 ${lamp(1180,560,1.1)}<rect y="560" width="1280" height="200" fill="#a67c52" ${sk(4)}/>${bed(330,640)}
 ${put([['jacob',{x:190,y:656,s:1.22,f:1}],['ephraim',{x:560,y:656,s:1.04,f:-1}],['manasseh',{x:680,y:656,s:1.06,f:-1}],['joseph',{x:820,y:656,s:1.14,f:-1,chain:1,ring:1}]])}
 <g id="glow" class="beam"><rect width="1280" height="720" fill="#ffe08a" opacity=".18"/>${[[300,280],[520,200],[700,320]].map(([x,y])=>glint(x,y)).join('')}</g>`,
 run:async()=>{
  await narr('“And it came to pass after these things, that one told Joseph, Behold, thy father is sick: and he took with him his two sons, Manasseh and Ephraim.”','GENESIS 48:1 · KJV',5800);
  await say('joseph','They are my sons, whom God hath given me in this place.',{ref:'GENESIS 48:9'});
  await say('jacob','Bring them, I pray thee, unto me, and I will bless them.',{ref:'GENESIS 48:9'});
  walkTo('ephraim',330,656,1400);walkTo('manasseh',450,656,1400);await wait(1400,true);
  pose('jacob','reach');
  await narr('“And Israel stretched out his right hand, and laid it upon Ephraim’s head, who was the younger, and his left hand upon Manasseh’s head, guiding his hands wittingly; for Manasseh was the firstborn.”','GENESIS 48:14 · KJV',7400,500);
  expr('joseph','surprised');pose('joseph','point');
  await say('joseph','Not so, my father: for this is the firstborn; put thy right hand upon his head.',{ref:'GENESIS 48:18'});pose('joseph','stand');expr('joseph','neutral');
  await say('jacob','I know it, my son, I know it: he also shall become a people, and he also shall be great: but truly his younger brother shall be greater than he…',{ref:'GENESIS 48:19'});
  await ask({tag:'Bible question',q:'Which of Joseph’s sons did Jacob set first?',o:['Manasseh, the firstborn','Ephraim, the younger','Benjamin'],a:1,
   yes:'Right! “…God make thee as Ephraim and as Manasseh: and he set Ephraim before Manasseh.”',ref:'Genesis 48:20'});
  $('glow').classList.add('on');expr('ephraim','happy');expr('manasseh','happy');pose('jacob','stand');
  await narr('“And he blessed them that day, saying, In thee shall Israel bless, saying, God make thee as Ephraim and as Manasseh…”','GENESIS 48:20 · KJV',5400);
 }});

S({id:'farewell',focus:560,draw:()=>`<rect width="1280" height="720" fill="url(#lampG)"/>
 <rect x="0" y="0" width="1280" height="560" fill="#4a3a5a" opacity=".5"/><rect width="1280" height="60" fill="url(#egW)" opacity=".7"/><path d="M0 60 H1280" stroke="${OL}" stroke-width="5"/>
 ${lamp(90,560,1)}<rect y="560" width="1280" height="200" fill="#8a6a4a" ${sk(4)}/><g transform="translate(330 640)">${bed(0,0)}${cover('cv')}</g>
 ${put([['jacob',{x:190,y:656,s:1.22,f:1}],['joseph',{x:560,y:656,s:1.14,f:-1,chain:1,ring:1}],['judah',{x:690,y:654,s:1.06,f:-1}],['reuben',{x:810,y:652,s:1.08,f:-1}],['simeon',{x:930,y:652,s:1.02,f:-1}],['benjamin',{x:1050,y:654,s:1.0,f:-1}]])}`,
 run:async()=>{
  await say('jacob','Gather yourselves together, that I may tell you that which shall befall you in the last days.',{ref:'GENESIS 49:1'});
  await narr('“…this is it that their father spake unto them, and blessed them; every one according to his blessing he blessed them.”','GENESIS 49:28 · KJV',5200);
  await say('jacob','I am to be gathered unto my people: bury me with my fathers in the cave that is in the field of Ephron the Hittite…',{ref:'GENESIS 49:29'});
  await ask({tag:'Bible question',q:'Where did Jacob ask his sons to bury him?',o:['In Egypt, near the palace','With his fathers, in the cave of Machpelah in Canaan','Beside the river Nile'],a:1,
   yes:'Right! “…bury me with my fathers in the cave… in the field of Machpelah, which is before Mamre, in the land of Canaan…”',ref:'Genesis 49:29–30'});
  ['joseph','judah','reuben','simeon','benjamin'].forEach(id=>expr(id,'sad'));
  $('mv-jacob').style.transition='opacity 1.6s';$('mv-jacob').style.opacity=0;$('cv').style.opacity=1;
  await narr('“And when Jacob had made an end of commanding his sons, he gathered up his feet into the bed… and was gathered unto his people.”','GENESIS 49:33 · KJV',5600);
  walkTo('joseph',470,656,1200);
  await narr('“And Joseph fell upon his father’s face, and wept upon him, and kissed him.”','GENESIS 50:1 · KJV',4200);
 }});

S({id:'good',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1080,120)}${cloud(120,.8,-20)}
 ${pyramid(200,470,.6)}<rect x="-40" y="468" width="1360" height="20" fill="#cdb27a" ${sk(3)}/>${palm(80,500,.5)}${palm(1220,500,.55)}
 <rect x="-40" y="486" width="1360" height="274" fill="${SAND[0]}" ${sk(4)}/>${column(980,640,300,.8)}
 ${put([['joseph',{x:860,y:656,s:1.16,f:-1,chain:1,ring:1}],['judah',{x:640,y:656,s:1.06,f:1,expr:'sad'}],['reuben',{x:520,y:658,s:1.08,f:1,expr:'sad'}],['simeon',{x:400,y:660,s:1.02,f:1,expr:'sad'}],['benjamin',{x:280,y:660,s:1.0,f:1,expr:'sad'}]])}
 <g id="glow" class="beam"><rect width="1280" height="720" fill="#ffe08a" opacity=".22"/>${[[300,300],[520,220],[760,330],[980,240],[640,470]].map(([x,y])=>glint(x,y)).join('')}</g>`,
 run:async()=>{
  await narr('“And when Joseph’s brethren saw that their father was dead, they said, Joseph will peradventure hate us, and will certainly requite us all the evil which we did unto him.”','GENESIS 50:15 · KJV',6400);
  const B=['judah','reuben','simeon','benjamin'];B.forEach((id,i)=>{place(id,640-i*120,656+i*2,.84);cls(id,'bowR',1);pose(id,'pray');});
  await say('judah','Behold, we be thy servants.',{name:'The brothers',ref:'GENESIS 50:18'});
  expr('joseph','sad');
  await say('joseph','Fear not: for am I in the place of God?',{ref:'GENESIS 50:19'});
  expr('joseph','smile');pose('joseph','reach');
  await say('joseph','But as for you, ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive.',{ref:'GENESIS 50:20'});
  await ask({tag:'Bible question',q:'What did Joseph tell his brothers about the evil they had done to him?',o:['“God meant it unto good.”','“Now I will repay you.”','“Go back to Canaan and never return.”'],a:0,
   yes:'Right! “…ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive.”',ref:'Genesis 50:20'});
  B.forEach((id,i)=>{place(id,640-i*120,656+i*2,1);cls(id,'bowR',0);pose(id,'stand');expr(id,'happy');});
  $('glow').classList.add('on');pose('joseph','stand');burst();
  await say('joseph','Now therefore fear ye not: I will nourish you, and your little ones.',{ref:'GENESIS 50:21'});
  await narr('“And he comforted them, and spake kindly unto them.”','GENESIS 50:21 · KJV',3600);
  await narr('“And Joseph said unto his brethren, I die: and God will surely visit you, and bring you out of this land unto the land which he sware to Abraham, to Isaac, and to Jacob.”','GENESIS 50:24 · KJV',6800);
  await narr('From the coat to the pit, the prison and the palace: God was with Joseph, and He turned it all for good.','',4200);
 }});
//@@moments
