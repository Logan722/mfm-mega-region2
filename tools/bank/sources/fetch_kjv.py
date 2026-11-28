"""Download the 3 independent public-domain KJV texts the accuracy checks compare.
A verse counts only when all three agree. Each file is checked against its SHA-256;
a mismatch stops everything (the source changed and must be re-reviewed).
Usage: python3 tools/bank/sources/fetch_kjv.py   (cache: $MFM_KJV or ~/.cache/mfm-kjv)"""
import hashlib,os,sys,urllib.request
DEST=os.environ.get('MFM_KJV',os.path.expanduser('~/.cache/mfm-kjv'))
FILES={
 'kjv.json':('https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json','f627b3c24a617013a4514ab24b6dd1bb305b09af237994c018f74cb9c7e71f41'),
 'kjv2.csv':('https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/csv/KJV.csv','a1051b4395bee78d01e239984425f3919563db5caee6fc162d4ddc7faff7eaa8'),
 'kjv3.json':('https://raw.githubusercontent.com/farskipper/kjv/master/json/verses-1769.json','43fbd2fd6a7aebaf62c0c828a85072336143c1fe8233a4856a12db1d5e5df470'),
}
os.makedirs(DEST,exist_ok=True); bad=0
for name,(url,sha) in FILES.items():
    p=os.path.join(DEST,name)
    if not(os.path.exists(p) and hashlib.sha256(open(p,'rb').read()).hexdigest()==sha):
        urllib.request.urlretrieve(url,p)
    got=hashlib.sha256(open(p,'rb').read()).hexdigest()
    print(('OK  ' if got==sha else 'BAD ')+name); bad+=got!=sha
sys.exit(1 if bad else 0)
