//@@meta
{"ch":"david-3","name":"David","num":3,"ctitle":"Jonathan, a True Friend","ref":"1 Samuel 18–20","min":7,"desc":"Play David’s story from 1 Samuel 18 to 20 as an animated storybook: Jonathan makes a covenant with David, the women sing of David’s ten thousands, Saul’s javelin, and the arrows in the field. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#c8312b','#e9a826','#2f6fd0','#2e9b57','#7a3fa0','#e8662a'];
const LOOK={
 david:{name:'David',skin:'#c98a5e',robe:'#c8a36a',sash:'#7a5230',hair:'#6b2e16',cls:'b1'},
 jonathan:{name:'Jonathan',skin:'#b07a52',robe:'#2f6fd0',sash:'#e9a826',hair:'#2a1a10',beard:'short',bc:'#2a1a10',cls:'b2'},
 saul:{name:'King Saul',skin:'#a87550',robe:'#7a1f2a',sash:'#e9a826',hair:'#2a1a10',crown:1,beard:'short',bc:'#2a1a10',cls:'b3'},
 w1:{name:'The women of Israel',lash:1,skin:'#b07a52',robe:'#7a3fa0',sash:'#e9a826',wrap:'#efe3c8',band:'#c9952c',cls:'b4'},
 w2:{name:'The women of Israel',lash:1,skin:'#a26f4b',robe:'#2e9b57',sash:'#e9d9b0',wrap:'#e2d6b8',band:'#c8312b',cls:'b1'},
 w3:{name:'The women of Israel',lash:1,skin:'#b98458',robe:'#c46a2b',sash:'#2f4f8f',wrap:'#efe3c8',band:'#2f4f8f',cls:'b2'},
 lad:{name:'Jonathan’s lad',child:.76,skin:'#b98458',robe:'#d9c9a3',sash:'#8a5a2b',hair:'#2a1a12',cls:'b3'}
};
const DEFS_X='';
const END={num:3,verse:'“A man that hath friends must shew himself friendly: and there is a friend that sticketh closer than a brother.”',cite:'PROVERBS 18:24 · KJV',
 q:'do you have a friend like Jonathan?',a:['Yes, I thank God for them','I am praying for one'],
 r:['Thank God for them, and be that kind of friend too: loyal, honest, and quick to speak good of others, as Jonathan did for David.','God sees. Ask Him for godly friends, and start by being a friend that sticketh closer than a brother.'],
 pray:'Father, thank You for true friends. Make me a faithful friend like Jonathan, keep me from jealousy like Saul’s, and bless every covenant of friendship in my life, in the name of Jesus.',
 next:{ch:'david-4',label:'Chapter 4',title:'Mercy in the Cave',ready:1}};
//@@scenes
/* David chapter 3 props */
const gift=(id,x,y,kind)=>`<g id="${id}" style="transition:transform .9s cubic-bezier(.45,.05,.25,1),opacity .4s;transform:translate(${x}px,${y}px) scale(1.5)">${
 kind==='robe'?`<path d="M-22 -44 L22 -44 L30 -30 L46 -22 L40 -6 L30 -10 L34 40 L-34 40 L-30 -10 L-40 -6 L-46 -22 L-30 -30Z" fill="#2f6fd0" ${ol}/><path d="M-14 -44 L0 -26 L14 -44" stroke="#e9a826" stroke-width="5" fill="none"/><path d="M-34 30 H34" stroke="#e9a826" stroke-width="5"/>`:
 kind==='sword'?`<rect x="-5" y="-58" width="10" height="80" rx="3" fill="#c9ced6" ${ol}/><rect x="-22" y="20" width="44" height="10" rx="4" fill="#e9a826" ${ol}/><rect x="-5" y="30" width="10" height="20" rx="3" fill="#7a5230" ${ol}/>`:
 kind==='bow'?`<path d="M-10 -56 Q40 0 -10 56" stroke="#7a5230" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-10 -56 L-10 56" stroke="#efe3c8" stroke-width="2.5"/>`:
 `<rect x="-46" y="-10" width="92" height="20" rx="8" fill="#e9a826" ${ol}/><rect x="-10" y="-14" width="20" height="28" rx="4" fill="#c8312b" ${sk(3)}/>`}</g>`;
const tabret=(x,y)=>`<g transform="translate(${x} ${y})"><circle r="20" fill="#e9d3a6" ${ol}/><circle r="20" fill="none" stroke="#c9952c" stroke-width="5" stroke-dasharray="4 6"/></g>`;
const jav=`<g id="jav" style="opacity:0;transform:translate(1010px,470px) rotate(-90deg);transition:transform .45s cubic-bezier(.3,0,.7,1),opacity .2s"><rect x="-4" y="-110" width="8" height="220" rx="3" fill="#7a5230" ${ol}/><path d="M0 -140 L12 -108 L-12 -108Z" fill="#c9ced6" ${ol}/></g>`;
const arrow=`<g id="arw" style="opacity:0;transform:translate(330px,520px);transition:transform 1.1s cubic-bezier(.2,.4,.6,1),opacity .2s"><path d="M-40 0 H34" stroke="#7a5230" stroke-width="5"/><path d="M34 -8 L48 0 L34 8Z" fill="#c9ced6" ${sk(2)}/><path d="M-40 0 L-52 -8 M-40 0 L-52 8" stroke="#c8312b" stroke-width="4"/></g>`;
const harp2=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-34 0 Q-46 -70 -20 -110 L-8 -104 Q-30 -66 -20 0Z" fill="#a0703c" ${ol}/><path d="M34 0 Q46 -70 20 -110 L8 -104 Q30 -66 20 0Z" fill="#a0703c" ${ol}/><rect x="-30" y="-120" width="60" height="16" rx="6" fill="#7a5230" ${ol}/><rect x="-38" y="-8" width="76" height="18" rx="6" fill="#7a5230" ${ol}/>${[-14,-5,4,13].map(a=>`<path d="M${a} -104 V-8" stroke="#f3e3b5" stroke-width="2.5"/>`).join('')}</g>`;

