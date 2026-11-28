"""Content for the new Play & Grow games (Dawn, 2026-11-27). Writes js/games/*.json in the site repo.
Every Bible fact is checked against the three KJV texts loaded by common.py (V = verses all three agree on)."""
import json, re, random, collections, pathlib, sys
from common import V, VALL, BOOKS, A, src, ref, parse, FAMOUS, UNSUITABLE, clean
OUT = pathlib.Path('/home/claude/mfm-mega-region2/js/games'); OUT.mkdir(exist_ok=True)
ERR = []
TEXT = {k: t for k, t in VALL.items()}
BY_CH = collections.defaultdict(list)
for k, t in TEXT.items(): BY_CH[(k[0], k[1])].append(t)
CHAPTERS = [max(c for (b, c, v) in A if b == bi) for bi in range(len(BOOKS))]

def in_kjv(word):
    rx = re.compile(r'\b' + re.escape(word) + r'\b', re.I)
    return any(rx.search(t) for t in TEXT.values())
def in_ref(word, r):
    """word appears in the chapter (or verse range) of reference r, e.g. 'Genesis 35' or 'Genesis 35:23'"""
    m = re.match(r'(.+?) (\d+)(?::(\d+)(?:-(\d+))?)?$', r.strip()); n = {'Psalm': 'Psalms', 'Song': 'Song of Solomon'}.get(m.group(1), m.group(1))
    b, c = BOOKS.index(n), int(m.group(2))
    rx = re.compile(r'\b' + re.escape(word) + r'\b', re.I)
    if m.group(3):
        v1 = int(m.group(3)); v2 = int(m.group(4) or v1)
        return any(rx.search(TEXT.get((b, c, v), '')) for v in range(v1, v2 + 1))
    return any(rx.search(t) for t in BY_CH[(b, c)])
def url(r):
    import urllib.parse
    return 'https://www.biblegateway.com/passage/?search=' + urllib.parse.quote(r) + '&version=KJV'

# ------------------------------------------------------------------ 1. Daily Verse
def daily_verse():
    seen, out = set(), []
    for k in FAMOUS:
        if k not in V or k in seen: continue
        seen.add(k); t = V[k]
        if len(t) > 260: continue
        out.append([ref(k), k[0], k[1], t])
    rnd = random.Random('daily-verse-order'); rnd.shuffle(out)
    return {'books': BOOKS, 'chapters': CHAPTERS, 'verses': out}

# ------------------------------------------------------------------ 2. Verse Builder
def chunks(text):
    words = text.split(); n = len(words)
    target = 5 if n <= 14 else 6 if n <= 22 else 7
    size = n / target; out, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        end_punct = re.search(r'[,;:.?!]$', w)
        if (len(cur) >= size * 0.75 and end_punct) or len(cur) >= size * 1.35 or i == n - 1:
            out.append(' '.join(cur)); cur = []
    if cur: out.append(' '.join(cur))
    # merge a tiny last tile
    if len(out) > 2 and len(out[-1].split()) == 1:
        last = out.pop(); out[-1] += ' ' + last
    return out
def verse_builder():
    out, seen = [], set()
    for k in FAMOUS:
        if k not in V or k in seen: continue
        seen.add(k); t = V[k]; n = len(t.split())
        if n < 7 or n > 32: continue
        c = chunks(t)
        if len(set(c)) != len(c) or len(c) < 4: continue
        out.append([ref(k), c])
    return out

# ------------------------------------------------------------------ 3. Bible Word Connect
NEG = set('die died devil curse cursed hate hated evil vile liver sore worse hurt war wars anger tear tears sin sins slain dead death grave fear fool fools wrath woe lies liar'.split())
BADW = set('ass asses whore harlot piss dung naked lust rape sex hell damn bastard teat teats breast breasts womb lie lies kill slay slew'.split())
def word_connect():
    low = collections.Counter(); cap = collections.Counter()
    for k, t in V.items():
        for w in re.findall(r"(?<![-A-Za-z])[A-Za-z]+(?![-A-Za-z])", t): (cap if w[0].isupper() else low)[w.lower()] += 1
    def ok(w, f=2):
        return low[w] >= f and low[w] >= 3 * cap[w] and w not in BADW and not UNSUITABLE.search(w) and len(w) >= 3
    valid = sorted(w for w in low if ok(w) and len(w) <= 7)
    KEYS = ('praise gospel prayer spirit heaven temple prophet saviour blessed shepherd glory grace mercy faith manna altar crown light peace power holy angels psalms wisdom church honour worship anoint harvest kingdom sabbath '
            'servant garden fishers bread water mountain olive branch vines palms throne trumpet hosanna triumph victory deliver rescue redeem forgive healing strength courage refuge shield rejoice gladness thanks '
            'promise heart stone hearts disciple apostle eternal heavens rivers fountain morning shining treasure golden silver incense lamp lamps candles oil wheat seeds sower dove eagle lion lamb lambs flock sheep abide altars beloved blessing branches brethren candle chosen comfort delight dwell eagles earth father fathers feast flowers fruits gentle gifts guide harps honey hosts humble hymns joyful judges kings knees lights lilies manger master mighty miracle morning nations olives palace pastors pearls pillar praying preach priest prince psalm reward riches risen robes saints scroll seeds shine singing sister spring stars steward strong talents tithes trust truth unity waters wings witness wonder worthy zealous mercy power holy peace faith rock rocks river garment portion offering clouds rainbow tables cedars spices savour cities gates walls tower towers').split()
    def can(word, letters):
        c = collections.Counter(letters); return all(c[ch] >= n for ch, n in collections.Counter(word).items())
    puzzles = []
    for key in KEYS:
        key = key.lower()
        if len(key) < 5 or len(key) > 7 or not ok(key, 3): continue
        forms = [w for w in valid if can(w, key)]
        common = sorted([w for w in forms if w != key and low[w] >= 20 and w not in NEG], key=lambda w: (-low[w]))
        targets = [key] + common[:6]
        if len(targets) < 4: continue
        targets = sorted(set(targets), key=lambda w: (len(w), w))
        bonus = sorted(w for w in forms if w not in targets)
        # a verse that uses the key word (famous first)
        vk = next((k for k in FAMOUS if k in V and re.search(r'\b' + key + r'\b', V[k], re.I)), None) or next((k for k in sorted(V) if re.search(r'\b' + key + r'\b', V[k], re.I) and len(V[k]) < 200), None)
        if not vk: continue
        puzzles.append({'k': key.upper(), 't': [w.upper() for w in targets], 'b': [w.upper() for w in bonus], 'v': [ref(vk), V[vk]]})
    return puzzles

