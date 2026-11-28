# Pass 2: every quotation in a chapter is checked word for word against three KJV editions, at the verse it cites.
import re,sys,json
sys.path.insert(0,'/home/claude/qgen')
from kjvload import load,norm
names,A,B,C,o2,o3=load()
BOOK={'GENESIS':'Genesis','GEN':'Genesis','PSALM':'Psalms','PS':'Psalms','EXODUS':'Exodus'}
def verses(ref):
    m=re.match(r'\s*([A-Za-z]+)\s+(\d+):(\d+)(?:[–-](\d+))?',ref)
    b=names.index(BOOK[m.group(1).upper()]); c=int(m.group(2)); v1=int(m.group(3)); v2=int(m.group(4) or v1)
    return b,c,list(range(v1,v2+1))
def edtext(D,b,c,vs,order=None):
    out=[]
    for v in vs:
        k=(b,c,v)
        if order is not None:
            k=(order.index(names[b]) if names[b] in order else b,c,v)
        out.append(D.get(k,''))
    return ' '.join(out)
def check(q,ref):
    b,c,vs=verses(ref)
    parts=[p for p in re.split(r'…|\.\.\.',q) if norm(p)]
    res=[]
    for name,D,order in [('kjv.json',A,None),('kjv2.csv',B,o2),('kjv3.json',C,o3)]:
        hay=' '+' '.join(norm(edtext(D,b,c,vs,order)))+' '
        ok=all((' '+' '.join(norm(p))+' ') in hay for p in parts)
        res.append(ok)
    return res
src=open(sys.argv[1]).read()
items=[]
# narration with “...” and a REF
for m in re.finditer(r"narr\('([^']*)','([A-Z][A-Z ]+\d+:\d+(?:[–-]\d+)?)",src):
    txt,ref=m.group(1),m.group(2)
    for q in re.findall(r'“([^”]*)”',txt): items.append(('narr',q,ref))
for m in re.finditer(r"say\('(\w+)','((?:[^'\\]|\\.)*)',\{[^}]*ref:'([^']*)'",src):
    items.append(('say:'+m.group(1),m.group(2).replace('\\u2019','’'),m.group(3)))
for m in re.finditer(r"yes:'([^']*)',ref:'([^']*)'",src):
    for q in re.findall(r'“([^”]*)”',m.group(1)): items.append(('answer',q,m.group(2)))
for m in re.finditer(r"<blockquote>“([^”]*)”</blockquote><cite>([^<]*)</cite>",src): items.append(('end',m.group(1),m.group(2)))
bad=0
for kind,q,ref in items:
    r=check(q,ref)
    flag='OK ' if all(r) else 'BAD'
    if not all(r): bad+=1
    print(flag,kind.ljust(11),ref.ljust(22),q[:90],'' if all(r) else r)
print('quotes',len(items),'mismatches',bad)
