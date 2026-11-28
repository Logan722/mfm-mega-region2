import sys; sys.path.insert(0,__import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from common import *
from pools import *
import collections
from wordfreq import zipf_frequency as zf, top_n_list
exec(open('gen_verse.py').read().split("cands=sorted")[0])
P=json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/packs_core.json'))
bl=[]
def add(s,t,ex,so,kind):
    bl.append(dict(id='z%d'%len(bl),pack='blitz',s=s,t=t,explain=ex,source=so,kind=kind))
# 1) quoted right? from verse pack (short)
for i,x in enumerate(P['verse']):
    full=x['explain'].split(' — ',1)[1].strip('“”')
    if len(full.split())>18: continue
    r=random.Random('bz'+x['id'])
    right=x['options'][x['answer']]
    if r.random()<.5: add('“'+full+'”',True,f"Quoted right — {x['source']['label'].replace(' (KJV)','')}.",x['source'],'verse')
    else:
        wrong=[o for j,o in enumerate(x['options']) if j!=x['answer']][0]
        s=x['q'].strip('“”').replace('____',wrong)
        add('“'+s+'”',False,f"It says “{right}”, not “{wrong}” — {x['source']['label'].replace(' (KJV)','')}.",x['source'],'verse')
# 2) who said it (spoken quotes, short)
for x in P['who']:
    if not x['q'].startswith('In ') : continue
    q=x['q'].split('? ',1)[1]
    if len(q.split())>16: continue
    r=random.Random('bw'+x['id']); a=x['options'][x['answer']]
    if r.random()<.5: add(f"{a} said: {q}",True,x['explain'],x['source'],'who')
    else:
        w=[o for j,o in enumerate(x['options']) if j!=x['answer']][0]
        add(f"{w} said: {q}",False,x['explain'],x['source'],'who')
# 3) book order
for b in range(65):
    r=random.Random('bo%d'%b)
    if r.random()<.5: add(f"{BOOKS[b+1]} comes right after {BOOKS[b]}.",True,f"{BOOKS[b]}, then {BOOKS[b+1]}.",{'label':'Books of the Bible (KJV order)','url':'https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/#booklist'},'order')
    else:
        w=r.choice([x for x in range(66) if abs(x-b)<=5 and x not in (b,b+1)])
        add(f"{BOOKS[w]} comes right after {BOOKS[b]}.",False,f"{BOOKS[b]} is followed by {BOOKS[b+1]}.",{'label':'Books of the Bible (KJV order)','url':'https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/#booklist'},'order')
# 4) which book (short)
for x in P['bible']:
    if not x['id'].startswith('bw'): continue
    v=x['q'].split('” Which book')[0]+'”'
    if len(v.split())>16: continue
    r=random.Random('bb'+x['id']); a=x['options'][x['answer']]
    if r.random()<.5: add(f"This is in {a}: {v}",True,x['explain'],x['source'],'book')
    else:
        w=[o for j,o in enumerate(x['options']) if j!=x['answer']][0]
        add(f"This is in {w}: {v}",False,f"It's {x['explain'].rstrip('.')}.",x['source'],'book')
random.Random(7).shuffle(bl)
c=collections.Counter(x['kind'] for x in bl); print('blitz',len(bl),c, sum(x['t'] for x in bl))
for x in bl: x.pop('kind')
bl=bl[:1200]
# ---- Word of the Day
cnt=collections.Counter(w for t in V.values() for w in norm(t) if len(w)==5)
ARCH=set('shalt thine hadst didst canst wilt saith hath doth spake brake bare unto'.split())
names=set()
for t in V.values():
    for w in re.findall(r"\b[A-Z][a-z]{4}\b",t): names.add(w)
cands=[]
for w,n in cnt.items():
    if n<6 or w in ARCH: continue
    z=zf(w,'en')
    if z<2.6: continue
    dist=n/ (10**z)
    cands.append((n>=40, z>=3.2, dist, w))
cands.sort(key=lambda x:(-x[2]))
good=[c[3] for c in cands if (c[0] or c[2]>1e-3)]
print('word cands',len(cands),len(good))
# exclude generic function words
STOP=set('which there their these those where would could shall about after again every other never under above below while whose thing being still since might first great among until whole often'.split())
ans=[w for w in good if w not in STOP]
print(len(ans),ans[:60])
ALLCAP=set(w.lower() for t in V.values() for w in re.findall(r'\b[A-Z][a-z]+\b',t) if not t.startswith(w))
BADW=set('vomit whore harlot dungs privy bowel lusts slime stink filth incest naked lewdly rapes fornic belly bowels lying'.split())
NAMECNT=collections.Counter(w.lower() for t in V.values() for w in re.findall(r"\b[A-Z][a-z]{4}\b",t))
pool={}
for w,n in cnt.items():
    if not w.isalpha() or w in ARCH or w in STOP: continue
    z=zf(w,'en'); nm=NAMECNT[w]>=max(5,n*0.8)
    if w in BADW or (w.endswith('s') and w[:-1] in ALLCAP): continue
    if nm and NAMECNT[w]>=3: q=2+min(n,200)/100+z/10
    elif z>=1.6 and n>=2: q=(min(n,300)/150)+(z>=3)*1+(n/(10**z)>1e-3)*1.5
    else: continue
    pool[w]=q
ranked=sorted(pool,key=lambda w:-pool[w])
print('word pool',len(ranked))
ranked=ranked[:1100]
def bestverse(w):
    best=None
    for k,t in V.items():
        if w in norm(t) and 6<=len(t.split())<=30:
            s=vscore(k,t)
            if not best or s>best[0]: best=(s,k,t)
    return best
# index for speed
inv=collections.defaultdict(list)
for k,t in V.items():
    if 6<=len(t.split())<=30:
        for x in set(norm(t)):
            if len(x)==5: inv[x].append(k)
words=[]
for w in ranked:
    ks=inv.get(w)
    if not ks: continue
    ks=[k for k in ks if re.search(r'\b%s\b'%w,V[k],re.I)]
    if not ks: continue
    k=max(ks,key=lambda k:vscore(k,V[k]))
    words.append(dict(w=w.upper(),ref=ref(k),text=V[k],url=src(k)['url']))
# tiers: top 365 are the most familiar; shuffle inside tiers so days vary
t1,t2,t3=words[:365],words[365:730],words[730:]
for i,t in enumerate((t1,t2,t3)): random.Random(100+i).shuffle(t)
words=(t1+t2+t3)[:1000]
valid=set(x['w'].lower() for x in words)
for w in top_n_list('en',200000):
    if len(w)==5 and w.isalpha() and w.isascii() and not re.search(r'(.)\1\1',w) and zf(w,'en')>=2.0: valid.add(w)
valid|=set(w for w in cnt if w.isalpha() and len(w)==5)
print('words',len(words),'valid guesses',len(valid))
print([x['w'] for x in words[:40]])
json.dump(dict(blitz=bl,words=words,valid=sorted(valid)),open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/packs_extra.json','w'),ensure_ascii=False)