# ------------------------------------------------------------------ 4. Bible Connections
# (name, level 1 easy .. 4 hard, reference, members shown, extra members that also belong, check: 'kjv' | 'book' | 'ref')
CATS = [
 ('Sons of Jacob', 2, 'Genesis 35:23-26', 'Reuben Simeon Levi Judah Naphtali Asher Issachar Zebulun Benjamin', 'Dan Gad Joseph', 'ref'),
 ('Fruit of the Spirit', 1, 'Galatians 5:22-23', 'Love Joy Peace Longsuffering Gentleness Goodness Meekness Temperance', 'Faith', 'ref'),
 ('Plagues of Egypt', 1, 'Exodus 8', 'Frogs Lice Flies Hail Locusts Darkness Boils Blood', 'Murrain', 'kjv'),
 ('Books of Moses', 1, 'Genesis 1', 'Genesis Exodus Leviticus Numbers Deuteronomy', '', 'book'),
 ('Gospels', 1, 'Matthew 1', 'Matthew Mark Luke John', '', 'book'),
 ('Musical instruments', 1, 'Psalm 150', 'Harp Trumpet Cymbals Timbrel Psaltery Organs Cornet Flute', 'Sackbut Dulcimer Viol', 'kjv'),
 ('Birds', 1, 'Leviticus 11:13-19', 'Raven Dove Eagle Sparrow Owl Stork Pelican Ostrich', 'Quails Swallow', 'kjv'),
 ('Trees', 1, 'Isaiah 41:19', 'Cedar Fig Olive Willow Oak Myrtle Almond Juniper', 'Palm Sycomore Shittah', 'kjv'),
 ('Mountains', 2, 'Exodus 19:20', 'Sinai Carmel Ararat Moriah Nebo Horeb Hermon Tabor', 'Zion Olivet', 'kjv'),
 ('Pieces of the armour of God', 1, 'Ephesians 6:13-17', 'Breastplate Shield Helmet Sword', '', 'ref'),
 ('Jesus said "I am the ..."', 2, 'John 14:6', 'Bread Door Shepherd Resurrection Way Vine Light', 'Truth Life', 'kjv'),
 ('Minor prophets', 3, 'Hosea 1', 'Hosea Joel Amos Obadiah Jonah Micah Nahum Habakkuk Zephaniah Haggai Zechariah Malachi', '', 'book'),
 ('Major prophets', 2, 'Isaiah 1', 'Isaiah Jeremiah Ezekiel Daniel', 'Lamentations', 'book'),
 ("Paul's letters to churches", 2, 'Romans 1', 'Romans Galatians Ephesians Philippians Colossians', 'Corinthians Thessalonians', 'book'),
 ('Seven churches of Revelation', 3, 'Revelation 1:11', 'Ephesus Smyrna Pergamos Thyatira Sardis Philadelphia Laodicea', '', 'ref'),
 ('Judges of Israel', 3, 'Judges 3', 'Othniel Ehud Shamgar Deborah Gideon Jephthah Samson Tola', 'Jair Ibzan Elon Abdon Samuel', 'kjv'),
 ('Kings of Judah', 4, '2 Kings 18:1', 'Rehoboam Asa Jehoshaphat Hezekiah Josiah Uzziah Amaziah Jotham', 'Joash Ahaz Manasseh Amon Abijah', 'kjv'),
 ('Kings of Israel (north)', 4, '1 Kings 16', 'Jeroboam Ahab Jehu Omri Zimri Pekah Menahem Baasha', 'Nadab Elah Ahaziah Jehoram Joash Jehoahaz Shallum Hoshea Saul David Solomon', 'kjv'),
 ('Precious stones', 4, 'Exodus 28:17-20', 'Sardius Topaz Emerald Sapphire Diamond Jasper Amethyst Beryl', 'Onyx Agate Carbuncle Ligure', 'kjv'),
 ('Towns in the Gospels', 2, 'John 2:1', 'Nazareth Capernaum Bethany Cana Bethsaida Nain Emmaus', 'Bethlehem Jericho Jerusalem', 'kjv'),
 ('Philistine cities', 4, '1 Samuel 6:17', 'Gaza Ashdod Gath Ekron Askelon', '', 'ref'),
 ('Mothers of Israel', 2, 'Genesis 29', 'Sarah Rebekah Rachel Leah', '', 'kjv'),
 ('Horses of Revelation 6', 3, 'Revelation 6:2-8', 'White Red Black Pale', '', 'ref'),
 ('Rivers of Eden', 4, 'Genesis 2:11-14', 'Pison Gihon Hiddekel Euphrates', '', 'ref'),
 ('Rivers', 4, '2 Kings 5:12', 'Jordan Kishon Abana Pharpar Chebar', 'Euphrates Pison Gihon Hiddekel Arnon', 'kjv'),
 ('Kept sheep', 3, 'Genesis 4:2', 'Abel Rachel Moses David', 'Amos Jacob', 'kjv'),
 ('Taken to Babylon with Daniel', 3, 'Daniel 1:6', 'Daniel Hananiah Mishael Azariah', '', 'ref'),
 ('Their Babylonian names', 3, 'Daniel 1:7', 'Belteshazzar Shadrach Meshach Abednego', '', 'ref'),
 ('Rained down from heaven', 3, 'Genesis 19:24', 'Manna Fire Brimstone Hail', 'Quails', 'kjv'),
 ('___ of God', 3, 'John 1:29', 'Lamb Kingdom Armour Temple Son Word', 'Love Peace Grace Spirit Glory Power Wisdom Faith Light Truth Bread Way Door Life', 'kjv'),
 ('Had leprosy', 4, '2 Kings 5:1', 'Naaman Miriam Gehazi Uzziah', '', 'kjv'),
 ('Twins', 4, 'Genesis 38:27-30', 'Jacob Esau Pharez Zarah', '', 'kjv'),
 ('Prophetesses', 4, 'Judges 4:4', 'Miriam Deborah Huldah Anna Noadiah', '', 'kjv'),
 ('Sons of Aaron', 4, 'Exodus 6:23', 'Nadab Abihu Eleazar Ithamar', '', 'ref'),
 ('One-chapter books', 4, 'Jude 1', 'Obadiah Philemon Jude', '2 John 3 John', 'book'),
]
# ministry groups (checked by hand against official sources, linked in the game)
MIN_CATS = [
 ('MFM programmes', 1, 'mountainoffire.org', 'https://www.mountainoffire.org/', ['PMCH', 'MANNA WATER', 'PRAYER RAIN', '70 DAYS']),
 ('Cities with a Mega Region 2 branch', 2, 'Find a church', 'https://mfmmegaregion2usa.org/branches', ['TAMPA', 'SAN ANTONIO', 'TULSA', 'ORLANDO', 'TALLAHASSEE', 'IRVING', 'ARLINGTON', 'HUNTSVILLE', 'MANSFIELD']),
 ('Mega Region 2 brand scriptures', 3, 'Mega Region 2 USA', 'https://mfmmegaregion2usa.org/about', ['JEREMIAH 23:29', 'DEUTERONOMY 4:11', 'JEREMIAH 20:9', 'OBADIAH 1:17']),
 ('Mega Region 2 weekly programmes', 3, 'Watch live', 'https://mfmmegaregion2usa.org/live', ['HEALING &amp; DELIVERANCE HOUR', 'OPEN HEAVEN ENCOUNTER']),
]
MIN_CATS = [c for c in MIN_CATS if len(c[4]) >= 4]
# where a reference is a single chapter used only for the link, members are checked against the whole Bible
REF_FOR_LINK_ONLY = {'Books of Moses', 'Gospels', 'Minor prophets', 'Major prophets', "Paul's letters to churches", 'One-chapter books'}
def connections():
    cats = []
    for name, lvl, r, mem, extra, chk in CATS:
        m = mem.split(); x = extra.split() if extra and chk != 'book' else ([] if not extra else ['2 John', '3 John'] if name == 'One-chapter books' else extra.split())
        for w in m:
            if chk == 'book':
                if w not in BOOKS and w.replace('Psalm', 'Psalms') not in BOOKS: ERR.append(('book', name, w))
            elif chk == 'ref':
                if not in_ref({'Abednego': 'Abed-nego'}.get(w, w), r): ERR.append(('ref', name, w, r))
            elif not in_kjv(w): ERR.append(('kjv', name, w))
        cats.append({'n': name, 'l': lvl, 'r': r, 'u': url(r), 'm': [w.upper() for w in m], 'x': [w.upper() for w in x]})
    for name, lvl, r, u, mem in MIN_CATS:
        cats.append({'n': name, 'l': lvl, 'r': r, 'u': u, 'm': list(mem), 'x': [], 'min': 1})
    # every display word: which categories it belongs to (shown or extra)
    belongs = collections.defaultdict(set)
    for i, c in enumerate(cats):
        for w in c['m'] + c['x']: belongs[w].add(i)
    by_l = collections.defaultdict(list)
    for i, c in enumerate(cats): by_l[c['l']].append(i)
    SHAPE = (1, 2, 2, 3)
    rnd = random.Random('connections-v2'); puzzles, seen = [], set()
    tries = 0
    while len(puzzles) < 400 and tries < 50000:
        tries += 1
        pick = [rnd.choice([i for i in by_l[l] if not cats[i].get('min')]) for l in SHAPE]   # Nov 27: easier puzzles, no level-4 groups
        mins = [i for i, c in enumerate(cats) if c.get('min')]
        if rnd.random() < .5:   # about half the puzzles carry one ministry group
            m = rnd.choice(mins); pick[SHAPE.index(cats[m]['l'])] = m
        if len(set(pick)) < 4: continue
        groups, used, okp = [], set(), True
        for ci in pick:
            pool = [w for w in cats[ci]['m'] if not (belongs[w] & set(pick)) - {ci} and w not in used]
            if len(pool) < 4: okp = False; break
            g = rnd.sample(pool, 4); used.update(g); groups.append([ci, g])
        if not okp: continue
        sig = tuple(sorted((ci, tuple(sorted(g))) for ci, g in groups))
        if sig in seen: continue
        seen.add(sig); puzzles.append(groups)
    return {'cats': [{'n': c['n'], 'l': c['l'], 'r': c['r'], 'u': c['u']} for c in cats], 'p': puzzles}

