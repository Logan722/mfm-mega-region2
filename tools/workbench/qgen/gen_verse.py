import sys; sys.path.insert(0,"/home/claude/qgen")
from common import *
from pools import *
import collections
used=set(json.load(open('used_refs.json'))) if False else set()
def toks(t): return re.findall(r"[A-Za-z']+",t)
def ok_verse(k,t,lo=8,hi=28):
    n=len(t.split())
    if not(lo<=n<=hi): return False
    if not t[0].isupper() or not t.endswith(('.','?','!')): return False
    if t.split()[0] in ('And','Then','So','Now','Moreover','Also','Howbeit') and k not in FAMOUS_SET: return False
    return True
GOODB=set(BOOKS.index(b) for b in ['Psalms','Proverbs','Isaiah','Jeremiah','Matthew','Mark','Luke','John','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Timothy','1 Timothy','Hebrews','James','1 Peter','1 John','Ecclesiastes','Deuteronomy','Joshua','Lamentations','Micah','Habakkuk','Zechariah','Malachi','Joel','Revelation','Job','Titus'])
def vscore(k,t):
    s=0
    if k in FAMOUS_SET: s+=20
    if k[0] in GOODB: s+=4
    n=len(t.split()); s+= 2 if 10<=n<=22 else 0
    if re.search(r'\b(LORD|God|Jesus|Christ)\b',t): s+=1.5
    s+=random.Random(str(k)).random()*2
    return s
def blank_pick(t):
    ws=toks(t); low=[w.lower() for w in ws]; c=collections.Counter(low)
    best=None
    for i,w in enumerate(ws):
        lw=w.lower()
        if i==0 or lw not in WHICH or c[lw]>1: continue
        p=WHICH[lw]; sc=PRIO[p]+len(lw)/10
        if not best or sc>best[0]: best=(sc,w,p)
    return best
def distract(w,p,t,seed,n=3):
    vw=set(x.lower() for x in toks(t))
    pool=[x for x in POOLS[p] if x!=w.lower() and x not in vw and abs(len(x)-len(w))<=3]
    r=random.Random(seed); r.shuffle(pool); d=pool[:n]
    if w[0].isupper(): d=[x.capitalize() for x in d]
    return d
cands=sorted(((vscore(k,t),k,t) for k,t in V.items() if ok_verse(k,t)),reverse=True)
print('verse cands',len(cands))
verse=[];kids_v=[];used=set()
for s,k,t in cands:
    b=blank_pick(t)
    if not b: continue
    _,w,p=b
    d=distract(w,p,t,str(k))
    if len(d)<3: continue
    q=re.sub(r'\b%s\b'%re.escape(w),'____',t,count=1)
    opts=[w]+d; random.Random('o'+str(k)).shuffle(opts)
    item=dict(id='v%d'%len(verse),pack='verse',level='all',q=f"“{q}”",options=opts,answer=opts.index(w),
      explain=f"{ref(k)} — “{t}”",source=src(k))
    verse.append(item); used.add(k)
    if len(verse)>=1000: break
print('verse',len(verse))
json.dump(verse,open('out_verse.json','w'),indent=0,ensure_ascii=False)
json.dump([list(k) for k in used],open('used_verse.json','w'))
for o in verse[:5]+verse[400:403]+verse[-3:]: print(o['q'],o['options'],o['answer'],o['source']['label'])
