"""Four new Bible topics for the Play & Grow bank (Dawn, 2026-11-27): Names and titles of God, Parables and miracles
of Jesus, Prayer and fasting, Promises of God. Every question names a KJV reference, and the checked words must
appear in that passage in the three KJV texts (VALL). Answer is option 0; the game shuffles the options."""
import json, re, sys, urllib.parse, pathlib
from common import VALL, BOOKS, C, clean
BANK = pathlib.Path('/home/claude/mfm-mega-region2/js/quiz-bank.json')

def passage(r):
    m = re.match(r'(.+?) (\d+):(\d+)(?:-(\d+))?$', r); n = {'Psalm': 'Psalms'}.get(m.group(1), m.group(1))
    b, c, v1 = BOOKS.index(n), int(m.group(2)), int(m.group(3)); v2 = int(m.group(4) or v1)
    return ' '.join(VALL.get((b, c, v)) or clean(C.get((b, c, v), '')) for v in range(v1, v2 + 1))
def src(r): return {'label': r + ' (KJV)', 'url': 'https://www.biblegateway.com/passage/?search=' + urllib.parse.quote(r) + '&version=KJV'}

# (question, [answer, distractor, distractor, distractor], reference, words that must be in the passage, explanation)
T = {
 'godnames': [
  ('Abraham named the place where God provided a ram. What did he call it?', ['Jehovah-jireh', 'Jehovah-nissi', 'Jehovah-shalom', 'Ebenezer'], 'Genesis 22:14', ['Jehovah-jireh'], 'Jehovah-jireh: "The LORD will provide."'),
  ('After the victory over Amalek, Moses built an altar. What did he call it?', ['Jehovah-nissi', 'Jehovah-jireh', 'Jehovah-shalom', 'Bethel'], 'Exodus 17:15', ['Jehovah-nissi'], 'Jehovah-nissi: "The LORD is my banner."'),
  ('Gideon built an altar to the LORD. What did he call it?', ['Jehovah-shalom', 'Jehovah-nissi', 'Jehovah-jireh', 'Ebenezer'], 'Judges 6:24', ['Jehovah-shalom'], 'Jehovah-shalom: "The LORD is peace."'),
  ('God said "I AM THAT I AM" to whom?', ['Moses', 'Abraham', 'Elijah', 'Samuel'], 'Exodus 3:13-14', ['Moses', 'I AM THAT I AM'], 'God spoke to Moses from the burning bush.'),
  ('Isaiah 9:6: "Wonderful, Counsellor, The mighty God, The everlasting Father, The ____."', ['Prince of Peace', 'King of Glory', 'Lord of Hosts', 'Holy One'], 'Isaiah 9:6', ['Prince of Peace'], 'Isaiah 9:6 names the child to be born.'),
  ('"I am Alpha and Omega, the beginning and the ending." Which book is this from?', ['Revelation', 'Isaiah', 'John', 'Hebrews'], 'Revelation 1:8', ['Alpha and Omega'], 'Revelation 1:8.'),
  ('Revelation calls Jesus "the Lion of the tribe of ____".', ['Juda', 'Benjamin', 'Levi', 'Ephraim'], 'Revelation 5:5', ['Lion of the tribe of Juda'], 'Revelation 5:5 (KJV spells it Juda).'),
  ('On His vesture is written "KING OF KINGS, AND LORD OF ____".', ['LORDS', 'HOSTS', 'GLORY', 'HEAVEN'], 'Revelation 19:16', ['KING OF KINGS, AND LORD OF LORDS'], 'Revelation 19:16.'),
  ('Jesus said, "I am the root and the offspring of David, and the bright and morning ____."', ['star', 'light', 'sun', 'lamp'], 'Revelation 22:16', ['bright and morning star'], 'Revelation 22:16.'),
  ('What does the name Emmanuel mean?', ['God with us', 'God is my judge', 'Salvation of God', 'Prince of God'], 'Matthew 1:23', ['Emmanuel', 'God with us'], 'Matthew 1:23: "Emmanuel, which being interpreted is, God with us."'),
  ('In Daniel’s vision, "the ____ of days did sit".', ['Ancient', 'Lord', 'King', 'Father'], 'Daniel 7:9', ['Ancient of days'], 'Daniel 7:9.'),
  ('Jeremiah 23:6: "this is his name whereby he shall be called, THE LORD OUR ____."', ['RIGHTEOUSNESS', 'SHEPHERD', 'STRENGTH', 'REDEEMER'], 'Jeremiah 23:6', ['THE LORD OUR RIGHTEOUSNESS'], 'Jeremiah 23:6.'),
  ('Exodus 15:26: "I am the LORD that ____ thee."', ['healeth', 'keepeth', 'leadeth', 'blesseth'], 'Exodus 15:26', ['I am the LORD that healeth thee'], 'Exodus 15:26.'),
  ('John the Baptist pointed to Jesus and said, "Behold the ____ of God."', ['Lamb', 'Son', 'Word', 'Light'], 'John 1:29', ['Behold the Lamb of God'], 'John 1:29.'),
  ('God appeared to Abram and said, "I am the ____ God."', ['Almighty', 'Living', 'Everlasting', 'Holy'], 'Genesis 17:1', ['I am the Almighty God'], 'Genesis 17:1.'),
  ('Psalm 18:2: "The LORD is my rock, and my fortress, and my ____."', ['deliverer', 'shepherd', 'banner', 'portion'], 'Psalm 18:2', ['my fortress, and my deliverer'], 'Psalm 18:2.'),
  ('1 Timothy 6:15 calls Him "the blessed and only ____, the King of kings".', ['Potentate', 'Saviour', 'Redeemer', 'Master'], '1 Timothy 6:15', ['only Potentate'], '1 Timothy 6:15.'),
  ('Hebrews 12:29: "For our God is a consuming ____."', ['fire', 'light', 'flame', 'glory'], 'Hebrews 12:29', ['consuming fire'], 'Hebrews 12:29.'),
  ('Revelation 3:14 calls Jesus "the faithful and true ____".', ['witness', 'shepherd', 'servant', 'friend'], 'Revelation 3:14', ['faithful and true witness'], 'Revelation 3:14.'),
  ('Exodus 34:14 says the LORD’s name is ____.', ['Jealous', 'Holy', 'Wonderful', 'Mighty'], 'Exodus 34:14', ['whose name is Jealous'], 'Exodus 34:14: "the LORD, whose name is Jealous, is a jealous God."'),
 ],
 'jesus': [
  ('Jesus turned water into wine at a wedding in which town?', ['Cana', 'Capernaum', 'Nazareth', 'Bethany'], 'John 2:1-9', ['Cana', 'water that was made wine'], 'John 2: the marriage in Cana of Galilee.'),
  ('How many loaves did Jesus use to feed the five thousand?', ['Five', 'Seven', 'Two', 'Twelve'], 'Matthew 14:17-21', ['five loaves'], 'Five loaves and two fishes (Matthew 14:17).'),
  ('Who did Jesus raise from the dead after four days in the grave?', ['Lazarus', 'Jairus', 'Bartimaeus', 'Zacchaeus'], 'John 11:39-44', ['Lazarus', 'four days'], 'John 11.'),
  ('In the parable of the lost sheep, how many sheep did the shepherd leave to find the one?', ['Ninety and nine', 'Forty', 'Fifty', 'Twelve'], 'Luke 15:4', ['ninety and nine'], 'Luke 15:4.'),
  ('In the parable of the sower, the seed that fell where was choked?', ['Among thorns', 'By the way side', 'On stony places', 'On good ground'], 'Matthew 13:7', ['thorns', 'choked'], 'Matthew 13:7.'),
  ('In the parable, who helped the man who fell among thieves on the road to Jericho?', ['A Samaritan', 'A priest', 'A Levite', 'A Roman soldier'], 'Luke 10:30-33', ['Samaritan', 'Jericho'], 'Luke 10: the good Samaritan.'),
  ('In the parable of the prodigal son, the son ended up feeding which animals?', ['Swine', 'Sheep', 'Goats', 'Camels'], 'Luke 15:15', ['swine'], 'Luke 15:15.'),
  ('Jesus put clay on a blind man’s eyes and told him to wash in which pool?', ['Siloam', 'Bethesda', 'Jordan', 'Gihon'], 'John 9:6-7', ['pool of Siloam'], 'John 9:7.'),
  ('Jesus said "Talitha cumi" to Jairus’ daughter. What does it mean?', ['Damsel, I say unto thee, arise', 'Peace, be still', 'Be thou clean', 'Thy faith hath made thee whole'], 'Mark 5:41', ['Talitha cumi', 'Damsel, I say unto thee, arise'], 'Mark 5:41.'),
  ('Blind Bartimaeus was healed near which city?', ['Jericho', 'Jerusalem', 'Nazareth', 'Bethlehem'], 'Mark 10:46', ['Jericho', 'Bartimaeus'], 'Mark 10:46.'),
  ('Who walked on the water to go to Jesus?', ['Peter', 'John', 'Andrew', 'Thomas'], 'Matthew 14:29', ['Peter', 'walked on the water'], 'Matthew 14:29.'),
  ('In the parable of the talents, where did the servant with one talent hide it?', ['In the earth', 'In a field of wheat', 'Under his bed', 'In the temple'], 'Matthew 25:18', ['digged in the earth'], 'Matthew 25:18.'),
  ('In Jesus’ teaching, the wise man built his house upon a ____.', ['rock', 'hill', 'mountain', 'river'], 'Matthew 7:24', ['built his house upon a rock'], 'Matthew 7:24.'),
  ('Jesus said the kingdom of heaven is like a grain of ____ seed.', ['mustard', 'wheat', 'barley', 'corn'], 'Matthew 13:31', ['grain of mustard seed'], 'Matthew 13:31.'),
  ('Jesus healed ten lepers. How many came back to give thanks?', ['One', 'Two', 'Five', 'Nine'], 'Luke 17:15-17', ['ten cleansed', 'where are the nine'], 'Luke 17: one returned, and he was a Samaritan.'),
  ('The man let down through the roof to Jesus was sick of the ____.', ['palsy', 'fever', 'dropsy', 'leprosy'], 'Mark 2:3-5', ['palsy'], 'Mark 2.'),
  ('Jesus calmed the storm saying, "Peace, be ____."', ['still', 'calm', 'gone', 'quiet'], 'Mark 4:39', ['Peace, be still'], 'Mark 4:39.'),
  ('Jesus told Peter to find a coin to pay the tribute where?', ['In the mouth of a fish', 'Under a stone', 'In the temple treasury', 'In his net'], 'Matthew 17:27', ['fish', 'his mouth'], 'Matthew 17:27.'),
  ('In the parable of the ten virgins, how many were wise?', ['Five', 'Three', 'Seven', 'Ten'], 'Matthew 25:2', ['five of them were wise'], 'Matthew 25:2.'),
  ('Whose faith made Jesus say, "I have not found so great faith, no, not in Israel"?', ['A centurion', 'A Pharisee', 'A fisherman', 'A priest'], 'Matthew 8:8-10', ['centurion', 'so great faith'], 'Matthew 8: the centurion’s servant was healed.'),
  ('How many loaves did Jesus use to feed the four thousand?', ['Seven', 'Five', 'Twelve', 'Three'], 'Matthew 15:34-38', ['Seven', 'four thousand'], 'Matthew 15:34.'),
 ],
 'prayer': [
  ('How long did Jesus fast in the wilderness?', ['Forty days and forty nights', 'Seven days', 'Three days', 'Twenty-one days'], 'Matthew 4:2', ['forty days and forty nights'], 'Matthew 4:2.'),
  ('Moses was with the LORD on the mountain without bread or water for how long?', ['Forty days and forty nights', 'Seven days', 'Twelve days', 'Three days'], 'Exodus 34:28', ['forty days and forty nights', 'neither eat bread, nor drink water'], 'Exodus 34:28.'),
  ('Esther asked the Jews in Shushan to fast for how many days?', ['Three', 'Seven', 'Forty', 'One'], 'Esther 4:16', ['three days'], 'Esther 4:16.'),
  ('Daniel mourned and ate no pleasant bread for how long?', ['Three full weeks', 'Forty days', 'Seven days', 'Three days'], 'Daniel 10:2-3', ['three full weeks'], 'Daniel 10:2-3.'),
  ('Which city proclaimed a fast and put on sackcloth after Jonah preached?', ['Nineveh', 'Jerusalem', 'Tarshish', 'Babylon'], 'Jonah 3:4-5', ['Nineveh', 'proclaimed a fast'], 'Jonah 3:5.'),
  ('Jesus said, "Howbeit this kind goeth not out but by prayer and ____."', ['fasting', 'faith', 'praise', 'giving'], 'Matthew 17:21', ['prayer and fasting'], 'Matthew 17:21: the scripture of Prayer Battle 7.'),
  ('Elijah went in the strength of that meat forty days and forty nights to which mount of God?', ['Horeb', 'Carmel', 'Zion', 'Nebo'], '1 Kings 19:8', ['forty days and forty nights', 'Horeb'], '1 Kings 19:8.'),
  ('Who prayed, "Oh that thou wouldest bless me indeed, and enlarge my coast"?', ['Jabez', 'Jacob', 'Hannah', 'Solomon'], '1 Chronicles 4:10', ['Jabez', 'enlarge my coast'], '1 Chronicles 4:10.'),
  ('Hannah prayed for a son at the house of the LORD in which town?', ['Shiloh', 'Bethel', 'Jerusalem', 'Hebron'], '1 Samuel 1:9-10', ['Shiloh', 'prayed'], '1 Samuel 1.'),
  ('At what time did Paul and Silas pray and sing praises in prison?', ['Midnight', 'Dawn', 'Noon', 'The ninth hour'], 'Acts 16:25', ['at midnight Paul and Silas prayed'], 'Acts 16:25.'),
  ('When Peter was kept in prison, what was the church doing?', ['Praying for him without ceasing', 'Planning his escape', 'Fasting in the temple', 'Writing to Caesar'], 'Acts 12:5', ['prayer was made without ceasing'], 'Acts 12:5.'),
  ('1 Thessalonians 5:17: "Pray without ____."', ['ceasing', 'fear', 'doubting', 'wrath'], '1 Thessalonians 5:17', ['Pray without ceasing'], '1 Thessalonians 5:17.'),
  ('Elijah prayed, and it did not rain for how long?', ['Three years and six months', 'Forty days', 'Seven years', 'One year'], 'James 5:17', ['three years and six months'], 'James 5:17.'),
  ('Where did Jesus pray before He was arrested?', ['Gethsemane', 'Golgotha', 'Bethany', 'The upper room'], 'Matthew 26:36', ['Gethsemane', 'pray'], 'Matthew 26:36.'),
  ('Which prophetess served God with fastings and prayers night and day in the temple?', ['Anna', 'Deborah', 'Huldah', 'Miriam'], 'Luke 2:36-37', ['Anna', 'fastings and prayers'], 'Luke 2:36-37.'),
  ('King Jehoshaphat proclaimed a fast throughout all ____.', ['Judah', 'Israel', 'Egypt', 'Samaria'], '2 Chronicles 20:3', ['proclaimed a fast throughout all Judah'], '2 Chronicles 20:3.'),
  ('Ezra proclaimed a fast at which river?', ['Ahava', 'Jordan', 'Chebar', 'Euphrates'], 'Ezra 8:21', ['river of Ahava'], 'Ezra 8:21.'),
  ('How many times a day did Daniel pray?', ['Three', 'Seven', 'Two', 'Five'], 'Daniel 6:10', ['three times a day'], 'Daniel 6:10.'),
  ('The Lord’s Prayer begins "Our Father which art in ____."', ['heaven', 'glory', 'Zion', 'the highest'], 'Matthew 6:9', ['Our Father which art in heaven'], 'Matthew 6:9.'),
  ('Nehemiah wept, fasted and prayed when he heard about the walls of which city?', ['Jerusalem', 'Babylon', 'Jericho', 'Shushan'], 'Nehemiah 1:3-4', ['Jerusalem', 'fasted, and prayed'], 'Nehemiah 1.'),
  ('James 5:16: "The effectual fervent prayer of a righteous man availeth ____."', ['much', 'all', 'grace', 'favour'], 'James 5:16', ['availeth much'], 'James 5:16.'),
 ],
 'promises': [
  ('Hebrews 13:5: "I will never leave thee, nor ____ thee."', ['forsake', 'forget', 'fail', 'reject'], 'Hebrews 13:5', ['I will never leave thee, nor forsake thee'], 'Hebrews 13:5.'),
  ('Philippians 4:19: "My God shall supply all your ____."', ['need', 'wants', 'desires', 'riches'], 'Philippians 4:19', ['supply all your need'], 'Philippians 4:19.'),
  ('Isaiah 54:17: "No weapon that is formed against thee shall ____."', ['prosper', 'stand', 'prevail', 'remain'], 'Isaiah 54:17', ['No weapon that is formed against thee shall prosper'], 'Isaiah 54:17.'),
  ('Isaiah 40:31: "They that wait upon the LORD shall renew their ____."', ['strength', 'youth', 'hope', 'joy'], 'Isaiah 40:31', ['renew their strength'], 'Isaiah 40:31.'),
  ('Romans 8:28: "All things work together for ____ to them that love God."', ['good', 'glory', 'peace', 'blessing'], 'Romans 8:28', ['work together for good'], 'Romans 8:28.'),
  ('"Fear thou not; for I am with thee: be not dismayed; for I am thy God." Which book is this from?', ['Isaiah', 'Psalms', 'Joshua', 'Jeremiah'], 'Isaiah 41:10', ['Fear thou not; for I am with thee'], 'Isaiah 41:10.'),
  ('Jeremiah 29:11: "thoughts of peace, and not of evil, to give you an expected ____."', ['end', 'future', 'blessing', 'reward'], 'Jeremiah 29:11', ['to give you an expected end'], 'Jeremiah 29:11.'),
  ('Matthew 7:7: "Ask, and it shall be given you; seek, and ye shall ____."', ['find', 'receive', 'see', 'gain'], 'Matthew 7:7', ['seek, and ye shall find'], 'Matthew 7:7.'),
  ('Matthew 11:28: "Come unto me, all ye that labour and are heavy laden, and I will give you ____."', ['rest', 'peace', 'joy', 'strength'], 'Matthew 11:28', ['I will give you rest'], 'Matthew 11:28.'),
  ('Psalm 91:7: "A thousand shall fall at thy side... but it shall not come ____ thee."', ['nigh', 'upon', 'against', 'unto'], 'Psalm 91:7', ['it shall not come nigh thee'], 'Psalm 91:7.'),
  ('1 John 1:9: "If we confess our sins, he is faithful and just to ____ us our sins."', ['forgive', 'remove', 'cleanse', 'wash'], '1 John 1:9', ['faithful and just to forgive us our sins'], '1 John 1:9.'),
  ('1 John 4:4: "Greater is he that is in you, than he that is in the ____."', ['world', 'earth', 'flesh', 'darkness'], '1 John 4:4', ['than he that is in the world'], '1 John 4:4.'),
  ('2 Corinthians 12:9: "My grace is sufficient for thee: for my strength is made perfect in ____."', ['weakness', 'faith', 'love', 'patience'], '2 Corinthians 12:9', ['made perfect in weakness'], '2 Corinthians 12:9.'),
  ('Psalm 30:5: "Weeping may endure for a night, but joy cometh in the ____."', ['morning', 'evening', 'spring', 'harvest'], 'Psalm 30:5', ['joy cometh in the morning'], 'Psalm 30:5.'),
  ('Deuteronomy 28:13: "The LORD shall make thee the head, and not the ____."', ['tail', 'foot', 'servant', 'last'], 'Deuteronomy 28:13', ['the head, and not the tail'], 'Deuteronomy 28:13.'),
  ('Obadiah 1:17: "Upon mount Zion shall be deliverance, and there shall be ____."', ['holiness', 'gladness', 'glory', 'peace'], 'Obadiah 1:17', ['and there shall be holiness'], 'Obadiah 1:17: a brand scripture of the region.'),
  ('Jeremiah 33:3: "Call unto me, and I will answer thee, and shew thee great and ____ things."', ['mighty', 'hidden', 'wonderful', 'new'], 'Jeremiah 33:3', ['great and mighty things'], 'Jeremiah 33:3.'),
  ('"Behold, I will do a new thing; now it shall spring forth." Which book is this from?', ['Isaiah', 'Jeremiah', 'Psalms', 'Ezekiel'], 'Isaiah 43:19', ['I will do a new thing'], 'Isaiah 43:19.'),
  ('Psalm 34:19: "Many are the afflictions of the righteous: but the LORD delivereth him out of them ____."', ['all', 'quickly', 'surely', 'daily'], 'Psalm 34:19', ['delivereth him out of them all'], 'Psalm 34:19.'),
  ('Philippians 4:13: "I can do all things through Christ which ____ me."', ['strengtheneth', 'loveth', 'keepeth', 'leadeth'], 'Philippians 4:13', ['through Christ which strengtheneth me'], 'Philippians 4:13.'),
  ('"God shall wipe away all tears from their eyes." Which book is this from?', ['Revelation', 'Isaiah', 'Psalms', 'John'], 'Revelation 21:4', ['wipe away all tears'], 'Revelation 21:4.'),
 ],
}
LABEL = {'godnames': ('Names and titles of God', 'Jehovah Jireh, Prince of Peace and more, and where they appear.'), 'jesus': ('Parables and miracles of Jesus', 'The stories Jesus told and the miracles He did.'), 'prayer': ('Prayer and fasting', 'Who prayed, who fasted, how long, and what God did.'), 'promises': ('Promises of God', 'Finish the promise, or find where it is.')}
PRE = {'godnames': 'gn', 'jesus': 'js', 'prayer': 'pf', 'promises': 'pm'}
err, out = [], []
for pack, qs in T.items():
    for i, (q, opts, r, must, ex) in enumerate(qs):
        text = passage(r).lower()
        for w in must:
            if w.lower() not in text: err.append((pack, i, r, w))
        if len(set(opts)) != 4: err.append((pack, i, 'options'))
        out.append({'id': PRE[pack] + str(i), 'pack': pack, 'level': 'all', 'q': q, 'options': opts, 'answer': 0, 'explain': ex, 'source': src(r)})
print('questions', len(out), 'errors', len(err)); [print(' ', e) for e in err]
if err: sys.exit(1)
b = json.load(open(BANK))
b['questions'] = [x for x in b['questions'] if x['pack'] not in T] + out
for k, (lab, bl) in LABEL.items(): b['packs'][k] = {'label': lab, 'icon': 'book', 'blurb': bl}
json.dump(b, open(BANK, 'w'), ensure_ascii=False, separators=(',', ':'))
print('bank now', len(b['questions']))
