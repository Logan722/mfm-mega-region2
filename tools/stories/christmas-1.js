//@@meta
{"ch":"christmas-1","name":"The First Christmas","num":1,"ctitle":"A Saviour Is Born","ref":"Luke 1–2 · Matthew 1–2","min":10,"event":1,"desc":"Play the first Christmas as an animated storybook, straight from Luke 1–2 and Matthew 1–2: the angel and Mary, Joseph’s dream, the manger in Bethlehem, the shepherds and the wise men. Answer as the story unfolds and lift your branch on the Play &amp; Grow leaderboard."}
//@@look
const COAT=['#2f4f8f','#e9a826','#fbfaf3','#c8312b','#2e9b57','#7a3fa0'];
const LOOK={
 mary:{name:'Mary',skin:'#b98a5f',robe:'#e8dcc4',sash:'#8a5a2b',wrap:'#3f6fb5',band:'#e9c860',lash:1,cls:'b1'},
 josephN:{name:'Joseph',skin:'#a87550',robe:'#8a5a35',sash:'#e9d9b0',wrap:'#d9c9a3',band:'#5a3d22',beard:'short',bc:'#2a1a10',cls:'b2'},
 angel:{name:'The angel of the Lord',skin:'#c9966a',robe:'#fbfaf3',sash:'#e9c860',hair:'#3a2616',cls:'b3'},
 shep1:{name:'Shepherd',skin:'#a26f4b',robe:'#8a7d6a',sash:'#4a3a2a',wrap:'#c9b78e',band:'#4a3420',beard:'short',bc:'#24170f',staff:1,cls:'b1'},
 shep2:{name:'Shepherd',skin:'#8f603f',robe:'#7a5a3a',sash:'#2b1a10',wrap:'#e2d6b8',band:'#6b4a2b',beard:'long',bc:'#d8d2c6',brow:'#d8d2c6',age:1,staff:1,cls:'b2'},
 shep3:{name:'Shepherd',skin:'#b07a52',robe:'#5f6b4a',sash:'#c9952c',hair:'#2a1a12',cls:'b4'},
 herod:{name:'Herod the king',skin:'#b78457',robe:'#6f2a6a',sash:'#e9a826',hair:'#2a1d12',beard:'short',bc:'#1d130c',crown:1,cls:'b3'},
 priest1:{name:'The chief priests and scribes',skin:'#a87550',robe:'#eef0f4',sash:'#2f4f8f',wrap:'#f4f1ea',band:'#2f4f8f',beard:'long',bc:'#3a2a1a',cls:'b1'},
 priest2:{name:'Scribe',skin:'#9c6a47',robe:'#4f6fa8',sash:'#e9d9b0',wrap:'#e8dcc0',band:'#4a3420',beard:'short',bc:'#24170f',cls:'b4'},
 wise1:{name:'The wise men',skin:'#8c5d3c',robe:'#7a3fa0',sash:'#e9a826',turban:'#e9c860',beard:'short',bc:'#1d130c',cls:'b1'},
 wise2:{name:'Wise man',skin:'#b07a52',robe:'#2e7d6f',sash:'#c8312b',turban:'#c8312b',beard:'long',bc:'#d8d2c6',brow:'#d8d2c6',age:1,cls:'b2'},
 wise3:{name:'Wise man',skin:'#6e4a30',robe:'#c46a2b',sash:'#2f4f8f',turban:'#2f4f8f',cls:'b3'},
 wise4:{name:'Wise man',skin:'#a87550',robe:'#2f4f8f',sash:'#e9a826',turban:'#f1ece0',beard:'short',bc:'#2a1a10',cls:'b4'},
 child:{name:'Jesus',skin:'#c08a5f',robe:'#f4efe2',sash:'#c9952c',hair:'#2a1a12',child:1.32,cls:'b2'}
};
const DEFS_X=`<radialGradient id="glory" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffef4" stop-opacity="1"/><stop offset=".45" stop-color="#fff1b8" stop-opacity=".75"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>
<linearGradient id="skyBN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1430"/><stop offset=".7" stop-color="#1d2d63"/><stop offset="1" stop-color="#34437e"/></linearGradient>`;
const END={num:1,verse:'“For unto us a child is born, unto us a son is given…”',cite:'ISAIAH 9:6 · KJV',
 q:'is there room for Jesus in your heart?',a:['Yes, He is my Lord','I want to make room for Him'],
 r:['Then do what the shepherds did: tell others the good news, and glorify God for all you have heard and seen.','There was no room for Him in the inn, but there can be room in your heart. He came to save His people from their sins.'],
 pray:'Father, thank You for sending Jesus to save us from our sins. I make room for Him in my heart today. Let Your peace and good will fill my home this Christmas, in the name of Jesus.',
 next:null,more:'More Great Events are coming soon.',done:'Story complete',again:'Play it again'};
