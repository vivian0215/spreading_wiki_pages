#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[1/6] Validate JavaScript syntax"
node --check app.js
node --check stability-hotfix.js

echo "[2/6] Validate core requirement data"
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

echo "[3/6] Validate required site assets exist"
for f in index.html styles.css app.js stability-hotfix.js data/requirements.json; do
  test -f "$f" || { echo "Missing required asset: $f"; exit 1; }
done

echo "[4/6] Validate index references current assets"
grep -q 'app.js?v=20260912-6' index.html
grep -q 'stability-hotfix.js?v=20260912-6' index.html
grep -q 'styles.css?v=20260912-6' index.html

echo "[5/6] Start local static server and verify HTTP paths"
python3 -m http.server 8765 >/tmp/ksp-pages-test.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT
sleep 1
python3 - <<'PY'
from urllib.request import urlopen
import json
base='http://127.0.0.1:8765/'
for path in ['','index.html','styles.css','app.js','stability-hotfix.js','data/requirements.json']:
    r=urlopen(base+path, timeout=5)
    assert r.status==200, (path,r.status)
with urlopen(base+'data/requirements.json', timeout=5) as r:
    data=json.load(r)
assert len(data)==112
print('Local HTTP smoke test OK')
PY

echo "[6/6] Optional knowledge assets report"
python3 - <<'PY'
from pathlib import Path
optional=['data/requirements-catalog.b64','content/project-overview.md','content/as-is-to-be.md','content/requirements-index.md','content/ai-capabilities.md','content/conflicts-and-gaps.md','content/source-register.md','content/agents.md','content/repository-readme.md']
missing=[x for x in optional if not Path(x).exists()]
if missing:
    print('WARNING optional assets missing:', ', '.join(missing))
else:
    print('Optional knowledge assets present')
PY

echo "All blocking smoke tests passed."
