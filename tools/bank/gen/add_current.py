"""Current-ministry questions (Dawn, 2026-11-27): from MFM's and the G.O.'s official Instagram posts (recent, Oct-Dec 2026)
and Mummy G.O.'s official page on mountainoffire.org. Answer is option 0; the game shuffles options. 'date' = when the fact
was posted, so the weekly builder can retire items older than about 3 months unless still relevant."""
import json, pathlib
BANK = pathlib.Path(__import__('os').environ.get('MFM_REPO',__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'../../..')))+'/js/quiz-bank.json')
IG = 'https://www.instagram.com/'
GO = 'https://www.mountainoffire.org/About/MummyAndDaddyGO'
Q = [
 ('cm1', 'mfm', 'What is MFM’s theme for the year 2026?', ['My year of great deliverance and fresh glory', 'My year of open heavens and divine speed', 'My year of supernatural turnaround', 'My year of uncommon breakthroughs'], 'The G.O. announced it for 2026 with Genesis 45:7, 1 Chronicles 11:14, Psalm 18:50, Job 29:20 and Luke 4:18-19.', ('Dr. D.K. Olukoya on Instagram, Dec 31, 2025', IG + 'official_dkolukoya/p/DS9GuRBDJnY/'), '2025-12-31', 'evergreen-2026'),
 ('cm2', 'mfm', 'The December 2026 Power Must Change Hands is a special 2-in-1: the Annual Anointing Service and ____.', ['Mantle of Power 5', 'Crossover Night', 'Holy Ghost Night', 'Marathon Sealing Prayers'], 'Saturday, December 5, 2026 at MFM Prayer City, ministering Dr. D.K. Olukoya.', ('Dr. D.K. Olukoya on Instagram, Nov 2026', IG + 'official_dkolukoya/p/Df6udJEs4l5/'), '2026-11-19', ''),
 ('cm3', 'mfm', 'What were worshippers asked to bring to the December 2026 PMCH (Annual Anointing Service and Mantle of Power 5)?', ['A bottle of olive oil and their mantle', 'Bottles of water, and to come fasting', 'A handful of sand', 'A Bible and a notebook'], 'Come with a bottle of olive oil and a mantle.', ('Dr. D.K. Olukoya on Instagram, Nov 2026', IG + 'official_dkolukoya/p/Df6udJEs4l5/'), '2026-11-19', ''),
 ('cm4', 'mfm', 'The 70 Days Prayer and Fasting 2026 ended with a Marathon Sealing Prayers Service. What was its topic?', ['Holy Ghost, Change My Spiritual Address', 'Dry Bones Shall Live Again', 'Defeating Repeated Battles', 'The God That Astonishes His People'], 'Texts: Luke 24:5-6, Psalm 40:2, Genesis 12:1-4 and 1 Samuel 2:8. Ministering: Dr. D.K. Olukoya.', ('Dr. D.K. Olukoya on Instagram, Oct 11, 2026', IG + 'official_dkolukoya/p/DeW5CldjCmL/'), '2026-10-11', ''),
 ('cm5', 'mfm', 'At the 2026 Marathon Sealing Prayers Service, the G.O. taught that the Holy Ghost is a divine ____.', ['relocator', 'navigator', 'architect', 'physician'], '"The Holy Ghost is a divine relocator. He brings transition and transformation."', ('Dr. D.K. Olukoya on Instagram, Oct 11, 2026', IG + 'official_dkolukoya/p/DeW5CldjCmL/'), '2026-10-11', ''),
 ('cm6', 'mfm', 'How many prayer points were prayed in all during the 70 Days Prayer and Fasting 2026?', ['1,960', '700', '1,400', '2,100'], '"For 70 days, we prayed 1,960 prayer points."', ('Dr. D.K. Olukoya on Instagram, Oct 10, 2026', IG + 'official_dkolukoya/p/DeUHkT2sInc/'), '2026-10-10', ''),
 ('cm7', 'mfm', 'After the 70 Days Prayer and Fasting 2026, MFM gathered for which service?', ['A Thanksgiving Service', 'Crossover Night', 'Holy Ghost Night', 'A Deliverance Crusade'], 'The 70 Days Thanksgiving Service, to return all the glory to God.', ('Dr. D.K. Olukoya on Instagram, Oct 2026', IG + 'official_dkolukoya/reel/Depu9f0kXsU/'), '2026-10-18', ''),
 ('cm8', 'mfm', 'In October 2026, the G.O. led the Manna Water congregation in "Prayers on the ____".', ['sand', 'water', 'oil', 'mantle'], 'Prayers on the Sand, at the Manna Water revival service.', ('Dr. D.K. Olukoya on Instagram, Oct 21, 2026', IG + 'official_dkolukoya/p/Dew-mPFMYoi/'), '2026-10-21', ''),
 ('cm9', 'mfm', 'Which hymn did the congregation sing at MFM Headquarters’ November 2026 Manna Water Praise Night as a reminder of the power of prayer?', ['Pray Always, Pray', 'Blessed Assurance', 'To God Be the Glory', 'Rock of Ages'], 'The hymn "Pray Always, Pray", a reminder of our access to the greatness of God through prayer.', ('MFM International Headquarters on Instagram, Nov 25, 2026', IG + 'mfm_ministries/p/DgLMkMXIGiD/'), '2026-11-25', ''),
 ('sh1', 'shade', 'Which secondary school in Sabo, Yaba did Pastor (Mrs.) Shade Olukoya attend?', ['Reagan Memorial Baptist Girls Secondary School', 'Queen’s College, Yaba', 'Methodist Girls’ High School', 'Holy Child College'], 'She later also attended Ajjeh Comprehensive High School.', ('Daddy and Mummy G.O. — mountainoffire.org', GO), '', ''),
 ('sh2', 'shade', 'At Darnley Career Academy in London, Mummy G.O. earned diplomas in Fashion Design and in ____.', ['Fine Arts and Interior Decoration', 'Graphic Design and Printing', 'Music and Drama', 'Textile Technology'], 'She went on to a BA in Fine Art (University of East London) and research in Fine Art at the Royal College of Art.', ('Daddy and Mummy G.O. — mountainoffire.org', GO), '', ''),
 ('sh3', 'shade', 'Mummy G.O. is a soloist who sings hymns. With whom does she sometimes sing duets?', ['The G.O., her husband', 'The MFM Guitar Choir', 'Pastor Olumide Oni', 'The Salvation Chorale'], 'She sometimes performs duets with her husband, Dr. D.K. Olukoya.', ('Daddy and Mummy G.O. — mountainoffire.org', GO), '', ''),
 ('sh4', 'shade', 'Which church did Mummy G.O.’s family attend when she was growing up?', ['Christ Apostolic Church', 'The Baptist Church', 'The Anglican Church', 'The Methodist Church'], 'Her family were Christians who attended the Christ Apostolic Church.', ('Daddy and Mummy G.O. — mountainoffire.org', GO), '', ''),
 ('sh5', 'shade', 'Which primary school did Mummy G.O. attend?', ['Surulere Baptist School', 'Corona School, Ikoyi', 'St. Mary’s Primary School', 'Command Children School'], 'Surulere Baptist School, then Modupe Johnson.', ('Daddy and Mummy G.O. — mountainoffire.org', GO), '', ''),
]
b = json.load(open(BANK)); ids = {q[0] for q in Q}
b['questions'] = [x for x in b['questions'] if x['id'] not in ids]
for qid, pack, q, opts, ex, (lab, url), date, keep in Q:
    assert len(set(opts)) == 4
    rec = {'id': qid, 'pack': pack, 'level': 'all', 'q': q, 'options': opts, 'answer': 0, 'explain': ex, 'source': {'label': lab, 'url': url}}
    if date: rec['date'] = date
    if keep: rec['keep'] = keep
    b['questions'].append(rec)
json.dump(b, open(BANK, 'w'), ensure_ascii=False, separators=(',', ':'))
import collections; print(len(Q), 'added;', collections.Counter(x['pack'] for x in b['questions']))
