//@@meta
{"ch":"joseph-3","name":"Joseph","num":3,"ctitle":"The Prison and the Palace","ref":"Genesis 40–41","min":8,"desc":"Play Joseph’s story from Genesis 40 and 41 as an animated storybook: the butler’s and the baker’s dreams, Pharaoh’s dreams, and Joseph lifted from the prison to the palace. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#c8312b','#e9a826','#2f6fd0','#2e9b57','#7a3fa0','#e8662a'];
const LOOK={
 joseph:{name:'Joseph',skin:'#c08a5f',robe:'#efe6d2',sash:'#8a5a2b',hair:'#2a1a12',chainable:1,ringable:1},
 butler:{name:'Chief butler',skin:'#9c6a47',robe:'#2f4f8f',sash:'#e9a826',wig:'#1b1410',collar:'#e9d9b0',cls:'b1'},
 baker:{name:'Chief baker',skin:'#b07a52',robe:'#d9b77a',sash:'#8a5a2b',wig:'#2a1d12',cls:'b2'},
 pharaoh:{name:'Pharaoh',skin:'#9a6844',robe:'#f6f1e4',sash:'#c9952c',nemes:1,collar:'#e9a826',ringable:1,cls:'b3'},
 wise1:{name:'Wise man',skin:'#8c5d3c',robe:'#4a2f5e',sash:'#e9a826',wig:'#1b1410',cls:'b4'},
 wise2:{name:'Magician',skin:'#a87550',robe:'#24324f',sash:'#c8312b',wig:'#241912',cls:'b2'},
 guard:{name:'Guard',skin:'#8c5d3c',robe:'#d9c9a3',sash:'#2f4f8f',wig:'#241912',cls:'b3'},
 e1:{name:'Egyptian',skin:'#9c6a47',robe:'#e7dcc4',sash:'#2e9b57',wig:'#1d140f',cls:'b1'},
 e2:{name:'Egyptian',skin:'#b07a52',robe:'#d8cbb0',sash:'#c46a2b',wig:'#2a1d12',cls:'b2'},
 e3:{name:'Egyptian',skin:'#a26f4b',robe:'#e9d3a6',sash:'#2f4f8f',wig:'#1b1410',cls:'b3'},
 e4:{name:'Egyptian',lash:1,skin:'#a8754e',robe:'#7a3fa0',sash:'#e9a826',wrap:'#efe3c8',band:'#c9952c',cls:'b4'}
};
const DEFS_X=`<linearGradient id="skyDr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1f5c"/><stop offset=".6" stop-color="#5a3f8f"/><stop offset="1" stop-color="#b47fb8"/></linearGradient>
<linearGradient id="skyM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd2b0"/><stop offset="1" stop-color="#ffefc8"/></linearGradient>`;
const END={num:3,verse:'“…For God hath caused me to be fruitful in the land of my affliction.”',cite:'GENESIS 41:52 · KJV',
 q:'are you waiting for God to lift you up?',a:['Yes, I am waiting','God has lifted me'],
 r:['Joseph waited two full years after the butler forgot him, but God did not forget him. Keep trusting: your times are in His hand.','Then give God the glory, as Joseph did when he said, “It is not in me.” Every good thing comes from Him.'],
 pray:'Father, as You lifted Joseph from the prison to the palace, lift me from every place of affliction to my place of honour, and make me fruitful in the land of my affliction, in the name of Jesus.',
 next:null,more:'More of Joseph’s story is coming soon: his brothers come to Egypt.'};
//@@scenes
/* chapter 3 props */
const grapes=(x,y,id)=>`<g id="${id}" style="opacity:0;transition:opacity .6s">${[[0,0],[-9,-10],[9,-10],[-14,-22],[0,-22],[14,-22],[-7,-33],[7,-33]].map(([a,b])=>`<circle cx="${x+a}" cy="${y-b}" r="8" fill="#7a3fa0" ${sk(2.5)}/>`).join('')}</g>`;
const vine=`<g id="vine"><path d="M620 330 Q600 270 630 220" stroke="${OL}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M620 330 Q600 270 630 220" stroke="#7a5230" stroke-width="9" fill="none" stroke-linecap="round"/>
 ${[['br1','M628 250 Q560 220 500 230',500,232],['br2','M630 226 Q640 170 690 150',690,152],['br3','M626 238 Q700 230 770 250',770,252]].map(([id,d,x,y])=>`<g id="${id}" style="opacity:0;transition:opacity .8s"><path d="${d}" stroke="${OL}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#7a5230" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="${x}" cy="${y-12}" rx="18" ry="10" fill="#5fa83f" ${sk(2.5)}/><circle class="blos" cx="${x+6}" cy="${y-24}" r="6" fill="#fff" ${sk(2)}/></g>`).join('')}
 ${grapes(504,262,'gr1')}${grapes(694,182,'gr2')}${grapes(774,282,'gr3')}
 <g id="cup" style="opacity:0;transition:opacity .6s,transform 1s;transform:translate(0px,0px)"><path d="M430 250 L470 250 Q468 284 450 288 Q432 284 430 250Z" fill="#e9a826" ${sk(3)}/><rect x="444" y="288" width="12" height="16" fill="#e9a826" ${sk(2.5)}/><rect x="434" y="302" width="32" height="8" rx="3" fill="#e9a826" ${sk(2.5)}/></g></g>`;
const basket=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 -34 L60 -34 L48 0 L-48 0Z" fill="#f4efe2" ${ol}/><path d="M-54 -22 H54 M-50 -10 H50" stroke="#c9b78e" stroke-width="3"/></g>`;
const bird=(id,x,y)=>`<g id="${id}" style="opacity:0;transform:translate(${x}px,${y}px);transition:transform 1.4s cubic-bezier(.4,.1,.2,1),opacity .4s"><path d="M-20 0 Q-10 -16 0 -2 Q10 -16 20 0" stroke="${OL}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-20 0 Q-10 -16 0 -2 Q10 -16 20 0" stroke="#3b3b4a" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;
const baskets=`<g id="baskets" style="display:none">${basket(640,320,1)}${basket(640,286,.96)}${basket(640,252,.92)}${[-36,-12,12,36].map(dx=>`<ellipse cx="${640+dx}" cy="222" rx="13" ry="8" fill="#e9b45f" ${sk(2.5)}/>`).join('')}${bird('bd1',380,120)}${bird('bd2',900,110)}${bird('bd3',820,60)}</g>`;
const cow=(id,x,y,fat,show)=>`<g id="${id}" class="fade" style="opacity:${show?1:0};transform:translate(${x}px,${y}px);transition:transform 1.6s cubic-bezier(.4,.1,.2,1),opacity .8s"><g transform="scale(.78)">
 ${fat?`<rect class="leg" x="-50" y="-10" width="16" height="50" rx="7" fill="#e9dcc4" ${ol}/><rect class="leg l2" x="34" y="-10" width="16" height="50" rx="7" fill="#e9dcc4" ${ol}/><ellipse cx="0" cy="-30" rx="80" ry="50" fill="#f2e6d0" ${ol}/><ellipse cx="-20" cy="-44" rx="26" ry="18" fill="#a0602f"/><ellipse cx="34" cy="-18" rx="18" ry="13" fill="#a0602f"/><ellipse cx="88" cy="-54" rx="30" ry="24" fill="#f2e6d0" ${ol}/><ellipse cx="106" cy="-44" rx="13" ry="10" fill="#e9a0a0" ${sk(2.5)}/><circle cx="88" cy="-62" r="4" fill="${OL}"/><path d="M76 -76 q-6 -16 6 -20 M98 -76 q8 -14 16 -10" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/>`
 :`<rect class="leg" x="-40" y="-14" width="10" height="54" rx="5" fill="#9b8a76" ${ol}/><rect class="leg l2" x="28" y="-14" width="10" height="54" rx="5" fill="#9b8a76" ${ol}/><ellipse cx="0" cy="-26" rx="70" ry="24" fill="#9b8a76" ${ol}/>${[-30,-14,2,18].map(dx=>`<path d="M${dx} -42 q4 14 0 30" stroke="${OL}" stroke-width="3" fill="none" opacity=".6"/>`).join('')}<ellipse cx="80" cy="-28" rx="26" ry="20" fill="#9b8a76" ${ol}/><circle cx="84" cy="-34" r="4" fill="${OL}"/><path d="M70 -46 q-8 -12 2 -18" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/>`}</g></g>`;
const ear=(x,y,ang,full,id)=>`<g id="${id}" class="fade" style="transform:translate(${x}px,${y}px) rotate(${ang}deg);opacity:${full?1:0}">${full?`<ellipse cx="0" cy="-26" rx="13" ry="28" fill="#f2c94c" ${sk(3)}/>${[-18,-30,-42].map(yy=>`<path d="M-10 ${yy} L10 ${yy+6}" stroke="#c99a26" stroke-width="3"/>`).join('')}`:`<path d="M0 0 Q-6 -30 2 -56 Q8 -30 0 0Z" fill="#a8a070" ${sk(3)}/>`}</g>`;
const stalk=()=>`<g id="stalk" style="opacity:0;transition:opacity .8s"><path d="M640 660 Q632 520 640 380" stroke="${OL}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M640 660 Q632 520 640 380" stroke="#7f9a45" stroke-width="7" fill="none" stroke-linecap="round"/>
 ${[[640,380,0],[624,420,-34],[656,420,34],[620,470,-40],[660,470,40],[622,520,-44],[658,520,44]].map(([x,y,a],i)=>ear(x,y,a,1,'fe'+i)).join('')}
 <g id="thin" style="opacity:0;transition:opacity .8s"><path d="M760 660 Q752 540 760 430" stroke="${OL}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M760 660 Q752 540 760 430" stroke="#a8a070" stroke-width="5" fill="none" stroke-linecap="round"/>${[[760,430,0],[746,466,-36],[774,466,36],[744,512,-42],[776,512,42],[746,556,-46],[774,556,46]].map(([x,y,a],i)=>ear(x,y,a,0,'te'+i).replace('opacity:0','opacity:1')).join('')}${[0,1,2].map(i=>`<path class="wind" d="M${880+i*20} ${450+i*50} q-60 -10 -120 0" stroke="#e8d7f2" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`).join('')}</g></g>`;
const throne=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-70" y="-200" width="140" height="200" rx="12" fill="#e9a826" ${ol}/><rect x="-52" y="-180" width="104" height="120" rx="8" fill="#2f4f8f" ${ol}/><rect x="-86" y="-70" width="172" height="40" rx="8" fill="#c9952c" ${ol}/><path d="M-30 -150 L0 -120 L30 -150" stroke="#e9a826" stroke-width="7" fill="none"/></g>`;
const dais=(x,y,w)=>`<rect x="${x-w/2}" y="${y}" width="${w}" height="26" fill="#d9c49a" ${ol}/><rect x="${x-w/2-30}" y="${y+26}" width="${w+60}" height="26" fill="#cdb589" ${ol}/>`;
const table=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-60" width="180" height="16" rx="5" fill="#8a5a35" ${ol}/><rect x="-74" y="-44" width="12" height="44" fill="#8a5a35" ${sk(3)}/><rect x="62" y="-44" width="12" height="44" fill="#8a5a35" ${sk(3)}/><ellipse cx="-44" cy="-72" rx="30" ry="12" fill="#e9b45f" ${sk(3)}/>${grapes(10,-58,'g'+x).replace('opacity:0','opacity:1')}<circle cx="54" cy="-74" r="14" fill="#c8312b" ${sk(3)}/><circle cx="70" cy="-70" r="11" fill="#e9a826" ${sk(3)}/></g>`;
const granary=(x,y,s=1,id)=>`<g ${id?`id="${id}"`:''} transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0 L-70 -110 Q-70 -200 0 -200 Q70 -200 70 -110 L70 0Z" fill="#e8d2a2" ${ol}/><path d="M-70 -110 H70" stroke="#c9a46e" stroke-width="6"/><rect x="-22" y="-70" width="44" height="70" rx="6" fill="#5a3d22" ${ol}/><rect x="-16" y="-170" width="32" height="22" rx="4" fill="#5a3d22" ${sk(3)}/></g>`;
const sheafT=(id,x,y)=>`<g id="${id}" style="transform:translate(${x}px,${y}px);transition:transform 1s cubic-bezier(.45,.05,.25,1),opacity .4s"><g transform="scale(.95)"><path d="M-14 0 L-20 -70 Q0 -96 20 -70 L14 0 Z" fill="#f2c94c" ${sk(3.5)}/>${[-12,-4,4,12].map(dx=>`<path d="M${dx} -60 L${dx*1.6} -96" stroke="#c99a26" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="${dx*1.7}" cy="-100" rx="5" ry="9" fill="#f2c94c" ${sk(2.5)}/>`).join('')}<rect x="-19" y="-40" width="38" height="9" rx="4" fill="#a0522d" ${sk(3)}/></g></g>`;
const horse=`<g transform="translate(150 0)"><rect class="leg l2" x="-62" y="-70" width="14" height="72" rx="6" fill="#7a4a24" ${ol}/><rect class="leg" x="34" y="-70" width="14" height="72" rx="6" fill="#7a4a24" ${ol}/><ellipse cx="0" cy="-96" rx="80" ry="38" fill="#9a5f2e" ${ol}/><path d="M54 -110 Q80 -170 96 -190 L126 -178 Q110 -150 86 -96Z" fill="#9a5f2e" ${ol}/><ellipse cx="118" cy="-184" rx="30" ry="16" fill="#9a5f2e" ${ol} transform="rotate(24 118 -184)"/><circle cx="114" cy="-192" r="4" fill="${OL}"/><path d="M70 -160 Q80 -190 98 -198" stroke="#2b1a10" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-78 -106 Q-110 -90 -104 -54" stroke="#2b1a10" stroke-width="12" fill="none" stroke-linecap="round"/><rect class="leg" x="-46" y="-70" width="14" height="72" rx="6" fill="#8a5a30" ${ol}/><rect class="leg l2" x="50" y="-70" width="14" height="72" rx="6" fill="#8a5a30" ${ol}/><path d="M-20 -130 L30 -130" stroke="#c8312b" stroke-width="10" stroke-linecap="round"/><path d="M90 -150 L-90 -80" stroke="#e9a826" stroke-width="5"/></g>`;
const chariot=()=>`<g class="mover" id="mv-chariot" style="transform:translate(-520px,590px)">${horse}
 <g transform="translate(-60 0)"><path d="M-70 -40 L60 -40 L76 -120 Q0 -140 -64 -120Z" fill="#e9a826" ${ol}/><path d="M-50 -60 H56" stroke="#c8312b" stroke-width="6"/>
 <g transform="translate(0 -80)">${person('joseph',{x:0,y:0,s:.8,f:1,expr:'happy',chain:1,ring:1})}</g>
 <path d="M-70 -40 L60 -40 L76 -120 Q0 -140 -64 -120Z" fill="none" ${ol}/><rect x="-74" y="-90" width="150" height="54" rx="8" fill="#e9a826" ${ol}/><path d="M-60 -62 H60" stroke="#2f4f8f" stroke-width="7"/>
 <g transform="translate(0 -26)"><g class="whl"><circle r="40" fill="#8a5a35" ${ol}/>${[0,60,120].map(a=>`<path d="M0 -36 V36" stroke="${OL}" stroke-width="6" transform="rotate(${a})"/>`).join('')}<circle r="10" fill="#e9a826" ${sk(3)}/></g></g></g></g>`;

S({id:'ward',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#brk)"/><rect width="1280" height="720" fill="#2a1a20" opacity=".25"/>
 <g transform="translate(200 160)"><rect x="-80" y="-56" width="160" height="112" fill="url(#skyM)" ${ol}/>${[-48,-16,16,48].map(dx=>`<rect x="${dx-6}" y="-56" width="12" height="112" fill="#4a4048" ${sk(3)}/>`).join('')}<rect x="-80" y="-56" width="160" height="112" fill="none" ${ol}/></g>
 <polygon points="150,216 260,216 420,720 90,720" fill="#fff3d0" opacity=".22"/>
 <rect y="600" width="1280" height="160" fill="#3a2e27" ${sk(4)}/>${[[1120,644],[180,646]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="76" ry="16" fill="#c9a24e" ${sk(3)}/>`).join('')}${torch(1040,380,1)}
 ${put([['butler',{x:420,y:650,s:1.1,f:1,expr:'sad'}],['baker',{x:870,y:652,s:1.1,f:-1,expr:'sad'}],['joseph',{x:-160,y:656,s:1.12,f:1}]])}
 <g id="dreamV" class="fade" style="opacity:0"><rect width="1280" height="720" fill="url(#dreamG)"/>${[...Array(40)].map((_,i)=>star((i*137)%1280,(i*71)%640+20,3+(i%3)*2,'tw',(i%7)*.3)).join('')}<g transform="translate(640 330) scale(1.75) translate(-620 -235)">${vine}</g><g transform="translate(640 360) scale(1.7) translate(-640 -255)">${baskets}</g></g>`,
 run:async()=>{
  await narr('“…the captain of the guard charged Joseph with them, and he served them…”','GENESIS 40:4 · KJV',4000);
  await narr('“And they dreamed a dream both of them, each man his dream in one night…”','GENESIS 40:5 · KJV',4200);
  walkTo('joseph',640,656,2800);await wait(2900,true);
  await narr('“And Joseph came in unto them in the morning, and looked upon them, and, behold, they were sad.”','GENESIS 40:6 · KJV',4400);
  await say('joseph','Wherefore look ye so sadly to day?',{ref:'GENESIS 40:7'});
  await say('butler','We have dreamed a dream, and there is no interpreter of it.',{name:'The butler and the baker',ref:'GENESIS 40:8'});
  pose('joseph','point');await say('joseph','Do not interpretations belong to God? tell me them, I pray you.',{ref:'GENESIS 40:8'});pose('joseph','stand');
  await ask({tag:'Bible question',q:'What did Joseph say about dreams and their meaning?',o:['“Do not interpretations belong to God?”','“Only Pharaoh’s magicians can tell you.”','“Dreams do not mean anything.”'],a:0,
   yes:'Right! Joseph said, “Do not interpretations belong to God? tell me them, I pray you.”',ref:'Genesis 40:8'});
  $('dreamV').style.opacity=1;
  await narr('The chief butler told his dream: “In my dream, behold, a vine was before me…”','GENESIS 40:9 · KJV',4200);
  ['br1','br2','br3'].forEach((id,i)=>setTimeout(()=>$(id).style.opacity=1,i*700));['gr1','gr2','gr3'].forEach((id,i)=>setTimeout(()=>$(id).style.opacity=1,2600+i*500));
  await narr('“And in the vine were three branches: and it was as though it budded, and her blossoms shot forth; and the clusters thereof brought forth ripe grapes…”','GENESIS 40:10 · KJV',6000);
  $('cup').style.opacity=1;
  await narr('“And Pharaoh’s cup was in my hand: and I took the grapes, and pressed them into Pharaoh’s cup, and I gave the cup into Pharaoh’s hand.”','GENESIS 40:11 · KJV',5600);
  $('dreamV').style.opacity=0;await wait(900,true);
  await say('joseph','This is the interpretation of it: The three branches are three days…',{ref:'GENESIS 40:12'});
  await say('joseph','Yet within three days shall Pharaoh lift up thine head, and restore thee unto thy place…',{ref:'GENESIS 40:13'});
  expr('butler','happy');hop('butler');
  await say('joseph','But think on me when it shall be well with thee… and make mention of me unto Pharaoh, and bring me out of this house…',{ref:'GENESIS 40:14'});
  $('vine').style.display='none';$('baskets').style.display='';flip('joseph',-1);
  await say('baker','I also was in my dream…',{ref:'GENESIS 40:16'});
  $('dreamV').style.opacity=1;
  await narr('The chief baker said, “…behold, I had three white baskets on my head…”','GENESIS 40:16 · KJV',4400);
  await narr('“And in the uppermost basket there was of all manner of bakemeats for Pharaoh…”','GENESIS 40:17 · KJV',4000);
  [['bd1','600px,214px'],['bd2','660px,206px'],['bd3','628px,196px']].forEach(([id,t],i)=>{const b=$(id);setTimeout(()=>{b.style.opacity=1;b.style.transform=`translate(${t})`},i*300)});
  await ask({tag:'Bible question',q:'In the baker’s dream, what ate from the basket on his head?',o:['Mice','The birds','A goat'],a:1,
   yes:'Yes. “…the birds did eat them out of the basket upon my head.”',ref:'Genesis 40:17'});
  $('dreamV').style.opacity=0;await wait(900,true);
  await say('joseph','This is the interpretation thereof: The three baskets are three days…',{ref:'GENESIS 40:18'});
  expr('baker','sad');
  await narr('Then Joseph told the baker the hard news: within three days Pharaoh would put him to death.','',4400);
 }});

S({id:'feast',focus:640,draw:()=>`<rect width="1280" height="720" fill="#e9d6ae"/><rect width="1280" height="70" fill="url(#egW)"/><path d="M0 70 H1280" stroke="${OL}" stroke-width="5"/>
 <rect x="0" y="70" width="1280" height="490" fill="#d9a86a" opacity=".35"/>${[0,1,2,3,4].map(i=>`<path d="M${130+i*260} 120 l20 30 h-40z" fill="#c8312b" opacity=".5"/>`).join('')}
 <rect y="560" width="1280" height="200" fill="#b58f5a" ${sk(4)}/><path d="M0 610 H1280" stroke="#9c7a48" stroke-width="4"/>
 ${column(60,600,430)}${column(1220,600,430)}${dais(960,574,300)}${throne(1020,580)}${table(300,640,1)}${table(560,646,.9)}
 ${put([['e1',{x:180,y:652,s:1,f:1,expr:'smile'}],['e3',{x:430,y:654,s:.98,f:1,expr:'smile'}],['e4',{x:240,y:650,s:.98,f:1,expr:'smile'}],['pharaoh',{x:960,y:574,s:1.2,f:-1,ring:1}],['butler',{x:-160,y:652,s:1.1,f:1,expr:'happy'}]])}
 <g id="cupF" style="opacity:0;transform:translate(700px,480px);transition:transform 1s,opacity .3s"><path d="M-20 -24 L20 -24 Q18 10 0 14 Q-18 10 -20 -24Z" fill="#e9a826" ${sk(3)}/><rect x="-6" y="14" width="12" height="14" fill="#e9a826" ${sk(2.5)}/><rect x="-16" y="26" width="32" height="8" rx="3" fill="#e9a826" ${sk(2.5)}/></g>`,
 run:async()=>{
  await narr('“And it came to pass the third day, which was Pharaoh’s birthday, that he made a feast unto all his servants…”','GENESIS 40:20 · KJV',4800);
  walkTo('butler',760,652,3000);await wait(3100,true);
  const c=$('cupF');c.style.opacity=1;pose('butler','give');await wait(400,true);c.style.transform='translate(880px,400px)';await wait(1100,true);pose('pharaoh','receive');pose('butler','stand');
  await narr('“And he restored the chief butler unto his butlership again; and he gave the cup into Pharaoh’s hand…”','GENESIS 40:21 · KJV',4800);
  await narr('But the chief baker was put to death, “as Joseph had interpreted to them.”','GENESIS 40:22 · KJV',4200);
  pose('pharaoh','stand');c.style.opacity=0;
  await narr('“Yet did not the chief butler remember Joseph, but forgat him.”','GENESIS 40:23 · KJV',4200);
  await ask({tag:'Bible question',q:'Did the chief butler remember Joseph?',o:['Yes, the very next day','No. He forgot him for two full years','Yes, he sent food to the prison'],a:1,
   yes:'That’s right. “Yet did not the chief butler remember Joseph, but forgat him.” Two full years went by.',ref:'Genesis 40:23; 41:1'});
 }});

S({id:'river',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyDr)"/>${[...Array(40)].map((_,i)=>star((i*137)%1280,(i*53)%280+20,3+(i%3)*2,'tw',(i%7)*.3)).join('')}<circle cx="1120" cy="110" r="44" fill="#fff4c9" ${ol}/>
 ${pyramid(1050,300,.55,'#8a6f9a')}${pyramid(1180,300,.4,'#7d6490')}<rect x="-40" y="298" width="1360" height="14" fill="#6e5a86" ${sk(3)}/>
 <rect x="-40" y="308" width="1360" height="100" fill="#5b8fd6" ${sk(4)}/>${[0,1,2,3].map(i=>`<path d="M${60+i*330} 330 q30 -8 60 0 t60 0" stroke="#dbe8ff" stroke-width="4" fill="none" opacity=".75"/>`).join('')}
 ${[370,460,550,640,730,820,910].map((x,i)=>`<g id="rip${i}"><ellipse cx="${x}" cy="368" rx="36" ry="13" fill="#a8c8ff" ${sk(3)}/><ellipse cx="${x}" cy="368" rx="18" ry="6" fill="#fff" opacity=".7"/></g>`).join('')}
 <path d="M-40 404 Q300 392 640 406 T1320 402 V760 H-40Z" fill="#6fa85a" ${sk(4)}/>${[120,1180,260,1040].map(x=>`<path d="M${x} 430 l-10 -40 M${x+10} 430 l4 -48 M${x+20} 430 l14 -38" stroke="#3f6e34" stroke-width="5" stroke-linecap="round"/>`).join('')}
 ${[0,1,2,3,4,5,6].map(i=>cow('fat'+i,370+i*90,380,1,0)).join('')}${[0,1,2,3,4,5,6].map(i=>cow('lean'+i,370+i*90,380,0,0)).join('')}
<g transform="translate(700 590) scale(1.3) translate(-700 -660)">${stalk()}</g>
 ${put([['pharaoh',{x:200,y:650,s:1.15,f:1,ring:1}]])}`,
 run:async()=>{
  await narr('“And it came to pass at the end of two full years, that Pharaoh dreamed: and, behold, he stood by the river.”','GENESIS 41:1 · KJV',4800);
  const rows=[470,520,480,530,474,524,486];
  await tapGame({ids:[0,1,2,3,4,5,6].map(i=>'rip'+i),hint:'Pharaoh’s dream: tap the river to see what came up out of it.',fx:640,
   onTap:(el)=>{const i=+el.id.slice(3);const cw=$('fat'+i);cw.style.opacity=1;setTimeout(()=>cw.style.transform=`translate(${330+i*108}px,${rows[i]}px)`,60);el.style.opacity=.35}});
  await narr('“…there came up out of the river seven well favoured kine and fatfleshed; and they fed in a meadow.”','GENESIS 41:2 · KJV',4600);
  [0,1,2,3,4,5,6].forEach(i=>{const cw=$('lean'+i);setTimeout(()=>{cw.style.opacity=1;cw.style.transform=`translate(${384+i*108}px,${rows[(i+3)%7]-40}px)`},i*260)});
  await narr('“And, behold, seven other kine came up after them out of the river, ill favoured and leanfleshed…”','GENESIS 41:3 · KJV',4600);
  [0,1,2,3,4,5,6].forEach(i=>{$('lean'+i).style.transform=`translate(${330+i*108}px,${rows[i]}px)`;setTimeout(()=>$('fat'+i).style.opacity=0,700)});
  await narr('“And the ill favoured and leanfleshed kine did eat up the seven well favoured and fat kine. So Pharaoh awoke.”','GENESIS 41:4 · KJV',5000);
  expr('pharaoh','surprised');await wait(900,true);
  [0,1,2,3,4,5,6].forEach(i=>$('lean'+i).style.opacity=0);$('stalk').style.opacity=1;expr('pharaoh','neutral');
  await narr('“And he slept and dreamed the second time: and, behold, seven ears of corn came up upon one stalk, rank and good.”','GENESIS 41:5 · KJV',5000);
  $('thin').style.opacity=1;
  await narr('“And, behold, seven thin ears and blasted with the east wind sprung up after them.”','GENESIS 41:6 · KJV',4400);
  [0,1,2,3,4,5,6].forEach(i=>setTimeout(()=>$('fe'+i).style.opacity=0,i*200));
  await narr('“And the seven thin ears devoured the seven rank and full ears. And Pharaoh awoke, and, behold, it was a dream.”','GENESIS 41:7 · KJV',5000);
  expr('pharaoh','surprised');await wait(800,true);
 }});

S({id:'court',focus:700,draw:()=>`<rect width="1280" height="720" fill="#efe2c4"/><rect width="1280" height="80" fill="url(#egW)"/><path d="M0 80 H1280" stroke="${OL}" stroke-width="5"/>
 <rect x="0" y="80" width="1280" height="480" fill="#c9952c" opacity=".12"/><path d="M80 560 L80 200 Q160 130 240 200 L240 560Z" fill="#7a4a2b" ${ol}/>
 <rect y="560" width="1280" height="200" fill="#d9c49a" ${sk(4)}/><path d="M300 600 L1220 600 L1280 700 L240 700Z" fill="#2f4f8f" opacity=".85" ${ol}/>
 ${column(360,600,440,.92)}${column(1240,600,440,.92)}${dais(1010,574,320)}${throne(1080,580)}
 ${put([['wise1',{x:1180,y:574,s:1.05,f:-1,expr:'sad'}],['wise2',{x:1260,y:572,s:1.02,f:-1,expr:'sad'}],['pharaoh',{x:980,y:574,s:1.2,f:-1,expr:'sad'}],['butler',{x:760,y:652,s:1.1,f:1}],['guard',{x:300,y:652,s:1.08,f:1}],['joseph',{x:-180,y:656,s:1.12,f:1,ringable:1,chainable:1}]])}
 <g id="ringF" style="opacity:0;transform:translate(1010px,470px);transition:transform 1s,opacity .3s"><circle r="11" fill="none" stroke="${OL}" stroke-width="9"/><circle r="11" fill="none" stroke="#ffd23f" stroke-width="5"/></g>${sparks(760,430)}`,
 run:async()=>{
  await narr('“…and Pharaoh told them his dream; but there was none that could interpret them unto Pharaoh.”','GENESIS 41:8 · KJV',4600);
  await say('butler','I do remember my faults this day…',{ref:'GENESIS 41:9'});
  await say('butler','…there was there with us a young man, an Hebrew… and we told him, and he interpreted to us our dreams…',{ref:'GENESIS 41:12'});
  flip('butler',-1);walkTo('butler',520,652,1800);expr('pharaoh','neutral');
  walkTo('joseph',700,656,4200);
  await narr('“Then Pharaoh sent and called Joseph, and they brought him hastily out of the dungeon: and he shaved himself, and changed his raiment, and came in unto Pharaoh.”','GENESIS 41:14 · KJV',6000,700);
  flip('butler',1);
  await say('pharaoh','I have dreamed a dream, and there is none that can interpret it: and I have heard say of thee, that thou canst understand a dream to interpret it.',{ref:'GENESIS 41:15'});
  await ask({tag:'Bible question',q:'What did Joseph say to Pharaoh?',o:['“I am the wisest man in Egypt.”','“Set me free, and then I will tell you.”','“It is not in me: God shall give Pharaoh an answer of peace.”'],a:2,
   yes:'Right! Joseph gave the glory to God: “It is not in me: God shall give Pharaoh an answer of peace.”',ref:'Genesis 41:16'});
  await say('joseph','It is not in me: God shall give Pharaoh an answer of peace.',{ref:'GENESIS 41:16'});
  pose('joseph','point');await say('joseph','The dream of Pharaoh is one: God hath shewed Pharaoh what he is about to do.',{ref:'GENESIS 41:25'});pose('joseph','stand');
  await say('joseph','Behold, there come seven years of great plenty throughout all the land of Egypt: And there shall arise after them seven years of famine…',{ref:'GENESIS 41:29–30'});
  await ask({tag:'Bible question',q:'What did the seven thin cows and the seven empty ears mean?',o:['Seven years of famine','Seven enemy kings','Seven years of rain'],a:0,
   yes:'Yes. “…the seven thin and ill favoured kine… and the seven empty ears blasted with the east wind shall be seven years of famine.”',ref:'Genesis 41:27'});
  await say('joseph','…let Pharaoh look out a man discreet and wise, and set him over the land of Egypt.',{ref:'GENESIS 41:33'});
  expr('pharaoh','smile');flip('pharaoh',1);
  await say('pharaoh','Can we find such a one as this is, a man in whom the Spirit of God is?',{name:'Pharaoh, to his servants',ref:'GENESIS 41:38'});
  flip('pharaoh',-1);walkTo('joseph',820,656,1200);await wait(1200,true);
  pose('pharaoh','point');await say('pharaoh','See, I have set thee over all the land of Egypt.',{ref:'GENESIS 41:41'});pose('pharaoh','give');
  cls('pharaoh','ring',0);const r=$('ringF');r.style.opacity=1;await wait(250,true);r.style.transform='translate(870px,500px)';await wait(1000,true);r.style.opacity=0;
  cls('joseph','ring',1);cls('joseph','chain',1);pose('pharaoh','stand');burst();expr('joseph','happy');expr('butler','happy');
  await narr('“And Pharaoh took off his ring from his hand, and put it upon Joseph’s hand, and arrayed him in vestures of fine linen, and put a gold chain about his neck…”','GENESIS 41:42 · KJV',5600,760);
 }});

S({id:'chariot',focus:860,draw:()=>`<rect width="1280" height="720" fill="url(#skyD)"/>${sun(1100,120)}${cloud(120,.8,-20)}
 ${pyramid(160,300,.6)}<rect x="-40" y="298" width="1360" height="16" fill="#cdb27a" ${sk(3)}/>
 <path d="M-40 312 H1320 V420 H-40Z" fill="#e9c860" ${sk(4)}/>${[...Array(26)].map((_,i)=>`<path d="M${i*52} 380 l-6 -40 M${i*52+12} 380 l4 -44 M${i*52+24} 378 l12 -36" stroke="#b88f2a" stroke-width="5" stroke-linecap="round"/>`).join('')}
 ${granary(880,420,.75)}${granary(1010,420,.68)}${granary(1150,420,.8,'grn')}${palm(50,420,.55)}
 <rect x="-40" y="416" width="1360" height="344" fill="${SAND[0]}" ${sk(4)}/>${road(540,'#e8d8b4')}
 
 ${put([['e1',{x:80,y:520,s:.82,f:1}],['e2',{x:175,y:524,s:.8,f:1}],['e3',{x:1090,y:520,s:.82,f:-1}],['e4',{x:1175,y:516,s:.8,f:-1}],['guard',{x:1255,y:522,s:.84,f:-1}]])}
 ${[0,1,2,3,4,5,6].map(i=>sheafT('sh'+i,250+i*68,500)).join('')}${chariot()}`,
 run:async()=>{cast.joseph={x:0,y:0,s:.8,f:1,k:1};
  walkTo('chariot',820,590,4600);
  await narr('“And he made him to ride in the second chariot which he had; and they cried before him, Bow the knee…”','GENESIS 41:43 · KJV',5000);
  $('mv-chariot').classList.add('still');['e1','e2'].forEach(id=>cls(id,'bowR',1));['e3','e4','guard'].forEach(id=>cls(id,'bowL',1));
  await narr('“And Joseph was thirty years old when he stood before Pharaoh king of Egypt.”','GENESIS 41:46 · KJV',4400);
  ['e1','e2','e3','e4','guard'].forEach(id=>{cls(id,'bowR',0);cls(id,'bowL',0)});
  await narr('“And in the seven plenteous years the earth brought forth by handfuls.”','GENESIS 41:47 · KJV',4200);
  await tapGame({ids:[0,1,2,3,4,5,6].map(i=>'sh'+i),hint:'The seven years of plenty: tap the corn to store it up.',fx:450,
   onTap:(el)=>{el.style.transform='translate(1150px,392px)';setTimeout(()=>el.style.opacity=0,900)}});
  await narr('“And Joseph gathered corn as the sand of the sea, very much, until he left numbering; for it was without number.”','GENESIS 41:49 · KJV',5200);
  await narr('“…and the dearth was in all lands; but in all the land of Egypt there was bread.”','GENESIS 41:54 · KJV',4400);
  await narr('“And all countries came into Egypt to Joseph for to buy corn…”','GENESIS 41:57 · KJV',4000);
  await narr('From the pit, to the prison, to the palace: God was with Joseph all the way.','',3800);
 }});
//@@moments
