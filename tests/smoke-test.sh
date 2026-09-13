#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo '[1/8] JS syntax'
node --check app.js
node --check stability-hotfix.js
node --check full-details-hotfix.js
node --check portal-fixes.js

echo '[2/8] Core index'
python3 - <<'PY'
import json
x=json.load(open('data/requirements.json')); assert len(x)==112; ids=[r['id'] for r in x]; assert len(set(ids))==112
print('112 core requirements OK')
PY

echo '[3/8] Full RTM details'
python3 - <<'PY'
import base64,gzip,re
from pathlib import Path
parts=[]
for i in range(8):
 p=Path(f'data/catalog/catalog-{i:02d}.b64'); assert p.exists(),p; parts.append(p.read_text().strip())
b64=''.join(parts); b64+='='*((4-len(b64)%4)%4); md=gzip.decompress(base64.b64decode(b64)).decode()
rows={}
for block in re.split(r'\n---\s*\n',md):
 m=re.search(r'^####\s+(EPIC\d+_\d+)\s+—\s+(.+)$',block,re.M)
 if not m: continue
 def meta(label):
  q=re.search(r'^- \*\*'+re.escape(label)+r':\*\*\s*(.+)$',block,re.M); return q.group(1).strip() if q else ''
 def sec(title):
  marker='**'+title+'**'; j=block.find(marker)
  if j<0:return ''
  b=block[j+len(marker):].lstrip(' \n'); q=re.search(r'\n\*\*[^*\n]+\*\*\s*\n|\n---\s*$',b,re.M); return (b[:q.start()] if q else b).strip()
 rows[m.group(1)]={'story':sec('User story'),'pre':sec('Pre-condition'),'rules':sec('Narrative / source business rules'),'type':meta('Type'),'sub':meta('Sub-process'),'origin':meta('Capability origin (source column)'),'process':meta('Process'),'source':meta('Source evidence')}
assert len(rows)==112,len(rows)
for rid,r in rows.items():
 for k,v in r.items(): assert v,f'{rid} missing {k}'
r=rows['EPIC1_1']; assert r['story'].startswith('As a credit analyst/CCOE'); assert 'SSO' in r['rules']; assert r['sub']=='Access'; assert r['origin']=='Existing Function'; assert 'RTM row 2' in r['source']
print('112 detailed requirements OK; EPIC1_1 content verified')
PY

echo '[4/8] Deterministic sort behavior'
node - <<'JS'
const {compareRequirements}=require('./portal-fixes.js');
const rows=[
 {id:'EPIC4_12',epic:'Epic 4: Review, Correction & Approval',priority:'2-Medium',summary:'Zulu'},
 {id:'EPIC4_3',epic:'Epic 4: Review, Correction & Approval',priority:'3-Low',summary:'Alpha'},
 {id:'EPIC4_1',epic:'Epic 4: Review, Correction & Approval',priority:'3-Low',summary:'Bravo'},
 {id:'EPIC3_9',epic:'Epic 3: QA',priority:'1-High',summary:'Charlie'},
 {id:'EPIC4_10',epic:'Epic 4: Review, Correction & Approval',priority:'3-Low',summary:'Delta'}
];
const details=new Map(rows.map(r=>[r.id,{sub_process:r.id==='EPIC4_12'?'B':'A'}]));
const ids=mode=>[...rows].sort((a,b)=>compareRequirements(a,b,mode,details)).map(x=>x.id);
if(JSON.stringify(ids('id'))!==JSON.stringify(['EPIC3_9','EPIC4_1','EPIC4_3','EPIC4_10','EPIC4_12'])) throw new Error('ID sort failed: '+ids('id'));
if(JSON.stringify(ids('epic'))!==JSON.stringify(['EPIC3_9','EPIC4_1','EPIC4_3','EPIC4_10','EPIC4_12'])) throw new Error('Epic sort failed: '+ids('epic'));
if(ids('priority')[0]!=='EPIC3_9'||ids('priority')[1]!=='EPIC4_12') throw new Error('Priority sort failed: '+ids('priority'));
if(ids('summary')[0]!=='EPIC4_3') throw new Error('Summary sort failed: '+ids('summary'));
console.log('Sort comparator OK:', ids('id').join(', '));
JS

echo '[5/8] Assets'
for f in index.html styles.css app.js stability-hotfix.js full-details-hotfix.js portal-fixes.js data/requirements.json data/catalog/catalog-{00..07}.b64; do test -f "$f"; done

echo '[6/8] Current references'
grep -q 'app.js?v=20260913-1' index.html
grep -q 'full-details-hotfix.js?v=20260913-1' index.html
grep -q 'portal-fixes.js?v=20260913-1' index.html
grep -q 'styles.css?v=20260913-1' index.html

echo '[7/8] Health-aware stale warning fix'
grep -q "text.startsWith('Portal data load issue:')" portal-fixes.js
grep -q 'reqs.length === 112 && details.size === 112' portal-fixes.js
grep -q "sort.addEventListener('change'" portal-fixes.js

echo '[8/8] Local HTTP'
python3 -m http.server 8765 >/tmp/ksp-pages-test.log 2>&1 & PID=$!; trap 'kill $PID 2>/dev/null || true' EXIT; sleep 1
python3 - <<'PY'
from urllib.request import urlopen
for p in ['','app.js','stability-hotfix.js','full-details-hotfix.js','portal-fixes.js','data/requirements.json']+[f'data/catalog/catalog-{i:02d}.b64' for i in range(8)]:
 assert urlopen('http://127.0.0.1:8765/'+p).status==200,p
print('HTTP assets OK')
PY

echo 'ALL BLOCKING PORTAL TESTS PASSED'
