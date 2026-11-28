const { chromium } = require('playwright');const fs=require('fs');
const trophy=fs.readFileSync('trophy.svg','utf8').replace(/width="50" height="50"/,'');
const G='#f0c760';
const ic={
 pray:`<svg viewBox="0 0 64 64"><defs><linearGradient id="f" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e85d26"/><stop offset="1" stop-color="#ffc061"/></linearGradient></defs><path d="M32 5c10 9 15 17 15 26a15 15 0 0 1-30 0c0-7 3.8-12.6 7.4-16.4.3 5 2.6 8.2 5.4 8.9C27.9 16.6 29.3 10.7 32 5Z" fill="url(#f)"/><path d="M32 30c3.6 3.4 5.4 6.2 5.4 9.4a5.4 5.4 0 0 1-10.8 0c0-3 1.8-5.6 5.4-9.4Z" fill="#fff3d6"/></svg>`,
 quote:`<svg viewBox="0 0 64 64"><path d="M14 40c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H14Zm22 0c0-10 5-17 15-21l2 4c-5 2.6-7.6 6-8 10h7v14H36Z" fill="${G}"/></svg>`,
 mail:`<svg viewBox="0 0 64 64" fill="none" stroke="${G}" stroke-width="3.2" stroke-linejoin="round"><rect x="9" y="16" width="46" height="33" rx="5"/><path d="m11 19 21 16 21-16" stroke-linecap="round"/></svg>`,
 hand:`<svg viewBox="0 0 64 64" fill="none" stroke="${G}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 34c8-9 18-15 22-15s14 6 22 15M18 46h28M32 19V8m-9 4 3 5m15-5-3 5"/></svg>`
};
const cards={
 play:{icon:trophy,k:'Daily Bible games',h:'Play &amp; Grow',sub:'10 questions a day. Can you get them all?',chips:['Play free','Word of the Day','60-second Blitz','Team Battle']},
 testimonies:{icon:ic.quote,k:'Testimonies',h:'God is still <em>doing it.</em>',sub:'Read what God has done, and share your own testimony.',verse:['The LORD hath done great things for us; whereof we are glad.','Psalm 126:3']},
 prayer:{icon:ic.pray,k:'Prayer request',h:'Request prayer',sub:'Tell us what to pray about. Our prayer team will stand with you.',verse:['Call unto me, and I will answer thee.','Jeremiah 33:3']},
 testimony:{icon:ic.quote,k:'Testimony',h:'Share your testimony',h1:88,sub:'Tell us what God has done. Your story could strengthen someone today.',verse:['And they overcame him by the blood of the Lamb, and by the word of their testimony.','Revelation 12:11']},
 contact:{icon:ic.mail,k:'Contact us',h:'We&rsquo;d love to <em>hear from you.</em>',h1:84,sub:'Questions, ministry support or anything else. We will reply with care.'},
 reachout:{icon:ic.hand,k:'Reach out to us',h:'How can we <em>help you?</em>',h1:88,sub:'Request prayer, share a testimony or send us a message.',chips:['Request prayer','Share a testimony','Contact us']}
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});
const tpl=fs.readFileSync('card.html','utf8');
for(const [k,c] of Object.entries(cards)){fs.writeFileSync('_'+k+'.html',tpl.replace('__CARD__',JSON.stringify(c)));
 await p.goto('file://'+__dirname+'/_'+k+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
 await p.screenshot({path:'share-'+k+'.jpg',type:'jpeg',quality:86});console.log(k,fs.statSync('share-'+k+'.jpg').size);}
await b.close();})();