# ------------------------------------------------------------------ 5. Who Am I?
# person: clues from hardest to easiest, each (clue, reference). The name must appear in the referenced verse(s).
WHO = [
 ('Abraham', [('I was told to leave my country, my family and my father’s house.', 'Genesis 12:1-4'), ('God changed my name when I was 99 years old.', 'Genesis 17:1-5'), ('I was willing to offer my son on Mount Moriah.', 'Genesis 22:1-2'), ('My wife Sarah laughed when she heard she would have a son.', 'Genesis 18:9-12'), ('I am called the father of many nations.', 'Genesis 17:5')]),
 ('Moses', [('I was hidden for three months as a baby.', 'Exodus 2:2-10'), ('I fled to Midian and kept the flock of Jethro.', 'Exodus 3:1'), ('God spoke to me from a burning bush.', 'Exodus 3:2-4'), ('I stretched out my hand over the Red Sea.', 'Exodus 14:21'), ('I brought the Ten Commandments down from Mount Sinai.', 'Exodus 34:29')]),
 ('David', [('I was the youngest son of Jesse.', '1 Samuel 16:11-13'), ('I played the harp for King Saul.', '1 Samuel 16:23'), ('My best friend was Jonathan.', '1 Samuel 18:1-3'), ('I danced before the LORD with all my might.', '2 Samuel 6:14'), ('I defeated Goliath with a sling and a stone.', '1 Samuel 17:49-50')]),
 ('Joseph', [('I was sold to the Ishmeelites for twenty pieces of silver.', 'Genesis 37:28'), ('I was put in prison in Egypt though I had done no wrong.', 'Genesis 39:20'), ('I explained the dreams of the butler and the baker.', 'Genesis 40:8-22'), ('Pharaoh made me ruler over all the land of Egypt.', 'Genesis 41:41-43'), ('My father gave me a coat of many colours.', 'Genesis 37:3')]),
 ('Noah', [('My father was Lamech.', 'Genesis 5:28-29'), ('I had three sons: Shem, Ham and Japheth.', 'Genesis 6:10'), ('I sent out a raven and then a dove.', 'Genesis 8:6-8'), ('I found grace in the eyes of the LORD.', 'Genesis 6:8'), ('I built an ark before the flood.', 'Genesis 6:13-14')]),
 ('Daniel', [('I would not defile myself with the king’s meat.', 'Daniel 1:8'), ('My Babylonian name was Belteshazzar.', 'Daniel 1:7'), ('I read the writing on the wall for King Belshazzar.', 'Daniel 5:13-25'), ('I prayed three times a day with my windows open toward Jerusalem.', 'Daniel 6:10'), ('God shut the mouths of the lions for me.', 'Daniel 6:22')]),
 ('Elijah', [('I was fed by ravens by the brook Cherith.', '1 Kings 17:3-6'), ('A widow of Zarephath fed me, and her meal and oil did not run out.', '1 Kings 17:9-16'), ('I challenged the prophets of Baal on Mount Carmel.', '1 Kings 18:19-21'), ('Fire fell from heaven when I prayed.', '1 Kings 18:36-38'), ('I went up by a whirlwind into heaven.', '2 Kings 2:11')]),
 ('Elisha', [('I was ploughing with twelve yoke of oxen when I was called.', '1 Kings 19:19'), ('I asked for a double portion of my master’s spirit.', '2 Kings 2:9'), ('I told Naaman to wash seven times in the Jordan.', '2 Kings 5:10'), ('I made an axe head float.', '2 Kings 6:5-6'), ('I took up the mantle of Elijah.', '2 Kings 2:13-14')]),
 ('Samson', [('An angel told my mother I would be a Nazarite.', 'Judges 13:3-5'), ('I killed a young lion with my bare hands.', 'Judges 14:5-6'), ('I carried away the gates of Gaza.', 'Judges 16:3'), ('Delilah found out the secret of my strength.', 'Judges 16:17-19'), ('My strength was connected to my long hair.', 'Judges 16:17')]),
 ('Gideon', [('I was threshing wheat by the winepress when an angel came.', 'Judges 6:11'), ('I asked God for a sign with a fleece of wool.', 'Judges 6:36-40'), ('God told me my army was too big.', 'Judges 7:2'), ('My 300 men had trumpets, pitchers and lamps.', 'Judges 7:16'), ('The angel called me "thou mighty man of valour".', 'Judges 6:12')]),
 ('Esther', [('My cousin Mordecai raised me.', 'Esther 2:7'), ('I was chosen out of many young women to be queen.', 'Esther 2:17'), ('I asked all the Jews in Shushan to fast for three days.', 'Esther 4:16'), ('I said, "If I perish, I perish."', 'Esther 4:16'), ('I saved my people from Haman’s plot.', 'Esther 7:3-6')]),
 ('Ruth', [('I came from the land of Moab.', 'Ruth 1:4'), ('My mother-in-law was Naomi.', 'Ruth 1:14-16'), ('I gleaned in the field of Boaz.', 'Ruth 2:3'), ('I became the great-grandmother of King David.', 'Ruth 4:17'), ('I said, "Thy people shall be my people, and thy God my God."', 'Ruth 1:16')]),
 ('Jonah', [('I was the son of Amittai.', 'Jonah 1:1'), ('I ran away to Tarshish instead of going where God sent me.', 'Jonah 1:3'), ('The sailors threw me into the sea.', 'Jonah 1:15'), ('I preached to Nineveh and the city repented.', 'Jonah 3:4-5'), ('I was in the belly of a great fish three days and three nights.', 'Jonah 1:17')]),
 ('Peter', [('My brother was Andrew.', 'Matthew 4:18'), ('I walked on the water toward Jesus.', 'Matthew 14:29'), ('I denied Jesus three times before the cock crew.', 'Matthew 26:75'), ('I preached on the day of Pentecost.', 'Acts 2:14'), ('Jesus said, "Upon this rock I will build my church."', 'Matthew 16:18')]),
 ('Paul', [('I was born in Tarsus.', 'Acts 22:3'), ('I was taught at the feet of Gamaliel.', 'Acts 22:3'), ('I was shipwrecked on the island of Melita.', 'Acts 28:1'), ('I wrote many letters, including Romans and Galatians.', 'Romans 1:1'), ('I met Jesus in a bright light on the road to Damascus.', 'Acts 9:3-4')]),
 ('Mary', [('I was from Nazareth, a city of Galilee.', 'Luke 1:26-27'), ('I was engaged to a man named Joseph.', 'Luke 1:27'), ('My cousin Elisabeth was the mother of John the Baptist.', 'Luke 1:36'), ('I said, "Behold the handmaid of the Lord."', 'Luke 1:38'), ('The angel Gabriel told me I would be the mother of Jesus.', 'Luke 1:30-31')]),
 ('Hannah', [('I was one of the two wives of Elkanah.', '1 Samuel 1:2'), ('I prayed so hard in the temple that Eli thought I was drunk.', '1 Samuel 1:13'), ('I promised to give my son to the LORD.', '1 Samuel 1:11'), ('I made my son a little coat every year.', '1 Samuel 2:19'), ('My son was Samuel the prophet.', '1 Samuel 1:20')]),
 ('Samuel', [('My mother brought me to Eli at the temple when I was young.', '1 Samuel 1:24-25'), ('The LORD called my name in the night.', '1 Samuel 3:10'), ('I said, "Speak; for thy servant heareth."', '1 Samuel 3:10'), ('I anointed Saul as the first king.', '1 Samuel 10:1'), ('I anointed David with oil.', '1 Samuel 16:13')]),
 ('Solomon', [('My mother was Bathsheba.', '2 Samuel 12:24'), ('I built the temple in Jerusalem.', '1 Kings 6:14'), ('The queen of Sheba came to test me with hard questions.', '1 Kings 10:1'), ('God gave me largeness of heart, even as the sand on the sea shore.', '1 Kings 4:29'), ('I asked God for wisdom.', '2 Chronicles 1:10-12')]),
 ('Jacob', [('I held my brother’s heel when we were born.', 'Genesis 25:26'), ('I dreamed of a ladder reaching to heaven.', 'Genesis 28:12'), ('I worked fourteen years to marry Rachel.', 'Genesis 29:20-30'), ('My name was changed to Israel.', 'Genesis 32:28'), ('I bought my brother Esau’s birthright for a meal.', 'Genesis 25:33-34')]),
 ('Joshua', [('I was the son of Nun.', 'Numbers 13:16'), ('I was one of the two spies who gave a good report.', 'Numbers 14:6-8'), ('The LORD told me, "Be strong and of a good courage."', 'Joshua 1:6-9'), ('I said, "As for me and my house, we will serve the LORD."', 'Joshua 24:15'), ('The walls of Jericho fell down when my people shouted.', 'Joshua 6:20')]),
 ('Nehemiah', [('I was the king’s cupbearer.', 'Nehemiah 1:11'), ('I was sad before King Artaxerxes because Jerusalem lay waste.', 'Nehemiah 2:1-3'), ('Sanballat and Tobiah mocked my work.', 'Nehemiah 4:1-3'), ('I prayed to the God of heaven before I answered the king.', 'Nehemiah 2:4-5'), ('I led the people to rebuild the walls of Jerusalem.', 'Nehemiah 2:17')]),
 ('Job', [('I lived in the land of Uz.', 'Job 1:1'), ('I had seven sons and three daughters.', 'Job 1:2'), ('I lost my children and my wealth in one day.', 'Job 1:13-19'), ('I said, "The LORD gave, and the LORD hath taken away."', 'Job 1:21'), ('The LORD gave me twice as much as I had before.', 'Job 42:10')]),
 ('Isaiah', [('I was the son of Amoz.', 'Isaiah 1:1'), ('I saw the Lord sitting upon a throne, high and lifted up.', 'Isaiah 6:1'), ('A seraphim touched my lips with a live coal.', 'Isaiah 6:6-7'), ('I said, "Here am I; send me."', 'Isaiah 6:8'), ('I prophesied, "A virgin shall conceive, and bear a son."', 'Isaiah 7:14')]),
 ('Jeremiah', [('I was of the priests that were in Anathoth.', 'Jeremiah 1:1'), ('I said, "Ah, Lord GOD! behold, I cannot speak: for I am a child."', 'Jeremiah 1:6'), ('I was put into a dungeon and sank in the mire.', 'Jeremiah 38:6'), ('I said God’s word was in my heart as a burning fire.', 'Jeremiah 20:9'), ('God told me, "Before I formed thee in the belly I knew thee."', 'Jeremiah 1:5')]),
 ('Nicodemus', [('I was a Pharisee and a ruler of the Jews.', 'John 3:1'), ('I came to Jesus by night.', 'John 3:2'), ('Jesus told me I must be born again.', 'John 3:3-7'), ('I asked, "How can a man be born when he is old?"', 'John 3:4'), ('I brought myrrh and aloes for the burial of Jesus.', 'John 19:39')]),
 ('Zacchaeus', [('I was chief among the publicans.', 'Luke 19:2'), ('I was rich.', 'Luke 19:2'), ('I was little of stature.', 'Luke 19:3'), ('I promised to give half my goods to the poor.', 'Luke 19:8'), ('I climbed a sycomore tree to see Jesus.', 'Luke 19:4')]),
 ('Lazarus', [('I lived in Bethany.', 'John 11:1'), ('My sisters were Mary and Martha.', 'John 11:1-2'), ('Jesus wept at my grave.', 'John 11:35'), ('I had been dead four days.', 'John 11:39'), ('Jesus called me out of the grave with a loud voice.', 'John 11:43-44')]),
 ('Stephen', [('I was chosen as one of seven men of honest report.', 'Acts 6:3-5'), ('I was full of faith and power, and did great wonders.', 'Acts 6:8'), ('I saw the heavens opened and Jesus standing at the right hand of God.', 'Acts 7:55-56'), ('A young man named Saul watched over the clothes of those who stoned me.', 'Acts 7:58'), ('I prayed, "Lord, lay not this sin to their charge."', 'Acts 7:60')]),
 ('Deborah', [('I was the wife of Lapidoth.', 'Judges 4:4'), ('I judged Israel under a palm tree.', 'Judges 4:5'), ('I called Barak to lead ten thousand men.', 'Judges 4:6'), ('I sang a song of victory with Barak.', 'Judges 5:1'), ('I was a prophetess and a judge of Israel.', 'Judges 4:4')]),
 ('John the Baptist', [('My father Zacharias was a priest.', 'Luke 1:13'), ('I ate locusts and wild honey.', 'Matthew 3:4'), ('I wore raiment of camel’s hair.', 'Matthew 3:4'), ('I said, "Behold the Lamb of God."', 'John 1:29'), ('I baptized Jesus in the Jordan.', 'Matthew 3:13')]),
 ('Adam', [('I was formed from the dust of the ground.', 'Genesis 2:7'), ('I gave names to all the animals.', 'Genesis 2:19-20'), ('God put me in the garden of Eden to dress it and keep it.', 'Genesis 2:15'), ('My wife was taken from my rib.', 'Genesis 2:21-22'), ('I was the first man.', '1 Corinthians 15:45')]),
 ('Eve', [('I was called the mother of all living.', 'Genesis 3:20'), ('The serpent spoke to me in the garden.', 'Genesis 3:1'), ('My sons were Cain and Abel.', 'Genesis 4:1-2'), ('I said, "The serpent beguiled me, and I did eat."', 'Genesis 3:13'), ('I was the wife of Adam in the garden of Eden.', 'Genesis 3:20')]),
 ('Thomas', [('I was also called Didymus.', 'John 11:16'), ('I asked Jesus, "How can we know the way?"', 'John 14:5'), ('I was not with the disciples when Jesus first came.', 'John 20:24'), ('I said, "My Lord and my God."', 'John 20:28'), ('I said I would not believe unless I saw the print of the nails.', 'John 20:25')]),
 ('Martha', [('I lived in Bethany with my sister and brother.', 'John 11:1'), ('I said to Jesus, "Lord, if thou hadst been here, my brother had not died."', 'John 11:21'), ('I said, "I believe that thou art the Christ, the Son of God."', 'John 11:27'), ('I was cumbered about much serving.', 'Luke 10:40'), ('My sister Mary sat at Jesus’ feet while I worked.', 'Luke 10:39-40')]),
 ('Caleb', [('I was the son of Jephunneh.', 'Numbers 13:6'), ('I was sent to spy out the land of Canaan.', 'Numbers 13:6'), ('I said, "Let us go up at once, and possess it."', 'Numbers 13:30'), ('At eighty-five years old I was as strong as on the day Moses sent me.', 'Joshua 14:10-11'), ('I asked for Hebron as my inheritance.', 'Joshua 14:13')]),
 ('Rahab', [('I lived in a house on the town wall.', 'Joshua 2:15'), ('I hid two spies under stalks of flax.', 'Joshua 2:6'), ('I let the spies down by a cord through the window.', 'Joshua 2:15'), ('I tied a scarlet line in my window.', 'Joshua 2:18-21'), ('My family was saved when Jericho fell.', 'Joshua 6:25')]),
 ('Mordecai', [('I was a Benjamite who was carried away from Jerusalem.', 'Esther 2:5-6'), ('I raised my cousin Hadassah.', 'Esther 2:7'), ('I uncovered a plot to kill the king.', 'Esther 2:21-22'), ('I would not bow to Haman.', 'Esther 3:2'), ('The king had me led through the city on his horse.', 'Esther 6:10-11')]),
 ('Timothy', [('My mother was a Jewess and my father was a Greek.', 'Acts 16:1'), ('My grandmother was Lois and my mother was Eunice.', '2 Timothy 1:5'), ('I knew the holy scriptures from a child.', '2 Timothy 3:15'), ('Paul called me his own son in the faith.', '1 Timothy 1:2'), ('Paul wrote two letters to me.', '2 Timothy 1:2')]),
 ('Hezekiah', [('My father was Ahaz.', '2 Kings 16:20'), ('I broke the brasen serpent that Moses had made.', '2 Kings 18:4'), ('I spread a threatening letter before the LORD.', '2 Kings 19:14'), ('God added fifteen years to my life.', '2 Kings 20:6'), ('The shadow went back ten degrees on the dial as a sign.', '2 Kings 20:11')]),
 ('Naaman', [('I was captain of the host of the king of Syria.', '2 Kings 5:1'), ('A little maid from Israel told my wife about a prophet.', '2 Kings 5:2-3'), ('I wanted to wash in Abana and Pharpar instead.', '2 Kings 5:12'), ('My skin came again like the flesh of a little child.', '2 Kings 5:14'), ('I dipped seven times in the Jordan and was healed of leprosy.', '2 Kings 5:14')]),
 ('Lydia', [('I was from the city of Thyatira.', 'Acts 16:14'), ('I was a seller of purple.', 'Acts 16:14'), ('I worshipped God by a river side where prayer was made.', 'Acts 16:13-14'), ('The Lord opened my heart to listen to Paul.', 'Acts 16:14'), ('I was baptized and asked Paul to stay at my house.', 'Acts 16:15')]),
]
def who_am_i():
    out = []
    for name, clues in WHO:
        key = name.split()[-1] if name == 'John the Baptist' else name
        key = 'John' if name == 'John the Baptist' else key
        for c, r in clues:
            # the person (or, for "I/my" clues, someone in the passage) must be in the passage; strict: the name or a known alias appears
            alias = {'Paul': ['Paul', 'Saul'], 'Peter': ['Peter', 'Simon'], 'Jacob': ['Jacob', 'Israel'], 'Abraham': ['Abraham', 'Abram'], 'Solomon': ['Solomon'], 'Eve': ['Eve', 'woman'], 'Adam': ['Adam', 'man'], 'Mary': ['Mary'],
                     'Jeremiah': ['Jeremiah', 'I', 'me'], 'David': ['David', 'LORD'], 'Hezekiah': ['Hezekiah', 'Ahaz'], 'Mordecai': ['Mordecai'], 'Timothy': ['Timothy', 'Timotheus', 'thee'], 'Esther': ['Esther', 'Hadassah'], 'Gideon': ['Gideon', 'thou'], 'Job': ['Job'], 'Deborah': ['Deborah'],
                     'Samson': ['Samson', 'son'], 'John the Baptist': ['John', 'son'], 'Joshua': ['Joshua', 'Oshea'], 'Thomas': ['Thomas'], 'Rahab': ['Rahab', 'she', 'her'], 'Lydia': ['Lydia', 'woman', 'she', 'her'], 'Nehemiah': ['Nehemiah', 'I'], 'Isaiah': ['Isaiah', 'I'], 'Caleb': ['Caleb'], 'Martha': ['Martha'], 'Noah': ['Noah'], 'Hannah': ['Hannah'], 'Samuel': ['Samuel', 'child'], 'Jonah': ['Jonah'], 'Elijah': ['Elijah', 'he'], 'Elisha': ['Elisha', 'he'], 'Daniel': ['Daniel'], 'Moses': ['Moses', 'child'], 'Joseph': ['Joseph'], 'Ruth': ['Ruth'], 'Nicodemus': ['Nicodemus', 'man'], 'Zacchaeus': ['Zacchaeus', 'he'], 'Lazarus': ['Lazarus', 'he'], 'Stephen': ['Stephen'], 'Naaman': ['Naaman', 'he']}.get(name, [key])
            rc = re.sub(r':.*$', '', r)
            if not any(in_ref(a, rc) for a in alias): ERR.append(('who', name, c, r))
        out.append({'n': name, 'c': [[c, r, url(r)] for c, r in clues]})
    return out

