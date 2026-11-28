import json,random,re,collections
U='https://dkoebooks.com/'
WAR="The Mystery of Seduction|Technical Prayers to Disgrace Local Goliaths|The Problems of Incomplete Deliverance|Born Great But Tied Down|The Wealth Transfer Agenda|Safeguarding Your Home|The A-Z of Complete Deliverance|Deliverance from Limiting Powers|Prayer is the Battle|The Mystery of Mobile Curses|The Star in Your Sky|Prayers to Kill Enchantment and Divination|The Dangerous Highway|The Unconquerable Power|Biblical Principles of Dream Interpretation|The Skeleton in your Grandfather's Cupboard|Dealing with The Satanic Exchange|The Mystery of the Mobile Temple|Battle Against The Spirit of Impossibility|Paying Evil Tithes|The Dining Table of Darkness|How to Pray When Surrounded by Enemies|Family Deliverance|Open Heavens through Holy Disturbance|Tied Down in the Spirit|Wasting the Wasters|Power For Explosive Success|Provocation At The Corridor of Breakthroughs|Medicine for Winners|Freedom from the Grip of Witchcraft|Power Over Tropical Demons|Principles of Prayer".split('|')
DREAM="Divine Immunity During Sleep|Dream Pointer|The Mystery of Sleep|Prayers to Fulfill your Destiny's Dreams|Dreaming Divine Dreams|Power Against Dream Criminals|Victory Over Satanic Dreams".split('|')
SERP="Watching The Serpents of the Magician|The Contest of the Serpents|Snake in the Power House|Killing the Serpent of Frustration|The Hidden Viper|Serpentine Enemies".split('|')
OTHER="Pray your Way to Marital Breakthrough|Steps to Greatness|The Mystery of Voices|The Fat Slaves|The Learners and The Listeners|Neutralising Satanic Prayers|Prayer Rain|Command The Morning|How to Pray When You are under Attack|Deliverance of the Brain|Receiving the oil Divine Favour|How to receive the Mantle of Power|Praying by the Blood of Jesus|Dealing with the Evil Powers of Your Father's House|40 Marriages that must not Hold|Violent Prayers to Disgrace Stubborn Problems|Prayer Strategies for Singles|Prayers to Destroy Diseases and Infirmities|Prayers To Move From Minimum To Maximum|Dealing with Local Satanic Technology|The Woman of Wonder|Prayer Passport to Crush Oppression|Intensity in Prayer|The God of Elijah|101 Weapons of Spiritual Warfare|Raiding The House Of The Strongman|The Secret of Progress and Enlargement".split('|')
SHADE="The Call Of God|Violence Against Negative Voices|The Daughters of Phillip|When Your Destiny Is Under Attack|Power to Fulfill Your Destiny".split('|')
GO=WAR+DREAM+SERP+OTHER
SER={'Warfare Prayer Series':WAR,'Dream and Sleep':DREAM,'Serpent':SERP}
src=lambda lab,u=U:{'label':lab,'url':u}
CAT='dkoebooks.com — Dr. D.K. Olukoya e-books'
out=[]
def add(q,c,ds,ex,s):
    o=[c]+ds[:3]; r=random.Random('go'+q); r.shuffle(o)
    out.append(dict(id='go%d'%len(out),pack='go-books',level='all',q=q,options=o,answer=o.index(c),explain=ex,source=s))
# 1 finish the title
STOP={'the','of','to','and','in','for','a','your','you','with','from','by','are','at','on','into','that','must','not','is','when','how','under','over','against','during','through'}
allt=GO+SHADE; low=set(t.lower() for t in allt)
words=collections.Counter()
for t in GO:
    for w in re.findall(r"[A-Za-z'-]+",t):
        if w.lower() not in STOP and len(w)>3: words[w]+=1
