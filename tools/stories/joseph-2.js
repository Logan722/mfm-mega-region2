//@@meta
{"ch":"joseph-2","name":"Joseph","num":2,"ctitle":"Potiphar’s House","ref":"Genesis 39","min":6,"desc":"Play Joseph’s story from Genesis 39 as an animated storybook: sold in Egypt, blessed in Potiphar’s house, faithful when tempted, and favoured even in prison. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#2f6f8f','#2f6f8f','#28607d','#2f6f8f','#28607d','#2f6f8f'];
const LOOK={
 joseph:{name:'Joseph',skin:'#c08a5f',robe:'#efe6d2',sash:'#8a5a2b',hair:'#2a1a12',coatable:1},
 trader1:{name:'Trader',skin:'#8f603f',robe:'#c46a2b',sash:'#2f4f8f',turban:'#f1ece0',beard:'short',bc:'#1d130c',cls:'b1'},
 potiphar:{name:'Potiphar',skin:'#9a6844',robe:'#f4efe2',sash:'#c8312b',wig:'#1b1410',collar:'#e9a826',cls:'b2'},
 guard:{name:'Guard',skin:'#8c5d3c',robe:'#d9c9a3',sash:'#2f4f8f',wig:'#241912',cls:'b3'},
 wife:{name:'Potiphar’s wife',lash:1,skin:'#a8754e',robe:'#6f3a8f',sash:'#e9a826',wrap:'#e8dcc0',band:'#c9952c',cls:'b4'},
 man1:{name:'A man of the house',skin:'#9c6a47',robe:'#e7dcc4',sash:'#2e9b57',wig:'#1d140f',cls:'b1'},
 man2:{name:'A man of the house',skin:'#b07a52',robe:'#d8cbb0',sash:'#c46a2b',wig:'#2a1d12',cls:'b2'},
 keeper:{name:'Keeper of the prison',skin:'#94623f',robe:'#7d6440',sash:'#2b1a10',wig:'#1b1410',cls:'b3'},
 pris1:{name:'Prisoner',skin:'#a87550',robe:'#8a7d6a',sash:'#4a3a2a',wrap:'#b8ab92',band:'#4a3a2a',beard:'short',bc:'#2a1a10',cls:'b4'},
 pris2:{name:'Prisoner',skin:'#8f603f',robe:'#7a6f62',sash:'#3b2a1a',beard:'short',bc:'#1d130c',hair:'#1d130c',cls:'b1'}
};
const DEFS_X='';
const END={num:2,verse:'“…God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape…”',cite:'1 CORINTHIANS 10:13 · KJV',
 q:'is anyone pushing you to do something you know is wrong?',a:['Yes, sometimes','Not right now'],
 r:['Do what Joseph did: say no, and get away from it. God is faithful, and He will make a way to escape.','Keep your heart ready. Joseph chose to honour God, even far from home.'],
 pray:'Father, give me strength to say no to sin and to flee from every temptation. As You were with Joseph, be with me, and make all that I do to prosper, in the name of Jesus.',
 next:{ch:'joseph-3',label:'Chapter 3',title:'The Prison and the Palace',ready:1}};
//@@scenes
S({id:'market',focus:620,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1080,120)}${cloud(110,.8,-20)}${cloud(190,.6,-45)}
 ${pyramid(250,470,1.05)}${pyramid(470,470,.7,'#d9ad5c')}${pyramid(1000,470,.55,'#dcb262')}
 <rect x="-40" y="468" width="1360" height="20" fill="#cdb27a" ${sk(3)}/>${nile(484,52)}${palm(140,500,.6)}${palm(1180,498,.55)}${palm(760,496,.45)}
 <rect x="-40" y="534" width="1360" height="226" fill="${SAND[0]}" ${sk(4)}/><path d="M-40 600 Q400 584 800 606 T1320 596" stroke="${SAND[1]}" stroke-width="10" fill="none"/>
 ${stall(120,652,1,'#c8312b')}${stall(1170,650,.95,'#2f6fd0')}${camel('camelA',230,640,1,.7,1)}${jar(330,654,.8)}${sack(1060,652,.8)}
 ${put([['trader1',{x:430,y:654,s:1.12,f:1}],['joseph',{x:575,y:656,s:1.1,f:1,expr:'sad'}],['potiphar',{x:1420,y:654,s:1.18,f:-1}],['guard',{x:1560,y:652,s:1.1,f:-1}]])}
 <g id="pouch" style="opacity:0;transform:translate(820px,470px);transition:transform 1s cubic-bezier(.45,.05,.25,1),opacity .3s"><path d="M-14 -4 Q-20 18 0 22 Q20 18 14 -4 Q8 -12 0 -10 Q-8 -12 -14 -4Z" fill="#8a5a35" ${sk(3)}/><path d="M-8 -8 L8 -8" stroke="#e9a826" stroke-width="4"/></g>`,
 run:async()=>{$('c-camelA').parentNode.classList.add('still');
  await narr('“And Joseph was brought down to Egypt…”','GENESIS 39:1 · KJV',3000);
  walkTo('potiphar',820,654,3000);walkTo('guard',960,652,3200);
  await narr('“…and Potiphar, an officer of Pharaoh, captain of the guard, an Egyptian, bought him of the hands of the Ishmeelites, which had brought him down thither.”','GENESIS 39:1 · KJV',5600);
  pose('potiphar','give');const pu=$('pouch');pu.style.opacity=1;await wait(300,true);pu.style.transform='translate(470px,480px)';await wait(1100,true);pose('trader1','receive');pu.style.opacity=0;pose('potiphar','stand');await wait(600,true);pose('trader1','stand');
  await ask({tag:'Bible question',q:'Who bought Joseph in Egypt?',o:['Pharaoh, the king of Egypt','Potiphar, captain of the guard','A farmer by the river'],a:1,
   yes:'Right! “…Potiphar, an officer of Pharaoh, captain of the guard, an Egyptian, bought him…”',ref:'Genesis 39:1'});
  flip('potiphar',1);flip('guard',1);['potiphar','guard','joseph'].forEach((id,i)=>walkTo(id,1500+i*130,id==='joseph'?656:654,3400));
  await wait(3300,true);
 }});

S({id:'house',focus:640,draw:()=>`<rect width="1280" height="720" fill="#e9d6ae"/><rect width="1280" height="70" fill="url(#egW)"/><path d="M0 70 H1280" stroke="${OL}" stroke-width="5"/>
 ${[300,980].map(x=>`<g><rect x="${x-90}" y="160" width="180" height="250" rx="10" fill="url(#skyD)" ${ol}/>${palm(x+30,410,.62)}<rect x="${x-90}" y="160" width="180" height="250" rx="10" fill="none" ${ol}/><path d="M${x} 160 V410 M${x-90} 285 H${x+90}" stroke="#8a5a35" stroke-width="10"/><path d="M${x} 160 V410 M${x-90} 285 H${x+90}" stroke="${OL}" stroke-width="3" opacity=".5"/></g>`).join('')}
 <rect y="560" width="1280" height="200" fill="#c9a46e" ${sk(4)}/><path d="M0 610 H1280 M0 670 H1280" stroke="#b58f5a" stroke-width="4"/>
 ${column(70,600,420)}${column(1210,600,420)}
 <g id="it1">${jar(470,640,.9)}</g><g id="it2">${sack(560,642,.85)}</g><g id="it3">${scrollT(668,642,.95)}</g><g id="it4">${bread(782,640,.9)}</g><g id="it5">${lamp(866,640,1)}</g>
 ${put([['joseph',{x:380,y:660,s:1.12,f:1,coat:1,expr:'smile'}],['potiphar',{x:1040,y:658,s:1.2,f:-1}],['man1',{x:170,y:656,s:1.02,f:1}]])}
 ${keys('keyR',1000,470)}<g id="glow" class="beam"><rect width="1280" height="720" fill="#ffe08a" opacity=".22"/>${[[200,520],[460,300],[640,470],[820,250],[1100,520],[560,600],[900,600]].map(([x,y])=>glint(x,y)).join('')}</g>`,
 run:async()=>{
  await narr('“And the LORD was with Joseph, and he was a prosperous man; and he was in the house of his master the Egyptian.”','GENESIS 39:2 · KJV',4800);
  const tx={it1:470,it2:560,it3:668,it4:782,it5:866};
  await tapGame({ids:['it1','it2','it3','it4','it5'],hint:'Help Joseph serve in Potiphar’s house: tap each glowing job.',fx:660,
   onTap:(el)=>{walkTo('joseph',tx[el.id]-72,660,500);flick(el.id);burstAt(tx[el.id],560)}});
  walkTo('joseph',640,660,900);await wait(900,true);
  await narr('“And his master saw that the LORD was with him, and that the LORD made all that he did to prosper in his hand.”','GENESIS 39:3 · KJV',4600);
  pose('potiphar','give');const k=$('keyR');k.style.opacity=1;await wait(300,true);k.style.transform='translate(700px,480px)';await wait(1100,true);pose('joseph','receive');pose('potiphar','stand');
  await narr('“…he made him overseer over his house, and all that he had he put into his hand.”','GENESIS 39:4 · KJV',4000);
  pose('joseph','stand');k.style.opacity=0;
  await ask({tag:'Bible question',q:'Why did Potiphar’s house prosper?',o:['The LORD blessed it for Joseph’s sake','Potiphar was clever with money','Joseph found gold in Egypt'],a:0,
   yes:'Right! “…the LORD blessed the Egyptian’s house for Joseph’s sake…”',ref:'Genesis 39:5'});
  $('glow').classList.add('on');expr('potiphar','smile');expr('man1','smile');
  await narr('“…and the blessing of the LORD was upon all that he had in the house, and in the field.”','GENESIS 39:5 · KJV',4200);
 }});

S({id:'refuse',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#lampG)"/>
 <rect x="0" y="0" width="1280" height="560" fill="#a86a4a" opacity=".55"/>${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<rect x="${i*128}" y="90" width="10" height="470" fill="#5a3427" opacity=".45"/>`).join('')}<rect width="1280" height="60" fill="url(#egW)" opacity=".9"/><path d="M0 60 H1280" stroke="${OL}" stroke-width="5"/>
 <path d="M60 560 L60 120 Q150 90 240 120 L240 560Z" fill="#7a2f3a" ${ol}/><path d="M90 140 Q110 340 88 560 M150 120 Q170 340 150 560 M210 136 Q230 340 212 560" stroke="#5a1f2a" stroke-width="5" fill="none"/>
 <g transform="translate(1060 0)"><rect x="-110" y="150" width="220" height="410" fill="url(#skyE)" ${ol}/>${palm(40,560,.6)}<rect x="-110" y="150" width="220" height="410" fill="none" ${ol}/><rect x="-130" y="132" width="260" height="26" rx="6" fill="#efe2c4" ${ol}/></g>
 <rect y="560" width="1280" height="200" fill="#6e4a2e" ${sk(4)}/><path d="M300 600 L980 600 L1060 700 L220 700Z" fill="#8a3b2a" ${ol}/><path d="M300 600 L980 600 L1060 700 L220 700Z" fill="none" stroke="#e9a826" stroke-width="5" stroke-dasharray="3 14"/>
 ${torch(330,420,1)}${torch(800,420,1)}${jar(900,640,.75,'#a85a32')}
 ${put([['wife',{x:420,y:648,s:1.12,f:1}],['joseph',{x:1060,y:656,s:1.12,f:-1,coat:1}]])}
 ${cloak('cloakH',520,470,0)}`,
 run:async()=>{
  await narr('But Potiphar’s wife wanted Joseph to do a wicked thing with her.','',3800);
  walkTo('joseph',760,656,2400);await wait(2400,true);
  await narr('“But he refused…”','GENESIS 39:8 · KJV',2400);
  await say('joseph','…how then can I do this great wickedness, and sin against God?',{ref:'GENESIS 39:9'});
  await ask({tag:'Bible question',q:'How did Joseph answer her?',o:['He gave in, just once','He said nothing and stayed','He refused, because it would be sin against God'],a:2,
   yes:'Right! Joseph refused. He called it “…this great wickedness, and sin against God…”',ref:'Genesis 39:8–9'});
  await narr('“…as she spake to Joseph day by day… he hearkened not unto her…”','GENESIS 39:10 · KJV',4000);
  flip('joseph',1);walkTo('joseph',1060,656,1800);await wait(1900,true);flip('joseph',-1);
  await narr('One day “…Joseph went into the house to do his business; and there was none of the men of the house there within.”','GENESIS 39:11 · KJV',4800);
  walkTo('joseph',700,656,2000);await wait(2100,true);
  flip('joseph',1);pose('wife','reach');walkTo('wife',575,648,900);await wait(900,true);expr('joseph','surprised');
  await narr('“And she caught him by his garment…”','GENESIS 39:12 · KJV',2800);
  cap.innerHTML='Joseph would not sin against God. Tap to help him flee!';cap.classList.add('on');
  await tapOnce('Flee!','40%',8000);cap.classList.remove('on');
  cls('joseph','coat',0);const c=$('cloakH');c.style.opacity=1;c.style.transform='translate(640px,470px)';
  walkTo('joseph',1500,656,1500);addPts(50);pop('+50',50,30);pose('wife','hold');await wait(1500,true);
  await narr('“…and he left his garment in her hand, and fled, and got him out.”','GENESIS 39:12 · KJV',4200);
 }});

S({id:'lie',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyE)"/><circle cx="160" cy="210" r="70" fill="#ffd27a" ${ol}/>${cloud(120,.7,-25)}
 <rect x="320" y="150" width="960" height="430" fill="#efe2c4" ${ol}/><rect x="320" y="150" width="960" height="46" fill="url(#egW)" ${ol}/>${[420,620,1000,1200].map(x=>column(x,580,330,.8)).join('')}
 <rect x="740" y="300" width="180" height="280" rx="8" fill="#3a2614" ${ol}/><path d="M830 300 V580" stroke="#22160b" stroke-width="5"/>
 ${palm(150,620,.9)}<rect x="-40" y="580" width="1360" height="180" fill="${SAND[2]}" ${sk(4)}/><path d="M560 600 L1100 600 L1180 700 L480 700Z" fill="#e8d8b4" ${ol}/>
 <rect x="40" y="610" width="200" height="40" rx="18" fill="#4fb0e0" ${ol}/>
 ${put([['man1',{x:330,y:650,s:1.0,f:1}],['man2',{x:220,y:654,s:.98,f:1}],['wife',{x:560,y:652,s:1.12,f:1,pose:'hold'}],['potiphar',{x:1420,y:656,s:1.2,f:-1}],['guard',{x:1560,y:654,s:1.1,f:-1}],['joseph',{x:1700,y:658,s:1.1,f:-1,expr:'sad'}]])}
 ${cloak('cloakL',660,470,1)}`,
 run:async()=>{
  await narr('“And she laid up his garment by her, until his lord came home.”','GENESIS 39:16 · KJV',3800);
  walkTo('potiphar',800,656,2600);walkTo('guard',950,654,2800);await wait(2700,true);
  await say('wife','The Hebrew servant, which thou hast brought unto us, came in unto me to mock me…',{ref:'GENESIS 39:17'});
  await narr('But it was not true. Joseph had done nothing wrong.','',3200);
  expr('potiphar','angry');await narr('“…his wrath was kindled.”','GENESIS 39:19 · KJV',2800);
  await ask({tag:'Bible question',q:'What did Potiphar do to Joseph?',o:['He sent him back to Canaan','He put him into the prison','He sold him to the traders again'],a:1,
   yes:'Yes. “…Joseph’s master took him, and put him into the prison, a place where the king’s prisoners were bound…”',ref:'Genesis 39:20'});
  flip('guard',-1);walkTo('joseph',1080,658,2200);await wait(2300,true);
  ['guard','joseph'].forEach((id,i)=>{flip(id,1);walkTo(id,1500+i*140,id==='joseph'?658:654,2400)});await wait(2400,true);
 }});

