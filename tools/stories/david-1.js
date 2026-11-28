//@@meta
{"ch":"david-1","name":"David","num":1,"ctitle":"The Shepherd Boy Is Chosen","ref":"1 Samuel 16","min":7,"desc":"Play David’s story from 1 Samuel 16 as an animated storybook: Samuel goes to Jesse’s house in Beth-lehem, the LORD looks on the heart, the shepherd boy is anointed, and David plays the harp for King Saul. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#c8312b','#e9a826','#2f6fd0','#2e9b57','#7a3fa0','#e8662a'];
const LOOK={
 david:{name:'David',skin:'#c98a5e',robe:'#c8a36a',sash:'#7a5230',hair:'#6b2e16',cls:'b1'},
 samuel:{name:'Samuel',age:1,brow:'#e6e2da',skin:'#b07a52',robe:'#5a3e6e',sash:'#c9952c',wrap:'#efe3c8',band:'#5a3e6e',beard:'long',bc:'#eceae4',staff:1},
 jesse:{name:'Jesse',age:1,brow:'#d8d2c6',skin:'#a87550',robe:'#3e6b46',sash:'#c9952c',wrap:'#e2d6b8',band:'#3b2a1a',beard:'long',bc:'#cfc8bb'},
 eliab:{name:'Eliab',skin:'#a26f4b',robe:'#8a3b2a',sash:'#e9d9b0',wrap:'#d2c19a',band:'#2a1d12',beard:'short',bc:'#20150d',cls:'b2'},
 abinadab:{name:'Abinadab',skin:'#b07a52',robe:'#2f4f8f',sash:'#e9a826',wrap:'#d9c9a3',band:'#3b2a1a',beard:'short',bc:'#2a1a10',cls:'b3'},
 shammah:{name:'Shammah',skin:'#9c6a47',robe:'#7a3fa0',sash:'#e9d9b0',wrap:'#c9b78e',band:'#2a1d12',beard:'short',bc:'#1d130c',cls:'b4'},
 elder:{name:'An elder of Beth-lehem',age:1,brow:'#d8d2c6',skin:'#9a6844',robe:'#8a6a3e',sash:'#3b2a1a',wrap:'#bfb39a',band:'#5a4026',beard:'long',bc:'#d8d2c6',cls:'b2'},
 saul:{name:'King Saul',skin:'#a87550',robe:'#7a1f2a',sash:'#e9a826',hair:'#2a1a10',crown:1,beard:'short',bc:'#2a1a10',cls:'b3'},
 servant:{name:'One of Saul’s servants',skin:'#b78457',robe:'#d9c9a3',sash:'#2f4f8f',wrap:'#e7dcc4',band:'#5a4026',cls:'b4'}
};
const DEFS_X=`<radialGradient id="godL" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#fff6d0" stop-opacity=".95"/><stop offset=".5" stop-color="#ffe08a" stop-opacity=".45"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>`;
const END={num:1,verse:'“…for man looketh on the outward appearance, but the LORD looketh on the heart.”',cite:'1 SAMUEL 16:7 · KJV',
 q:'do you ever feel too small or too young for God to use?',a:['Yes, sometimes','No, I know God can use me'],
 r:['David was the youngest, out with the sheep, and nobody thought to call him. But God had already chosen him. God looks on your heart.','Then stay faithful in the small things, as David was with the sheep. God sees, and He lifts up in His time.'],
 pray:'Father, You look on the heart. Make my heart right before You, fill me with Your Spirit as You filled David, and use me for Your glory, in the name of Jesus.',
 next:{ch:'david-2',label:'Chapter 2',title:'David and Goliath',ready:1}};
//@@scenes
/* David chapter 1 props */
const horn=(id,x,y,show)=>`<g id="${id}" style="opacity:${show?1:0};transition:transform 1s cubic-bezier(.45,.05,.25,1),opacity .4s;transform:translate(${x}px,${y}px)"><path d="M-30 10 Q-34 -26 6 -40 Q30 -46 34 -30 Q14 -26 4 -8 Q-4 8 -14 16Z" fill="#e8d2a2" ${ol}/><path d="M-22 4 Q-20 -18 4 -28 M-12 10 Q-8 -8 10 -18" stroke="#b8925c" stroke-width="3" fill="none"/><ellipse cx="34" cy="-32" rx="6" ry="9" fill="#5a3d22" ${sk(2)}/></g>`;
const oil=(id)=>`<g id="${id}" style="opacity:0;transition:opacity .5s">${[0,1,2].map(i=>`<path class="drop" d="M0 ${-8+i*22} Q-7 ${4+i*22} 0 ${10+i*22} Q7 ${4+i*22} 0 ${-8+i*22}Z" fill="#e9b42a" ${sk(2)}/>`).join('')}</g>`;
const harp=(id,x,y,s=1)=>`<g id="${id}"><g transform="translate(${x} ${y}) scale(${s})"><path d="M-34 0 Q-46 -70 -20 -110 L-8 -104 Q-30 -66 -20 0Z" fill="#a0703c" ${ol}/><path d="M34 0 Q46 -70 20 -110 L8 -104 Q30 -66 20 0Z" fill="#a0703c" ${ol}/><rect x="-30" y="-120" width="60" height="16" rx="6" fill="#7a5230" ${ol}/><rect x="-38" y="-8" width="76" height="18" rx="6" fill="#7a5230" ${ol}/>${[-14,-5,4,13].map(a=>`<path d="M${a} -104 V-8" stroke="#f3e3b5" stroke-width="2.5"/>`).join('')}</g></g>`;
const note=(id,x,y)=>`<g id="${id}" style="opacity:0;transform:translate(${x}px,${y}px);transition:transform 1.6s ease-out,opacity .6s"><path d="M0 0 V-34 L18 -40 V-8" stroke="${OL}" stroke-width="4" fill="none"/><ellipse cx="-5" cy="2" rx="8" ry="6" fill="#ffd23f" ${sk(3)}/><ellipse cx="13" cy="-6" rx="8" ry="6" fill="#ffd23f" ${sk(3)}/></g>`;
const house=(x,y,s=1,c='#e2c48e')=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-130" width="180" height="130" fill="${c}" ${ol}/><rect x="-100" y="-146" width="200" height="22" rx="4" fill="${shade(c,-30)}" ${ol}/><rect x="-24" y="-74" width="48" height="74" rx="20" fill="#5a3d22" ${ol}/><rect x="40" y="-108" width="30" height="28" rx="4" fill="#3b2a1a" ${sk(3)}/></g>`;
const voice=(id)=>`<g id="${id}" style="opacity:0;transition:opacity 1.4s"><ellipse cx="640" cy="200" rx="560" ry="330" fill="url(#godL)"/>${[...Array(9)].map((_,i)=>`<path d="M640 -40 L${360+i*70} 760" stroke="#fff1b8" stroke-width="10" opacity=".18"/>`).join('')}</g>`;

S({id:'ramah',focus:620,draw:()=>`<rect width="1280" height="720" fill="url(#skyE)"/>${sun(1060,170)}${cloud(120,.8,-20)}${hills(EVE,650)}${house(300,650,.9)}${house(1080,650,.8,'#d9b77a')}${tree(860,640,.8)}
 ${voice('vc')}${put([['samuel',{x:620,y:656,s:1.24,f:1,expr:'sad'}]])}${horn('hornA',740,520,0)}`,
 run:async()=>{
  $('vc').style.opacity=1;pose('samuel','pray');
  await narr('“And the LORD said unto Samuel, How long wilt thou mourn for Saul, seeing I have rejected him from reigning over Israel?”','1 SAMUEL 16:1 · KJV',5600);
  await narr('“…fill thine horn with oil, and go, I will send thee to Jesse the Beth-lehemite: for I have provided me a king among his sons.”','1 SAMUEL 16:1 · KJV',5600);
  $('hornA').style.opacity=1;pose('samuel','hold');expr('samuel','neutral');$('vc').style.opacity=.3;
  $('hornA').style.opacity=0;pose('samuel','stand');flip('samuel',1);walkTo('samuel',1500,656,3600);
  await narr('“And Samuel did that which the LORD spake, and came to Beth-lehem.”','1 SAMUEL 16:4 · KJV',3800);
 }});

S({id:'sons',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1100,120)}${cloud(150,.8,-30)}${hills(DAY,650)}${house(170,650,1)}${house(1150,650,.85,'#d9b77a')}${well(380,650,.7)}
 ${voice('vc')}${put([['samuel',{x:-140,y:660,s:1.24,f:1}],['elder',{x:520,y:656,s:1.1,f:-1}],['jesse',{x:830,y:658,s:1.18,f:-1}],['eliab',{x:960,y:654,s:1.18,f:-1}],['abinadab',{x:1060,y:654,s:1.08,f:-1}],['shammah',{x:1160,y:654,s:1.06,f:-1}]])}`,
 run:async()=>{
  walkTo('samuel',360,660,3000);expr('elder','surprised');await wait(3000,true);
  await say('elder','Comest thou peaceably?',{name:'The elders of the town',ref:'1 SAMUEL 16:4'});
  await say('samuel','Peaceably: I am come to sacrifice unto the LORD: sanctify yourselves, and come with me to the sacrifice.',{ref:'1 SAMUEL 16:5'});
  expr('elder','smile');flip('elder',1);walkTo('elder',-160,656,3000);
  walkTo('eliab',600,656,1800);await wait(1800,true);pose('samuel','point');
  await narr('“…he looked on Eliab, and said, Surely the LORD’s anointed is before him.”','1 SAMUEL 16:6 · KJV',4200);
  pose('samuel','stand');$('vc').style.opacity=1;
  await narr('“But the LORD said unto Samuel, Look not on his countenance, or on the height of his stature; because I have refused him…”','1 SAMUEL 16:7 · KJV',5600);
  await narr('“…for man looketh on the outward appearance, but the LORD looketh on the heart.”','1 SAMUEL 16:7 · KJV',4600);
  await ask({tag:'Bible question',q:'What does the LORD look on?',o:['The height of a man','The outward appearance','The heart'],a:2,
   yes:'Right! “…man looketh on the outward appearance, but the LORD looketh on the heart.”',ref:'1 Samuel 16:7'});
  $('vc').style.opacity=0;walkTo('eliab',960,654,1600);
  await tapGame({ids:['mv-eliab','mv-abinadab','mv-shammah'],hint:'“Jesse made seven of his sons to pass before Samuel”: tap each son as he passes by.',fx:760,
   onTap:(el)=>{const id=el.id.slice(3);walkTo(id,560,656,900);setTimeout(()=>walkTo(id,{eliab:960,abinadab:1060,shammah:1160}[id],654,900),950)}});
  await say('samuel','The LORD hath not chosen these.',{ref:'1 SAMUEL 16:10'});
  await say('samuel','Are here all thy children?',{ref:'1 SAMUEL 16:11'});
  await say('jesse','There remaineth yet the youngest, and, behold, he keepeth the sheep.',{ref:'1 SAMUEL 16:11'});
  await ask({tag:'Bible question',q:'Where was David, the youngest son, when Samuel came?',o:['Asleep in the house','Out keeping the sheep','At the king’s palace'],a:1,
   yes:'Right! “There remaineth yet the youngest, and, behold, he keepeth the sheep.”',ref:'1 Samuel 16:11'});
  await say('samuel','Send and fetch him: for we will not sit down till he come hither.',{ref:'1 SAMUEL 16:11'});
 }});

S({id:'anoint',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(160,120)}${cloud(120,.7,-10)}${hills(DAY,650)}${flock([[1080,610,.8],[1130,620,.76],[1040,624,.72],[1180,630,.7]])}${tree(120,640,.9)}
 ${put([['samuel',{x:520,y:660,s:1.24,f:1}],['jesse',{x:300,y:658,s:1.16,f:1}],['eliab',{x:190,y:654,s:1.16,f:1}],['abinadab',{x:90,y:654,s:1.08,f:1}],['david',{x:1240,y:660,s:1.02,f:-1,expr:'smile'}]])}
 ${horn('hornB',600,500,0)}<g transform="translate(700 420)">${oil('oilB')}</g>
 <g id="glow" class="beam"><rect width="1280" height="720" fill="#ffe08a" opacity=".24"/>${[[560,260],[700,200],[820,300],[660,380],[760,460]].map(([x,y])=>glint(x,y)).join('')}</g>`,
 run:async()=>{
  walkTo('david',720,660,3400);
  await narr('“And he sent, and brought him in. Now he was ruddy, and withal of a beautiful countenance, and goodly to look to.”','1 SAMUEL 16:12 · KJV',5400,700);
  await narr('“And the LORD said, Arise, anoint him: for this is he.”','1 SAMUEL 16:12 · KJV',3800);
  pose('samuel','give');const h=$('hornB');h.style.opacity=1;await wait(300,true);h.style.transform='translate(690px,370px) rotate(40deg)';await wait(900,true);
  $('oilB').style.opacity=1;await wait(1300,true);$('oilB').style.opacity=0;h.style.opacity=0;pose('samuel','stand');
  $('glow').classList.add('on');expr('david','happy');burst();
  await narr('“Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward.”','1 SAMUEL 16:13 · KJV',6400,700);
  await ask({tag:'Bible question',q:'What came upon David from the day he was anointed?',o:['A crown of gold','The Spirit of the LORD','A great fear'],a:1,
   yes:'Right! “…the Spirit of the LORD came upon David from that day forward.”',ref:'1 Samuel 16:13'});
 }});

