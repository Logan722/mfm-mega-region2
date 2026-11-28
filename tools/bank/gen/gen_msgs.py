import json,re,random,collections
d=json.load(open(__import__('os').environ.get('MFM_REPO',__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'../../..')))+'/js/media-playlists.json'))
mb={x['id']:x for x in json.load(open(__import__('os').environ.get('MFM_REPO',__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'../../..')))+'/tools/media-baked.json'))}
SPK=re.compile(r"^(Dr\.? ?Pastor|Pastor|Dr\.|Dr|Rev\.?|Evang\.?|Prophet|Apostle|Bishop)\b",re.I)
def canon(n):
    if re.search(r'olukoya',n,re.I) and not re.search(r'shade|mrs',n,re.I): return 'Dr. D.K. Olukoya'
    return {'Pastor Substance':'Pastor Substance Ibegbulem','Pastor Kolo Oloko':'Pastor Kola Oloko','Pastor Segun Obatunsin':'Pastor Segun Obatusin','Pastor Popoola':'Pastor David Popoola','Pastor Oluwatoyin Oni':'Pastor (Mrs.) Oluwatoyin Oni'}.get(n,n)
def toks(n): return set(w.lower() for w in re.findall(r"[A-Za-z-]+",n) if w.lower() not in ('pastor','dr','mrs','rev'))
def clean(t): return re.sub(r'\s+',' ',re.sub(r'[🔴🔥🌟]|#\w+','',t)).strip(' |—-')
def tc(s):
    if s.isupper() or sum(c.isupper() for c in s)>len(s)*.6:
        small={'a','an','the','of','to','in','and','for','on','at','is','by','my','your'}
        w=s.lower().split(); return ' '.join(x if (i and x in small) else x[:1].upper()+x[1:] for i,x in enumerate(w))
    return s
PL={'Open Heaven Encounter | Full Sermons':'Open Heaven Encounter','Healing & Deliverance Hour | Full Sermons':'Healing & Deliverance Hour','Women Foundation Conferences | MFM Mega Region 2':'MFM Women Foundation','Gen 218 Conferences | Mega Region 2':'Gen218','Divine Restoration | MFM Women Foundation Conference; Atlanta':'MFM Women Foundation','Thanksgiving Service | MFM USA Mega Region 2 | Dec 14th, 2024':'Thanksgiving Service 2024','GEN 218 Single\'s Conference: It Is My Time To Rejoice':'Gen218'}
items={}
for p in d['playlists']:
    for v in p['videos']:
        t=clean(v['title'].replace('LIVE |','').replace('LIVE NOW:',''))
        parts=[x.strip() for x in re.split(r'\s[|—]\s',t) if x.strip()]
        spk=None; msg=None; ev=None; date=None
        for x in parts:
            m=re.search(r'(\w{3} \d{1,2}, \d{4})',x)
            if SPK.match(x) and len(x.split())<=6: spk=canon(re.sub(r'^Dr\.? Pastor','Pastor',x).strip())
        msg=parts[0] if parts else None
        if msg and (SPK.match(msg) or re.match(r'^(Healing & Deliverance Hour|OPEN HEAVEN ENCOUNTER|MFM|PART|Question|Educative|Opening|Recap|GEN 218$|PRAISE|CHOIR|IYC|Communion)',msg,re.I)): msg=None
        if msg and msg.lower() in ('the message','genesis 2:18'): msg=None
        for x in parts[1:]:
            if re.search(r'(Crusade|Conference|Retreat|Service|Convention|Dedication)\s*(\d{4})?',x) and not SPK.match(x): ev=x.replace('(Rekindling the Altar)','').strip()
        m=re.search(r'Healing & Deliverance Hour LIVE \| (\w{3} \d{1,2}, \d{4})',v['title']); 
        prog=PL.get(p['title'])
        if 'Healing & Deliverance Hour LIVE' in v['title']: prog='Healing & Deliverance Hour'; date=m.group(1) if m else None
        if 'Open Heaven Encounter LIVE' in v['title']: prog='Open Heaven Encounter'
        pub=mb.get(v['id'],{}).get('published','')[:10]
        if not msg: continue
        k=msg.lower()
        it=items.setdefault(k,dict(msg=tc(msg),ids=[],spk=None,ev=None,prog=None,date=None,pub=''))
        it['ids'].append(v['id']); it['spk']=it['spk'] or spk; it['ev']=it['ev'] or ev; it['prog']=it['prog'] or prog; it['date']=it['date'] or date; it['pub']=max(it['pub'],pub)
L=list(items.values()); print(len(L))
spks=sorted(set(x['spk'] for x in L if x['spk']))
progs=['Healing & Deliverance Hour','Open Heaven Encounter','MFM Women Foundation','Gen218']
out=[]
def add(q,c,ds,ex,vid,date):
    o=[c]+ds[:3]; r=random.Random('ms'+q); r.shuffle(o)
    out.append(dict(id='ms%d'%len(out),pack='messages',level='all',q=q,options=o,answer=o.index(c),explain=ex,date=date or '2000-01-01',source={'label':'Watch on YouTube — MFM Mega Region 2 USA','url':'https://www.youtube.com/watch?v='+vid}))
for x in L:
    vid=x['ids'][0]; dt=x['pub']
    if x['spk']:
        ds=[s for s in spks if not (toks(s)&toks(x['spk']))]; random.Random(x['msg']).shuffle(ds)
        add(f"Who preached “{x['msg']}”?",x['spk'],ds,f"“{x['msg']}” — {x['spk']}"+(f", {x['ev']}." if x['ev'] else '.'),vid,dt)
    if x['prog'] in progs:
        ds=[p for p in progs if p!=x['prog']]+['Power Must Change Hands']
        add(f"On which programme was “{x['msg']}” preached?",x['prog'],ds,f"It was preached on {x['prog']}.",vid,dt)
    if x['ev'] and re.search(r'(Crusade|Conference|Retreat|Service|Convention|Dedication)',x['ev']):
        evs=sorted(set(y['ev'] for y in L if y['ev'] and y['ev']!=x['ev']))
        r=random.Random('e'+x['msg']); r.shuffle(evs)
        if len(evs)>=3: add(f"“{x['msg']}” was part of which event?",x['ev'],evs,f"{x['ev']}: “{x['msg']}”.",vid,dt)
    if x['date']:
        others=[y['msg'] for y in L if y['prog']=='Healing & Deliverance Hour' and y['msg']!=x['msg']]; random.Random('d'+x['msg']).shuffle(others)
        add(f"Which message was preached on Healing & Deliverance Hour on {x['date']}?",x['msg'],others,f"{x['date']}: “{x['msg']}”.",vid,dt)
print(len(out))
json.dump(out,open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_msgs.json','w'),ensure_ascii=False,indent=0)
for o in random.Random(3).sample(out,12): print(o['q'][:110],'|',o['options'],'->',o['options'][o['answer']])
