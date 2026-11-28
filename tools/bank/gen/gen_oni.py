import re,html,glob,random,json,collections,sys
sys.path.insert(0,__import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from pools import POOLS,WHICH,PRIO
R=__import__('os').environ.get('MFM_ONI_BOOKS',__import__('os').path.expanduser('~/oni-site/books'))+'/'
def tx(x): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>','',x))).strip()
books={}
for f in sorted(glob.glob(R+'*.html')):
    slug=f.split('/')[-1][:-5]
    if slug=='positioned-by-god-for-greatness': continue
    s=open(f,encoding='utf-8').read()
    title=tx(re.search(r'<title>(.*?)</title>',s).group(1)).split(' — ')[0]
    s=re.sub(r'<script.*?</script>|<style.*?</style>','',s,flags=re.S)
    heads=[tx(x) for x in re.findall(r'<h2[^>]*>(.*?)</h2>',s,flags=re.S)]+[tx(x) for x in re.findall(r'<h3[^>]*class="subsection-heading"[^>]*>(.*?)</h3>',s,flags=re.S)]
    paras=[tx(x) for x in re.findall(r'<p(?: [^>]*)?>(.*?)</p>',s,flags=re.S)]
    prayers=[tx(x) for x in re.findall(r'class="prayer-text"[^>]*>(.*?)</',s,flags=re.S)]
    books[slug]=dict(title=title,heads=[h for h in heads if h and not re.match(r'(Prayers?|Prophetic|Thanksgiving|Breaking|Divine|Open Doors|Chapter)\b',h)],paras=paras,prayers=prayers,url='https://pastorolumideoni.com/books/'+slug)
print({k:(len(v['heads']),len(v['paras']),len(v['prayers'])) for k,v in books.items()})
titles={k:v['title'] for k,v in books.items()}
out=[]
def opts_for(slug,seed):
    o=[k for k in books if k!=slug]; r=random.Random(seed); r.shuffle(o); o=[slug]+o[:3]; r.shuffle(o); return o
allheads=collections.Counter(h.lower() for v in books.values() for h in v['heads'])
for slug,b in books.items():
    for h in b['heads']:
        if allheads[h.lower()]>1 or len(h)<12: continue
        o=opts_for(slug,'h'+h)
        out.append(dict(id='oh%d'%len(out),pack='oni-books',level='all',q=f"Which of Pastor Oni's books has a chapter or section called “{h}”?",options=[titles[x] for x in o],answer=o.index(slug),
            explain=f"“{h}” is in {b['title']}.",source={'label':b['title']+' — pastorolumideoni.com','url':b['url']}))
# memorable lines
def sentences(p): return [x.strip() for x in re.split(r'(?<=[.!])\s+',p) if x.strip()]
seen=collections.Counter()
lines={}
for slug,b in books.items():
    L=[]
    for p in b['paras']:
        for s in sentences(p):
            n=len(s.split())
            if not(9<=n<=26) or '"' in s or '“' in s or '(' in s or ':' in s or not s[0].isupper(): continue
            if re.search(r'\b(I|me|my|chapter|book|this message)\b',s,re.I) and not re.search(r'\bGod\b',s): continue
            if not re.search(r'\b(God|faith|prayer|pray|destiny|grace|peace|joy|delay|miracle|power|altar|Spirit|heaven|breakthrough|victory|storm|greatness|lifting|restoration|sacrifice|enemy|lift|season)\b',s,re.I): continue
            L.append(s); seen[s.lower()]+=1
    lines[slug]=L
for slug in lines: lines[slug]=[s for s in lines[slug] if seen[s.lower()]==1]
print({k:len(v) for k,v in lines.items()})
fill=[];which=[]
for slug,L in lines.items():
    b=books[slug]; r=random.Random(slug); L=L[:]; r.shuffle(L)
    half=len(L)//2
    for s in L[:half][:45]:
        o=opts_for(slug,'w'+s)
        which.append(dict(id='ow%d'%len(which),pack='oni-books',level='all',q=f"Which book is this line from? “{s}”",options=[titles[x] for x in o],answer=o.index(slug),
            explain=f"From {b['title']} by Pastor Olumide Oni.",source={'label':b['title']+' — pastorolumideoni.com','url':b['url']}))
    for s in L[half:][:45]:
        ws=re.findall(r"[A-Za-z']+",s); c=collections.Counter(w.lower() for w in ws)
        best=None
        for i,w in enumerate(ws):
            lw=w.lower()
            if i==0 or lw not in WHICH or c[lw]>1: continue
            sc=PRIO[WHICH[lw]]+len(lw)/10
            if not best or sc>best[0]: best=(sc,w,WHICH[lw])
        if not best: continue
        _,w,p=best
        pool=[x for x in POOLS[p] if x!=w.lower() and x not in c and abs(len(x)-len(w))<=3]
        rr=random.Random('f'+s); rr.shuffle(pool); d=pool[:3]
        if w[0].isupper(): d=[x.capitalize() for x in d]
        o=[w]+d; rr.shuffle(o)
        fill.append(dict(id='of%d'%len(fill),pack='oni-books',level='all',q=f"Finish Pastor Oni's line from {b['title']}: “{re.sub(r'\b%s\b'%re.escape(w),'____',s,count=1)}”",options=o,answer=o.index(w),
            explain=f"“{s}” — {b['title']}.",source={'label':b['title']+' — pastorolumideoni.com','url':b['url']}))
# prayer points
pr=[]
for slug,b in books.items():
    for s in b['prayers'][:40]:
        if not(6<=len(s.split())<=30): continue
        ws=re.findall(r"[A-Za-z']+",s); c=collections.Counter(w.lower() for w in ws)
        cand=[(PRIO[WHICH[w.lower()]]+len(w)/10,w) for i,w in enumerate(ws) if i>0 and w.lower() in WHICH and c[w.lower()]==1]
        if not cand: continue
        w=max(cand)[1]; p=WHICH[w.lower()]
        pool=[x for x in POOLS[p] if x!=w.lower() and x not in c and abs(len(x)-len(w))<=3]
        rr=random.Random('p'+s); rr.shuffle(pool); d=pool[:3]
        if w[0].isupper(): d=[x.capitalize() for x in d]
        o=[w]+d; rr.shuffle(o)
        pr.append(dict(id='op%d'%len(pr),pack='oni-books',level='all',q=f"Complete this prayer point from {b['title']}: “{re.sub(r'\b%s\b'%re.escape(w),'____',s,count=1)}”",options=o,answer=o.index(w),
            explain=f"Prayer point from {b['title']}: “{s}”",source={'label':b['title']+' — pastorolumideoni.com','url':b['url']}))
allq=out+which+fill+pr
print('heads',len(out),'which',len(which),'fill',len(fill),'prayers',len(pr),'total',len(allq))
json.dump(dict(questions=allq,books=[dict(slug=k,title=v['title'],url=v['url']) for k,v in books.items()]),open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_oni.json','w'),ensure_ascii=False,indent=0)
for x in [out[0],which[0],fill[0],pr[0]]: print(x['q'],x['options'],x['answer'])