# ------------------------------------------------------------------ 6/7. Imposter + Charades word lists (simple, well known)
PEOPLE = 'Noah Moses David Goliath Daniel Jonah Esther Ruth Samson Delilah Abraham Sarah Isaac Jacob Joseph Elijah Elisha Gideon Solomon Peter Paul Mary Martha Lazarus Zacchaeus Pharaoh Adam Eve Cain Abel Nehemiah Joshua Deborah Hannah Samuel Saul Job Isaiah Jeremiah Thomas Judas Nicodemus Timothy Stephen Barnabas Lydia Rahab Naomi Boaz'.split()
PLACES = 'Bethlehem Nazareth Jerusalem Egypt Babylon Jericho Eden Galilee Jordan Sinai Carmel Nineveh Damascus Bethany Calvary Zion Canaan Patmos Samaria Capernaum Gethsemane Ararat Goshen Shiloh Hebron'.split()
THINGS = ['Ark', 'Manna', 'Tabernacle', 'Burning bush', 'Coat of many colours', 'Sling', 'Lions’ den', 'Fiery furnace', 'Red Sea', 'Stone tablets', 'Golden calf', 'Crown of thorns', 'Cross', 'Empty tomb', 'Five loaves', 'Two fishes', 'Rainbow', 'Dove', 'Harp', 'Trumpet', 'Shepherd’s staff', 'Alabaster box', 'Fishing net', 'Lamp', 'Altar', 'Jar of oil', 'Mustard seed', 'Pearl', 'Fig tree', 'Olive branch']
STORIES = ['Noah builds the ark', 'David fights Goliath', 'Jonah and the big fish', 'Daniel in the lions’ den', 'Moses parts the Red Sea', 'The walls of Jericho fall', 'Jesus walks on water', 'Jesus feeds five thousand', 'The prodigal son', 'The good Samaritan', 'Zacchaeus climbs a tree', 'Jesus calms the storm', 'Water into wine', 'Lazarus comes out of the grave', 'The Last Supper', 'Peter denies Jesus', 'Samson pushes the pillars', 'Joseph’s coat', 'Baby Moses in a basket', 'The tower of Babel', 'Elijah and the fire', 'The lost sheep', 'Jesus is baptized', 'The wise men follow the star', 'Paul is shipwrecked', 'The day of Pentecost']
MFM_WORDS = ['Prayer City', 'PMCH', 'Manna Water', 'Prayer Rain', '70 Days Prayer and Fasting', 'Mountain Top University', 'Healing & Deliverance Hour', 'Open Heaven Encounter', 'Deliverance service', 'Prayer line', 'Mega Region 2', 'Youth Church', 'Choir', 'Night vigil', 'Crusade', 'Church dedication']
def word_lists():
    for w in PEOPLE + PLACES:
        if not in_kjv(w): ERR.append(('list', w))
    return {'People': PEOPLE, 'Places': PLACES, 'Things': THINGS, 'Stories': STORIES, 'MFM': MFM_WORDS}

# ------------------------------------------------------------------ 8. Noah's Pairs
def pairs():
    keys = [parse('Genesis 7:9'), parse('Genesis 6:19'), parse('Genesis 9:13'), parse('Genesis 8:11'), parse('Genesis 7:1')]
    out = []
    for k in keys:
        if k not in VALL: ERR.append(('pairs', k)); continue
        out.append([ref(k), clean(VALL[k])])
    return out

data = {'dverse': daily_verse(), 'build': verse_builder(), 'wheel': word_connect(), 'connect': connections(), 'whoami': who_am_i(), 'words': word_lists(), 'pairs': pairs()}
for k, v in data.items():
    (OUT / (k + '.json')).write_text(json.dumps(v, ensure_ascii=False, separators=(',', ':')))
print({k: (len(v) if isinstance(v, list) else {kk: len(vv) for kk, vv in v.items() if isinstance(vv, list)}) for k, v in data.items()})
print('ERRORS', len(ERR)); [print(' ', e) for e in ERR]
