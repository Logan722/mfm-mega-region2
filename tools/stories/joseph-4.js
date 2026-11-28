//@@meta
{"ch":"joseph-4","name":"Joseph","num":4,"ctitle":"I Am Joseph","ref":"Genesis 42–45","min":8,"desc":"Play Joseph’s story from Genesis 42 to 45 as an animated storybook: the famine, the brothers bowing before the governor of Egypt, Simeon bound, Benjamin and the silver cup, Judah’s offer, and Joseph making himself known. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#c8312b','#e9a826','#2f6fd0','#2e9b57','#7a3fa0','#e8662a'];
const LOOK={
 joseph:{name:'Joseph',skin:'#c08a5f',robe:'#f6f1e4',sash:'#c9952c',hair:'#2a1a12',chainable:1,ringable:1},
 jacob:{name:'Jacob',age:1,brow:'#d8d2c6',skin:'#b9825a',robe:'#2f4f8f',sash:'#c9952c',wrap:'#efe3c8',band:'#6b4a2b',beard:'long',bc:'#ece8e0',staff:1},
 reuben:{name:'Reuben',skin:'#a87550',robe:'#8a3b2a',sash:'#3b2a1a',wrap:'#d9c9a3',band:'#3b2a1a',beard:'short',bc:'#24170f',cls:'b1'},
 judah:{name:'Judah',skin:'#9c6a47',robe:'#3e6b46',sash:'#c9952c',wrap:'#c9b78e',band:'#2a1d12',beard:'short',bc:'#1d130c',cls:'b2'},
 simeon:{name:'Simeon',skin:'#b07a52',robe:'#5b4a7a',sash:'#2a1d12',wrap:'#e2d6b8',band:'#4a3420',beard:'short',bc:'#2a1a10',cls:'b3'},
 levi:{name:'Levi',skin:'#a26f4b',robe:'#3d6f8a',sash:'#e9d9b0',wrap:'#d2c19a',band:'#2a1d12',beard:'short',bc:'#20150d',cls:'b4'},
 benjamin:{name:'Benjamin',skin:'#b98458',robe:'#c46a2b',sash:'#2f4f8f',wrap:'#efe3c8',band:'#8a5a2b',beard:'short',bc:'#2a1a12',cls:'b1'},
 steward:{name:'The steward',skin:'#9c6a47',robe:'#e7dcc4',sash:'#2f4f8f',wig:'#1d140f',collar:'#e9a826',cls:'b2'},
 guard:{name:'Guard',skin:'#8c5d3c',robe:'#d9c9a3',sash:'#2f4f8f',wig:'#241912',cls:'b3'}
};
const DEFS_X=`<linearGradient id="skyF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c78a"/><stop offset="1" stop-color="#fbe7bf"/></linearGradient>`;
const END={num:4,verse:'“Now therefore be not grieved, nor angry with yourselves, that ye sold me hither: for God did send me before you to preserve life.”',cite:'GENESIS 45:5 · KJV',
 q:'is there someone you find it hard to forgive?',a:['Yes, there is','Not right now'],
 r:['Joseph forgave the brothers who sold him, because he saw God’s hand in his story. Ask God for grace to forgive, and leave the past in His hands.','Keep your heart soft. When someone hurts you, remember Joseph: God can turn it for good.'],
 pray:'Father, give me a heart like Joseph’s, ready to forgive. Heal every wound in my family, and turn every evil plan against me into life and blessing, in the name of Jesus.',
 next:{ch:'joseph-5',label:'Chapter 5',title:'God Meant It unto Good',ready:1}};
//@@scenes
/* chapter 4 props */
const throne=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-70" y="-200" width="140" height="200" rx="12" fill="#e9a826" ${ol}/><rect x="-52" y="-180" width="104" height="120" rx="8" fill="#2f4f8f" ${ol}/><rect x="-86" y="-70" width="172" height="40" rx="8" fill="#c9952c" ${ol}/><path d="M-30 -150 L0 -120 L30 -150" stroke="#e9a826" stroke-width="7" fill="none"/></g>`;
const granary=(x,y,s=1,id)=>`<g ${id?`id="${id}"`:''} transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0 L-70 -110 Q-70 -200 0 -200 Q70 -200 70 -110 L70 0Z" fill="#e8d2a2" ${ol}/><path d="M-70 -110 H70" stroke="#c9a46e" stroke-width="6"/><rect x="-22" y="-70" width="44" height="70" rx="6" fill="#5a3d22" ${ol}/><rect x="-16" y="-170" width="32" height="22" rx="4" fill="#5a3d22" ${sk(3)}/></g>`;
const ass=(id,x,y,f=1,s=1)=>`<g id="${id}" transform="translate(${x} ${y}) scale(${f*s} ${s})"><rect x="-58" y="-92" width="104" height="46" rx="22" fill="#9a8f80" ${ol}/><path d="M38 -84 Q70 -96 74 -128 L90 -126 Q92 -92 56 -66Z" fill="#9a8f80" ${ol}/><path d="M76 -128 L80 -150 L88 -130Z" fill="#7d7466" ${sk(3)}/><circle cx="82" cy="-118" r="3.5" fill="${OL}"/>${[-44,-24,22,36].map(a=>`<rect x="${a}" y="-52" width="10" height="52" rx="4" fill="#7d7466" ${sk(3)}/>`).join('')}<rect x="-42" y="-112" width="70" height="30" rx="8" fill="#c9a46e" ${ol}/><path d="M-30 -112 V-82 M14 -112 V-82" stroke="#8a6a3e" stroke-width="4"/></g>`;
const sackC=(id,x,y,s=1,mark)=>`<g id="${id}" transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0 Q-38 -46 -22 -70 Q-30 -82 -18 -86 L18 -86 Q30 -82 22 -70 Q38 -46 30 0Z" fill="#d9b77a" ${ol}/><path d="M-20 -72 Q0 -64 20 -72" stroke="#8a6a3e" stroke-width="5" fill="none"/>${mark?`<g class="cupI" style="opacity:0;transition:opacity .4s"><path d="M-14 -108 H14 L10 -86 Q0 -78 -10 -86Z" fill="#dfe6ee" ${sk(3)}/><rect x="-3" y="-86" width="6" height="12" fill="#dfe6ee" ${sk(2)}/><ellipse cx="0" cy="-72" rx="12" ry="4" fill="#dfe6ee" ${sk(2)}/></g>`:''}</g>`;
const dish=(id,x,y,big)=>`<g id="${id}" transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="${big?46:30}" ry="${big?14:10}" fill="#e9a826" ${sk(3)}/>${big?[-26,-12,2,16,30].map((a,i)=>`<circle cx="${a}" cy="${-12-(i%2)*6}" r="10" fill="${['#c8312b','#7a3fa0','#e9b45f','#2e9b57','#e8662a'][i]}" ${sk(2.4)}/>`).join(''):`<circle cx="-8" cy="-9" r="9" fill="#e9b45f" ${sk(2.4)}/><circle cx="9" cy="-8" r="8" fill="#c8312b" ${sk(2.4)}/>`}</g>`;

S({id:'canaan',focus:600,draw:()=>`<rect width="1280" height="720" fill="url(#skyF)"/>${sun(1080,130)}${hills(DRY,650)}
 ${tent(250,560,.55)}${tent(110,640)}${acacia(1180,610,.8)}${rocks(860,646,.8)}${[0,1,2,3,4,5,6,7,8].map(i=>`<path d="M${320+i*90} 660 l-4 -14 M${330+i*90} 660 l6 -12" stroke="#9c7a44" stroke-width="4" stroke-linecap="round"/>`).join('')}
 ${put([['jacob',{x:330,y:656,s:1.28,f:1}],['benjamin',{x:200,y:654,s:1.04,f:1}],['reuben',{x:640,y:650,s:1.08,f:-1}],['judah',{x:760,y:648,s:1.06,f:-1}],['simeon',{x:880,y:646,s:1.02,f:-1}],['levi',{x:990,y:646,s:1.0,f:-1}]])}
 ${ass('assA',1120,650,-1,.9)}`,
 run:async()=>{
  expr('jacob','sad');['reuben','judah','simeon','levi'].forEach(id=>expr(id,'sad'));
  await narr('“…for the famine was in the land of Canaan.”','GENESIS 42:5 · KJV',3200);
  await narr('“Now when Jacob saw that there was corn in Egypt, Jacob said unto his sons, Why do ye look one upon another?”','GENESIS 42:1 · KJV',4800);
  pose('jacob','point');await say('jacob','Behold, I have heard that there is corn in Egypt: get you down thither, and buy for us from thence; that we may live, and not die.',{ref:'GENESIS 42:2'});pose('jacob','stand');
  await ask({tag:'Bible question',q:'Why did Jacob send his sons down to Egypt?',o:['To look for Joseph','To buy corn, because of the famine','To sell their sheep and goats'],a:1,
   yes:'Right! “…there is corn in Egypt: get you down thither, and buy for us from thence; that we may live, and not die.”',ref:'Genesis 42:2'});
  ['reuben','judah','simeon','levi'].forEach((id,i)=>{flip(id,1);walkTo(id,1420+i*110,650,3600);});
  await narr('“And Joseph’s ten brethren went down to buy corn in Egypt.”','GENESIS 42:3 · KJV',3600);
  pose('jacob','hold');expr('benjamin','sad');
  await narr('“But Benjamin, Joseph’s brother, Jacob sent not with his brethren; for he said, Lest peradventure mischief befall him.”','GENESIS 42:4 · KJV',5200,300);
  pose('jacob','stand');
 }});

S({id:'bow',focus:680,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(160,110)}${cloud(150,.7,-30)}
 ${pyramid(1150,470,.55)}<rect x="-40" y="468" width="1360" height="20" fill="#cdb27a" ${sk(3)}/>
 ${granary(170,560,.85)}${granary(320,560,.72)}${granary(1180,560,.8)}${palm(1060,566,.5)}
 <rect x="-40" y="556" width="1360" height="204" fill="${SAND[0]}" ${sk(4)}/>${dais(880,600,300)}${throne(920,602)}${column(1250,640,420,.85)}
 ${put([['steward',{x:770,y:612,s:1.0,f:-1}],['joseph',{x:920,y:606,s:1.16,f:-1,chain:1,ring:1}],['guard',{x:1080,y:608,s:1.04,f:-1}],['reuben',{x:-120,y:660,s:1.08,f:1}],['judah',{x:-230,y:662,s:1.06,f:1}],['simeon',{x:-340,y:664,s:1.02,f:1}],['levi',{x:-450,y:666,s:1.0,f:1}]])}`,
 run:async()=>{
  const B=['reuben','judah','simeon','levi'];B.forEach((id,i)=>walkTo(id,590-i*135,660+i*2,3600));
  await narr('“And Joseph was the governor over the land, and he it was that sold to all the people of the land…”','GENESIS 42:6 · KJV',4600);
  B.forEach((id,i)=>{place(id,590-i*135,660+i*2,.84);cls(id,'bowR',1);pose(id,'pray');});expr('joseph','surprised');
  await narr('“…and Joseph’s brethren came, and bowed down themselves before him with their faces to the earth.”','GENESIS 42:6 · KJV',4600);
  await narr('“And Joseph knew his brethren, but they knew not him.”','GENESIS 42:8 · KJV',3400);
  await ask({tag:'Bible question',q:'When his brothers bowed down to him, what did Joseph remember?',o:['The dreams he had dreamed of them','The price they sold him for','The words of Pharaoh’s butler'],a:0,
   yes:'Right! “And Joseph remembered the dreams which he dreamed of them…”',ref:'Genesis 42:9'});
  B.forEach((id,i)=>{place(id,590-i*135,660+i*2,1);cls(id,'bowR',0);pose(id,'stand');});expr('joseph','neutral');
  await say('joseph','Whence come ye?',{ref:'GENESIS 42:7'});
  await say('reuben','From the land of Canaan to buy food.',{ref:'GENESIS 42:7'});
  pose('joseph','point');await say('joseph','Ye are spies; to see the nakedness of the land ye are come.',{ref:'GENESIS 42:9'});pose('joseph','stand');
  B.forEach(id=>expr(id,'surprised'));
  await say('judah','Thy servants are twelve brethren, the sons of one man in the land of Canaan; and, behold, the youngest is this day with our father, and one is not.',{ref:'GENESIS 42:13'});
 }});

S({id:'guilty',focus:640,draw:()=>`<rect width="1280" height="720" fill="#e9d6ae"/><rect width="1280" height="70" fill="url(#egW)"/><path d="M0 70 H1280" stroke="${OL}" stroke-width="5"/>
 <rect x="0" y="70" width="1280" height="490" fill="#c9952c" opacity=".1"/>${column(80,600,450)}${column(1200,600,450)}
 <rect y="560" width="1280" height="200" fill="#c9a46e" ${sk(4)}/><path d="M0 612 H1280 M0 676 H1280" stroke="#b58f5a" stroke-width="4"/>
 ${sackC('sk1',300,640,.9)}${sackC('sk2',410,644,.9)}${sackC('sk3',520,646,.9)}${sackC('sk4',630,648,.9)}
 ${put([['joseph',{x:1020,y:650,s:1.14,f:-1,chain:1,ring:1}],['guard',{x:1150,y:648,s:1.04,f:-1}],['reuben',{x:740,y:652,s:1.08,f:-1,expr:'sad'}],['judah',{x:300,y:656,s:1.06,f:1,expr:'sad'}],['simeon',{x:470,y:656,s:1.02,f:1,expr:'sad'}],['levi',{x:600,y:658,s:1.0,f:1,expr:'sad'}]])}`,
 run:async()=>{
  ['sk1','sk2','sk3','sk4'].forEach(id=>$(id).style.opacity=0);
  await say('judah','We are verily guilty concerning our brother, in that we saw the anguish of his soul, when he besought us, and we would not hear; therefore is this distress come upon us.',{name:'The brothers, to one another',ref:'GENESIS 42:21'});
  await say('reuben','Spake I not unto you, saying, Do not sin against the child; and ye would not hear?',{ref:'GENESIS 42:22'});
  flip('joseph',1);expr('joseph','sad');
  await narr('“And he turned himself about from them, and wept…”','GENESIS 42:24 · KJV',3600,1020);
  flip('joseph',-1);expr('joseph','neutral');walkTo('guard',560,650,2200);await wait(2200,true);
  walkTo('simeon',1240,656,3000);walkTo('guard',1320,650,3000);
  await narr('“…and returned to them again, and communed with them, and took from them Simeon, and bound him before their eyes.”','GENESIS 42:24 · KJV',5000);
  await ask({tag:'Bible question',q:'Which brother did Joseph keep bound in Egypt?',o:['Reuben','Simeon','Benjamin'],a:1,
   yes:'Right! He “took from them Simeon, and bound him before their eyes.”',ref:'Genesis 42:24'});
  ['sk1','sk2','sk3','sk4'].forEach(id=>{const e=$(id);e.style.transition='opacity .4s';});
  await tapGame({ids:['sk1','sk2','sk3','sk4'],hint:'Joseph commanded to fill their sacks with corn: tap each sack to fill it.',fx:470,
   onTap:(el)=>{el.style.opacity=1;burstAt(+el.getAttribute('transform').match(/translate\(([\d.]+)/)[1],600)}});
  await narr('“Then Joseph commanded to fill their sacks with corn, and to restore every man’s money into his sack, and to give them provision for the way…”','GENESIS 42:25 · KJV',5600);
 }});

S({id:'feast',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#lampG)"/>
 <rect x="0" y="0" width="1280" height="560" fill="#a86a4a" opacity=".45"/><rect width="1280" height="60" fill="url(#egW)" opacity=".9"/><path d="M0 60 H1280" stroke="${OL}" stroke-width="5"/>
 ${lamp(120,560,1.1)}${lamp(1160,560,1.1)}<rect y="560" width="1280" height="200" fill="#b98a5a" ${sk(4)}/>
 ${put([['joseph',{x:1180,y:656,s:1.14,f:-1,chain:1,ring:1}],['steward',{x:1260,y:654,s:1.0,f:-1}],['reuben',{x:300,y:650,s:1.0,f:1}],['judah',{x:450,y:650,s:.98,f:1}],['simeon',{x:600,y:650,s:.96,f:1}],['levi',{x:750,y:650,s:.96,f:1}],['benjamin',{x:920,y:650,s:.98,f:1}]])}
 <rect x="170" y="594" width="920" height="26" rx="8" fill="#8a5a35" ${ol}/><path d="M180 606 H1080" stroke="#6b4428" stroke-width="4"/><rect x="200" y="620" width="18" height="90" fill="#8a5a35" ${sk(3)}/><rect x="1042" y="620" width="18" height="90" fill="#8a5a35" ${sk(3)}/>
 ${dish('d1',300,590)}${dish('d2',450,590)}${dish('d3',600,590)}${dish('d4',750,590)}${dish('d5',920,586,1)}`,
 run:async()=>{
  ['d1','d2','d3','d4','d5'].forEach(id=>{const e=$(id);e.style.opacity=0;e.style.transition='opacity .4s';});
  await narr('“And the men took that present, and they took double money in their hand, and Benjamin; and rose up, and went down to Egypt, and stood before Joseph.”','GENESIS 43:15 · KJV',5600);
  expr('joseph','smile');
  await say('joseph','Is this your younger brother, of whom ye spake unto me? …God be gracious unto thee, my son.',{ref:'GENESIS 43:29'});
  expr('joseph','sad');flip('joseph',1);walkTo('joseph',1420,656,1800);
  await narr('“And Joseph made haste; for his bowels did yearn upon his brother: and he sought where to weep; and he entered into his chamber, and wept there.”','GENESIS 43:30 · KJV',5600);
  flip('joseph',-1);expr('joseph','neutral');walkTo('joseph',1140,656,1800);await wait(1800,true);
  await say('joseph','Set on bread.',{ref:'GENESIS 43:31'});
  for(const id of ['d1','d2','d3','d4','d5']){$(id).style.opacity=1;await wait(450,true);}
  ['reuben','judah','simeon','levi','benjamin'].forEach(id=>expr(id,'happy'));
  await narr('“…but Benjamin’s mess was five times so much as any of theirs. And they drank, and were merry with him.”','GENESIS 43:34 · KJV',5000);
 }});

