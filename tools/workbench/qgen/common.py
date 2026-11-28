import sys,re,random,json,urllib.parse
sys.path.insert(0,'/home/claude/qgen')
from kjvload import load,norm
names,A,B,C,_,o3=load()
BOOKS=[n if n!="Solomon's Song" else 'Song of Solomon' for n in o3]
def clean(t):
    t=re.sub(r'[\[\]#]','',t); t=re.sub(r'\s+',' ',t).strip()
    return t
def _n(t): return [w.replace('ae','e') for w in norm(t)]
def agree(k):
    a,b,c=_n(A[k]),_n(B[k]),_n(C[k])
    return a==c and (b==a or (len(b)>len(a) and b[-len(a):]==a and len(b)-len(a)<=8))
V={k:clean(C[k]) for k in A if agree(k)}
# family-friendly: leave out verses a church game shouldn't show (Dawn's audience includes children)
UNSUITABLE=re.compile(r"\b(whore\w*|harlot\w*|naked\w*|fornicat\w*|secret parts|privy|piss\w*|dung(?!eon)\w*|menstruous|concubine\w*|lie with|lay with|lieth with|lain with|lay down with|uncover\w*|ravish\w*|breasts?|teats|foreskins?|circumcis\w*|uncircumcis\w*|sodomites?|bowels|vomit\w*|excrement|incest|go in unto|went in unto|came in unto|gone in unto|knew (her|his wife)|seed of copulation|issue of (his|her) (flesh|blood)|flux|stones are crushed|eunuchs?|adulter\w*|lust\w*|wanton\w*|lewd\w*|bastard\w*|dash\w* (in pieces )?(the |their )?(little ones|infants|children)|ripped up|eat the flesh of (thy|their|your|his) (sons|daughters)|sucklings?|rape\w*|defiled? (her|his)|slew (him|them) .* (sons|children)|skin of (his|her) flesh|unclean until the even|sore and the plague|leprous|scab)\b",re.I)
VALL=dict(V)
_drop=[k for k,t in V.items() if UNSUITABLE.search(t)]
for k in _drop: del V[k]
def ref(k):
    b,c,v=k; n=BOOKS[b]
    if n=='Psalms': n='Psalm'
    return f'{n} {c}:{v}'
def src(k,k2=None):
    r=ref(k) if not k2 else ref(k)+'-'+str(k2[2])
    return {'label':r+' (KJV)','url':'https://www.biblegateway.com/passage/?search='+urllib.parse.quote(r)+'&version=KJV'}
def parse(r):
    m=re.match(r'(.+?) (\d+):(\d+)$',r.strip()); n=m.group(1)
    n={'Psalm':'Psalms','Song':'Song of Solomon'}.get(n,n)
    return (BOOKS.index(n),int(m.group(2)),int(m.group(3)))
GROUPS=[(0,5),(5,17),(17,22),(22,27),(27,39),(39,43),(43,57),(57,66)]
def group(b):
    for i,(s,e) in enumerate(GROUPS):
        if s<=b<e: return i
