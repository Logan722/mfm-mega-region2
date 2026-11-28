import json,random,re
H='https://mountainoffire.org/About'; G='https://mountainoffire.org/About/MummyAndDaddyGO'; M='https://mountainoffire.org/About/Mission'
BL='https://mountainoffire.org/About/Beliefs'; SP='https://mountainoffire.org/special-programmes'; HM='https://mountainoffire.org/'; YM='https://mfmym.org/about-us-2/'; YH='https://mfmym.org/'
L={H:'MFM history — mountainoffire.org',G:'Daddy & Mummy G.O. — mountainoffire.org',M:'Mission & vision — mountainoffire.org',BL:'Our beliefs — mountainoffire.org',SP:'Special programmes — mountainoffire.org',HM:'mountainoffire.org',YM:'About MFM Youth Ministry — mfmym.org',YH:'mfmym.org'}
F=[
# history
(H,"How many people came to the first MFM prayer meeting in Dr. Olukoya's living room in 1989?","24","12","70","100","Twenty-four people attended the first meeting."),
(H,"Where did the meetings move to first, as the numbers grew?","60 Old Yaba Road, Yaba","Km 12 Lagos-Ibadan Expressway","Ikeja, Lagos","Ibadan","They moved first to 60 Old Yaba Road, Yaba, Lagos."),
(H,"What is the address of MFM's International Headquarters?","13 Olasimbo Street, Onike, Yaba, Lagos","60 Old Yaba Road, Lagos","10000 Kleckley Drive, Houston","Km 12 Lagos-Ibadan Expressway","13 Olasimbo Street, Onike, Yaba — near the second gate of the University of Lagos."),
(H,"MFM's International Headquarters is near the second gate of which university?","University of Lagos","University of Ibadan","Obafemi Awolowo University","University of Reading","It sits near UNILAG's second gate."),
(H,"What was the site of MFM's International Headquarters before the church built there?","An abandoned slum","A football field","A market","A school","The site was once an abandoned slum."),
(H,"How did the name “Mountain of Fire and Miracles Ministries” come to Dr. Olukoya?","During prayer","In a newspaper","From a church vote","From a song","The name came to him during prayer."),
(H,"On what date was the first service held under the name Mountain of Fire and Miracles Ministries?","April 24, 1994","July 15, 1989","January 1, 1990","November 11, 1989","The first service was held on April 24, 1994."),
(H,"In which city did MFM's first branches outside Nigeria begin?","London","Houston","Toronto","Accra","Overseas branches began in London, then spread to the USA, Canada and beyond."),
# G.O.
(G,"In which Nigerian state is Akure, the G.O.'s birthplace?","Ondo","Lagos","Oyo","Ogun","Dr. Olukoya was born in Akure, Ondo State."),
(G,"What was the work of Dr. Olukoya's father?","Police officer","Teacher","Farmer","Doctor","His father was a police officer, and a pastor at the Christ Apostolic Church."),
(G,"Dr. Olukoya's father was a pastor in which church?","Christ Apostolic Church","The Redeemed Christian Church of God","The Anglican Church","The Methodist Church","He pastored at the Christ Apostolic Church (CAC)."),
(G,"At which secondary school was Dr. Olukoya born again?","Methodist Boys' High School, Lagos","King's College, Lagos","Igbobi College","CMS Grammar School","He was born again at Methodist Boys' High School, Lagos."),
(G,"In which year did Dr. Olukoya graduate from the University of Lagos with a first-class degree?","1980","1975","1985","1989","He graduated in Microbiology in 1980 with first-class honours."),
(G,"How many years did it take Dr. Olukoya to complete his PhD at the University of Reading?","Three","Two","Five","Seven","He earned his PhD in Molecular Genetics in three years."),
(G,"Where did Dr. Olukoya work as a scientist?","The Nigerian Institute of Medical Research, Yaba","Lagos University Teaching Hospital","The University of Ibadan","Shell Petroleum","He joined the Nigerian Institute of Medical Research in Yaba."),
(G,"Dr. Olukoya is known in science as a...","Geneticist","Geologist","Pharmacist","Physicist","He became known as a geneticist."),
(G,"How many scientific papers has Dr. Olukoya published?","Over 70","About 10","Over 500","None","He has published over 70 scientific papers."),
(G,"Which foundation continues the G.O.'s work in biotechnology?","Daniel & Fola Biotechnology Foundation","MFM Science Trust","Olukoya Genetics Institute","Prayer City Labs","The Daniel & Fola Biotechnology Foundation, an NGO."),
(G,"Whose ministry strongly influenced Dr. Olukoya's ministry?","Apostle Joseph Ayodele Babalola","Billy Graham","Smith Wigglesworth","Kathryn Kuhlman","Apostle Joseph Ayodele Babalola, founder of the CAC."),
(G,"By July 2015, how many Christian books had Dr. Olukoya written?","Over 250","About 25","About 100","Over 1,000","Over 250 books, plus tapes, CDs and video discs."),
(G,"What were the names of Mummy G.O.'s parents?","Mr. and Mrs. George F. Adesanya","Mr. and Mrs. Olukoya","Mr. and Mrs. Babalola","Mr. and Mrs. Akinola","She was born to Mr. and Mrs. George F. Adesanya."),
(G,"Mummy G.O. was which child of seven?","The fifth","The first","The last","The second","She was the fifth of seven children."),
(G,"What was Mummy G.O.'s father's job?","Marine engineer with the Nigerian Ports Authority","Police officer","Pastor","Banker","He was a marine engineer with the Nigerian Ports Authority."),
(G,"At which London college did Mummy G.O. study for her Master's in Fine Art?","Royal College of Art","King's College","University of Reading","London School of Economics","She holds a Masters in Fine Art from the Royal College of Art, London."),
(G,"Where did Mummy G.O. earn her BA in Fine Art?","University of East London","University of Lagos","University of Reading","Royal College of Art","Her BA in Fine Art is from the University of East London."),
(G,"Who illustrated almost all of the G.O.'s 250+ books?","Pastor (Mrs.) Shade Olukoya","Battle Cry's art team","His children","An outside artist","Mummy G.O. is an artist and illustrated almost all of them."),
(G,"Mummy G.O. is International Coordinator of which MFM ministry?","The MFM Women's Foundation","The Youth Ministry","Gen218","Men of Valour","She coordinates the MFM Women's Foundation, which runs adult literacy and skills training."),
(G,"Besides art, Mummy G.O. is also known as a...","Soloist who sings hymns","Novelist","Doctor","News presenter","She is a soloist, sometimes singing duets with her husband."),
(G,"Which spiritual gifts does the official MFM page describe Mummy G.O. as having?","Dreams and visions","Tongues only","Healing only","Prophecy of numbers","The page describes her as having gifts of dreams and visions."),
# mission + beliefs
(M,"MFM describes itself as a “do-it-yourself” gospel ministry where your hands are trained to...","Wage war","Build houses","Write books","Play music","“Where your hands are trained to wage war and your fingers to do battle” (see Psalm 144:1)."),
(M,"MFM is “a full gospel ministry devoted to the Revival of Apostolic Signs” and Holy Ghost...","Fireworks","Choirs","Schools","Conferences","“devoted to the Revival of Apostolic Signs, Holy Ghost fireworks”."),
(BL,"According to MFM's statement of beliefs, what is the only basis for our faith and fellowship?","The Scriptures, the inspired Word of God","Church tradition","Dreams","The G.O.'s books","“The Scriptures are the inspired Word of God; the only basis for our faith and fellowship”."),
(BL,"Which of these is listed in MFM's statement of beliefs?","Restitution for past wrongs where possible","Infant baptism","Praying to saints","Seven sacraments","Belief 6: “Restitution for past wrongs where possible”."),
(BL,"MFM's belief about the Holy Spirit baptism cites which verse first?","Acts 2:4","John 3:16","Romans 8:28","Genesis 1:1","“The Baptism of the Holy Spirit - Acts 2:4; 10:44 and 19:1-6”."),
(BL,"Which two ordinances of the Church does MFM's statement of beliefs name?","The Lord's Supper and Water Baptism","Fasting and tithing","Marriage and burial","Confession and penance","“The Ordinance of the Church, the Lord's Supper and Water Baptism”."),
(BL,"How many statements of belief does mountainoffire.org list?","14","7","10","12","There are 14, from the Scriptures to the New Heaven and Earth."),
(BL,"How does MFM's statement of beliefs describe sanctification?","An act of separation from that which is evil","A yearly festival","Joining a church","Speaking in tongues","“Sanctification is seen as an act of separation from that which is evil”."),
# programmes
(SP,"What does PMCH stand for?","Power Must Change Hands","Prayer Meeting for Church Healing","Praise, Ministry, Church, Holiness","Power Makes Champions Holy","PMCH = Power Must Change Hands."),
(SP,"When does Power Must Change Hands hold at MFM Headquarters?","The first Saturday of every month","Every Sunday","Every Wednesday","Once a year","Monthly, on the first Saturday, 7 AM to 12 PM (Nigeria time)."),
(SP,"What should you bring to Wednesday Manna Water?","Bottle(s) of water — and come fasting","A Bible only","Anointing oil","Bread","“Come fasting and with your bottle(s) of water.”"),
(SP,"On which day of the week is Manna Water service held?","Wednesday","Monday","Friday","Sunday","Every Wednesday at MFM Headquarters."),
(SP,"Prayer Rain holds every week on which day?","Friday","Monday","Wednesday","Sunday","Every Friday (except the Friday before PMCH)."),
(SP,"Where is the weekly Prayer Rain held?","MFM Prayer City, Lagos-Ibadan Expressway","13 Olasimbo Street, Yaba","The University of Lagos","Abuja","At MFM Prayer City, Km 12 Lagos-Ibadan Expressway."),
(SP,"At which kilometre of the Lagos-Ibadan Expressway is MFM Prayer City?","Km 12","Km 46","Km 3","Km 100","MFM Prayer City is at Km 12."),
(SP,"Prayer Rain is a time to “rain ____ prayers upon every stubborn problem”.","Acidic","Gentle","Long","Quiet","“rain acidic prayers upon every stubborn problems in our lives”."),
(HM,"What time does Sunday service begin at MFM Headquarters (Nigeria time)?","7:00 am","9:00 am","10:30 am","6:00 pm","Sunday service is at 7:00 am WAT."),
(HM,"Which university has MFM as its proprietor?","Mountain Top University","Covenant University","Babcock University","Redeemer's University","Mountain Top University (mtu.edu.ng)."),
(HM,"What is the name of MFM's yearly prayer and fasting programme?","70 Days Prayer and Fasting Programme","40 Days of Glory","21 Days of Fire","100 Days of Praise","The 70 Days Prayer and Fasting Programme."),
(HM,"Which MFM online broadcast holds on Saturdays?","Great Physician Hour","Eagle Hour","Revival Hour","Prayers That Move Mountains","Great Physician Hour (Saturdays)."),
(HM,"Which MFM online broadcast holds on Sundays?","Eagle Hour","Great Physician Hour","Revival Hour","Manna Water","Eagle Hour (Sundays)."),
(HM,"Which MFM online broadcast holds on Mondays?","Revival Hour","Eagle Hour","Great Physician Hour","Prayer Rain","Revival Hour (Mondays)."),
(HM,"“Prayers That Move Mountains” holds on which night?","Friday","Tuesday","Sunday","Wednesday","Friday nights."),
(HM,"Which of these is listed among MFM's ministries?","Men of Valour","Men of Steel","Mighty Men Club","Brothers of Fire","Men of Valour is one of MFM's ministries."),
(HM,"Which of these is one of MFM's ministries?","Christian Tentmakers","Builders of Zion","Kingdom Merchants","Faith Traders","Christian Tentmakers is listed among MFM's ministries."),
(HM,"Which of these is one of the MFM Schools?","School of Supernatural Power and Healing","School of Business","School of Music","School of Law","MFM Schools include the School of Supernatural Power and Healing."),
(HM,"MFM's School of Counselling also covers which studies?","Peace Studies","Music","Medicine","Engineering","School of Counselling and Peace Studies."),
(HM,"What does MFM's School of Evangelism also train in?","Church Planting","Accounting","Choir","Drama","School of Evangelism and Church Planting."),
# youth / USA
(YM,"MFM Youth Ministry (MFMYM) serves youth and young adults in which part of the world?","The Americas and the Caribbean","Europe only","Asia","Nigeria only","It serves the Americas and the Caribbean."),
(YH,"Complete MFM Youth Ministry's tagline: “Raising a generation walking in freedom, purpose, and...”","Victory in Christ","Wealth","Fame","Success at school","“Raising a generation walking in freedom, purpose, and victory in Christ.”"),
(YM,"What is IYC?","The International Youth Convention","The Intercessors' Youth Club","Ibadan Youth Camp","The Inner Youth Council","IYC = International Youth Convention, an annual gathering."),
(YM,"In which city were IYC 2025 and IYC 2026 held?","Houston","Atlanta","Dallas","Lagos","Houston, Texas (2025: July 17–20; 2026: July 16–19)."),
(YM,"Gen218 is MFM Youth Ministry's community for whom?","Christian singles","Children","Pastors","Retirees","Christian Singles – Gen218."),
(YM,"What does YMTP stand for?","Youth Ministers Training Program","Young Men's Teaching Plan","Youth Mission Travel Project","Youth Music and Theatre Program","Youth Ministers Training Program."),
(YM,"Where is MFM USA Headquarters?","10000 Kleckley Drive, Houston, Texas","13 Olasimbo Street, Lagos","Dallas, Texas","Atlanta, Georgia","10000 Kleckley Drive, Houston, TX 77075."),
]

