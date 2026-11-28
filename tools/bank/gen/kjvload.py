import json,csv,re,unicodedata
K=__import__('os').environ.get('MFM_KJV',__import__('os').path.expanduser('~/.cache/mfm-kjv'))+'/'
def norm(t):
    t=unicodedata.normalize('NFKD',t).replace('æ','ae').replace('Æ','Ae')
    t=re.sub(r'[\[\]#¶]','',t)
    return re.sub(r'[^a-z ]','',re.sub(r'[-—–]',' ',t.lower())).split()
def load():
    a=json.load(open(K+'kjv.json',encoding='utf-8-sig'))
    names=[b['name'] for b in a]
    A={}
    for bi,b in enumerate(a):
        for ci,c in enumerate(b['chapters']):
            for vi,v in enumerate(c): A[(bi,ci+1,vi+1)]=v
    # scrollmapper
    B={};order=[]
    for r in csv.DictReader(open(K+'kjv2.csv',encoding='utf-8')):
        if r['Book'] not in order: order.append(r['Book'])
        B[(order.index(r['Book']),int(r['Chapter']),int(r['Verse']))]=r['Text']
    C={};order3=[]
    for k,v in json.load(open(K+'kjv3.json',encoding='utf-8')).items():
        m=re.match(r'(.+) (\d+):(\d+)$',k)
        if m.group(1) not in order3: order3.append(m.group(1))
        C[(order3.index(m.group(1)),int(m.group(2)),int(m.group(3)))]=v
    return names,A,B,C,order,order3
