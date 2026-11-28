import sys; sys.path.insert(0,__import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from common import *
from pools import *
import collections
exec(open('gen_verse.py').read().split("cands=sorted")[0])  # helpers
usedv=set(tuple(x) for x in json.load(open('used_verse.json')))
cands=sorted(((vscore(k,t),k,t) for k,t in V.items() if ok_verse(k,t,8,26)),reverse=True)
def bname(b): return BOOKS[b]
wb=[];used=set()
gc=collections.Counter()
for s,k,t in cands:
    if k in usedv and k not in FAMOUS_SET: continue
    b=k[0]; g=group(b)
    if gc[b]>=14: continue
    s_,e_=GROUPS[g]; pool=[x for x in range(s_,e_) if x!=b]
    if len(pool)<3: pool+= [x for x in range(GROUPS[g-1][0],GROUPS[g-1][1])]
    r=random.Random('wb'+str(k)); r.shuffle(pool); opts=[b]+pool[:3]; r.shuffle(opts)
    # don't give it away: book name inside verse
    if any(bname(x).split()[-1].lower() in norm(t) for x in opts): continue
    gc[b]+=1
    wb.append(dict(id='bw%d'%len(wb),pack='bible',level='all',q=f"“{t}” Which book is this from?",options=[bname(x) for x in opts],answer=opts.index(b),
        explain=f"{ref(k)}.",source=src(k))); used.add(k)
    if len(wb)>=330: break
print('whichbook',len(wb),len(gc))
# numbers
SKIP={(3,c) for c in (1,2,3,4,7,26,29,33)}|{(12,c) for c in range(1,10)}|{(14,2)}|{(15,7)}|{(15,11)}|{(15,12)}
num=[];ncount=collections.Counter()
NSET=set(NUMS)
for k,t in sorted(V.items(),key=lambda kv:-vscore(*kv)):
    if (k[0],k[1]) in SKIP or k in used: continue
    if not(8<=len(t.split())<=30): continue
    lw=[w.lower() for w in toks(t)]
    nums=[w for w in lw if w in NSET]
    if len(set(nums))!=1: continue
    n=nums[0]
    tl=t.lower()
    if re.search(r'\b(\w+) and %s\b'%n,tl) and re.search(r'\b(\w+) and %s\b'%n,tl).group(1) in NSET-{n}: continue
    if re.search(r'\b%s and (\w+)\b'%n,tl) and re.search(r'\b%s and (\w+)\b'%n,tl).group(1) in NSET-{n}: continue
    if re.search(r'\b%s (score|hundred|thousand)\b'%n,tl) or re.search(r'\bscore\b',tl): continue
    if re.search(r'\b(hundred|thousand)\b',t.lower()) and n not in ('hundred','thousand'): continue
    if n in ('hundred','thousand') and re.search(r'\b(an|a|one) (hundred|thousand)\b',t.lower()) is None: continue
    if ncount[n]>=45: continue
    others=[x for x in ['three','seven','twelve','forty','ten','two','five','six','four','thirty','fifty','seventy','twenty','eight','nine','eleven'] if x!=n and x not in lw]
    r=random.Random('n'+str(k)); r.shuffle(others); d=others[:3]
    q=re.sub(r'\b%s\b'%n,'____',t,flags=re.I)
    opts=[n]+d; r.shuffle(opts); ncount[n]+=1
    num.append(dict(id='bn%d'%len(num),pack='bible',level='all',q=f"How many? “{q}”",options=opts,answer=opts.index(n),explain=f"{ref(k)} — “{t}”",source=src(k))); used.add(k)
    if len(num)>=260: break
print('numbers',len(num),ncount.most_common())
# places
pl=[];pc=collections.Counter()
for k,t in sorted(V.items(),key=lambda kv:-vscore(*kv)):
    if k in used or k in usedv: continue
    if not(8<=len(t.split())<=30): continue
    nt=k[0]>=39; P=PLACES_NT if nt else PLACES_OT
    found=[p for p in P if re.search(r'\b%s\b'%p,t)]
    if len(found)!=1: continue
    p=found[0]
    if len(re.findall(r'\b%s\b'%p,t))>1 or pc[p]>=14: continue
    others=[x for x in P if x!=p and x not in t]
    r=random.Random('p'+str(k)); r.shuffle(others); opts=[p]+others[:3]; r.shuffle(opts)
    pc[p]+=1
    pl.append(dict(id='bp%d'%len(pl),pack='bible',level='all',q=f"Name the place: “{re.sub(r'\b%s\b'%p,'____',t)}”",options=opts,answer=opts.index(p),explain=f"{ref(k)} — “{t}”",source=src(k))); used.add(k)
    if len(pl)>=200: break
print('places',len(pl))
# book order
order=[]
for b in range(1,66):
    prev=b-1
    pool=[x for x in range(max(0,b-6),min(66,b+6)) if x not in (b,prev)]
    r=random.Random('bo%d'%b); r.shuffle(pool); opts=[prev]+pool[:3]; r.shuffle(opts)
    order.append(dict(id='bo%d'%b,pack='bible',level='kids' if b<45 or b>=39 else 'all',q=f"Which book comes right before {BOOKS[b]}?",options=[BOOKS[x] for x in opts],answer=opts.index(prev),
        explain=f"{BOOKS[prev]}, then {BOOKS[b]}.",source={'label':'Books of the Bible (KJV order)','url':'https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/#booklist'}))
for b in range(0,65):
    nx=b+1
    pool=[x for x in range(max(0,b-6),min(66,b+7)) if x not in (b,nx)]
    r=random.Random('ba%d'%b); r.shuffle(pool); opts=[nx]+pool[:3]; r.shuffle(opts)
    order.append(dict(id='ba%d'%b,pack='bible',level='kids',q=f"Which book comes right after {BOOKS[b]}?",options=[BOOKS[x] for x in opts],answer=opts.index(nx),
        explain=f"{BOOKS[b]}, then {BOOKS[nx]}.",source={'label':'Books of the Bible (KJV order)','url':'https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/#booklist'}))
print('order',len(order))
json.dump(dict(wb=wb,num=num,pl=pl,order=order),open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_bible_gen.json','w'),indent=0,ensure_ascii=False)
json.dump([list(k) for k in used],open('used_bible.json','w'))
for o in wb[:3]+num[:4]+pl[:4]: print(o['q'],o['options'],o['answer'])
