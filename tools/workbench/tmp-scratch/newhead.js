/* ---------- character rig ---------- */
/* 3/4 view, facing +x. Head is an egg shape with a real jaw and chin; features sit on a face line
   at x≈.34R: eyes on the middle line, nose between eyes and mouth, mouth a third of the way up from the chin. */
const P=(x,y)=>`${(x*R).toFixed(1)} ${(y*R).toFixed(1)}`;
const HEAD=`M${P(0,-1.08)} C${P(.64,-1.08)} ${P(.96,-.64)} ${P(.95,-.12)} C${P(.94,.32)} ${P(.82,.64)} ${P(.58,.88)} Q${P(.38,1.07)} ${P(.12,1.04)} C${P(-.3,.98)} ${P(-.62,.72)} ${P(-.8,.36)} C${P(-.98,0)} ${P(-.97,-.56)} ${P(-.62,-.88)} C${P(-.42,-1.04)} ${P(-.22,-1.08)} ${P(0,-1.08)} Z`;
const EYE=[{x:.06,rx:.155,ry:.185},{x:.62,rx:.125,ry:.17}],EY=.02;
function face(o){
 const bc=o.brow||'#3b2414',mc='#6a2a1c',sk2=sk(2.4),bw=R*.085,ey=EY*R;
 const eyes=EYE.map(e=>{const x=e.x*R,rx=e.rx*R,ry=e.ry*R;return `<ellipse cx="${x}" cy="${ey}" rx="${rx}" ry="${ry}" fill="#fff" ${sk2}/><circle cx="${x+rx*.32}" cy="${ey+ry*.08}" r="${Math.min(rx,ry)*.62}" fill="#2a1a12"/><circle cx="${x+rx*.5}" cy="${ey-ry*.22}" r="${R*.035}" fill="#fff"/>`}).join('');
 const brow=(lift,tilt,w)=>EYE.map((e,i)=>{const x=e.x*R,hw=e.rx*R*1.05,y=ey-e.ry*R-R*.11-lift,t=(i?-tilt:tilt);return `<path d="M${x-hw} ${y+t+R*.02} Q${x} ${y-R*.04} ${x+hw} ${y-t+R*.02}" stroke="${bc}" stroke-width="${w||bw}" stroke-linecap="round" fill="none"/>`}).join('');
 const lids=EYE.map(e=>{const x=e.x*R,rx=e.rx*R+1.5,ry=e.ry*R+1.5;return `<path d="M${x-rx} ${ey-R*.01} A${rx} ${ry} 0 0 1 ${x+rx} ${ey-R*.01} Z" fill="${o.skin}" stroke="${OL}" stroke-width="2.4"/>`}).join('');
 const mx=R*.36,my=R*.64,mw=R*.15;
 const M={neutral:`<path d="M${mx-mw} ${my} Q${mx} ${my+R*.03} ${mx+mw} ${my-R*.01}" stroke="${mc}" stroke-width="${R*.065}" fill="none" stroke-linecap="round"/>`,
  smile:`<path d="M${mx-mw*1.15} ${my-R*.04} Q${mx} ${my+R*.15} ${mx+mw*1.15} ${my-R*.05}" stroke="${mc}" stroke-width="${R*.065}" fill="none" stroke-linecap="round"/>`,
  happy:`<path d="M${mx-mw*1.35} ${my-R*.06} Q${mx} ${my+R*.3} ${mx+mw*1.35} ${my-R*.07} Z" fill="${mc}" stroke="${mc}" stroke-width="2" stroke-linejoin="round"/><path d="M${mx-mw*.9} ${my-R*.04} Q${mx} ${my+R*.02} ${mx+mw*.9} ${my-R*.05}" stroke="#fff" stroke-width="${R*.05}" fill="none" stroke-linecap="round"/><path d="M${mx-mw*.55} ${my+R*.13} Q${mx} ${my+R*.19} ${mx+mw*.55} ${my+R*.13}" fill="#d9605a"/>`,
  jealous:`<path d="M${mx-mw} ${my+R*.05} Q${mx} ${my-R*.04} ${mx+mw} ${my+R*.06}" stroke="${mc}" stroke-width="${R*.065}" fill="none" stroke-linecap="round"/>`,
  angry:`<path d="M${mx-mw*1.2} ${my+R*.1} Q${mx} ${my-R*.12} ${mx+mw*1.2} ${my+R*.1} Z" fill="${mc}" stroke="${mc}" stroke-width="2" stroke-linejoin="round"/>`,
  sad:`<path d="M${mx-mw} ${my+R*.07} Q${mx} ${my-R*.07} ${mx+mw} ${my+R*.07}" stroke="${mc}" stroke-width="${R*.065}" fill="none" stroke-linecap="round"/>`,
  surprised:`<ellipse cx="${mx}" cy="${my+R*.03}" rx="${R*.075}" ry="${R*.11}" fill="${mc}"/>`,
  sleep:`<path d="M${mx-mw*.7} ${my} Q${mx} ${my+R*.06} ${mx+mw*.7} ${my}" stroke="${mc}" stroke-width="${R*.06}" fill="none" stroke-linecap="round"/>`};
 const closed=EYE.map(e=>{const x=e.x*R,rx=e.rx*R;return `<path d="M${x-rx} ${ey} Q${x} ${ey+R*.11} ${x+rx} ${ey}" stroke="${OL}" stroke-width="3" fill="none" stroke-linecap="round"/>`}).join('');
 const sadBrow=EYE.map((e,i)=>{const x=e.x*R,hw=e.rx*R*1.05,y=ey-e.ry*R-R*.1;const inner=i?-1:1;/* inner ends (towards the nose) go up */return `<path d="M${x-hw} ${y+(i?-R*.08:R*.04)} L${x+hw} ${y+(i?R*.04:-R*.08)}" stroke="${bc}" stroke-width="${bw}" stroke-linecap="round"/>`}).join('');
 const tear=`<path class="tear" d="M${EYE[0].x*R+R*.04} ${ey+R*.2} q${R*.06} ${R*.11} 0 ${R*.16} q${-R*.06} ${-R*.05} 0 ${-R*.16}Z" fill="#7cc6ff" stroke="${OL}" stroke-width="1.6"/>`;
 const X={neutral:brow(0,0),smile:brow(R*.03,R*.01),happy:brow(R*.08,R*.02),jealous:lids+brow(-R*.05,-R*.08),angry:lids+brow(-R*.07,-R*.13,R*.11),sad:sadBrow+tear,surprised:brow(R*.14,0),sleep:closed};
 /* 3/4 nose: bridge line down from between the eyes, soft tip, one nostril curl */
 const nose=`<path d="M${P(.36,.06)} Q${P(.5,.24)} ${P(.54,.36)} Q${P(.52,.45)} ${P(.4,.44)}" fill="none" stroke="${OL}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M${P(.31,.42)} Q${P(.35,.47)} ${P(.4,.44)}" fill="none" stroke="${OL}" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>`;
 const blush=`<ellipse cx="${P(.76,.4).split(' ')[0]}" cy="${.4*R}" rx="${R*.11}" ry="${R*.07}" fill="#e0716a" opacity=".35"/><ellipse cx="${-.1*R}" cy="${.42*R}" rx="${R*.14}" ry="${R*.08}" fill="#e0716a" opacity=".3"/>`;
 const lash=o.lash?EYE.map(e=>{const x=e.x*R,rx=e.rx*R,ry=e.ry*R;return `<path d="M${x+rx*.35} ${ey-ry*.92} l${R*.04} ${-R*.09} M${x+rx*.78} ${ey-ry*.62} l${R*.08} ${-R*.07} M${x+rx*1.02} ${ey-ry*.2} l${R*.09} ${-R*.03}" stroke="${OL}" stroke-width="2.4" stroke-linecap="round"/>`}).join(''):'';
 const age=o.age?`<path d="M${P(-.2,-.58)} Q${P(.3,-.66)} ${P(.78,-.56)} M${P(-.1,-.47)} Q${P(.3,-.53)} ${P(.7,-.46)}" stroke="${shade(o.skin,-42)}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M${P(.84,.06)} l${R*.08} ${-R*.04} M${P(.84,.13)} l${R*.08} ${R*.02}" stroke="${shade(o.skin,-42)}" stroke-width="2" stroke-linecap="round"/>`:'';
 return `${age}${nose}<g class="eyes">${eyes}${lash}</g>${blush}`+Object.keys(M).map(k=>`<g class="ex ex-${k}">${X[k]}<g class="mouth">${M[k]}</g></g>`).join('');
}
function head(o){
 let h='';const veil=o.wrap&&o.lash;
 /* behind the head: drapes and lappets */
 if(o.wrap)h+=veil?`<path d="M${P(.2,-1.1)} C${P(-.9,-1.2)} ${P(-1.25,-.4)} ${P(-1.25,.4)} L${P(-1.4,1.85)} Q${P(-.7,2.0)} ${P(-.05,1.7)} L${P(-.2,.9)} Z" fill="${shade(o.wrap,-14)}" ${sk()}/>`
  :`<path d="M${P(.1,-1.1)} C${P(-.8,-1.15)} ${P(-1.15,-.5)} ${P(-1.12,.1)} L${P(-1.3,1.6)} Q${P(-.7,1.78)} ${P(-.25,1.45)} L${P(-.4,.55)} Z" fill="${shade(o.wrap,-14)}" ${sk()}/>`;
 if(o.nemes)h+=`<path d="M${P(.3,-1.0)} C${P(-.7,-1.2)} ${P(-1.25,-.5)} ${P(-1.25,.1)} L${P(-1.42,1.95)} L${P(-.3,1.95)} L${P(-.42,.5)} Z" fill="url(#nem)" ${sk()}/>`;
 if(o.wig)h+=`<path d="M${P(.2,-1.1)} C${P(-.7,-1.18)} ${P(-1.14,-.6)} ${P(-1.14,0)} L${P(-1.1,.92)} L${P(-.4,.92)} Z" fill="${o.wig}" ${sk()}/>`;
 /* the head */
 h+=`<path d="${HEAD}" fill="${o.skin}" ${sk()}/>`;
 /* ear (hidden by head-cloths and wigs) */
 if(!o.wrap&&!o.wig&&!o.nemes)h+=`<path d="M${P(-.52,-.12)} C${P(-.82,-.2)} ${P(-.86,.32)} ${P(-.56,.34)}" fill="${o.skin}" ${sk(3.2)}/><path d="M${P(-.6,-.02)} Q${P(-.72,.08)} ${P(-.6,.2)}" stroke="${shade(o.skin,-40)}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
 /* beard and moustache: frame the jaw, leave the mouth open */
 if(o.beard){const L=o.beard==='long'?1.9:1.28,bc=o.bc;
  h+=`<path d="M${P(-.62,.1)} C${P(-.62,.78)} ${P(-.25,L)} ${P(.2,L)} C${P(.62,L-.04)} ${P(.9,.78)} ${P(.92,.16)} Q${P(.86,.46)} ${P(.66,.54)} Q${P(.54,.86)} ${P(.34,.86)} Q${P(.14,.86)} ${P(.06,.56)} Q${P(-.3,.48)} ${P(-.62,.1)} Z" fill="${bc}" ${sk()}/>`+
   `<path d="M${P(.1,.54)} Q${P(.36,.42)} ${P(.64,.52)} Q${P(.52,.62)} ${P(.37,.57)} Q${P(.22,.62)} ${P(.1,.54)} Z" fill="${bc}" ${sk(2.6)}/>`+(o.beard==='long'?`<path d="M${P(0,1.2)} Q${P(.2,1.5)} ${P(.12,1.75)} M${P(.42,1.15)} Q${P(.5,1.45)} ${P(.4,1.7)}" stroke="${shade(bc,-30)}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>`:'')}
 /* hair: soft curls on the crown and back, hairline above the brows */
 if(o.hair)h+=`<path d="M${P(.9,-.5)} C${P(.8,-1.2)} ${P(-.6,-1.35)} ${P(-.9,-.6)} C${P(-1.05,-.2)} ${P(-.95,.25)} ${P(-.78,.42)} L${P(-.6,.1)} Q${P(-.52,-.35)} ${P(-.18,-.48)} Q${P(.35,-.66)} ${P(.9,-.5)} Z" fill="${o.hair}" ${sk()}/>`+
   [[-.62,-.78,.3],[-.2,-.98,.3],[.26,-.96,.27],[.66,-.76,.22],[-.92,-.36,.26],[-.86,.08,.22]].map(([x,y,r])=>`<circle cx="${x*R}" cy="${y*R}" r="${r*R}" fill="${o.hair}" ${sk(3.4)}/>`).join('')+
   `<path d="M${P(.9,-.5)} C${P(.8,-1.2)} ${P(-.6,-1.35)} ${P(-.9,-.6)} C${P(-1.05,-.2)} ${P(-.95,.25)} ${P(-.78,.42)} L${P(-.6,.1)} Q${P(-.52,-.35)} ${P(-.18,-.48)} Q${P(.35,-.66)} ${P(.9,-.5)} Z" fill="${o.hair}"/>`+
   `<path d="M${P(.1,-.62)} q${R*.12} ${-R*.1} ${R*.24} 0 M${P(-.4,-.6)} q${R*.1} ${-R*.12} ${R*.2} -.01" stroke="${shade(o.hair,40)}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".55"/>`;
 /* front caps: cover the crown down to a hairline above the brows */
 if(o.wig)h+=`<path d="M${P(.94,-.48)} C${P(.86,-1.28)} ${P(-.96,-1.34)} ${P(-1.06,-.3)} L${P(-1.0,.86)} L${P(-.34,.86)} L${P(-.26,.04)} Q${P(-.12,-.46)} ${P(.3,-.52)} Q${P(.64,-.56)} ${P(.94,-.48)} Z" fill="${o.wig}" ${sk()}/><path d="M${P(.1,-.6)} Q${P(-.4,-.9)} ${P(-.8,-.5)}" stroke="${shade(o.wig,40)}" stroke-width="2.4" fill="none" opacity=".5" stroke-linecap="round"/>`;
 if(o.nemes)h+=`<path d="M${P(.96,-.5)} C${P(.88,-1.36)} ${P(-1.0,-1.42)} ${P(-1.1,-.3)} L${P(-.66,.5)} L${P(-.34,-.1)} Q${P(-.12,-.5)} ${P(.3,-.56)} Q${P(.66,-.6)} ${P(.96,-.5)} Z" fill="url(#nem)" ${sk()}/><path d="M${P(.96,-.52)} Q${P(.3,-.6)} ${P(-.12,-.52)} Q${P(-.3,-.32)} ${P(-.36,-.08)} L${P(-.66,.5)}" stroke="#e9a826" stroke-width="${.14*R}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${P(.96,-.52)} Q${P(.3,-.6)} ${P(-.12,-.52)} Q${P(-.3,-.32)} ${P(-.36,-.08)} L${P(-.66,.5)}" stroke="${OL}" stroke-width="2.4" fill="none" opacity=".55" stroke-linejoin="round"/>`;
 if(o.wrap)h+=veil?`<path d="M${P(.92,-.44)} C${P(.9,-1.32)} ${P(-1.02,-1.42)} ${P(-1.14,-.3)} L${P(-1.18,.9)} Q${P(-.8,1.15)} ${P(-.3,1.02)} Q${P(-.5,.6)} ${P(-.42,.1)} Q${P(-.34,-.4)} ${P(.12,-.5)} Q${P(.6,-.54)} ${P(.92,-.44)} Z" fill="${o.wrap}" ${sk()}/><path d="M${P(.1,-1.02)} Q${P(-.6,-.9)} ${P(-.86,.4)}" stroke="${shade(o.wrap,-22)}" stroke-width="2.4" fill="none" opacity=".7" stroke-linecap="round"/>`
  :`<path d="M${P(.92,-.44)} C${P(.88,-1.28)} ${P(-.98,-1.38)} ${P(-1.08,-.3)} L${P(-.9,.62)} Q${P(-.66,.4)} ${P(-.5,.05)} Q${P(-.36,-.38)} ${P(.12,-.5)} Q${P(.6,-.54)} ${P(.92,-.44)} Z" fill="${o.wrap}" ${sk()}/>`;
 h+=face(o);
 if(o.wrap)h+=`<path d="M${P(.93,-.47)} Q${P(.3,-.6)} ${P(-.2,-.48)} Q${P(-.5,-.36)} ${P(-.62,-.08)}" stroke="${o.band}" stroke-width="${.13*R}" fill="none" stroke-linecap="round"/><path d="M${P(.93,-.47)} Q${P(.3,-.6)} ${P(-.2,-.48)} Q${P(-.5,-.36)} ${P(-.62,-.08)}" stroke="${OL}" stroke-width="2" fill="none" opacity=".45"/>`;
 if(o.turban)h+=`<path d="M${P(-1.0,-.12)} Q${P(-1.12,-1.36)} ${P(.04,-1.44)} Q${P(1.06,-1.36)} ${P(.97,-.36)} Q${P(.2,-.62)} ${P(-1.0,-.12)} Z" fill="${o.turban}" ${sk()}/><path d="M${P(-.85,-.5)} Q${P(.05,-1.0)} ${P(.88,-.66)} M${P(-.6,-.92)} Q${P(.1,-1.28)} ${P(.7,-1.02)}" stroke="${OL}" stroke-width="2.6" fill="none" opacity=".45"/><circle cx="${.6*R}" cy="${-.64*R}" r="${.1*R}" fill="#e9a826" ${sk(2.4)}/>`;
 return h;
}