//@@scenes
/* Christmas props */
const glory=(x,y,r,id,on)=>`<circle ${id?`id="${id}" class="fade"`:''} cx="${x}" cy="${y}" r="${r}" fill="url(#glory)" style="opacity:${on===0?0:1}"/>`;
const house=(x,y,s,lit)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="-110" width="140" height="110" fill="#d9c49a" ${ol}/><rect x="-78" y="-122" width="156" height="16" rx="3" fill="#b89a6a" ${ol}/><rect x="-18" y="-60" width="36" height="60" rx="4" fill="#5a3d22" ${ol}/><rect x="30" y="-90" width="24" height="22" rx="3" fill="${lit?'#ffd27a':'#3a2614'}" ${sk(3)}/></g>`;
const town=(gy,lit)=>[[860,gy,.7],[980,gy-10,.85],[1110,gy,.75],[1210,gy-14,.6],[760,gy+4,.55]].map(([x,y,s],i)=>house(x,y,s,lit&&i%2===0)).join('');
const shelter=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-230 -330 L0 -400 L230 -330 L210 -300 L-210 -300 Z" fill="#b8924f" ${ol}/>${[-180,-110,-40,30,100,170].map(dx=>`<path d="M${dx} -330 l10 28" stroke="#8a6a35" stroke-width="4"/>`).join('')}<rect x="-200" y="-304" width="16" height="304" fill="#7a5230" ${ol}/><rect x="184" y="-304" width="16" height="304" fill="#7a5230" ${ol}/><path d="M-200 -40 H200" stroke="#7a5230" stroke-width="10"/><path d="M-200 -40 H200" stroke="${OL}" stroke-width="3" opacity=".5"/></g>`;
const manger=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-70 -70 L70 -70 L52 -20 L-52 -20 Z" fill="#9a6a38" ${ol}/><path d="M-52 -20 L-64 0 M52 -20 L64 0 M-40 -20 L-28 0 M40 -20 L28 0" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M-52 -20 L-64 0 M52 -20 L64 0 M-40 -20 L-28 0 M40 -20 L28 0" stroke="#9a6a38" stroke-width="3" stroke-linecap="round"/>${[-56,-36,-14,8,30,52].map((dx,i)=>`<path d="M${dx} -70 l${i%2?8:-8} -18" stroke="#e9c860" stroke-width="5" stroke-linecap="round"/>`).join('')}<path d="M-66 -72 Q0 -86 66 -72" stroke="#e9c860" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
const baby=(x,y,id,show)=>`<g id="${id}" class="fade" style="opacity:${show?1:0}" transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="46" ry="18" fill="#f6efe0" ${ol}/><path d="M-30 -6 Q-10 8 10 -6 M-12 -14 Q8 2 28 -12" stroke="#d9cbb2" stroke-width="3" fill="none"/><circle cx="34" cy="-8" r="15" fill="#c08a5f" ${ol}/><path d="M30 -10 q3 3 6 0 M38 -11 q3 3 6 0" stroke="${OL}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M33 -3 q4 3 8 0" stroke="#6a2a1c" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M22 -16 Q34 -30 48 -14" fill="#f6efe0" ${sk(3)}/></g>`;
const host=(id,x,y)=>`<g id="${id}"><circle cx="${x}" cy="${y}" r="22" fill="#fff6c8" ${sk(3)}/><g class="hh fade" style="opacity:0">${glory(x,y+10,70)}<path d="M${x-22} ${y+62} L${x} ${y+4} L${x+22} ${y+62} Z" fill="#fbfaf3" ${sk(3)}/><circle cx="${x}" cy="${y}" r="13" fill="#c9966a" ${sk(3)}/><circle cx="${x-4}" cy="${y-7}" r="9" fill="#3a2616"/><path d="M${x-14} ${y+22} l-16 -18 M${x+14} ${y+22} l16 -18" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M${x-14} ${y+22} l-16 -18 M${x+14} ${y+22} l16 -18" stroke="#fbfaf3" stroke-width="3.5" stroke-linecap="round"/></g></g>`;
const gift=(id,x,y,k)=>`<g id="${id}" style="transform:translate(${x}px,${y}px);transition:transform 1s cubic-bezier(.45,.05,.25,1)">${k===0?`<rect x="-24" y="-30" width="48" height="30" rx="4" fill="#e9a826" ${ol}/><rect x="-28" y="-40" width="56" height="12" rx="4" fill="#c9952c" ${ol}/><circle cx="0" cy="-16" r="6" fill="#fff6c8"/>`:k===1?`<path d="M-18 0 L-22 -36 Q0 -46 22 -36 L18 0Z" fill="#8a5a35" ${ol}/><ellipse cx="0" cy="-38" rx="22" ry="7" fill="#c9a46e" ${ol}/><path d="M-4 -46 q-8 -14 4 -24 q8 -10 0 -18" stroke="#efe6d2" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>`:`<path d="M-12 0 L-16 -32 Q-16 -44 0 -48 Q16 -44 16 -32 L12 0Z" fill="#2e7d6f" ${ol}/><rect x="-7" y="-60" width="14" height="14" rx="3" fill="#c8312b" ${ol}/>`}</g>`;
const starBig=(id,x,y,on)=>`<g id="${id}" class="fade" style="opacity:${on?1:0};transform:translate(${x}px,${y}px);transition:transform 4.5s cubic-bezier(.4,.1,.2,1),opacity .8s"><circle r="70" fill="url(#glory)"/><path d="M0 -34 L8 -8 L34 0 L8 8 L0 34 L-8 8 L-34 0 L-8 -8Z" fill="#fff6c8" ${sk(3)}/></g>`;
const nightSky=(n)=>`<rect width="1280" height="720" fill="url(#skyBN)"/>${[...Array(n||44)].map((_,i)=>star((i*137)%1280,(i*61)%360+20,3+(i%3)*2,'tw',(i%7)*.3)).join('')}`;
const mangerBG=()=>`${nightSky()}<circle cx="160" cy="110" r="40" fill="#fff4c9" ${ol}/><circle cx="178" cy="98" r="36" fill="#0b1430"/>
 ${town(400,1)}${house(150,410,.6,1)}${hills(['#2d4a6e','#264262','#3b4f6a','#2c3b52'],560)}
 <rect x="-40" y="556" width="1360" height="204" fill="#3a3a2a" ${sk(4)}/>${shelter(640,560)}<ellipse cx="640" cy="562" rx="260" ry="16" fill="#c9a24e" ${sk(3)}/>${lamp(450,560,1)}${manger(640,562)}`;