S({id:'cup',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1100,120)}${cloud(120,.8,-10)}
 ${pyramid(180,470,.6)}<rect x="-40" y="468" width="1360" height="20" fill="#cdb27a" ${sk(3)}/>${palm(60,500,.5)}${palm(1220,500,.55)}
 <rect x="-40" y="486" width="1360" height="274" fill="${SAND[0]}" ${sk(4)}/>${road(600,'#e8d8b4')}
 ${sackC('c1',300,662,.85)}${sackC('c2',420,664,.85)}${sackC('c3',540,666,.85)}${sackC('c4',660,668,.85)}${sackC('c5',780,670,.85,1)}
 ${put([['reuben',{x:300,y:620,s:.95,f:1}],['judah',{x:420,y:622,s:.94,f:1}],['simeon',{x:540,y:624,s:.92,f:1}],['levi',{x:660,y:626,s:.92,f:1}],['benjamin',{x:780,y:628,s:.92,f:1}],['steward',{x:1400,y:640,s:1.02,f:-1}]])}`,
 run:async()=>{
  await narr('“And put my cup, the silver cup, in the sack’s mouth of the youngest, and his corn money…”','GENESIS 44:2 · KJV',4600);
  walkTo('steward',960,640,3000);await wait(3000,true);
  await say('steward','Wherefore have ye rewarded evil for good?',{ref:'GENESIS 44:4'});
  ['reuben','judah','simeon','levi','benjamin'].forEach(id=>expr(id,'surprised'));
  await tapGame({ids:['c1','c2','c3','c4','c5'],hint:'The steward searched, beginning at the eldest and leaving at the youngest: tap each sack to search it.',fx:540,
   onTap:(el,n)=>{flick(el.id);if(n===5){$('c5').querySelector('.cupI').style.opacity=1;burstAt(780,560);}}});
  ['reuben','judah','simeon','levi','benjamin'].forEach(id=>expr(id,'sad'));
  await narr('“…and the cup was found in Benjamin’s sack. Then they rent their clothes, and laded every man his ass, and returned to the city.”','GENESIS 44:12–13 · KJV',5600);
 }});

S({id:'reveal',focus:640,draw:()=>`<rect width="1280" height="720" fill="#efe2c4"/><rect width="1280" height="80" fill="url(#egW)"/><path d="M0 80 H1280" stroke="${OL}" stroke-width="5"/>
 <rect x="0" y="80" width="1280" height="480" fill="#c9952c" opacity=".12"/>${column(110,600,440,.92)}${column(1170,600,440,.92)}
 <rect y="560" width="1280" height="200" fill="#d9c49a" ${sk(4)}/><path d="M260 600 L1020 600 L1090 700 L190 700Z" fill="#2f4f8f" opacity=".85" ${ol}/>
 ${put([['joseph',{x:760,y:652,s:1.16,f:-1,chain:1,ring:1}],['guard',{x:960,y:650,s:1.04,f:-1}],['steward',{x:1060,y:650,s:1.0,f:-1}],['benjamin',{x:560,y:656,s:1.0,f:1}],['judah',{x:450,y:656,s:1.06,f:1}],['reuben',{x:340,y:656,s:1.08,f:1}],['levi',{x:230,y:658,s:1.0,f:1}],['simeon',{x:130,y:658,s:1.02,f:1}]])}
 <g id="glow" class="beam"><rect width="1280" height="720" fill="#ffe08a" opacity=".2"/>${[[300,300],[560,220],[760,330],[980,240],[640,470]].map(([x,y])=>glint(x,y)).join('')}</g>`,
 run:async()=>{
  ['judah','reuben','levi','simeon','benjamin'].forEach(id=>expr(id,'sad'));
  await narr('“And Judah and his brethren came to Joseph’s house; for he was yet there: and they fell before him on the ground.”','GENESIS 44:14 · KJV',5200);
  pose('judah','pray');
  await say('judah','Now therefore, I pray thee, let thy servant abide instead of the lad a bondman to my lord; and let the lad go up with his brethren.',{name:'Judah, to Joseph',ref:'GENESIS 44:33'});
  await say('judah','For how shall I go up to my father, and the lad be not with me?',{ref:'GENESIS 44:34'});pose('judah','stand');
  await ask({tag:'Bible question',q:'What did Judah offer to do for Benjamin?',o:['Run away with him in the night','Stay as a bondman in Benjamin’s place','Pay twice the price of the cup'],a:1,
   yes:'Right! Judah said: “let thy servant abide instead of the lad a bondman to my lord; and let the lad go up with his brethren.”',ref:'Genesis 44:33'});
  pose('joseph','point');
  await narr('“Then Joseph could not refrain himself before all them that stood by him; and he cried, Cause every man to go out from me.”','GENESIS 45:1 · KJV',5200);
  pose('joseph','stand');flip('guard',1);flip('steward',1);walkTo('guard',1420,650,2400);walkTo('steward',1520,650,2600);
  expr('joseph','sad');
  await narr('“And he wept aloud: and the Egyptians and the house of Pharaoh heard.”','GENESIS 45:2 · KJV',3800);
  expr('joseph','happy');pose('joseph','reach');
  await say('joseph','I am Joseph; doth my father yet live?',{ref:'GENESIS 45:3'});
  ['benjamin','judah','reuben','levi','simeon'].forEach(id=>expr(id,'surprised'));
  await narr('“And his brethren could not answer him; for they were troubled at his presence.”','GENESIS 45:3 · KJV',3800);
  await say('joseph','Come near to me, I pray you. …I am Joseph your brother, whom ye sold into Egypt.',{ref:'GENESIS 45:4'});
  ['benjamin','judah','reuben','levi','simeon'].forEach((id,i)=>walkTo(id,640-i*95,656,1400));
  await say('joseph','Now therefore be not grieved, nor angry with yourselves, that ye sold me hither: for God did send me before you to preserve life.',{ref:'GENESIS 45:5'});
  await ask({tag:'Bible question',q:'Who did Joseph say had sent him to Egypt?',o:['His brothers, who sold him','The Ishmeelite traders','God'],a:2,
   yes:'Right! “So now it was not you that sent me hither, but God…”',ref:'Genesis 45:8'});
  $('glow').classList.add('on');pose('joseph','joy');expr('benjamin','happy');burst();
  await narr('“And he fell upon his brother Benjamin’s neck, and wept; and Benjamin wept upon his neck.”','GENESIS 45:14 · KJV',4400);
  ['judah','reuben','levi','simeon'].forEach(id=>expr(id,'happy'));pose('joseph','stand');
  await narr('“Moreover he kissed all his brethren, and wept upon them: and after that his brethren talked with him.”','GENESIS 45:15 · KJV',4600);
  pose('joseph','point');
  await say('joseph','Haste ye, and go up to my father, and say unto him, Thus saith thy son Joseph, God hath made me lord of all Egypt: come down unto me, tarry not.',{ref:'GENESIS 45:9'});
  pose('joseph','stand');
 }});
//@@moments
