import re, sys
ROOT='/home/claude/mfm-mega-region2/'
def rd(p): return open(ROOT+p).read()
def wr(p,t): open(ROOT+p,'w').write(t)

# svg templates for each network, taken from existing pages
TPL={}
for f in ['branches/mfm-houston-3-city-of-refuge.html','branches/mfm-tampa.html']:
    t=rd(f); s=re.search(r'<div class="bp-soc-row">(.*?)</div></div>',t,re.S).group(1)
    for a in re.findall(r'<a [^>]*data-net="([a-z]+)"[^>]*>(.*?)</a>',s,re.S):
        TPL.setdefault(a[0],a[1])
LABEL={'website':'Website','facebook':'Facebook','instagram':'Instagram','youtube':'YouTube'}
ORDER=['website','facebook','instagram','youtube']

def soc(page, **changes):
    p=f'branches/{page}.html'; t=rd(p)
    name=re.search(r'<h1[^>]*>(.*?)</h1>',t,re.S).group(1).strip()
    m=re.search(r'<div class="bp-soc"><div class="bp-soc-lbl">Connect with this branch</div><div class="bp-soc-row">(.*?)</div></div>',t,re.S)
    cur={}
    if m:
        for net,href in re.findall(r'<a href="([^"]*)"[^>]*data-net="([a-z]+)"',m.group(1)): pass
        for href,net in re.findall(r'<a href="([^"]*)" target="_blank" rel="noopener" data-net="([a-z]+)"',m.group(1)): cur[net]=href
    before=dict(cur)
    for net,val in changes.items():
        if val is None: cur.pop(net,None)
        else: cur[net]=val
    links=''.join(f'<a href="{cur[n]}" target="_blank" rel="noopener" data-net="{n}" aria-label="{name} on {LABEL[n]}">{TPL[n]}</a>' for n in ORDER if n in cur)
    block=f'<div class="bp-soc"><div class="bp-soc-lbl">Connect with this branch</div><div class="bp-soc-row">{links}</div></div>' if links else ''
    if m: t=t[:m.start()]+block+t[m.end():]
    else:
        i=t.index('</div>\n            \n          </div>') if '</div>\n            \n          </div>' in t else None
        anchor='<a class="btn btn--secondary" href="/?subject=general'
        j=t.index(anchor); k=t.index('</div>',j)+6
        t=t[:k]+'\n            '+block+t[k:]
    wr(p,t); print(page, before, '->', cur)

soc('mfm-houston-3-city-of-refuge', facebook='https://www.facebook.com/MFMHOUSTON/', instagram=None)
soc('mfm-revival-and-solution-center', instagram=None)
soc('mfm-usa-prayer-city', facebook='https://www.facebook.com/MFMUSAHEADQUARTERS', instagram='https://www.instagram.com/mfmusahdq/')
soc('mfm-broward', facebook='https://www.facebook.com/profile.php?id=100067185901592')
soc('mfm-riverdale', website=None)
soc('mfm-orlando-citadel-of-solution', website='https://www.mfmorlando.com/', youtube='https://www.youtube.com/@MfmOrlando')
soc('mfm-grand-prairie', website='https://www.mfmgrandprairie.com/', youtube='https://www.youtube.com/@mfmgrandprairie9522')
soc('mfm-revival-chapel', website=None)
soc('mfm-mansfield', website=None)
soc('mfm-arlington', website=None, facebook=None)
soc('mfm-arlington-matlock', facebook='https://www.facebook.com/mfmarlingtontx')
soc('mfm-tampa', website='https://www.mfmtampaflorida.org/')

# Nashville new location
OLD='2754 Anderson Road, Antioch TN 37013'; NEW='13135 Central Pike, Mount Juliet TN 37122'
for p in ['branches/mfm-nashville.html','branches.html']:
    t=rd(p); n=t.count(OLD)
    t=t.replace(OLD,NEW).replace('2754+Anderson+Road%2C+Antioch+TN+37013','13135+Central+Pike%2C+Mount+Juliet+TN+37122')
    if p=='branches.html':
        t=t.replace('<small>Antioch, TN</small><h3>MFM Nashville</h3>','<small>Mount Juliet, TN</small><h3>MFM Nashville</h3>')
        t=t.replace('"lat": 36.061, "lng": -86.669, "meta": "Antioch, TN \\u00b7 Pastor Lovena Okeke"','"lat": 36.1401, "lng": -86.4332, "meta": "Mount Juliet, TN \\u00b7 Pastor Lovena Okeke"')
    else:
        t=t.replace('MFM Nashville in Antioch, TN.','MFM Nashville in Mount Juliet, TN.').replace('MFM Nashville — Antioch, TN','MFM Nashville — Mount Juliet, TN')
        t=t.replace('"latitude": 36.061, "longitude": -86.669','"latitude": 36.1401, "longitude": -86.4332').replace('var lat=36.061, lng=-86.669;','var lat=36.1401, lng=-86.4332;')
        row='<div class="bp-row"><span class="bp-k">Services</span><span class="bp-v">Weekly worship &amp; midweek prayer — reach out for current service times.</span></div>'
        assert t.count(row)==1
        t=t.replace(row,row+'\n            <div class="bp-row"><span class="bp-k">Phone</span><span class="bp-v"><a href="tel:+16156368177">(615) 636-8177</a></span></div>')
        t=t.replace('"addressRegion": "TN", "addressCountry": "US"}','"addressRegion": "TN", "addressCountry": "US"}, "telephone": "+16156368177"',1)
    wr(p,t); print(p,'nashville replaced',n,'| left:',t.count('Anderson'),t.count('Antioch'))

# Marietta street number
for p in ['branches/mfm-citadel-of-signs-and-wonders.html','branches.html']:
    t=rd(p); n=t.count('Hunt Street NE, Marietta GA 30060')
    t=re.sub(r'(?<!168 )Hunt Street NE, Marietta GA 30060','168 Hunt Street NE, Marietta GA 30060',t)
    t=re.sub(r'(?<!168\+)Hunt\+Street\+NE%2C\+Marietta','168+Hunt+Street+NE%2C+Marietta',t)
    wr(p,t); print(p,'marietta',n)
