import sys; sys.path.insert(0,"/home/claude/qgen")
from common import *
import collections
T1='Jesus Moses David Peter Paul Abraham Elijah Ruth Joseph Noah Samuel Daniel Jonah Esther Mary Solomon Joshua Gideon Samson Isaac Jacob Sarah Hannah Eli Saul Goliath Adam Eve Cain Pilate Martha Naomi Job Elisha'.split()
T2='Rehoboam Jeroboam Elkanah Ahimelech Hiram Ittai Mephibosheth Ziba Amnon Tamar Nabal Jesse Eliab Abner Asa Jehoiada Elkanah Jephthah Barak Sisera Achan Korah Phinehas Eleazar Jochebed Potiphar Benjamin Simeon Levi Abimelech Melchizedek Ishmael Hagar Abram Sarai Shem Ham Japheth Methuselah Enoch Cyrus Zerubbabel Sanballat Tobiah Vashti Ahasuerus Shadrach Meshach Abednego Hosea Amos Micah Habakkuk Jairus Bartimaeus Lazarus Caiaphas Annas Matthias Silas Timothy Apollos Aquila Priscilla Lydia Tabitha Dorcas Rhoda Sapphira Mark Luke Titus Philemon Onesimus Aaron Esau Rebekah Rachel Laban Pharaoh Caleb Deborah Delilah Boaz Jonathan Nathan Absalom Ahab Jezebel Naaman Gehazi Hezekiah Isaiah Jeremiah Mordecai Haman Nehemiah Ezra Nebuchadnezzar Balaam Balak Rahab Abigail Joab Thomas Andrew Philip John James Judas Nicodemus Herod Barnabas Stephen Zacharias Elisabeth Agrippa Festus Gamaliel Cornelius Ananias Zacchaeus Satan Miriam Lot Reuben Judah Manoah Eliphaz Bildad Zophar Elihu Felix Simon Bathsheba Uriah Jehu Elihu Darius Belshazzar Jethro Shimei Hushai Ahithophel Micaiah Jehoshaphat Josiah'.split()
FAME={n:3 for n in T1}; FAME.update({n:2 for n in T2 if n not in FAME})
FAME['God']=2
SAY=r"(?:said|saith|answered and said|answering said|answered|spake|cried|cried, and said|called|prayed, and said|sware)"
P1=re.compile(r"^(?:And |Then |But |So |Now |And when |)(?:(?P<pre>Simon Peter|the LORD God|the LORD|God|[A-Z][a-z]+))(?: the [A-Za-z]+)? "+SAY+r"(?: unto (?P<to>[^,:;]{2,40}?))?,(?:\s*saying,)? (?P<q>[A-Z].+)$")
P3=re.compile(r"^(?:Then|And) answered (?P<pre>Simon Peter|Jesus|[A-Z][a-z]+) and said(?: unto (?P<to>[^,:;]{2,40}?))?, (?P<q>[A-Z].+)$")
P2=re.compile(r"^(?:Then|And|But) said (?P<pre>Simon Peter|the LORD God|the LORD|God|Jesus|[A-Z][a-z]+)(?: unto (?P<to>[^,:;]{2,40}?))?, (?P<q>[A-Z].+)$")
PRON={'him','her','them','me','us','you','thee','it','himself','his','one','another'}
def speaker(n,b):
    if n in ('the LORD','the LORD God','God'): return 'God'
    if n=='Simon Peter' or (n=='Simon' and b>=39): return 'Peter'
    if n=='Saul' and b==43: return 'Saul (Paul)'
    if n=='Simon': return None
    n={'Abram':'Abraham','Sarai':'Sarah'}.get(n,n)
    return n