S({id:'nazareth',focus:640,draw:()=>`<rect width="1280" height="720" fill="#ead9b8"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M0 ${100+i*64} H1280" stroke="#d9c49a" stroke-width="4"/>`).join('')}<rect width="1280" height="70" fill="#8a6a45"/>${[100,360,620,880,1140].map(x=>`<rect x="${x-30}" y="0" width="60" height="86" fill="#7a5230" ${ol}/>`).join('')}
 <g transform="translate(250 150)"><path d="M-90 220 L-90 40 Q0 -40 90 40 L90 220 Z" fill="url(#skyD)" ${ol}/><path d="M-90 220 L-90 140 Q-40 100 10 130 Q50 108 90 128 L90 220 Z" fill="#7fbf5a" ${sk(3)}/><path d="M-90 220 L-90 175 Q-10 150 90 170 L90 220Z" fill="#5fa83f"/><path d="M-90 220 L-90 40 Q0 -40 90 40 L90 220 Z" fill="none" ${ol}/></g>
 <rect y="600" width="1280" height="160" fill="#c9a878" ${sk(4)}/><path d="M320 620 L960 620 L1010 690 L270 690Z" fill="#a85a3a" ${ol}/>${jar(1080,640,.9)}${lamp(160,640,1)}
 ${put([['mary',{x:520,y:656,s:1.14,f:1}]])}
 <g id="angelG" class="fade" style="opacity:0">${glory(880,440,260)}${person('angel',{x:880,y:654,s:1.2,f:-1,k:1,expr:'smile'})}</g>${sparks(880,430)}`,
 run:async()=>{cast.angel={x:880,y:654,s:1.2,f:-1,k:1};
  await narr('“…the angel Gabriel was sent from God unto a city of Galilee, named Nazareth…”','LUKE 1:26 · KJV',4400);
  await narr('“To a virgin espoused to a man whose name was Joseph, of the house of David; and the virgin’s name was Mary.”','LUKE 1:27 · KJV',5000);
  $('angelG').style.opacity=1;burst();expr('mary','surprised');await wait(900,true);
  await say('angel','Hail, thou that art highly favoured, the Lord is with thee: blessed art thou among women.',{name:'The angel Gabriel',ref:'LUKE 1:28'});
  expr('mary','sad');await narr('“And when she saw him, she was troubled at his saying…”','LUKE 1:29 · KJV',3600);
  await say('angel','Fear not, Mary: for thou hast found favour with God.',{name:'The angel Gabriel',ref:'LUKE 1:30'});expr('mary','neutral');
  await say('angel','And, behold, thou shalt conceive in thy womb, and bring forth a son, and shalt call his name JESUS.',{name:'The angel Gabriel',ref:'LUKE 1:31'});
  await ask({tag:'Bible question',q:'What name did the angel say Mary must give her son?',o:['John','JESUS','David'],a:1,
   yes:'Right! “…thou shalt… bring forth a son, and shalt call his name JESUS.”',ref:'Luke 1:31'});
  await say('angel','He shall be great, and shall be called the Son of the Highest…',{name:'The angel Gabriel',ref:'LUKE 1:32'});
  await say('mary','How shall this be, seeing I know not a man?',{ref:'LUKE 1:34'});
  await say('angel','The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee…',{name:'The angel Gabriel',ref:'LUKE 1:35'});
  await say('angel','For with God nothing shall be impossible.',{name:'The angel Gabriel',ref:'LUKE 1:37'});
  expr('mary','smile');pose('mary','pray');
  await say('mary','Behold the handmaid of the Lord; be it unto me according to thy word.',{ref:'LUKE 1:38'});
  pose('mary','stand');$('angelG').style.opacity=0;
  await narr('“And the angel departed from her.”','LUKE 1:38 · KJV',3000);
 }});

S({id:'dream',focus:640,draw:()=>`<rect width="1280" height="720" fill="#24305a"/><rect width="1280" height="720" fill="#3a2a40" opacity=".35"/>
 <g transform="translate(1000 230)"><rect x="-100" y="-80" width="200" height="160" rx="10" fill="url(#skyBN)" ${ol}/>${star(-40,-30,8,'tw',0)}${star(30,10,6,'tw',.6)}<circle cx="40" cy="-34" r="22" fill="#fff4c9" ${sk(3)}/><path d="M0 -80 V80 M-100 0 H100" stroke="#5a3d22" stroke-width="10"/><rect x="-100" y="-80" width="200" height="160" rx="10" fill="none" ${ol}/></g>
 <rect y="600" width="1280" height="160" fill="#3a2e27" ${sk(4)}/>${lamp(260,640,1)}<circle cx="292" cy="600" r="130" fill="#ffb24a" opacity=".12"/>
 <rect x="400" y="560" width="520" height="34" rx="8" fill="#6b4a2b" ${ol}/><rect x="420" y="590" width="20" height="30" fill="#5a3d22" ${ol}/><rect x="880" y="590" width="20" height="30" fill="#5a3d22" ${ol}/><rect x="760" y="512" width="110" height="44" rx="20" fill="#f3ead6" ${ol}/>
 <g transform="translate(560 516) rotate(90)">${person('josephN',{x:0,y:0,s:1,f:-1,expr:'sleep'})}</g>
 <g transform="translate(660 562)"><path d="M-140 -2 Q-138 -78 -50 -84 L120 -80 Q142 -60 138 -2 Z" fill="#6f4a2e" ${ol}/><path d="M-120 -42 Q0 -62 126 -48" stroke="#e9c860" stroke-width="6" fill="none" stroke-dasharray="14 12"/></g>
 <g id="dreamV" class="fade" style="opacity:0"><rect width="1280" height="720" fill="url(#dreamG)"/>${[...Array(30)].map((_,i)=>star((i*137)%1280,(i*71)%640+20,3+(i%3)*2,'tw',(i%7)*.3)).join('')}${glory(640,420,330)}${person('angel',{x:640,y:660,s:1.3,f:-1,k:1,expr:'smile'})}</g>`,
 run:async()=>{cast.angel={x:640,y:660,s:1.3,f:-1,k:1};
  await narr('“Then Joseph her husband, being a just man… was minded to put her away privily.”','MATTHEW 1:19 · KJV',5000);
  $('dreamV').style.opacity=1;await wait(900,true);
  await narr('“…behold, the angel of the Lord appeared unto him in a dream…”','MATTHEW 1:20 · KJV',3600);
  await say('angel','Joseph, thou son of David, fear not to take unto thee Mary thy wife: for that which is conceived in her is of the Holy Ghost.',{ref:'MATTHEW 1:20'});
  await say('angel','And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.',{ref:'MATTHEW 1:21'});
  await ask({tag:'Bible question',q:'Why was the baby to be called JESUS?',o:['Because he would be born in Bethlehem','Because he would save his people from their sins','Because it was a family name'],a:1,
   yes:'Yes! “…thou shalt call his name JESUS: for he shall save his people from their sins.”',ref:'Matthew 1:21'});
  await narr('“…they shall call his name Emmanuel, which being interpreted is, God with us.”','MATTHEW 1:23 · KJV',4800);
  $('dreamV').style.opacity=0;await wait(900,true);expr('josephN','smile');
  await narr('“Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife…”','MATTHEW 1:24 · KJV',5200);
 }});

S({id:'road',focus:640,draw:()=>`<rect width="1280" height="720" fill="url(#skyE)"/>${cloud(110,.8,-20)}<circle cx="1060" cy="300" r="70" fill="#ffd27a" ${ol}/>${hills(DRYE,560)}${town(470,0)}${road(560,'#e8b97f')}${rocks(140,560,.7,'#9c7f68')}${acacia(1220,562,.7)}${bush(420,562,.7,'#9aa24f')}
 <g transform="translate(1180 640)"><rect x="-6" y="-110" width="12" height="110" fill="#6b4a2b" ${ol}/><rect x="-86" y="-130" width="172" height="48" rx="10" fill="#f6e3b4" ${ol}/><text x="0" y="-98" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="26" fill="${OL}">Bethlehem</text></g>
 ${put([['josephN',{x:-140,y:640,s:1.12,f:1}],['mary',{x:-280,y:644,s:1.08,f:1}]])}`,
 run:async()=>{
  walkTo('josephN',760,640,8000);walkTo('mary',620,644,8000);
  await narr('“And it came to pass in those days, that there went out a decree from Caesar Augustus, that all the world should be taxed.”','LUKE 2:1 · KJV',5200);
  await narr('“And Joseph also went up from Galilee, out of the city of Nazareth, into Judaea, unto the city of David, which is called Bethlehem…”','LUKE 2:4 · KJV',5600);
  await narr('“To be taxed with Mary his espoused wife, being great with child.”','LUKE 2:5 · KJV',4400);
 }});

S({id:'manger',focus:640,draw:()=>`${mangerBG()}${baby(640,496,'babyJ',0)}
 ${put([['mary',{x:500,y:564,s:1.0,f:1}],['josephN',{x:800,y:562,s:1.04,f:-1}]])}`,
 run:async()=>{
  await narr('“And so it was, that, while they were there, the days were accomplished that she should be delivered.”','LUKE 2:6 · KJV',4800);
  $('babyJ').style.opacity=1;expr('mary','happy');expr('josephN','happy');pose('mary','receive');
  await narr('“And she brought forth her firstborn son, and wrapped him in swaddling clothes, and laid him in a manger; because there was no room for them in the inn.”','LUKE 2:7 · KJV',6200);
  pose('mary','stand');expr('mary','smile');expr('josephN','smile');
  await ask({tag:'Bible question',q:'Where did Mary lay baby Jesus?',o:['In a manger','In a palace bed','In the temple'],a:0,
   yes:'Right! “…and laid him in a manger; because there was no room for them in the inn.”',ref:'Luke 2:7'});
 }});

S({id:'field',focus:640,draw:()=>`${nightSky(50)}
 ${[0,1,2,3,4,5,6].map(i=>host('h'+i,[300,420,540,640,740,860,980][i],[170,120,90,70,90,120,170][i])).join('')}
 ${hills(['#2f4a3a','#2a4334','#3a5440','#2e4636'],650)}${town(470,1)}
 <g transform="translate(860 650)"><path d="M-30 0 L0 -18 L30 0Z" fill="#5a3d22" ${ol}/><g class="fl"><path d="M-22 -10 Q-26 -60 0 -88 Q26 -60 22 -10Z" fill="#ff8a2a" ${ol}/><path d="M-10 -12 Q-12 -40 0 -56 Q12 -40 10 -12Z" fill="#ffd23f"/></g></g><circle cx="860" cy="610" r="140" fill="#ffb24a" opacity=".12"/>
 ${flock([[120,640,.8],[170,650,.75],[80,652,.7],[1080,640,.8],[1140,648,.75],[1190,656,.7]])}
 <g id="gloryF" class="fade" style="opacity:0">${glory(640,360,560)}</g>
 ${put([['shep1',{x:380,y:652,s:1.08,f:1}],['shep2',{x:520,y:654,s:1.04,f:1}],['shep3',{x:980,y:650,s:1.02,f:-1}]])}
 <g id="angelF" class="fade" style="opacity:0">${person('angel',{x:700,y:560,s:1.08,f:-1,k:1,expr:'smile'})}</g>`,
 run:async()=>{cast.angel={x:700,y:560,s:1.08,f:-1,k:1};
  await narr('“And there were in the same country shepherds abiding in the field, keeping watch over their flock by night.”','LUKE 2:8 · KJV',5000);
  $('gloryF').style.opacity=1;$('angelF').style.opacity=1;['shep1','shep2','shep3'].forEach(id=>expr(id,'surprised'));
  await narr('“And, lo, the angel of the Lord came upon them, and the glory of the Lord shone round about them: and they were sore afraid.”','LUKE 2:9 · KJV',5400);
  await say('angel','Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people.',{ref:'LUKE 2:10'});
  ['shep1','shep2','shep3'].forEach(id=>expr(id,'neutral'));
  await say('angel','For unto you is born this day in the city of David a Saviour, which is Christ the Lord.',{ref:'LUKE 2:11'});
  await ask({tag:'Bible question',q:'What sign did the angel give the shepherds?',o:['A rainbow across the sky','A babe wrapped in swaddling clothes, lying in a manger','A king sitting on a throne'],a:1,
   yes:'Yes! “Ye shall find the babe wrapped in swaddling clothes, lying in a manger.”',ref:'Luke 2:12'});
  await tapGame({ids:[0,1,2,3,4,5,6].map(i=>'h'+i),hint:'Suddenly the sky was full of angels: tap each light!',fx:640,
   onTap:(el)=>{el.querySelector('.hh').style.opacity=1}});
  ['shep1','shep2','shep3'].forEach(id=>{expr(id,'happy');pose(id,'joy')});
  await narr('“And suddenly there was with the angel a multitude of the heavenly host praising God, and saying…”','LUKE 2:13 · KJV',4600);
  await narr('“Glory to God in the highest, and on earth peace, good will toward men.”','LUKE 2:14 · KJV',4800);
  ['shep1','shep2','shep3'].forEach(id=>pose(id,'stand'));
  $('angelF').style.opacity=0;$('gloryF').style.opacity=0;document.querySelectorAll('[id^="h"] .hh').forEach(e=>e.style.opacity=0);await wait(900,true);
  await say('shep1','Let us now go even unto Bethlehem, and see this thing which is come to pass, which the Lord hath made known unto us.',{name:'The shepherds',ref:'LUKE 2:15'});
 }});

S({id:'visit',focus:640,draw:()=>`${mangerBG()}${baby(640,496,'babyV',1)}
 ${put([['mary',{x:520,y:564,s:1.0,f:1,expr:'smile'}],['josephN',{x:800,y:562,s:1.04,f:-1,expr:'smile'}],['shep1',{x:-140,y:566,s:.98,f:1}],['shep2',{x:-280,y:568,s:.95,f:1}],['shep3',{x:-400,y:564,s:.93,f:1}]])}`,
 run:async()=>{
  walkTo('shep1',340,566,3200);walkTo('shep2',225,568,3400);walkTo('shep3',115,564,3600);
  await narr('“And they came with haste, and found Mary, and Joseph, and the babe lying in a manger.”','LUKE 2:16 · KJV',4800);
  ['shep1','shep2','shep3'].forEach(id=>{expr(id,'happy');cls(id,'bowR',1)});
  await narr('“And when they had seen it, they made known abroad the saying which was told them concerning this child.”','LUKE 2:17 · KJV',5000);
  ['shep1','shep2','shep3'].forEach(id=>cls(id,'bowR',0));
  await narr('“But Mary kept all these things, and pondered them in her heart.”','LUKE 2:19 · KJV',4200);
  ['shep1','shep2','shep3'].forEach((id,i)=>{flip(id,-1);pose(id,'joy');walkTo(id,-200-i*120,[566,568,564][i],3800)});
  await narr('“And the shepherds returned, glorifying and praising God for all the things that they had heard and seen…”','LUKE 2:20 · KJV',5000);
 }});

S({id:'herod',focus:640,draw:()=>`<rect width="1280" height="720" fill="#e6d6b6"/><rect width="1280" height="80" fill="#6f2a6a"/><path d="M0 80 H1280" stroke="${OL}" stroke-width="5"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${i*170} 80 q85 70 170 0" fill="#7f3a7a" ${sk(3)}/>`).join('')}
 <rect y="560" width="1280" height="200" fill="#cdb589" ${sk(4)}/><path d="M300 600 L1220 600 L1280 700 L240 700Z" fill="#6f2a6a" opacity=".8" ${ol}/>
 ${[120,1180].map(x=>`<g><rect x="${x-34}" y="150" width="68" height="410" fill="#efe6d2" ${ol}/><rect x="${x-48}" y="130" width="96" height="24" rx="4" fill="#d9c49a" ${ol}/><rect x="${x-48}" y="548" width="96" height="18" fill="#d9c49a" ${ol}/></g>`).join('')}${dais(980,574,300)}
 <g transform="translate(1040 580)"><rect x="-70" y="-210" width="140" height="210" rx="12" fill="#c9952c" ${ol}/><rect x="-52" y="-190" width="104" height="130" rx="8" fill="#6f2a6a" ${ol}/><rect x="-86" y="-70" width="172" height="40" rx="8" fill="#b8862a" ${ol}/></g>
 ${put([['herod',{x:960,y:574,s:1.18,f:-1}],['priest1',{x:1160,y:572,s:1.06,f:-1}],['priest2',{x:1250,y:574,s:1.0,f:-1}],['wise1',{x:-140,y:652,s:1.08,f:1}],['wise2',{x:-270,y:654,s:1.06,f:1}],['wise3',{x:-400,y:650,s:1.04,f:1}],['wise4',{x:-530,y:654,s:1.06,f:1}]])}`,
 run:async()=>{
  walkTo('wise1',620,652,3800);walkTo('wise2',490,654,3900);walkTo('wise3',360,650,4000);walkTo('wise4',230,654,4100);
  await narr('“…behold, there came wise men from the east to Jerusalem…”','MATTHEW 2:1 · KJV',4200);
  await say('wise1','Where is he that is born King of the Jews? for we have seen his star in the east, and are come to worship him.',{ref:'MATTHEW 2:2'});
  expr('herod','jealous');
  await narr('“When Herod the king had heard these things, he was troubled, and all Jerusalem with him.”','MATTHEW 2:3 · KJV',4800);
  await say('priest1','In Bethlehem of Judaea: for thus it is written by the prophet…',{ref:'MATTHEW 2:5'});
  pose('herod','point');expr('herod','smile');
  await say('herod','Go and search diligently for the young child; and when ye have found him, bring me word again, that I may come and worship him also.',{ref:'MATTHEW 2:8'});
  pose('herod','stand');expr('herod','jealous');
  await narr('But Herod did not truly want to worship the child.','',3600);
 }});

S({id:'star',focus:640,draw:()=>`${nightSky(46)}${hills(['#2d4a6e','#264262','#3b4f6a','#2c3b52'],650)}
 ${house(380,560,.9,1)}${house(1120,566,.8,1)}<g transform="translate(760 0)">${house(0,570,1.25,1)}</g>${road(600,'#6a6a7a')}
 <rect x="-40" y="640" width="1360" height="120" fill="#3a3a48" ${sk(4)}/>${starBig('bigStar',120,110,1)}
 ${put([['wise1',{x:-140,y:652,s:1.04,f:1}],['wise2',{x:-270,y:654,s:1.02,f:1}],['wise3',{x:-400,y:650,s:1.0,f:1}],['wise4',{x:-530,y:654,s:1.02,f:1}]])}`,
 run:async()=>{
  $('bigStar').style.transform='translate(760px,250px)';
  walkTo('wise1',600,652,4800);walkTo('wise2',480,654,4900);walkTo('wise3',360,650,5000);walkTo('wise4',240,654,5100);
  await narr('“…and, lo, the star, which they saw in the east, went before them, till it came and stood over where the young child was.”','MATTHEW 2:9 · KJV',6000);
  ['wise1','wise2','wise3','wise4'].forEach(id=>{expr(id,'happy');pose(id,'joy')});
  await narr('“When they saw the star, they rejoiced with exceeding great joy.”','MATTHEW 2:10 · KJV',4400);
  ['wise1','wise2','wise3','wise4'].forEach(id=>pose(id,'stand'));
 }});

S({id:'gifts',focus:740,draw:()=>`<rect width="1280" height="720" fill="#e8d6b2"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M0 ${100+i*64} H1280" stroke="#d8c49e" stroke-width="4"/>`).join('')}<rect width="1280" height="64" fill="#7a5230"/>${[160,480,800,1120].map(x=>`<rect x="${x-26}" y="0" width="52" height="78" fill="#6b4a2b" ${ol}/>`).join('')}
 <g transform="translate(1060 200)"><rect x="-90" y="-70" width="180" height="140" rx="10" fill="url(#skyBN)" ${ol}/>${star(0,-10,14,'tw',0)}<circle cx="0" cy="-10" r="40" fill="url(#glory)"/><path d="M0 -70 V70 M-90 0 H90" stroke="#5a3d22" stroke-width="10"/><rect x="-90" y="-70" width="180" height="140" rx="10" fill="none" ${ol}/></g>
 <rect y="600" width="1280" height="160" fill="#c9a878" ${sk(4)}/><path d="M640 620 L1180 620 L1240 700 L580 700Z" fill="#2f4f8f" opacity=".85" ${ol}/>${lamp(1180,640,1)}
 ${put([['mary',{x:1010,y:654,s:1.12,f:-1,expr:'smile'}],['child',{x:900,y:654,s:.62,f:-1,expr:'smile'}],['wise1',{x:690,y:652,s:1.04,f:1}],['wise2',{x:575,y:654,s:1.02,f:1}],['wise3',{x:460,y:650,s:1.0,f:1}],['wise4',{x:345,y:654,s:1.02,f:1}]])}
 ${gift('g0',750,560,0)}${gift('g1',635,560,1)}${gift('g2',520,556,2)}`,
 run:async()=>{
  ['wise1','wise2','wise3','wise4'].forEach(id=>cls(id,'bowR',1));
  await narr('“And when they were come into the house, they saw the young child with Mary his mother, and fell down, and worshipped him…”','MATTHEW 2:11 · KJV',5800);
  ['wise1','wise2','wise3','wise4'].forEach(id=>cls(id,'bowR',0));
  const spot={g0:[800,600],g1:[755,606],g2:[845,606]},names={g0:'Gold',g1:'Frankincense',g2:'Myrrh'};
  await tapGame({ids:['g0','g1','g2'],hint:'They opened their treasures: tap each gift.',fx:700,
   onTap:(el)=>{const [x,y]=spot[el.id];el.style.transform=`translate(${x}px,${y}px)`;pop(names[el.id],50,34)}});
  await narr('“…they presented unto him gifts; gold, and frankincense, and myrrh.”','MATTHEW 2:11 · KJV',4600);
  await ask({tag:'Bible question',q:'Where did the wise men find the young child Jesus?',o:['In the manger','In a house, with Mary his mother','In Herod’s palace'],a:1,
   yes:'Right! “…when they were come into the house, they saw the young child with Mary his mother…”',ref:'Matthew 2:11'});
  ['wise1','wise2','wise3','wise4'].forEach((id,i)=>{flip(id,-1);walkTo(id,-200-i*130,[652,654,650,654][i],4600)});
  await narr('“And being warned of God in a dream that they should not return to Herod, they departed into their own country another way.”','MATTHEW 2:12 · KJV',5800);
  await narr('Unto us a Saviour was born: Jesus, God with us.','',3800);
 }});
//@@moments
