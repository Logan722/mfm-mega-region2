#!/usr/bin/env python3
"""Merge helper (Oct 11 2026): bring the October release's gallery improvements onto the gallery pages
that were rebuilt on the live site (10-photo previews, 'See all' album pages, Download + Share).

For each page it keeps the live page's content, albums, captions, Download/Share and share texts, and applies:
  * accessible photo viewer: role=dialog / aria-modal, focus trap + focus return (MFMOverlay), Esc,
    arrow keys, swipe, visible caption, 'Photo n of N' live counter, 48px targets, focus rings
  * right-sized images: tiles use <picture> 480/800 WebP + 800 JPEG with lazy loading (first 4 eager);
    the viewer uses 800/1600 WebP; Download still delivers the full original photo
  * the release's footer and scripts (overlay.js, sw-register.js, mobile-nav.js)
Usage: upgrade_gallery_pages.py DONOR_GALLERY_HTML PAGE.html [PAGE.html ...]   (pages are rewritten in place)
"""
import json, os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
donor = open(sys.argv[1]).read()
pages = sys.argv[2:]

A11Y_CSS = re.search(r'\.gl-tile picture,\.gl-tile img\{.*?\}\}', donor, re.S).group(0)
EXTRA_CSS = (".gl-lb .gl-fig{padding-bottom:72px}.gl-lb .gl-acts,.gl-lb .gl-toast{z-index:3}"
             ".gl-lb .gl-act{min-height:44px;white-space:nowrap}.gl-lb .gl-act:focus-visible{outline:3px solid #f0c760;outline-offset:2px}"
             "@media(max-width:600px){.gl-lb .gl-acts{bottom:84px}.gl-lb .gl-toast{bottom:140px}.gl-lb .gl-fig{padding-bottom:150px}.gl-lb .gl-fig img{max-height:60vh}}")
FOOTER = donor[donor.index('<footer'):donor.index('</body>')]

LIGHTBOX = ('<div class="gl-lb" id="glLb" hidden><div class="gl-dialog" role="dialog" aria-modal="true" aria-label="Photo viewer" aria-describedby="glCap">'
            '<p class="gl-ct" id="glCt" aria-live="polite"></p>'
            '<button type="button" class="gl-x" id="glX" aria-label="Close photo viewer">&times;</button>'
            '<button type="button" class="gl-arw gl-prev" id="glPrev" aria-label="Previous photo">&#8249;</button>'
            '<figure class="gl-fig"><picture><source id="glSrc" type="image/webp" sizes="92vw"><img id="glImg" alt="" decoding="async"></picture><figcaption id="glCap"></figcaption></figure>'
            '<button type="button" class="gl-arw gl-next" id="glNext" aria-label="Next photo">&#8250;</button>'
            '<div class="gl-acts"><button class="gl-act" id="glDl" type="button" aria-label="Download this photo">&#8595;&nbsp; Download</button>'
            '<button class="gl-act" id="glShare" type="button" aria-label="Share this album">&#8599;&nbsp; Share</button></div>'
            '<span class="gl-toast" id="glToast" role="status" aria-live="polite"></span></div></div>')

SCRIPT_BODY = r"""
var cur=[],idx=0,al='',opener=null;
var lb=document.getElementById('glLb'),dlg=lb.querySelector('.gl-dialog'),im=document.getElementById('glImg'),srcEl=document.getElementById('glSrc'),cap=document.getElementById('glCap'),ct=document.getElementById('glCt'),toast=document.getElementById('glToast');
function pre(it){if(!it)return;var p=new Image();p.decoding='async';p.src=it.w1600||it.src;}
function show(i){idx=(i+cur.length)%cur.length;var it=cur[idx];if(it.w800){srcEl.srcset=it.w800+' 800w, '+it.w1600+' '+(it.fw>800?it.fw:1600)+'w';}else{srcEl.removeAttribute('srcset');}
 im.src=it.jpg||it.src;if(it.fw){im.width=it.fw;im.height=it.fh;}im.alt=it.cap;cap.textContent=it.cap;ct.textContent='Photo '+(idx+1)+' of '+cur.length;
 im.onload=function(){pre(cur[(idx+1)%cur.length]);pre(cur[(idx-1+cur.length)%cur.length]);};}
function open(tile){opener=tile;al=tile.dataset.al;cur=DATA[al]||[];lb.hidden=false;lb.classList.add('open');show(+tile.dataset.i);
 if(window.MFMOverlay)window.MFMOverlay.open(lb,{dialog:dlg,initialFocus:'#glNext',returnFocus:tile,onRequestClose:close});}
function close(){if(lb.hidden)return;lb.classList.remove('open');lb.hidden=true;srcEl.removeAttribute('srcset');im.removeAttribute('src');if(window.MFMOverlay)window.MFMOverlay.close(lb);else if(opener)opener.focus();}
document.querySelectorAll('.gl-tile').forEach(function(t){t.addEventListener('click',function(){open(t);});});
document.getElementById('glX').onclick=close;
document.getElementById('glNext').onclick=function(){show(idx+1);};
document.getElementById('glPrev').onclick=function(){show(idx-1);};
lb.addEventListener('click',function(e){if(e.target===lb||e.target===dlg)close();});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='ArrowRight'){e.preventDefault();show(idx+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(idx-1);}if(e.key==='Escape'&&!window.MFMOverlay)close();});
/* swipe on touch screens */
var sx=null,sy=null;lb.addEventListener('touchstart',function(e){var p=e.touches[0];sx=p.clientX;sy=p.clientY;},{passive:true});
lb.addEventListener('touchend',function(e){if(sx===null)return;var p=e.changedTouches[0],dx=p.clientX-sx,dy=p.clientY-sy;sx=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)show(idx+(dx<0?1:-1));},{passive:true});
/* Download (full original) + Share (album link) */
function toastMsg(m){if(!toast)return;toast.textContent=m;toast.classList.add('on');setTimeout(function(){toast.classList.remove('on');},2300);}
document.getElementById('glDl').onclick=function(){var s=cur[idx].src,a=document.createElement('a');a.href=s;a.download=(s.split('/').pop()||'photo.jpg');document.body.appendChild(a);a.click();document.body.removeChild(a);};
document.getElementById('glShare').onclick=function(){var info=SHARE[al]||{},d={title:info.title||'MFM Mega Region 2 USA',text:info.text||'',url:info.url||location.href};if(navigator.share){navigator.share(d).catch(function(){});}else{var t=(d.text?d.text+' ':'')+d.url;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){toastMsg('Link copied — paste it anywhere to share');},function(){window.prompt('Copy this link to share:',t);});}else{window.prompt('Copy this link to share:',t);}}};
})();
"""