items=[];seen=collections.defaultdict(set)
for k,t in V.items():
    b=k[0]
    m=P1.match(t) or P2.match(t) or P3.match(t)
    if not m: continue
    sp=speaker(m.group('pre'),b)
    if not sp or (sp.split(' ')[0] not in FAME and sp!='Saul (Paul)'): continue
    q=m.group('q').strip()
    q=re.sub(r'\s+',' ',q)
    if re.search(r'\b(said|saith|answered|spake)\b',q): continue
    if re.search(r'[:;,] (so|and|then) (he|she|they|both|David|Saul|Moses|Jesus) ?\w* ?(went|came|took|arose|did|departed|returned|rose|fled|sent|gave)\b',q): continue
    if re.search(r'[.?!;:] (Then|And|So|But|Now) (came|went|took|they|he|she|all|it)\b',q): continue
    if sp.split(' ')[0] in q: continue
    if re.search(r'[.?!] (Then|And|So|But) ([A-Z][a-z]+|the|they|he|she|his|her)\b',q): continue
    if re.search(r'[.;:] And (he|she|they|it|when|the|so|his|there|all)\b',q): continue
    w=q.split()
    if len(w)>26:
        # truncate at a clause boundary
        cut=None
        for mm in re.finditer(r'[;:,]',q):
            n=len(q[:mm.start()].split())
            if 10<=n<=26: cut=mm.start()
        if not cut: continue
        q=q[:cut].rstrip()+'…'
        w=q.split()
    if len(w)<6: continue
    q=re.sub(r'[,:;]$','…',q)
    if sp=='God' and b in (2,3): continue  # Leviticus/Numbers instructions
    to=m.group('to')
    if to:
        to=to.strip()
        if to.split()[0].lower() in PRON or len(to.split())>4: to=None
        elif to.startswith('the LORD'): to='the LORD'
    key=' '.join(norm(q)[:10])
    seen[key].add(sp)
    items.append(dict(k=k,sp=sp,q=q,to=to,key=key))
items=[i for i in items if len(seen[i['key']])==1]
# dedupe identical quotes
u={};
for i in items: u.setdefault(i['key'],i)
items=list(u.values())
bybook=collections.defaultdict(collections.Counter)
for i in items: bybook[i['k'][0]][i['sp']]+=1
def score(i):
    s=FAME.get(i['sp'].split(' ')[0],2)*3
    n=len(i['q'].split()); s+= 2 if 8<=n<=24 else 0
    if i['k'] in FAMOUS_SET: s+=6
    if i['to']: s+=1
    if i['q'].endswith('?') : s+=1
    return s
random.seed(29)
random.shuffle(items)
items.sort(key=score,reverse=True)
CAP={'Jesus':230,'God':80}
cnt=collections.Counter();out=[]
OT=[n for n in FAME if n!='God']
for i in items:
    sp=i['sp']
    if cnt[sp]>=CAP.get(sp,45): continue
    b=i['k'][0]
    inq=set(norm(i['q']))
    pool=[n for n,_ in bybook[b].most_common() if n!=sp and n!='God' and n.split(' ')[0].lower() not in inq]
    if len(pool)<3:
        test=1 if b>=39 else 0
        ext=[n for n in sorted(FAME,key=lambda x:-FAME[x]) if n not in pool and n!=sp and n!='God' and n.lower() not in inq]
        # same testament speakers overall
        tc=collections.Counter(j['sp'] for j in items if (j['k'][0]>=39)==(b>=39))
        ext=[n for n,_ in tc.most_common(40) if n not in pool and n!=sp and n!='God' and n.split(' ')[0].lower() not in inq]
        pool+=ext
    r=random.Random(i['key'])
    top=pool[:8]; r.shuffle(top); d=top[:3]
    if len(d)<3: continue
    cnt[sp]+=1
    opts=[sp]+d; r.shuffle(opts)
    bk=BOOKS[b] if BOOKS[b]!='Psalms' else 'Psalms'
    to=f" to {i['to']}" if i['to'] else ''
    if sp.split(' ')[0] in bk: bk_ctx='In the Bible'
    else: bk_ctx=f'In {bk}'
    lvl='kids' if FAME.get(sp.split(' ')[0])==3 and len(i['q'].split())<=16 else 'all'
    out.append(dict(id='w%d'%len(out),pack='who',level='all',q=f"“{i['q']}”",ctx=f"{bk_ctx}, who said this{to}?",options=opts,answer=opts.index(sp),
        explain=f"{sp} said it — {ref(i['k'])}.",source=src(i['k']),_kid=lvl=='kids'))
    if len(out)>=1100: break