S({id:'covenant',focus:640,draw:()=>`<rect width="1280" height="720" fill="#e9d6ae"/><rect width="1280" height="60" fill="#7a1f2a"/><path d="M0 60 H1280" stroke="${OL}" stroke-width="5"/>
 ${column(110,600,480)}${column(1170,600,480)}<rect y="560" width="1280" height="200" fill="#c9a46e" ${sk(4)}/><path d="M240 610 L1040 610 L1110 700 L170 700Z" fill="#7a1f2a" opacity=".8" ${ol}/>
 ${put([['jonathan',{x:520,y:656,s:1.14,f:1}],['david',{x:800,y:660,s:1.04,f:-1}]])}
 ${gift('gRobe',360,500,'robe')}${gift('gSword',250,510,'sword')}${gift('gBow',150,500,'bow')}${gift('gBelt',260,640,'belt')}
 <g id="glow" class="beam"><rect width="1280" height="720" fill="#ffe08a" opacity=".2"/>${[[500,300],[640,220],[780,320]].map(([x,y])=>glint(x,y)).join('')}</g>`,
 run:async()=>{
  await narr('“…the soul of Jonathan was knit with the soul of David, and Jonathan loved him as his own soul.”','1 SAMUEL 18:1 · KJV',5000);
  $('glow').classList.add('on');expr('jonathan','smile');expr('david','smile');
  await narr('“Then Jonathan and David made a covenant, because he loved him as his own soul.”','1 SAMUEL 18:3 · KJV',4400);
  await tapGame({ids:['gRobe','gSword','gBow','gBelt'],hint:'Jonathan gave David his own things: tap each gift to give it to David.',fx:520,
   onTap:(el)=>{el.style.transform='translate(760px,540px) scale(.6)';setTimeout(()=>el.style.opacity=0,900);pose('jonathan','give');setTimeout(()=>pose('jonathan','stand'),900)}});
  expr('david','happy');
  await narr('“And Jonathan stripped himself of the robe that was upon him, and gave it to David, and his garments, even to his sword, and to his bow, and to his girdle.”','1 SAMUEL 18:4 · KJV',6200);
  await ask({tag:'Bible question',q:'What did Jonathan give to David?',o:['A field and a house','His robe, his sword and his bow','Gold and silver'],a:1,
   yes:'Right! He “gave it to David, and his garments, even to his sword, and to his bow, and to his girdle.”',ref:'1 Samuel 18:4'});
 }});