S({id:'harp',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#lampG)"/>
 <rect x="0" y="0" width="1280" height="560" fill="#5a3427" opacity=".5"/>${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<rect x="${i*128}" y="70" width="10" height="490" fill="#3b2418" opacity=".45"/>`).join('')}
 ${lamp(130,560,1.1)}${lamp(1150,560,1.1)}<rect y="560" width="1280" height="200" fill="#8a6a4a" ${sk(4)}/><path d="M240 610 L1040 610 L1110 700 L170 700Z" fill="#7a1f2a" opacity=".85" ${ol}/>
 ${dais(920,584,300)}${put([['saul',{x:920,y:584,s:1.2,f:-1,expr:'sad'}],['servant',{x:640,y:656,s:1.04,f:1}],['david',{x:-140,y:660,s:1.02,f:1}]])}
 ${harp('harpA',-200,600,.9)}${note('n1',520,460)}${note('n2',560,440)}${note('n3',600,470)}${note('n4',640,450)}`,
 run:async()=>{
  pose('saul','hold');
  await narr('“But the Spirit of the LORD departed from Saul, and an evil spirit from the LORD troubled him.”','1 SAMUEL 16:14 · KJV',5200,900);
  flip('servant',-1);pose('servant','point');
  await say('servant','Behold, I have seen a son of Jesse the Beth-lehemite, that is cunning in playing, and a mighty valiant man… and the LORD is with him.',{ref:'1 SAMUEL 16:18'});
  pose('servant','stand');flip('servant',1);walkTo('servant',1100,656,2400);
  walkTo('david',560,660,3200);const hp=$('harpA');hp.style.transition='transform 3.2s linear';hp.style.transform='translate(800px,0)';
  await narr('“And David came to Saul, and stood before him: and he loved him greatly; and he became his armourbearer.”','1 SAMUEL 16:21 · KJV',5000,700);
  await ask({tag:'Bible question',q:'What did David become for King Saul?',o:['His cook','His armourbearer','The captain of his army'],a:1,
   yes:'Right! “…he loved him greatly; and he became his armourbearer.”',ref:'1 Samuel 16:21'});
  pose('david','hold');['n1','n2','n3','n4'].forEach(id=>$(id).style.opacity=.7);
  await tapGame({ids:['n1','n2','n3','n4'],hint:'David took an harp, and played with his hand: tap each note to play for the king.',fx:720,
   onTap:(el)=>{el.style.opacity=1;el.style.transition='transform 1.6s ease-out,opacity .6s';const m=el.style.transform.match(/translate\(([\d.]+)px, *([\d.]+)px\)/);el.style.transform=`translate(${+m[1]+260}px,${+m[2]-120}px)`;setTimeout(()=>el.style.opacity=0,1200)}});
  expr('saul','smile');pose('saul','stand');
  await narr('“…David took an harp, and played with his hand: so Saul was refreshed, and was well, and the evil spirit departed from him.”','1 SAMUEL 16:23 · KJV',6000,760);
  await ask({tag:'Bible question',q:'What happened when David played the harp for Saul?',o:['Saul was refreshed, and was well','Saul sent David back home','Saul fell asleep for a year'],a:0,
   yes:'Right! “…so Saul was refreshed, and was well, and the evil spirit departed from him.”',ref:'1 Samuel 16:23'});
  pose('david','stand');
 }});
//@@moments