print(len(items),len(out),cnt.most_common(25))
json.dump(out,open('out_who.json','w'),indent=0,ensure_ascii=False)
for o in out[:6]+out[500:503]+out[-3:]: print(o['ctx'],o['q'],o['options'],o['answer'])
# ---- "Who wrote these words?" — author named in the book's own opening verse
AUTH={}
for b in range(44,57): AUTH[b]=('Paul','%s 1:1'%BOOKS[b])
AUTH[58]=('James','James 1:1');AUTH[59]=('Peter','1 Peter 1:1');AUTH[60]=('Peter','2 Peter 1:1');AUTH[64]=('Jude','Jude 1:1');AUTH[65]=('John','Revelation 1:1')
for n in 'Isaiah Jeremiah Hosea Joel Amos Obadiah Micah Nahum Habakkuk Zephaniah Haggai Zechariah Malachi'.split():
    AUTH[BOOKS.index(n)]=(n,n+' 1:1')
AUTH[BOOKS.index('Proverbs')]=('Solomon','Proverbs 1:1')
# confirm each author's name really is in the opening verse in all three texts
for b,(a,r) in list(AUTH.items()):
    k=parse(r)
    if k not in V or a.lower() not in norm(V[k]):
        if a=='Haggai' or a=='Habakkuk' or a=='Nahum' or a=='Jeremiah':
            k2=(b,1,1); 
        print('check',r,a,V.get(k,'')[:80])
LET=['Paul','Peter','James','Jude','John']; PRO=['Isaiah','Jeremiah','Ezekiel','Daniel','Hosea','Joel','Amos','Micah','Habakkuk','Malachi','Zechariah','Jonah','Obadiah','Nahum','Haggai','Zephaniah']
cands=[]
for k,t in V.items():
    if k[0] not in AUTH: continue
    if BOOKS[k[0]]=='Proverbs' and k[1]>=30: continue   # Prov 30 = Agur, Prov 31 = Lemuel
    n=len(t.split())
    if not(8<=n<=24) or not t[0].isupper() or t.split()[0] in ('And','Then','Now','So','But','Wherefore','For') and k not in FAMOUS_SET: continue
    if not t.endswith(('.','?','!')): continue
    if re.search(r'\b(Paul|Peter|James|Jude|Solomon|Isaiah|Jeremiah|Hosea|Joel|Amos|Micah|Malachi|Habakkuk)\b',t): continue
    s=(10 if k in FAMOUS_SET else 0)+(3 if 10<=n<=18 else 0)+random.Random(str(k)).random()*3
    cands.append((s,k,t))
cands.sort(reverse=True)
per=collections.Counter(); wr=[]
for s,k,t in cands:
    a,r=AUTH[k[0]]
    if per[k[0]]>=40: continue
    pool=[x for x in (LET if a in LET else (['Solomon','David','Asaph','Agur'] if a=='Solomon' else PRO)) if x!=a]
    rr=random.Random(str(k)); rr.shuffle(pool); opts=[a]+pool[:3]; rr.shuffle(opts)
    per[k[0]]+=1
    wr.append(dict(id='wa%d'%len(wr),pack='who',level='all',q=f"“{t}”",ctx="Who wrote these words?",options=opts,answer=opts.index(a),
       explain=f"{a} — {ref(k)}. The book names its writer in {r}.",source=src(k)))
print('writers',len(wr))
need=1000-len(out)
mix=out+wr[:max(need,0)]
json.dump(mix,open('out_who.json','w'),indent=0,ensure_ascii=False)
print('who total',len(mix))
for o in wr[:4]: print(o['q'],o['options'],o['answer'])