S({id:'song',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1100,120)}${cloud(150,.8,-30)}${hills(DAY,650)}${tree(1200,640,.8)}${road(660,'#e8d8b4')}
 ${put([['w1',{x:280,y:660,s:1.0,f:1}],['w2',{x:400,y:664,s:.98,f:1}],['w3',{x:160,y:662,s:.96,f:1}],['saul',{x:860,y:656,s:1.2,f:-1}],['david',{x:1000,y:660,s:1.04,f:-1}]])}${tabret(330,540)}${tabret(450,548)}`,
 run:async()=>{
  ['w1','w2','w3'].forEach(id=>{expr(id,'happy');pose(id,'joy')});
  await narr('“…the women came out of all cities of Israel, singing and dancing, to meet king Saul, with tabrets, with joy, and with instruments of musick.”','1 SAMUEL 18:6 · KJV',6000);
  ['w1','w2','w3'].forEach(id=>hop(id));
  await say('w1','Saul hath slain his thousands, and David his ten thousands.',{ref:'1 SAMUEL 18:7'});
  await ask({tag:'Bible question',q:'What did the women sing?',o:['“Saul hath slain his thousands, and David his ten thousands.”','“David is king over Israel.”','“The Philistines have won.”'],a:0,
   yes:'Right! “Saul hath slain his thousands, and David his ten thousands.”',ref:'1 Samuel 18:7'});
  ['w1','w2','w3'].forEach(id=>pose(id,'stand'));expr('saul','angry');
  await say('saul','They have ascribed unto David ten thousands, and to me they have ascribed but thousands: and what can he have more but the kingdom?',{ref:'1 SAMUEL 18:8'});
  expr('david','sad');
  await narr('“And Saul eyed David from that day and forward.”','1 SAMUEL 18:9 · KJV',3600,900);
 }});

S({id:'javelin',focus:820,draw:()=>`<rect width="1280" height="720" fill="url(#lampG)"/>
 <rect x="0" y="0" width="1280" height="560" fill="#5a3427" opacity=".5"/>${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<rect x="${i*128}" y="70" width="10" height="490" fill="#3b2418" opacity=".45"/>`).join('')}
 ${lamp(130,560,1.1)}<rect y="560" width="1280" height="200" fill="#8a6a4a" ${sk(4)}/>${dais(1040,584,260)}
 ${put([['saul',{x:1040,y:584,s:1.18,f:-1,expr:'angry'}],['david',{x:620,y:660,s:1.04,f:1}]])}${harp2(700,600,.8)}${jav}`,
 run:async()=>{
  pose('david','hold');pose('saul','hold');
  await narr('“And the evil spirit from the LORD was upon Saul, as he sat in his house with his javelin in his hand: and David played with his hand.”','1 SAMUEL 19:9 · KJV',6000);
  await tapOnce('Help David slip away!','40%',7000);
  const j=$('jav');j.style.opacity=1;pose('saul','point');walkTo('david',260,660,700);
  await wait(120,true);j.style.transform='translate(520px,420px) rotate(-90deg)';await wait(500,true);
  await narr('“And Saul sought to smite David even to the wall with the javelin; but he slipped away out of Saul’s presence, and he smote the javelin into the wall…”','1 SAMUEL 19:10 · KJV',6000,640);
  flip('david',-1);walkTo('david',-160,660,2200);
  await narr('“…and David fled, and escaped that night.”','1 SAMUEL 19:10 · KJV',3200,640);
  await ask({tag:'Bible question',q:'What happened when Saul threw the javelin?',o:['David caught it in his hand','David slipped away, and the javelin went into the wall','Jonathan stood in front of David'],a:1,
   yes:'Right! “…he slipped away out of Saul’s presence, and he smote the javelin into the wall…”',ref:'1 Samuel 19:10'});
 }});

