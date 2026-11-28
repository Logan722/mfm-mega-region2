#!/usr/bin/env python3
"""Build stories/<ch>.html from tools/stories/template.html + tools/stories/<ch>.js.
Each chapter source has sections: //@@meta (JSON), //@@look, //@@scenes, //@@moments."""
import json,re,sys,pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
SRC=ROOT/'tools'/'stories'
tpl=(SRC/'template.html').read_text(encoding='utf-8')
def build(f):
    parts=dict(re.findall(r'//@@(\w+)\n(.*?)(?=\n//@@\w+\n|\Z)',f.read_text(encoding='utf-8'),re.S))
    m=json.loads(parts['meta'])
    h=tpl
    for k,v in {'look':'/*@@LOOK@@*/','scenes':'/*@@SCENES@@*/','moments':'/*@@MOMENTS@@*/'}.items():
        assert h.count(v)==1; h=h.replace(v,parts[k].rstrip('\n')+'\n')
    ev=m.get('event')
    m['sub']=m['ctitle'] if ev else 'Chapter %s: %s'%(m['num'],m['ctitle'])
    m['h1']=m['name'] if ev else '%s · Chapter %s'%(m['name'],m['num'])
    m['full']=('%s: %s' if ev else '%s, Chapter %s: %s')%((m['name'],m['ctitle']) if ev else (m['name'],m['num'],m['ctitle']))
    for k in ('FULL','SUB','H1','NAME','NUM','CTITLE','REF','MIN','DESC','CH'):
        h=h.replace('@@%s@@'%k,str(m[k.lower()]))
    assert '@@' not in re.sub(r'<script>.*</script>','',h,flags=re.S) or True
    left=re.findall(r'@@[A-Z]+@@',h); assert not left,left
    out=ROOT/'stories'/(m['ch']+'.html'); out.write_text(h,encoding='utf-8'); print('built',out.relative_to(ROOT))
for f in sorted(SRC.glob('*.js')):
    if len(sys.argv)<2 or f.stem in sys.argv[1:]: build(f)