EV='https://mfmmegaregion2usa.org/events'; PM='https://mfmamerica.org/power-must-change-hands/'; DL='https://mfmamerica.org/deliverance/'; BC='https://mfmamerica.org/broadcast/'; AB='https://mfmamerica.org/about/'; MA='https://mfmamerica.org/'
NV='https://www.youtube.com/@mfmmegaregion2usa'; IG='https://www.instagram.com/mfm_ministries/'
L.update({EV:'Events — mfmmegaregion2usa.org',PM:'Power Must Change Hands — mfmamerica.org',DL:'Deliverance — mfmamerica.org',BC:'Broadcast — mfmamerica.org',AB:'About — mfmamerica.org',MA:'mfmamerica.org',NV:'MFM Mega Region 2 USA on YouTube',IG:'MFM International HQ on Instagram (@mfm_ministries)'})
F+=[
(PM,"In the USA, when is Power Must Change Hands held at MFM Prayer City, Houston?","The first Saturday of every month","Every Friday night","The last Sunday of the month","Every Wednesday","PMCH: first Saturday of each month at MFM Prayer City, 10000 Kleckley Drive, Houston."),
(PM,"What time does PMCH run at MFM Prayer City USA?","8:00 AM to 11:30 AM","6:00 PM to 9:00 PM","Midnight to 3:00 AM","Noon to 2:00 PM","8:00 AM to 11:30 AM."),
(PM,"For PMCH, when do participants eat their last meal before the fast?","Thursday night","Friday morning","Saturday morning","Wednesday noon","Last meal Thursday night, then fast until the Saturday programme."),
(PM,"How does mfmamerica.org describe Power Must Change Hands?","A monthly fasting and prayer programme","A yearly convention","A youth camp","A Bible school","\u201ca monthly fasting and prayer program\u201d \u2014 a covenant prayer programme of MFM Worldwide."),
(DL,"Which scripture does MFM America give as the basis of its Deliverance programme?","Obadiah 1:17","John 3:16","Psalm 23:1","Genesis 1:1","\u201cBut upon mount Zion shall be deliverance\u201d \u2014 Obadiah 1:17."),
(DL,"According to MFM America, one aim of deliverance is to close the doors opened to...","The enemy","Strangers","Business","Travel","\u201cIt is to close the doors opened to the enemy.\u201d"),
(DL,"Why is there no Deliverance programme at Prayer City USA on the first Saturday of the month?","It is PMCH day","It is a public holiday","The church is closed","It is choir practice","The first Saturday is Power Must Change Hands."),
(AB,"How often does prayer go on at the MFM Prayer City, according to mfmamerica.org?","24 hours a day, 7 days a week","Only on Sundays","Once a month","Only during Lent","Prayer runs \u201c24 hours a day, 7 days a week.\u201d"),
(MA,"Where is MFM America's US Headquarters?","10000 Kleckley Drive, Houston, Texas","Atlanta, Georgia","New York City","Dallas, Texas","10000 Kleckley Dr, Houston, TX 77075."),
(BC,"Which of these is one of the live services MFM America broadcasts?","Glorious Sunday","Sunday Funday","Praise Party","Midnight Movie","Live services include PMCH, Prayer Rain, Wednesday Night Live, Gen 2:18 Singles, Glorious Sunday and Crossover Night."),
(BC,"Which MFM live service is held on New Year's Eve?","Crossover Night","Glorious Sunday","Manna Water","Eagle Hour","Crossover Night is one of MFM's live services."),
(BC,"What is MFM's on-demand TV service called?","MFM TV On Demand (mfmtelevision.tv)","MFM Flix","Fire TV","Prayer City Plus","Replays are on MFM TV On Demand at mfmtelevision.tv."),
(EV,"What was the theme of the Great Nashville Tennessee Deliverance Crusade 2026?","Dry Bones Shall Live Again","Defeating Repeated Battles","Rekindling the Altar","Come Expecting","\u201cDry Bones Shall Live Again\u201d (Ezekiel 37)."),
(EV,"Where was the Great Nashville Tennessee Deliverance Crusade 2026 held?","The Forum, Goodlettsville","Southfork Ranch, Parker","MFM Prayer City, Houston","The Marriott, Houston","The Forum, 705 Rivergate Pkwy, Goodlettsville, TN."),
(EV,"Where was the Great Dallas Deliverance Crusade 2026 held?","Southfork Ranch, Parker, Texas","The Forum, Goodlettsville","AT&T Stadium, Arlington","MFM Dallas, Richardson","Southfork Ranch, 3700 Hogge Dr, Parker, TX."),
(NV,"What was the message at the Great Dallas Deliverance Crusade 2026?","Defeating Repeated Battles","Dry Bones Shall Live Again","Binding the Strongman","Breaking Evil Limitation","\u201cDefeating Repeated Battles\u201d \u2014 Dr. D.K. Olukoya, Nov 21, 2026."),
(EV,"Who hosted the Great Dallas Deliverance Crusade and the MFM Dallas church dedication in 2026?","Pastor David Popoola","Pastor Lovena Okeke","Pastor Francis Benede","Pastor Abel Michael","Pastor David Popoola hosted both."),
(EV,"Who hosted the Nashville church dedication and crusade in November 2026?","Pastor Lovena Okeke","Pastor David Popoola","Pastor Kehinde Olajide","Pastor Jacob Kuye","Pastor Lovena Okeke hosted both."),
(EV,"In which city is the new MFM Nashville church building, dedicated in November 2026?","Mount Juliet, Tennessee","Antioch, Tennessee","Memphis, Tennessee","Knoxville, Tennessee","MFM Nashville, 13135 Central Pike, Mount Juliet, TN."),
(EV,"In which city is the MFM Dallas church building dedicated on November 22, 2026?","Richardson, Texas","Plano, Texas","Irving, Texas","Garland, Texas","MFM Dallas, 306 N Greenville Avenue, Richardson, TX."),
(EV,"What was the theme of the MFM Women Foundation Retreat 2026 in Houston?","Rekindling the Altar","Becoming a Mother in Israel","Divine Restoration","Come Expecting","\u201cRekindling the Altar\u201d \u2014 7 hours at the Master's feet."),
(EV,"Which verse was the scripture for the Women's Retreat \u201cRekindling the Altar\u201d?","Leviticus 6:13","Psalm 23:1","Isaiah 60:1","Jeremiah 20:9","\u201cThe fire shall ever be burning upon the altar; it shall never go out.\u201d \u2014 Leviticus 6:13."),
(EV,"The Gen218 Regional Prayer Conference takes its name from which verse?","Genesis 2:18","Genesis 1:28","Proverbs 18:22","Ephesians 5:25","\u201cIt is not good that the man should be alone\u201d \u2014 Genesis 2:18."),
(EV,"What was the 2026 edition of the 70-Day Prayer and Fasting programme called?","Prayer Battle 7","Prayer Battle 1","Fire Rain 2026","Mountain Top 70","\u201cPrayer Battle 7\u201d, starting August 3, 2026."),
(EV,"Which verse was the scripture for the 70-Day Prayer and Fasting 2026?","Matthew 17:21","Isaiah 58:6","Joel 2:12","Daniel 9:3","\u201cHowbeit this kind goeth not out but by prayer and fasting.\u201d \u2014 Matthew 17:21."),
(EV,"What was the theme of MFM Riverdale's Grand Finale Deliverance Service 2026?","The God That Astonishes His People","Dry Bones Shall Live Again","Come Expecting","His Praises in My Mouth","\u201cThe God That Astonishes His People\u201d (Mark 7:37)."),
(EV,"What was the theme of the MFM Revival Center Atlanta Praise Night in December 2026?","His Praises in My Mouth","A Resurgence of Praise","Night of Divine Recovery","Rekindling the Altar","\u201cHis Praises in My Mouth\u201d (Psalm 71:8)."),
(EV,"What was the theme of MFM Austin's End of the Year Vigil 2026?","Night of Divine Recovery: What Was Lost Shall Be Restored!","Defeating Repeated Battles","Dry Bones Shall Live Again","Come Expecting","Joel 2:25 \u2014 what was lost shall be restored."),
(EV,"What is the theme of Mega Region 2's Thanksgiving Service on December 12, 2026?","Come Expecting","Rekindling the Altar","Dry Bones Shall Live Again","Glory Revealed","\u201cCome Expecting\u201d \u2014 MFM Banquet Hall, Prayer City, Houston."),
(EV,"Which MFM branch began a weekly service called \u201cThe Mountain of Bring Your Problems to God\u201d?","MFM Tampa","MFM Nashville","MFM Dallas","MFM Riverdale","MFM Tampa, Thursdays at 7 PM ET."),
(EV,"Mega Region 2's weekly online prayer line is called...","Healing & Deliverance Hour","Eagle Hour","Revival Hour","Great Physician Hour","Healing & Deliverance Hour, live on the MFM Mega Region 2 YouTube channel."),
(EV,"Mega Region 2's weekly prayer service on Thursdays is called...","Open Heaven Encounter","Manna Water","Prayer Rain","Glorious Sunday","Open Heaven Encounter, live on YouTube every Thursday."),
(IG,"At MFM Headquarters' Manna Water Praise Night, which group ministered \u201cOgo Ni Fun Baba, Ogo Ni Fun Omo\u201d?","The MFM Guitar Choir","The Salvation Chorale","The Youth Choir","The Children's Choir","The MFM Guitar Choir (MFM HQ Instagram, Nov 25, 2026)."),
(IG,"At the Manna Water Praise Night, Pastor Clement Imoru taught that praise is a weapon, drawing from which passage?","2 Chronicles 20:21\u201322","Psalm 150","Acts 16:25","Joshua 6:20","2 Chronicles 20:21\u201322: when we praise, God steps in."),
(IG,"What is the official Instagram account of MFM International Headquarters?","@mfm_ministries","@mfmintlhq","@mountainoffire","@mfmworld","@mfm_ministries \u2014 MFM INTERNATIONAL HEADQUARTERS."),
]

out=[]
for i,(u,q,c,a,b,d,ex) in enumerate(F):
    o=[c,a,b,d]; r=random.Random('mf'+q); r.shuffle(o)
    out.append(dict(id='mf%d'%i,pack='mfm',level='all',q=q,options=o,answer=o.index(c),explain=ex,source={'label':L[u],'url':u}))
json.dump(out,open(__import__('os').path.dirname(__import__('os').path.abspath(__file__))+'/data/out_mfm.json','w'),ensure_ascii=False,indent=0)
print(len(out))
