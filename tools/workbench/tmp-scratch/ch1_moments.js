async function walkGame(){
 const W=$('world'),prog=$('prog'),pi=$('progI');let off=0,held=false,last=performance.now(),idle=0,said1=false,done=false;const END=3360;
 act.innerHTML='Hold to walk';act.classList.add('on');act.style.bottom='4cqw';prog.classList.add('on');prog.style.top='3cqw';
 const down=e=>{e.preventDefault();e.stopPropagation();held=true;idle=0},up=e=>{held=false};
 act.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
 const key=e=>{if(e.code==='Space'||e.code==='ArrowRight'){held=e.type==='keydown';e.preventDefault()}};window.addEventListener('keydown',key);window.addEventListener('keyup',key);
 await new Promise(res=>{function tick(t){const dt=Math.min(50,t-last);last=t;idle+=dt;
   const auto=idle>5000;const v=held?0.32:(auto?0.16:0);if(auto&&!held)act.innerHTML='Hold to walk faster';
   if(v>0){off+=v*dt;P('joseph').classList.add('walk')}else P('joseph').classList.remove('walk');
   off=Math.min(off,END);W.style.transform=`translateX(${-off}px)`;pi.style.width=(off/END*100)+'%';
   if(!said1&&off>900){said1=true;held=false;P('joseph').classList.remove('walk');act.classList.remove('on');cast.man.x=1700-off;
     (async()=>{const ox=off;cast.man.x=1700-ox;await say('man','What seekest thou?',{ref:'GENESIS 37:15'});await say('joseph','I seek my brethren: tell me, I pray thee, where they feed their flocks.',{ref:'GENESIS 37:16'});await say('man','They are departed hence; for I heard them say, Let us go to Dothan.',{ref:'GENESIS 37:17'});act.classList.add('on');idle=0;requestAnimationFrame(tick)})();return}
   if(off>=END){done=true;P('joseph').classList.remove('walk');res();return}
   requestAnimationFrame(tick)}requestAnimationFrame(tick)});
 act.classList.remove('on');prog.classList.remove('on');act.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('keydown',key);window.removeEventListener('keyup',key);
 addPts(50);pop('+50',50,30);await narr('Joseph reached Dothan.','',1800);
}
async function prayMoment(){
 await narr('Years later his brothers remembered “the anguish of his soul, when he besought us, and we would not hear…”','GENESIS 42:21 · KJV',4400);
 await narr('Before the story goes on, take a moment to pray.','',2200);
 act.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-4 3-6 4-9z" fill="#ff8a2a" stroke="#2b1a10" stroke-width="2" stroke-linejoin="round"/></svg> Pray';act.style.bottom='46%';act.classList.add('on');cap.innerHTML='';
 await new Promise(res=>{let t=setTimeout(go,9000);function go(){clearTimeout(t);act.removeEventListener('click',go);res()}act.addEventListener('click',e=>{e.stopPropagation();go()},{once:true})});
 act.classList.remove('on');$('beam').classList.add('on');addPts(50);pop('+50',50,26);
 await narr('“The LORD is nigh unto all them that call upon him, to all that call upon him in truth.”','PSALM 145:18 · KJV',4400);
}
