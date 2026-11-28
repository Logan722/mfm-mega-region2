import sys
from PIL import Image, ImageDraw, ImageFont
page, prefix, names = sys.argv[1], sys.argv[2], sys.argv[3].split('|')
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',34); f2=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
for n in range(1,6):
    d=Image.open(f'{prefix}{n}-d.png').convert('RGB'); m=Image.open(f'{prefix}{n}-m.png').convert('RGB')
    d2=d.resize((720,int(d.height*720/d.width))); m2=m.resize((int(m.width*.8),int(m.height*.8)))
    cols=2 if m2.height < d2.height*2 else 3; ch=-(-m2.height//cols)
    W=30+720+50+cols*(m2.width+16)+20; H=max(d2.height,ch)+150
    c=Image.new('RGB',(W,H),'#142240'); dr=ImageDraw.Draw(c)
    dr.text((30,30),f'{page} · Design {n}: {names[n-1]}',fill='#f0c760',font=F)
    dr.text((30,96),'Computer',fill='#c9d3e3',font=f2); dr.text((800,96),f'Phone (one long page, cut into {cols} columns, read left to right)',fill='#c9d3e3',font=f2)
    c.paste(d2,(30,130))
    for i in range(cols): c.paste(m2.crop((0,i*ch,m2.width,min((i+1)*ch,m2.height))),(800+i*(m2.width+16),130))
    c.save(f'{page.lower().replace(" ","-")}-design-{n}.jpg',quality=80)