S({id:'field',focus:600,draw:()=>`<rect width="1280" height="720" fill="url(#skyE)"/>${sun(140,170)}${cloud(1000,.8,-20)}${hills(DAY,650)}${rocks(1120,650,1.1)}${tree(80,640,.9)}${bush(980,646,.8)}
 ${put([['jonathan',{x:420,y:660,s:1.12,f:1}],['david',{x:600,y:660,s:1.04,f:-1}],['lad',{x:300,y:664,s:1.0,f:1}]])}${arrow}`,
 run:async()=>{
  $('mv-lad').style.opacity=0;expr('david','sad');
  await say('david','What have I done? what is mine iniquity? and what is my sin before thy father, that he seeketh my life?',{ref:'1 SAMUEL 20:1'});
  await say('jonathan','Whatsoever thy soul desireth, I will even do it for thee.',{ref:'1 SAMUEL 20:4'});
  await say('jonathan','And I will shoot three arrows on the side thereof, as though I shot at a mark.',{ref:'1 SAMUEL 20:20'});
  await say('jonathan','But if I say thus unto the young man, Behold, the arrows are beyond thee; go thy way: for the LORD hath sent thee away.',{ref:'1 SAMUEL 20:22'});
  await ask({tag:'Bible question',q:'If Jonathan called out “the arrows are beyond thee”, what did it mean for David?',o:['Come back, for there is peace','Go thy way: for the LORD hath sent thee away','Hide in the field one more day'],a:1,
   yes:'Right! “Behold, the arrows are beyond thee; go thy way: for the LORD hath sent thee away.”',ref:'1 Samuel 20:22'});
  walkTo('david',1120,660,2000);await wait(2000,true);$('mv-david').style.transition='opacity .8s';$('mv-david').style.opacity=0;
  $('mv-lad').style.transition='opacity .6s';$('mv-lad').style.opacity=1;
  await narr('“And it came to pass in the morning, that Jonathan went out into the field at the time appointed with David, and a little lad with him.”','1 SAMUEL 20:35 · KJV',5800);
  await say('jonathan','Run, find out now the arrows which I shoot.',{ref:'1 SAMUEL 20:36'});
  walkTo('lad',760,664,2400);
  await tapOnce('Shoot the arrow!','40%',7000);
  pose('jonathan','point');const a=$('arw');a.style.opacity=1;await wait(60,true);a.style.transform='translate(960px,560px)';await wait(1100,true);
  await say('jonathan','Is not the arrow beyond thee?',{ref:'1 SAMUEL 20:37'});
  await say('jonathan','Make speed, haste, stay not.',{ref:'1 SAMUEL 20:38'});pose('jonathan','stand');
 }});

S({id:'part',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyE)"/>${sun(140,170)}${hills(EVE,650)}${rocks(1120,650,1.1)}${tree(80,640,.9)}
 ${put([['jonathan',{x:520,y:660,s:1.12,f:1,expr:'sad'}],['david',{x:1140,y:660,s:1.04,f:-1,expr:'sad'}]])}
 <g id="glow" class="beam"><rect width="1280" height="720" fill="#ffe08a" opacity=".2"/>${[[520,300],[660,220],[800,320]].map(([x,y])=>glint(x,y)).join('')}</g>`,
 run:async()=>{
  walkTo('david',720,660,2600);await wait(2600,true);cls('david','bowL',1);
  await narr('“And as soon as the lad was gone, David arose out of a place toward the south, and fell on his face to the ground, and bowed himself three times…”','1 SAMUEL 20:41 · KJV',6000);
  cls('david','bowL',0);pose('david','hold');pose('jonathan','hold');
  await narr('“…and they kissed one another, and wept one with another, until David exceeded.”','1 SAMUEL 20:41 · KJV',4600);
  pose('david','stand');pose('jonathan','stand');
  await say('jonathan','Go in peace, forasmuch as we have sworn both of us in the name of the LORD, saying, The LORD be between me and thee, and between my seed and thy seed for ever.',{ref:'1 SAMUEL 20:42'});
  await ask({tag:'Bible question',q:'What did Jonathan say to David as they parted?',o:['“Go in peace.”','“Never come back.”','“I will tell my father where you are.”'],a:0,
   yes:'Right! “Go in peace, forasmuch as we have sworn both of us in the name of the LORD…”',ref:'1 Samuel 20:42'});
  $('glow').classList.add('on');flip('david',1);walkTo('david',1460,660,3400);flip('jonathan',-1);walkTo('jonathan',-160,660,3600);
  await narr('“And he arose and departed: and Jonathan went into the city.”','1 SAMUEL 20:42 · KJV',3800);
 }});
//@@moments
