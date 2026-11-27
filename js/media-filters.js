/* Media library: on phones the filters fold under a filter button beside the search strip. */
(function(){
  var f=document.querySelector('.media-filters');if(!f)return;
  var lab=f.querySelector(':scope>label');if(!lab)return;
  var row=document.createElement('div');row.className='mf-row';f.insertBefore(row,lab);row.appendChild(lab);
  var b=document.createElement('button');b.type='button';b.className='mf-toggle';b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Show filters');
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18l-7 8.5V20l-4-2v-4.5z"/></svg><span>Filters</span><b hidden></b>';
  row.appendChild(b);
  var ids=['mPlaylist','mProgram','mSpeaker','mTopic','mYear'],badge=b.querySelector('b');
  function count(){var n=0;ids.forEach(function(i){var s=document.getElementById(i);if(s&&s.value&&s.value!=='All')n++;});badge.textContent=n;badge.hidden=!n;b.setAttribute('aria-label',(f.classList.contains('open')?'Hide filters':'Show filters')+(n?' ('+n+' on)':''));}
  b.addEventListener('click',function(){var o=!f.classList.contains('open');f.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');count();});
  f.addEventListener('change',count);f.addEventListener('click',function(e){if(e.target.closest('.quick-filter-row button,#mClear'))setTimeout(count,0);});
  count();
})();
