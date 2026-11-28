//@@meta
{"ch":"david-4","name":"David","num":4,"ctitle":"Mercy in the Cave","ref":"1 Samuel 24","min":6,"desc":"Play David’s story from 1 Samuel 24 as an animated storybook: Saul hunts David in the wilderness of En-gedi, comes into the very cave where David is hiding, and David spares the LORD’s anointed. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#c8312b','#e9a826','#2f6fd0','#2e9b57','#7a3fa0','#e8662a'];
const LOOK={
 david:{name:'David',skin:'#c98a5e',robe:'#c8a36a',sash:'#7a5230',hair:'#6b2e16',beard:'short',bc:'#6b2e16',cls:'b1'},
 saul:{name:'King Saul',skin:'#a87550',robe:'#7a1f2a',sash:'#e9a826',hair:'#2a1a10',crown:1,beard:'short',bc:'#2a1a10',cls:'b3'},
 m1:{name:'One of David’s men',skin:'#a26f4b',robe:'#6b5a3a',sash:'#3b2a1a',wrap:'#c9b78e',band:'#2a1d12',beard:'short',bc:'#20150d',cls:'b2'},
 m2:{name:'One of David’s men',skin:'#b07a52',robe:'#4a5a6a',sash:'#2a1d12',wrap:'#d9c9a3',band:'#3b2a1a',beard:'short',bc:'#2a1a10',cls:'b4'},
 k1:{name:'A soldier of Saul',skin:'#9c6a47',robe:'#7a1f2a',sash:'#e9d9b0',wrap:'#d2c19a',band:'#2a1d12',beard:'short',bc:'#1d130c',cls:'b1'},
 k2:{name:'A soldier of Saul',skin:'#b07a52',robe:'#7a1f2a',sash:'#e9a826',wrap:'#d9c9a3',band:'#3b2a1a',beard:'short',bc:'#2a1a10',cls:'b2'}
};
const DEFS_X=`<radialGradient id="caveG" cx=".82" cy=".5" r=".75"><stop offset="0" stop-color="#e9c98a"/><stop offset=".35" stop-color="#6a5040"/><stop offset="1" stop-color="#231812"/></radialGradient>`;
const END={num:4,verse:'“Be not overcome of evil, but overcome evil with good.”',cite:'ROMANS 12:21 · KJV',
 q:'has someone treated you badly, and you could pay them back?',a:['Yes, it is hard','Not right now'],
 r:['David could have paid Saul back, but he left it to the LORD and showed mercy. Ask God for the grace to overcome evil with good.','Then keep your heart ready, as David did. When the chance comes to repay evil, choose mercy and leave judgment to God.'],
 pray:'Father, give me a merciful heart like David’s. Help me never to repay evil for evil, but to overcome evil with good, and to trust You to judge between me and every enemy, in the name of Jesus.',
 next:null,more:'More of David’s story is coming: David the king.'};
//@@scenes
/* David chapter 4 props */
const goat=(x,y,s=1,f=1)=>`<g transform="translate(${x} ${y}) scale(${f*s} ${s})"><ellipse cx="0" cy="-36" rx="34" ry="18" fill="#c9a46e" ${ol}/><path d="M26 -46 Q40 -70 48 -72 L58 -62 Q50 -50 38 -40Z" fill="#c9a46e" ${ol}/><path d="M46 -72 Q36 -96 22 -100 M50 -72 Q48 -98 36 -106" stroke="#7a5a3a" stroke-width="5" fill="none" stroke-linecap="round"/>${[-22,-10,12,24].map(a=>`<rect x="${a}" y="-24" width="7" height="26" rx="3" fill="#a88456" ${sk(2.4)}/>`).join('')}</g>`;
const skirt=(id,x,y)=>`<g id="${id}" style="opacity:0;transition:opacity .4s,transform .9s;transform:translate(${x}px,${y}px)"><path d="M-24 -10 L26 -14 L30 18 L-20 22Z" fill="#7a1f2a" ${ol}/><path d="M-20 14 L28 10" stroke="#e9a826" stroke-width="4"/></g>`;
const cliff=(x,w,top,c)=>`<path d="M${x} 720 L${x} ${top+40} Q${x+w*.2} ${top} ${x+w*.5} ${top+20} Q${x+w*.8} ${top-10} ${x+w} ${top+50} L${x+w} 720Z" fill="${c}" ${ol}/>`;

S({id:'engedi',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1080,120)}${cloud(160,.7,-20)}
 ${cliff(-40,520,260,'#c9a46e')}${cliff(820,500,230,'#b8925c')}<path d="M-40 600 Q640 570 1320 600 V760 H-40Z" fill="#d9b77a" ${sk(4)}/>
 ${goat(260,330,.8)}${goat(980,300,.7,-1)}${goat(1120,320,.75,-1)}
 ${put([['saul',{x:-160,y:660,s:1.18,f:1}],['k1',{x:-300,y:660,s:1.04,f:1}],['k2',{x:-420,y:662,s:1.02,f:1}]])}`,
 run:async()=>{
  await narr('“…it was told him, saying, Behold, David is in the wilderness of En-gedi.”','1 SAMUEL 24:1 · KJV',4200);
  walkTo('saul',640,660,4200);walkTo('k1',500,660,4200);walkTo('k2',380,662,4200);expr('saul','angry');
  await narr('“Then Saul took three thousand chosen men out of all Israel, and went to seek David and his men upon the rocks of the wild goats.”','1 SAMUEL 24:2 · KJV',5800);
  await ask({tag:'Bible question',q:'Where was David when Saul went to seek him?',o:['In the wilderness of En-gedi','In the king’s palace','In the land of Egypt'],a:0,
   yes:'Right! “Behold, David is in the wilderness of En-gedi.”',ref:'1 Samuel 24:1'});
 }});

S({id:'cave',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#caveG)"/>
 <path d="M-40 0 H1320 V120 Q1100 60 900 140 Q700 60 460 130 Q260 70 -40 140Z" fill="#231812"/><path d="M-40 140 Q260 70 460 130 Q700 60 900 140 Q1100 60 1320 120" fill="none" stroke="${OL}" stroke-width="5"/>
 <path d="M1000 600 Q1040 300 1180 260 Q1320 300 1320 600Z" fill="#f3dca8" opacity=".55"/>
 <path d="M-40 600 Q640 584 1320 600 V760 H-40Z" fill="#4a3628" ${sk(4)}/>${rocks(120,610,1.2,'#5a463a')}${rocks(420,620,.8,'#5a463a')}
 ${put([['david',{x:240,y:650,s:1.04,f:1}],['m1',{x:110,y:650,s:1.02,f:1}],['m2',{x:360,y:656,s:1.0,f:1}],['saul',{x:1420,y:660,s:1.18,f:-1}]])}${skirt('skt',780,560)}${[[430,'fs1'],[560,'fs2'],[700,'fs3']].map(([x,id])=>`<g id="${id}"><ellipse cx="${x}" cy="682" rx="36" ry="12" fill="#f3dca8" opacity=".55" ${sk(2)}/></g>`).join('')}`,
 run:async()=>{
  ['david','m1','m2'].forEach(id=>expr(id,'surprised'));walkTo('saul',820,660,3600);
  await narr('“And he came to the sheepcotes by the way, where was a cave… and David and his men remained in the sides of the cave.”','1 SAMUEL 24:3 · KJV',5600);
  flip('m1',-1);
  await say('m1','Behold the day of which the LORD said unto thee, Behold, I will deliver thine enemy into thine hand, that thou mayest do to him as it shall seem good unto thee.',{name:'David’s men, whispering',ref:'1 SAMUEL 24:4'});
  flip('m1',1);
  await tapGame({ids:['fs1','fs2','fs3'],hint:'Help David creep up quietly in the dark: tap each step.',fx:560,
   onTap:(el,n)=>{walkTo('david',[0,430,560,700][n],656,700)}});
  await wait(400,true);pose('david','reach');await wait(500,true);
  $('skt').style.opacity=1;$('skt').style.transform='translate(740px,560px)';
  await narr('“Then David arose, and cut off the skirt of Saul’s robe privily.”','1 SAMUEL 24:4 · KJV',3600,760);
  pose('david','hold');flip('david',-1);walkTo('david',300,650,2200);$('skt').style.transform='translate(340px,560px)';await wait(2200,true);
  await ask({tag:'Bible question',q:'What did David cut off in the cave?',o:['A lock of Saul’s hair','The skirt of Saul’s robe','Saul’s sword belt'],a:1,
   yes:'Right! “…David arose, and cut off the skirt of Saul’s robe privily.”',ref:'1 Samuel 24:4'});
  flip('david',1);expr('david','sad');
  await narr('“And it came to pass afterward, that David’s heart smote him, because he had cut off Saul’s skirt.”','1 SAMUEL 24:5 · KJV',4400);
  await say('david','The LORD forbid that I should do this thing unto my master, the LORD’s anointed, to stretch forth mine hand against him, seeing he is the anointed of the LORD.',{name:'David, to his men',ref:'1 SAMUEL 24:6'});
  await ask({tag:'Bible question',q:'Why would David not stretch out his hand against Saul?',o:['Saul was the LORD’s anointed','Saul was too strong for him','Saul had three thousand men'],a:0,
   yes:'Right! “…seeing he is the anointed of the LORD.”',ref:'1 Samuel 24:6'});
  flip('saul',1);walkTo('saul',1460,660,3200);
  await narr('“So David stayed his servants with these words, and suffered them not to rise against Saul. But Saul rose up out of the cave, and went on his way.”','1 SAMUEL 24:7 · KJV',5600);
 }});