def variants(src):
    """src like /img/gallery/x/name.jpg -> dict of web paths + display size, or None if no variants."""
    base = src.lstrip('/').rsplit('.', 1)[0]
    p = lambda suf: os.path.join(ROOT, base + suf)
    if not (os.path.exists(p('-480.webp')) and os.path.exists(p('-800.webp')) and os.path.exists(p('-800.jpg'))):
        return None
    big = next((s for s in ('-1600.webp', '-1080.webp', '-1200.webp') if os.path.exists(p(s))), '-800.webp')
    with Image.open(p(big.replace('.webp', '.webp'))) as im:
        fw, fh = im.size
    with Image.open(p('-800.jpg')) as im:
        tw, th = im.size
    w = lambda suf: '/' + base + suf
    return {'w480': w('-480.webp'), 'w800': w('-800.webp'), 'w1600': w(big), 'jpg': w('-800.jpg'), 'fw': fw, 'fh': fh, 'tw': tw, 'th': th}

TILE = re.compile(r'<button class="gl-tile" data-al="(\w+)" data-i="(\d+)" style="background-image:url\(([^)]+)\)" aria-label="([^"]*)"><span>(.*?)</span></button>', re.S)

for page in pages:
    s = open(page).read()
    n_tiles = len(TILE.findall(s))
    # 1) CSS
    m = [b for b in re.finditer(r'<style>(.*?)</style>', s, re.S) if '.gl-tile' in b.group(1)][0]
    css = m.group(1)
    if 'gl-dialog' not in css:
        css = css.rstrip('\n') + '\n' + A11Y_CSS + '\n' + EXTRA_CSS + '\n'
    s = s[:m.start(1)] + css + s[m.end(1):]
    # 2) tiles
    count = [0]
    def tile(mt):
        al, i, src, label, capt = mt.groups()
        count[0] += 1
        v = variants(src)
        load = 'eager' if count[0] <= 4 else 'lazy'
        if v:
            pic = ('<picture><source type="image/webp" srcset="%s 480w, %s 800w" sizes="(max-width: 900px) 50vw, 300px">'
                   '<img src="%s" alt="" width="%d" height="%d" loading="%s" decoding="async"></picture>') % (v['w480'], v['w800'], v['jpg'], v['tw'], v['th'], load)
        else:
            pic = '<img src="%s" alt="" loading="%s" decoding="async">' % (src, load)
        aria = label if label.startswith('View photo') else 'View photo: ' + label
        return '<button type="button" class="gl-tile" data-al="%s" data-i="%s" aria-label="%s">%s<span>%s</span></button>' % (al, i, aria, pic, capt)
    s = TILE.sub(tile, s)
    assert count[0] == n_tiles and 'background-image:url(/img/gallery' not in s, (page, count[0], n_tiles)
    # 3) DATA enrich
    dm = re.search(r'var DATA=(\{.*?\});var SHARE=(\{.*?\});', s, re.S)
    data = json.loads(dm.group(1)); share = dm.group(2)
    for al, items in data.items():
        for it in items:
            v = variants(it['src'])
            if v:
                it.update({k: v[k] for k in ('w800', 'w1600', 'jpg', 'fw', 'fh')})
    # 4+5) lightbox markup + script
    lb0 = s.index('<div class="gl-lb" id="glLb"')
    sc0 = s.index('<script>', lb0)
    sc1 = s.index('</script>', sc0)
    script = '<script>\n(function(){var DATA=' + json.dumps(data, ensure_ascii=False) + ';var SHARE=' + share + ';' + SCRIPT_BODY
    s = s[:lb0] + LIGHTBOX + script + s[sc1:]
    # 6) footer + scripts
    s = s[:s.index('<footer')] + FOOTER + s[s.index('</body>'):]
    open(page, 'w').write(s)
    print('%-40s tiles=%d (%d with sizes)  photos=%d' % (page, n_tiles, s.count('<picture><source type="image/webp" srcset="/img/gallery'), sum(len(v) for v in data.values())))
