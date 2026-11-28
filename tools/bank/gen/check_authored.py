import sys; sys.path.insert(0,__import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from common import *
V=VALL
out=[];bad=[]
for ln,line in enumerate(open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/authored.txt',encoding='utf-8')):
    p=line.rstrip('\n').split('|')
    if len(p)<8: continue
    lvl,q,c,d1,d2,d3,r,kw=p[:8]; neg=p[8].lstrip('-').split(',') if len(p)>8 else []
    m=re.match(r'(.+?) (\d+):(\d+)(?:-(\d+))?$',r)
    k=parse(f'{m.group(1)} {m.group(2)}:{m.group(3)}'); e=int(m.group(4) or m.group(3))
    ks=[(k[0],k[1],v) for v in range(k[2],e+1)]
    if any(x not in V for x in ks): bad.append((r,'not agreed in 3 texts')); continue
    txt=[w.replace('ae','e') for w in norm(' '.join(V[x] for x in ks))]; ts=' '.join(txt)
    miss=[w for w in kw.split(',') if ' '.join(norm(w)).replace('ae','e') not in ts]
    neg_hit=[w for w in neg if w.lower() in txt]
    if miss or neg_hit: bad.append((r,q,miss,neg_hit)); continue
    opts=[c,d1,d2,d3]; rr=random.Random(q); rr.shuffle(opts)
    out.append(dict(id='ba_%d'%ln,pack='bible',level='kids' if lvl=='k' else 'all',q=q,options=opts,answer=opts.index(c),
        explain=f"{c} — {r}.",source=src(k,ks[-1] if len(ks)>1 else None)))
print(len(out),'ok;',len(bad),'bad');[print(' ',b) for b in bad]
json.dump(out,open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_authored.json','w'),indent=0,ensure_ascii=False)
