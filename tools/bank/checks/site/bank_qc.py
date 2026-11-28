import json,re,collections,sys
R=__import__('os').environ.get('MFM_REPO',__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'../../../..')))+'/js/'
core=json.load(open(R+'quiz-bank.json'))
packs={p:json.load(open(R+'quiz/'+p+'.json')) for p in ['bible','verse','who','kids','oni-books','blitz']}
W=json.load(open(R+'quiz/words.json'))
issues=collections.defaultdict(list); ids=collections.Counter(); qtext=collections.defaultdict(list)
allq=[('core',q) for q in core['questions']]+[(p,q) for p,l in packs.items() if p!='blitz' for q in l]
for src,q in allq:
    ids[q['id']]+=1
    pk=q.get('pack')
    if pk not in core['packs']: issues['unknown pack'].append(q['id'])
    o=q.get('options',[])
    if len(o)!=4: issues['not 4 options'].append(q['id'])
    if len(set(x.strip().lower() for x in o))!=len(o): issues['duplicate options'].append((q['id'],o))
    if not isinstance(q.get('answer'),int) or not 0<=q['answer']<len(o): issues['bad answer index'].append(q['id'])
    if any(not str(x).strip() for x in o): issues['empty option'].append(q['id'])
    if not q.get('q','').strip(): issues['empty question'].append(q['id'])
    if not q.get('explain','').strip(): issues['no explanation'].append(q['id'])
    s=q.get('source') or {}
    if not re.match(r'^https://',s.get('url','')) or not s.get('label'): issues['bad source'].append(q['id'])
    if q['q'].count('____')>1 and 'How many' not in q['q']: issues['multiple blanks'].append(q['id'])
    if re.search(r'\b(undefined|None|null|nan)\b',q['q']+' '.join(o)): issues['junk text'].append(q['id'])
    if len(q['q'])>420: issues['very long question'].append((q['id'],len(q['q'])))
    if any(len(x)>90 for x in o): issues['very long option'].append(q['id'])
    if q['options'][q['answer']].lower() in q['q'].lower() and '____' not in q['q'] and pk not in ('who','bible','oni-books','go-books','messages','mfm'): issues['answer visible in question'].append(q['id'])
    qtext[(pk,re.sub(r'\W','',q['q'].lower()))].append(q['id'])
for k,v in ids.items():
    if v>1: issues['duplicate id'].append(k)
for k,v in qtext.items():
    if len(v)>1: issues['duplicate question text'].append(v)
# blitz
for z in packs['blitz']:
    ids[z['id']]+=1
    if not isinstance(z.get('t'),bool): issues['blitz t not bool'].append(z['id'])
    if not z.get('s','').strip(): issues['blitz empty'].append(z['id'])
    if not z.get('explain'): issues['blitz no explain'].append(z['id'])
    if not (z.get('source') or {}).get('url','').startswith('https://'): issues['blitz bad source'].append(z['id'])
bt=collections.Counter(z['t'] for z in packs['blitz'])
# words
vs=set(W['valid'])
for w in W['words']:
    x=w['w']
    if not re.fullmatch(r'[A-Z]{5}',x): issues['word not 5 letters'].append(x)
    if x.lower() not in vs: issues['word not in valid list'].append(x)
    if not re.search(r'\b%s\b'%x,w['text'],re.I): issues['word not in its verse'].append(x)
if len(set(w['w'] for w in W['words']))!=len(W['words']): issues['duplicate words'].append('dup')
# kids answers sanity
counts={**collections.Counter(q['pack'] for _,q in allq)}
print('COUNTS',counts,'blitz',len(packs['blitz']),bt,'words',len(W['words']),'valid',len(vs))
print('answer position balance',collections.Counter(q['answer'] for _,q in allq))
# Reviewed false alarms (do not stop the weekly run): 'None' is KJV text (1 Chr 15:2); 'Five' loaves is the Bible fact.
KNOWN_OK={'junk text':{'W-w257'},'answer visible in question':{'js1'}}
for k in list(issues):
    issues[k]=[x for x in issues[k] if not (isinstance(x,str) and x in KNOWN_OK.get(k,()))]
    if not issues[k]: del issues[k]
for k,v in issues.items(): print('ISSUE',k,len(v),v[:6])
if not issues: print('NO ISSUES')
import sys; sys.exit(1 if issues else 0)