pool=list(words)
for t in GO:
    ws=t.split(); cand=[i for i,w in enumerate(ws) if i>0 and w.lower() not in STOP and len(w)>3 and re.match(r"^[A-Za-z-]+$",w)]
    if not cand or len(ws)<3: continue
    i=cand[-1]; w=ws[i]
    r=random.Random('t'+t); ds=[x for x in pool if x.lower()!=w.lower() and x.lower() not in t.lower() and x[0].isupper()==w[0].isupper()]
    r.shuffle(ds); good=[]
    for d in ds:
        alt=' '.join(ws[:i]+[d]+ws[i+1:]).lower()
        if alt not in low: good.append(d)
        if len(good)==3: break
    blank=' '.join(ws[:i]+['____']+ws[i+1:])
    add(f"Finish the title of this book by Dr. D.K. Olukoya: “{blank}”",w,good,f"The book is “{t}” by Dr. D.K. Olukoya.",src(CAT))
# 2 which series
SU={'Warfare Prayer Series':'https://www.dkoebooks.com/index.php?module=ebooks&func=qsearch&sfld=8&stext=Warfare+Prayer+Series','Dream and Sleep':U,'Serpent':U}
names=['Warfare Prayer Series','Dream and Sleep','Serpent','Stepping High']
for s,ts in SER.items():
    for t in ts:
        add(f"Which series of Dr. Olukoya's books does “{t}” belong to?",s,[x for x in names if x!=s],f"“{t}” is in the {s} series.",src(f'{s} — dkoebooks.com',SU[s]))
# 3 Shade Olukoya
SH='https://www.dkoebooks.com/index.php?module=ebooks&func=qsearch&sfld=3&stext=Mrs.+Shade+Olukoya'
for k,t in enumerate(SHADE):
    r=random.Random('sh%d'%k); ds=OTHER[:]; r.shuffle(ds)
    add("Which of these books was written by Pastor (Mrs.) Shade Olukoya, Mummy G.O.?",t,ds,f"“{t}” is by Pastor (Mrs.) Shade Olukoya.",src('Pastor Mrs. Shade Olukoya — dkoebooks.com',SH))
# 4 70 days programme
PB={2020:'1',2021:'2',2022:'3',2023:'4',2024:'5',2025:'6',2026:'7'}
for y,n in PB.items():
    ds=[str(x) for x in range(1,9) if str(x)!=n]; random.Random('pb%d'%y).shuffle(ds)
    add(f"The {y} edition of the 70 Days Prayer and Fasting Programme is called Prayer Battle number...",n,ds,f"The {y} edition is Prayer Battle {n}." if n!='1' else "The 2020 edition is titled Prayer Battle; 2021 was Prayer Battle 2.",src(CAT,'https://www.dkoebooks.com/index.php?module=ebooks&func=qsearch&sfld=top&stext=Top+Sellers'))
TH=[(2019,'Prayers that bring supernatural ease and double honor'),(2018,'Prayers That Bring Extraordinary Turnaround and Rejoicing'),(2017,'Prayers that bring indisputable victory and uncommon deliverance'),(2016,'Prayers that bring dominion favor and divine acceleration'),(2015,'Prayers that bring unparalleled favour'),(2013,'Prayers to secure fresh oil and distinctive shining')]
for y,t in TH:
    ds=[x for _,x in TH if x!=t]; random.Random('th%d'%y).shuffle(ds)
    add(f"What was the theme of the {y} 70 Days Prayer and Fasting Programme?",t,ds,f"{y}: “{t}”.",src(CAT))
add("For how many days is the Stepping High personal prayer and fasting programme?","21","[7]".strip('[]')and['7','40','70'],"Stepping High is a 21-day personal prayer and fasting programme for all-round open heavens.",src(CAT))
add("“Pluie De Prieres” is the French edition of which book by Dr. Olukoya?","Prayer Rain",["Command The Morning","Prayer is the Battle","Intensity in Prayer"],"Pluie De Prieres = Prayer Rain (French edition).",src(CAT))
add("What is the name of Dr. Olukoya's daily devotional?","Mountain Top Life",["Open Heavens","Our Daily Bread","Prayer Rain Daily"],"Mountain Top Life Daily Devotional.",src(CAT))
add("Where can you buy and read Dr. D.K. Olukoya's e-books online?","dkoebooks.com",["amazon-only","mfmbooks.org.ng","olukoyabooks.net"],"His e-books are on dkoebooks.com (MFM e-books: mfmebooks.com).",src('mountainoffire.org','https://mountainoffire.org/'))
print(len(out)); json.dump(out,open('out_go.json','w'),ensure_ascii=False,indent=0)
for x in out[::25]: print(x['q'][:110],x['options'])
