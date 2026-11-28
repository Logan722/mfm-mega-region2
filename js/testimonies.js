/* Testimonies page: category filter, search, load more, full-testimony reader (Dawn chose the sidebar design, Nov 26 2026) */
(function(){var root=document.querySelector('[data-tl]');if(!root)return;var items=[].slice.call(root.querySelectorAll('[data-it]')),size=+(root.getAttribute('data-size')||9),shown=size,cat='all',q='';
var moreB=document.querySelector('[data-more]'),cnt=document.querySelector('[data-count]'),empty=document.querySelector('.empty');
function match(it){return (cat==='all'||it.getAttribute('data-cat')===cat)&&(!q||it.getAttribute('data-q').indexOf(q)>=0);}
function draw(){var m=items.filter(match);items.forEach(function(it){it.hidden=true;});m.slice(0,shown).forEach(function(it){it.hidden=false;});
 if(moreB){moreB.hidden=m.length<=shown;}if(cnt)cnt.textContent='Showing '+Math.min(shown,m.length)+' of '+m.length+' testimonies';if(empty)empty.style.display=m.length?'none':'block';
 document.querySelectorAll('[data-shelf]').forEach(function(s){var v=[].some.call(s.querySelectorAll('[data-it]'),function(x){return !x.hidden;});s.hidden=!v;});
 document.querySelectorAll('[data-cnt]').forEach(function(b){var c=b.getAttribute('data-cnt');b.textContent=items.filter(function(it){return c==='all'||it.getAttribute('data-cat')===c;}).length;});}
document.querySelectorAll('[data-cat-btn]').forEach(function(b){b.addEventListener('click',function(){cat=b.getAttribute('data-cat-btn');shown=size;document.querySelectorAll('[data-cat-btn]').forEach(function(x){x.classList.toggle('on',x===b||x.getAttribute('data-cat-btn')===cat);});draw();});});
document.querySelectorAll('[data-q-in]').forEach(function(i){i.addEventListener('input',function(){q=i.value.trim().toLowerCase();shown=size;draw();});});
if(moreB)moreB.addEventListener('click',function(){shown+=size;draw();});
var md=document.getElementById('dzModal');document.addEventListener('click',function(e){var r=e.target.closest&&e.target.closest('[data-read]');if(r){var a=r.closest('[data-it]');md.querySelector('.c').innerHTML=a.querySelector('.tag').outerHTML+'<h3>'+a.querySelector('h3').innerHTML+'</h3><p>'+a.querySelector('p').innerHTML+'</p>'+a.querySelector('.by').outerHTML;md.classList.add('open');md.querySelector('.x').focus();}
 if(e.target===md||(e.target.closest&&e.target.closest('.dz-modal .x')))md.classList.remove('open');});
document.addEventListener('keydown',function(e){if(e.key==='Escape')md.classList.remove('open');});
draw();
// a shared testimony link (/testimonies/<slug> -> /testimonies#<slug>) opens that testimony (Dawn, Nov 28 2026)
(function(){var id=decodeURIComponent((location.hash||'').slice(1));if(!id)return;var a=document.getElementById(id);if(!a||!a.hasAttribute('data-it'))return;var i=items.indexOf(a);if(i>=shown){shown=Math.ceil((i+1)/size)*size;draw();}
 setTimeout(function(){a.scrollIntoView({block:'center'});var r=a.querySelector('[data-read]');if(r)r.click();},60);})();
document.querySelectorAll('[data-cnt]').forEach(function(s){var b=s.closest('button');if(b&&s.textContent==='0')b.hidden=true;});})();