def words(t): return norm(t)
FAMOUS_TXT='''Genesis 1:1;Genesis 1:3;Genesis 1:27;Genesis 2:7;Genesis 2:18;Genesis 3:15;Genesis 4:9;Genesis 6:8;Genesis 7:12;Genesis 9:13;Genesis 12:1;Genesis 12:2;Genesis 15:6;Genesis 18:14;Genesis 22:8;Genesis 28:12;Genesis 32:28;Genesis 37:3;Genesis 50:20;
Exodus 3:5;Exodus 3:14;Exodus 14:14;Exodus 14:21;Exodus 15:26;Exodus 20:3;Exodus 20:12;Exodus 33:14;Leviticus 19:18;Numbers 6:24;Numbers 6:25;Numbers 6:26;Numbers 23:19;Deuteronomy 4:24;Deuteronomy 6:4;Deuteronomy 6:5;Deuteronomy 8:18;Deuteronomy 28:13;Deuteronomy 31:6;Deuteronomy 4:11;
Joshua 1:8;Joshua 1:9;Joshua 6:20;Joshua 24:15;Judges 6:12;Judges 16:28;Ruth 1:16;1 Samuel 3:10;1 Samuel 15:22;1 Samuel 16:7;1 Samuel 17:45;1 Samuel 17:47;2 Samuel 22:2;1 Kings 18:21;1 Kings 18:38;1 Kings 19:12;2 Kings 2:11;2 Kings 6:16;2 Kings 6:17;1 Chronicles 4:10;2 Chronicles 7:14;2 Chronicles 20:15;Nehemiah 8:10;Esther 4:14;Job 1:21;Job 19:25;Job 42:10;
Psalm 1:1;Psalm 1:2;Psalm 1:3;Psalm 8:1;Psalm 19:1;Psalm 19:14;Psalm 23:1;Psalm 23:2;Psalm 23:3;Psalm 23:4;Psalm 23:5;Psalm 23:6;Psalm 24:1;Psalm 27:1;Psalm 30:5;Psalm 34:1;Psalm 34:8;Psalm 34:19;Psalm 37:4;Psalm 37:25;Psalm 46:1;Psalm 46:10;Psalm 51:10;Psalm 55:22;Psalm 68:1;Psalm 84:11;Psalm 90:12;Psalm 91:1;Psalm 91:2;Psalm 91:7;Psalm 91:11;Psalm 100:4;Psalm 103:1;Psalm 103:2;Psalm 107:20;Psalm 118:24;Psalm 119:11;Psalm 119:105;Psalm 121:1;Psalm 121:2;Psalm 126:5;Psalm 133:1;Psalm 139:14;Psalm 150:6;
Proverbs 3:5;Proverbs 3:6;Proverbs 4:23;Proverbs 9:10;Proverbs 15:1;Proverbs 16:3;Proverbs 16:18;Proverbs 18:10;Proverbs 18:21;Proverbs 22:6;Proverbs 27:17;Proverbs 29:18;Proverbs 31:10;Ecclesiastes 3:1;Ecclesiastes 12:13;
Isaiah 6:8;Isaiah 7:14;Isaiah 9:6;Isaiah 26:3;Isaiah 40:8;Isaiah 40:29;Isaiah 40:31;Isaiah 41:10;Isaiah 43:2;Isaiah 43:19;Isaiah 53:5;Isaiah 54:17;Isaiah 55:8;Isaiah 55:11;Isaiah 60:1;Isaiah 61:1;Jeremiah 1:5;Jeremiah 17:7;Jeremiah 20:9;Jeremiah 23:29;Jeremiah 29:11;Jeremiah 32:27;Jeremiah 33:3;Lamentations 3:22;Lamentations 3:23;Ezekiel 37:4;Daniel 3:17;Daniel 6:22;Daniel 11:32;Joel 2:28;Obadiah 1:17;Micah 6:8;Habakkuk 2:2;Habakkuk 3:17;Zechariah 4:6;Malachi 3:10;
Matthew 4:4;Matthew 4:19;Matthew 5:3;Matthew 5:8;Matthew 5:9;Matthew 5:14;Matthew 5:16;Matthew 5:44;Matthew 6:9;Matthew 6:33;Matthew 6:34;Matthew 7:7;Matthew 7:12;Matthew 11:28;Matthew 16:18;Matthew 17:20;Matthew 18:20;Matthew 19:26;Matthew 22:37;Matthew 24:35;Matthew 28:19;Matthew 28:20;Mark 9:23;Mark 10:27;Mark 11:24;Mark 16:15;Mark 16:17;Luke 1:37;Luke 2:10;Luke 2:11;Luke 2:14;Luke 4:18;Luke 6:31;Luke 6:38;Luke 10:19;Luke 15:7;Luke 18:27;Luke 19:10;
John 1:1;John 1:12;John 1:14;John 3:3;John 3:16;John 3:30;John 4:24;John 6:35;John 8:12;John 8:32;John 8:36;John 10:10;John 10:11;John 11:25;John 11:35;John 13:34;John 14:1;John 14:2;John 14:6;John 14:14;John 14:27;John 15:5;John 15:13;John 16:33;John 17:17;John 20:29;
Acts 1:8;Acts 2:4;Acts 2:38;Acts 3:6;Acts 4:12;Acts 16:31;Acts 17:28;Acts 20:35;Romans 1:16;Romans 3:23;Romans 5:8;Romans 6:23;Romans 8:1;Romans 8:28;Romans 8:31;Romans 8:37;Romans 10:9;Romans 10:17;Romans 12:1;Romans 12:2;Romans 12:21;Romans 15:13;1 Corinthians 2:9;1 Corinthians 10:13;1 Corinthians 13:4;1 Corinthians 13:13;1 Corinthians 15:57;1 Corinthians 15:58;1 Corinthians 16:13;2 Corinthians 4:18;2 Corinthians 5:7;2 Corinthians 5:17;2 Corinthians 9:7;2 Corinthians 12:9;Galatians 2:20;Galatians 5:22;Galatians 6:7;Galatians 6:9;Ephesians 2:8;Ephesians 3:20;Ephesians 4:32;Ephesians 6:10;Ephesians 6:11;Ephesians 6:12;Philippians 1:6;Philippians 1:21;Philippians 2:10;Philippians 3:14;Philippians 4:4;Philippians 4:6;Philippians 4:7;Philippians 4:8;Philippians 4:13;Philippians 4:19;Colossians 3:2;Colossians 3:23;1 Thessalonians 5:16;1 Thessalonians 5:17;1 Thessalonians 5:18;2 Timothy 1:7;2 Timothy 2:15;2 Timothy 3:16;2 Timothy 4:7;Hebrews 4:12;Hebrews 11:1;Hebrews 11:6;Hebrews 12:2;Hebrews 12:29;Hebrews 13:5;Hebrews 13:8;James 1:5;James 1:17;James 1:22;James 4:7;James 5:16;1 Peter 2:9;1 Peter 5:7;1 Peter 5:8;1 John 1:9;1 John 4:4;1 John 4:8;1 John 4:18;3 John 1:2;Revelation 3:20;Revelation 12:11;Revelation 21:4;Revelation 22:13'''
FAMOUS=[parse(x) for x in FAMOUS_TXT.replace('\n','').split(';') if x.strip()]
FAMOUS_SET=set(FAMOUS)
