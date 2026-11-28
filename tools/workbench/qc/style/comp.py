from PIL import Image
import sys,glob
for pg in sys.argv[1:]:
    d=Image.open(f'{pg}-1440.png').convert('RGB'); W,H=d.size; i=0
    for y in range(0,H,2400):
        d.crop((0,y,W,min(H,y+2400))).resize((720,(min(H,y+2400)-y)//2)).save(f'n-d-{pg}-{i}.jpg',quality=80); i+=1
    m=Image.open(f'{pg}-390.png').convert('RGB'); W,H=m.size
    cols=[m.crop((0,y,W,min(H,y+1700))) for y in range(0,H,1700)]
    for j in range(0,len(cols),4):
        g=cols[j:j+4]; c=Image.new('RGB',(W*len(g)+10*(len(g)-1),1700),'white')
        for k,im in enumerate(g): c.paste(im,(k*(W+10),0))
        c.save(f'n-m-{pg}-{j//4}.jpg',quality=75)
