import sys; sys.path.insert(0,"/home/claude/qgen")
from common import *
from pools import *
import collections,copy
exec(open('gen_verse.py').read().split("cands=sorted")[0])
who=json.load(open('out_who.json')); verse=json.load(open('out_verse.json'))
bg=json.load(open('out_bible_gen.json')); au=json.load(open('out_authored.json'))
def strip(x): x=dict(x); x.pop('_kid',None); return x
bible=[strip(x) for x in au]+bg['wb']+bg['num']+bg['pl']+[x for x in bg['order'] if x['id'].startswith('bo')]
for x in bible: x['level']='all'
# ---- kids pack
def kcopy(x,pre):
    y=copy.deepcopy(strip(x)); y['id']=pre+y['id']; y['pack']='kids'; y['level']='kids'; return y
kids=[kcopy(x,'k') for x in au if x['level']=='kids']
kids+=[kcopy(x,'k') for x in bg['order'] if x['id'].startswith('ba')]
kw=[x for x in who if x.get('_kid')]
for x in kw:
    y=kcopy(x,'k'); y['q']=y['ctx']+' '+y['q']; y.pop('ctx',None); kids.append(y)
# kids fill-the-verse: memory verses only (the famous list), up to 3 different blanks per verse
fam=[k for k in FAMOUS if k in V and len(V[k].split())<=32]
rounds=[[],[],[]]
for k in fam:
    t=V[k]; ws=toks(t); low=[w.lower() for w in ws]; c=collections.Counter(low)
    cand=sorted(set(w for i,w in enumerate(ws) if i>0 and w.lower() in WHICH and c[w.lower()]==1 and len(w)<=10),key=lambda w:-(PRIO[WHICH[w.lower()]]+len(w)/10))
    for j,w in enumerate(cand[:3]):
        p=WHICH[w.lower()]; d=distract(w,p,t,'k%d'%j+str(k))
        if len(d)<3: continue
        opts=[w]+d; random.Random('ko%d'%j+str(k)).shuffle(opts)
        rounds[j].append(dict(id='kv%d_%d_%d_%d'%(k[0],k[1],k[2],j),pack='kids',level='kids',q="Finish the verse: “"+re.sub(r'\b%s\b'%re.escape(w),'____',t,count=1)+"”",options=opts,answer=opts.index(w),explain=f"{ref(k)} — “{t}”",source=src(k)))
# memory verse: which book? (famous verses only)
for k in fam:
    b=k[0]; g=group(b); s_,e_=GROUPS[g]; pool=[x for x in range(s_,e_) if x!=b]
    if len(pool)<3: pool+=list(range(GROUPS[g-1][0],GROUPS[g-1][1]))
    r=random.Random('kb'+str(k)); r.shuffle(pool); o=[b]+pool[:3]; r.shuffle(o)
    if any(BOOKS[x].split()[-1].lower() in norm(V[k]) for x in o): continue
    rounds[1].insert(0,dict(id='km%d_%d_%d'%k,pack='kids',level='kids',q=f"Which book is this memory verse in? “{V[k]}”",options=[BOOKS[x] for x in o],answer=o.index(b),explain=f"{ref(k)}.",source=src(k)))
kids+=[kcopy(x,'k') for x in bg['order'] if x['id'].startswith('bo')]
for r in rounds:
    for x in r:
        if len(kids)<1000: kids.append(x)
whoq=[]
for x in who:
    y=strip(x); y['q']=y.pop('ctx')+' '+y['q']; whoq.append(y)
print('bible',len(bible),'verse',len(verse),'who',len(whoq),'kids',len(kids))
json.dump(dict(bible=bible,verse=verse,who=whoq,kids=kids),open('packs_core.json','w'),ensure_ascii=False)