S({id:'prison',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#brk)"/><rect width="1280" height="720" fill="#1a1020" opacity=".35"/>
 <g transform="translate(640 150)"><rect x="-90" y="-60" width="180" height="120" fill="#9fd4f2" ${ol}/>${[-54,-18,18,54].map(dx=>`<rect x="${dx-6}" y="-60" width="12" height="120" fill="#4a4048" ${sk(3)}/>`).join('')}<rect x="-90" y="-60" width="180" height="120" fill="none" ${ol}/></g>
 <g id="beam" class="beam"><polygon points="560,210 720,210 860,720 420,720" fill="url(#beamG)"/></g>
 <rect y="600" width="1280" height="160" fill="#3a2e27" ${sk(4)}/>${[[160,640],[1120,644],[900,650]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="70" ry="16" fill="#c9a24e" ${sk(3)}/><path d="M${x-50} ${y-6} l20 -14 m10 16 l18 -16 m10 14 l20 -12" stroke="#a07e30" stroke-width="4"/>`).join('')}
 ${torch(250,380,1)}${torch(1030,380,1)}
 <path d="M90 600 V470 Q90 440 120 440 H160" stroke="#4a4048" stroke-width="10" fill="none"/>
 ${put([['pris1',{x:300,y:650,s:1.0,f:1,expr:'sad'}],['pris2',{x:980,y:652,s:1.0,f:-1,expr:'sad'}],['joseph',{x:640,y:656,s:1.12,f:-1,expr:'sad'}],['keeper',{x:-160,y:654,s:1.14,f:1}]])}
 ${keys('keyP',430,470)}`,
 run:async()=>{
  await narr('“…and he was there in the prison.”','GENESIS 39:20 · KJV',3200);
  $('beam').classList.add('on');await wait(900,true);expr('joseph','smile');
  await narr('“But the LORD was with Joseph, and shewed him mercy, and gave him favour in the sight of the keeper of the prison.”','GENESIS 39:21 · KJV',5000);
  walkTo('keeper',470,654,2600);await wait(2700,true);
  pose('keeper','give');const k=$('keyP');k.style.opacity=1;await wait(300,true);k.style.transform='translate(580px,480px)';await wait(1100,true);pose('joseph','receive');pose('keeper','stand');
  await ask({tag:'Bible question',q:'What did the keeper of the prison put into Joseph’s hand?',o:['All the prisoners in the prison','Only the prison kitchen','The keys to Pharaoh’s palace'],a:0,
   yes:'Right! “…the keeper of the prison committed to Joseph’s hand all the prisoners that were in the prison…”',ref:'Genesis 39:22'});
  pose('joseph','stand');k.style.opacity=0;expr('pris1','smile');expr('pris2','smile');
  await narr('“…because the LORD was with him, and that which he did, the LORD made it to prosper.”','GENESIS 39:23 · KJV',4600);
  await narr('Even in the prison, God was with Joseph. His story was not over.','',3200);
 }});
//@@moments
