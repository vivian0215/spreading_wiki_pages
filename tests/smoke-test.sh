#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[1/7] Validate JavaScript syntax"
node --check app.js
node --check stability-hotfix.js
node --check full-details-hotfix.js

echo "[2/7] Validate core requirement index"
python3 - <<'PY'
import json
from pathlib import Path
p=Path('data/requirements.json')
data=json.loads(p.read_text())
assert isinstance(data,list), 'requirements.json must be a list'
assert len(data)==112, f'expected 112 requirements, got {len(data)}'
ids=[x.get('id') for x in data]
assert len(set(ids))==112, 'requirement IDs must be unique'
assert all(ids), 'requirement IDs must not be blank'
print('requirements.json OK:', len(data), 'rows')
PY

echo "[3/7] Validate full normalized RTM catalog"
python3 - <<'PY'
import base64,gzip,re
from pathlib import Path
b64=''.join(Path('data/requirements-catalog.b64').read_text().split())
b64 += '=' * ((4-len(b64)%4)%4)
md=gzip.decompress(base64.b64decode(b64)).decode('utf-8')
blocks=re.split(r'\n---\s*\n',md)
rows={}
for block in blocks:
    m=re.search(r'^####\s+(EPIC\d+_\d+)\s+—\s+(.+)$',block,re.M)
    if not m: continue
    rid=m.group(1)
    def meta(label):
        mm=re.search(r'^- \*\*'+re.escape(label)+r':\*\*\s*(.+)$',block,re.M)
        return mm.group(1).strip() if mm else ''
    def section(title):
        marker='**'+title+'**'
        i=block.find(marker)
        if i<0:return ''
        body=block[i+len(marker):].lstrip(' \n')
        mm=re.search(r'\n\*\*[^*\n]+\*\*\s*\n|\n---\s*$',body,re.M)
        return (body[:mm.start()] if mm else body).strip()
    rows[rid]={
      'summary':m.group(2).strip(),'type':meta('Type'),'sub':meta('Sub-process'),
      'status':meta('Status'),'origin':meta('Capability origin (source column)'),
      'process':meta('Process'),'source':meta('Source evidence'),
      'story':section('User story'),'pre':section('Pre-condition'),
      'rules':section('Narrative / source business rules')}
assert len(rows)==112, f'expected 112 detailed requirements, got {len(rows)}'
for rid,r in rows.items():
    for key in ['summary','type','sub','status','origin','process','source','story','pre','rules']:
        assert r[key], f'{rid} missing {key}'
r=rows['EPIC1_1']
assert r['story'].startswith('As a credit analyst/CCOE, I want to log in to the spreading portal')
assert 'SSO' in r['rules']
assert r['sub']=='Access'
assert r['origin']=='Existing Function'
assert 'RTM row 2' in r['source']
print('Full RTM catalog OK:',len(rows),'requirements with usable details')
PY

echo "[4/7] Validate required site assets exist"
for f in index.html styles.css app.js stability-hotfix.js full-details-hotfix.js data/requirements.json data/requirements-catalog.b64; do
  test -f "$f" || { echo "Missing required asset: $f"; exit 1; }
done

echo "[5/7] Validate index references current assets"
grep -q 'app.js?v=20260912-7' index.html
grep -q 'stability-hotfix.js?v=20260912-7' index.html
grep -q 'full-details-hotfix.js?v=20260912-7' index.html
grep -q 'styles.css?v=20260912-7' index.html

echo "[6/7] Start local static server and verify HTTP paths"
python3 -m http.server 8765 >/tmp/ksp-pages-test.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT
sleep 1
python3 - <<'PY'
from urllib.request import urlopen
import json,base64,gzip
base='http://127.0.0.1:8765/'
paths=['','index.html','styles.css','app.js','stability-hotfix.js','full-details-hotfix.js','data/requirements.json','data/requirements-catalog.b64']
for path in paths:
    r=urlopen(base+path, timeout=5)
    assert r.status==200, (path,r.status)
with urlopen(base+'data/requirements.json', timeout=5) as r:
    data=json.load(r)
assert len(data)==112
with urlopen(base+'data/requirements-catalog.b64', timeout=5) as r:
    b64=''.join(r.read().decode().split())
b64 += '=' * ((4-len(b64)%4)%4)
md=gzip.decompress(base64.b64decode(b64)).decode('utf-8')
assert '#### EPIC1_1 — Access Spreading Portal' in md
assert '**User story**' in md
assert '**Pre-condition**' in md
assert '**Narrative / source business rules**' in md
print('Local HTTP smoke test OK')
PY

echo "[7/7] Verify detail loader contains fail-closed validation"
grep -q "parsed.size !== 112" full-details-hotfix.js
grep -q "Incomplete normalized detail" full-details-hotfix.js
grep -q "requirementDetails.clear" full-details-hotfix.js
grep -q "repeat((4 - (b64.length % 4)) % 4)" full-details-hotfix.js

echo "All blocking smoke tests passed."
