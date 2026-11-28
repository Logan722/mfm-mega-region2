import json,random,collections,re,os
R=__import__('os').environ.get('MFM_REPO',__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'../../..')))+'/js/'
old=json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/'+'quiz-bank.orig.json'))
P=json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/packs_core.json')); E=json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/packs_extra.json')); O=json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_oni.json'))
code={'bible':'B','verse':'V','who':'W','kids':'K','oni-books':'O','blitz':'Z'}
def pre(lst,pack):
    out=[]
    for x in lst:
        y=dict(x); y['id']=code[pack]+'-'+x['id']; y['pack']=pack; out.append(y)
    return out
# oni selection (balanced, drop give-away chapter questions)
STOP=set("a an the of to is in your for by and my god god's".split())
def easy(q):
    if not q['id'].startswith('oh'): return False
    h=q['q'].split('“')[1].split('”')[0].lower(); t=q['options'][q['answer']].lower()
    return any(w in h for w in re.findall(r"[a-z']+",t) if w not in STOP)
by=collections.defaultdict(list)
for q in O['questions']:
    if not easy(q): by[q['id'][:2]].append(q)
oni=[]
for k,n in {'oh':203,'ow':317,'of':250,'op':230}.items():
    v=by[k][:]; random.Random(k).shuffle(v); oni+=v[:n]
oldq=old['questions']
keep_core=[q for q in oldq if q['pack'] in ('mfm','go-books','messages') and q.get('level')!='kids' and q['id']!='m1']
for q in keep_core:
    if q['pack']=='messages': q.setdefault('date','2026-11-23')
    q['q']=q['q'].replace('Pastor (Dr.) Shade Olukoya','Pastor (Mrs.) Shade Olukoya')
new=json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_mfm.json'))+json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_go.json'))+json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_msgs.json'))
nq=set(re.sub(r'\W','',x['q'].lower()) for x in new)
keep_core=[q for q in keep_core if re.sub(r'\W','',q['q'].lower()) not in nq]+new
seenq=set(); dedup=[]
for q in keep_core:
    k=re.sub(r'\W','',q['q'].lower())
    if k in seenq: continue
    seenq.add(k); dedup.append(q)
keep_core=dedup
old_by=collections.defaultdict(list)
for q in oldq:
    if q.get('level')=='kids': old_by['kids'].append(q)
    elif q['pack'] in code: old_by[q['pack']].append(q)
print({k:len(v) for k,v in old_by.items()}, 'core',len(keep_core))
# Blitz from every topic (Dawn, Nov 26): true/false on a question + a proposed answer
def tf(qs,tag,limit):
    out=[]
    for q in qs:
        if len(q['q'])>170: continue
        r=random.Random('tf'+q['id']); ok=r.random()<.5
        a=q['options'][q['answer']] if ok else [o for i,o in enumerate(q['options']) if i!=q['answer']][r.randrange(3)]
        out.append(dict(id='t'+tag+q['id'],pack='blitz',s=q['q'],a='Answer: '+a,t=ok,explain=('Yes \u2014 ' if ok else 'No \u2014 the answer is ')+q['options'][q['answer']]+'. '+q['explain'],source=q.get('source')))
    random.Random(tag).shuffle(out); return out[:limit]
core_new=json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_mfm.json'))+json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_go.json'))+json.load(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_msgs.json'))
extra=tf(core_new,'c',400)+tf(oni,'o',300)
bl=E['blitz'][:1000]+extra; random.Random(5).shuffle(bl)
lazy={'bible':P['bible'],'verse':P['verse'],'who':P['who'],'kids':P['kids'],'oni-books':oni,'blitz':bl}
for p,l in lazy.items():
    l=[dict(q,id='o'+q['id']) for q in old_by.get(p,[])]+l   # the original 28 hand-checked questions stay (brand scriptures etc.)
    l=pre(l,p)
    _seen=set(); _l=[]
    for x in l:
        k=re.sub(r'\W','',(x.get('q') or x.get('s','')+x.get('a','')).lower())
        if k in _seen: continue
        _seen.add(k); _l.append(x)
    l=_l
    ids=[x['id'] for x in l]; assert len(ids)==len(set(ids)),p
    json.dump(l,open(R+'quiz/'+p+'.json','w'),ensure_ascii=False,separators=(',',':'))
    print(p,len(l))
json.dump(dict(words=E['words'],valid=E['valid']),open(R+'quiz/words.json','w'),ensure_ascii=False,separators=(',',':'))
packs=old['packs']
packs['go-books']['label']="The G.O.'s Books"
packs['oni-books']['label']="Pastor Oni's Books"
packs['messages']['label']='Our Messages'
packs['mfm']['blurb']='The story of the ministry, its founder and its programmes.'
packs['bible']['blurb']='Stories, places, numbers and the books of the Bible.'
packs['oni-books']['blurb']="Lines, chapters and prayer points from Pastor Oni's free books on pastorolumideoni.com."
packs['who']={'label':'Who Said It?','icon':'quote','blurb':'A line from Scripture. Name who said or wrote it.'}
packs['kids']={'label':'Kids Mode','icon':'star','blurb':'Easier Bible questions for children.'}
packs['blitz']={'label':'60-second Blitz','icon':'bolt','blurb':'True or false against the clock.'}
for q in keep_core:
    u=(q.get('source') or {}).get('url','')
    if u.startswith('/'): q['source']['url']='https://mfmmegaregion2usa.org'+u
import hashlib
lv={f[:-5]:hashlib.sha256(open(R+'quiz/'+f,'rb').read()).hexdigest()[:8] for f in os.listdir(R+'quiz') if f.endswith('.json')}
core=dict(version='preview-2026-11-26c',launch='2026-11-26',packs=packs,lazy=lv,questions=keep_core)
json.dump(core,open(R+'quiz-bank.json','w'),ensure_ascii=False,indent=1)
print('core questions',len(keep_core))