S({id:'mercy',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(160,120)}${cloud(1000,.7,-20)}
 ${cliff(-40,460,240,'#c9a46e')}<path d="M120 600 Q180 470 280 460 Q380 470 420 600Z" fill="#231812" ${ol}/>${cliff(900,420,280,'#b8925c')}
 <path d="M-40 600 Q640 570 1320 600 V760 H-40Z" fill="#d9b77a" ${sk(4)}/>
 ${put([['saul',{x:960,y:660,s:1.18,f:1}],['k1',{x:1100,y:660,s:1.04,f:1}],['k2',{x:1220,y:662,s:1.02,f:1}],['david',{x:280,y:640,s:1.04,f:1}]])}${skirt('skt',330,540)}
 <g id="glow" class="beam"><rect width="1280" height="720" fill="#ffe08a" opacity=".2"/>${[[500,300],[640,220],[780,320]].map(([x,y])=>glint(x,y)).join('')}</g>`,
 run:async()=>{
  $('skt').style.opacity=1;walkTo('david',480,660,1800);$('skt').style.transform='translate(530px,540px)';await wait(1800,true);
  await say('david','My lord the king.',{ref:'1 SAMUEL 24:8'});
  flip('saul',-1);flip('k1',-1);flip('k2',-1);cls('david','bowR',1);
  await narr('“And when Saul looked behind him, David stooped with his face to the earth, and bowed himself.”','1 SAMUEL 24:8 · KJV',4400);
  cls('david','bowR',0);pose('david','point');
  await say('david','…see the skirt of thy robe in my hand: for in that I cut off the skirt of thy robe, and killed thee not, know thou and see that there is neither evil nor transgression in mine hand…',{ref:'1 SAMUEL 24:11'});
  await say('david','The LORD judge between me and thee, and the LORD avenge me of thee: but mine hand shall not be upon thee.',{ref:'1 SAMUEL 24:12'});
  pose('david','stand');expr('saul','sad');
  await narr('“…Saul said, Is this thy voice, my son David? And Saul lifted up his voice, and wept.”','1 SAMUEL 24:16 · KJV',4600,860);
  await say('saul','Thou art more righteous than I: for thou hast rewarded me good, whereas I have rewarded thee evil.',{ref:'1 SAMUEL 24:17'});
  await ask({tag:'Bible question',q:'What did Saul say to David?',o:['“Thou art more righteous than I.”','“Give me back my robe.”','“I will find thee tomorrow.”'],a:0,
   yes:'Right! “Thou art more righteous than I: for thou hast rewarded me good, whereas I have rewarded thee evil.”',ref:'1 Samuel 24:17'});
  $('glow').classList.add('on');
  await say('saul','…wherefore the LORD reward thee good for that thou hast done unto me this day.',{ref:'1 SAMUEL 24:19'});
  await ask({tag:'Bible question',q:'How did David repay Saul, who had hunted him?',o:['With good: he spared his life','With a trap in the cave','With an army of his own'],a:0,
   yes:'Right! Saul said, “thou hast rewarded me good, whereas I have rewarded thee evil.”',ref:'1 Samuel 24:17'});
  expr('david','smile');
 }});
//@@moments
