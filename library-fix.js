// Runtime fix for GitHub Pages: Markdown source files in the Pages site can be routed/processed
// differently by GitHub Pages. Load the public repository's raw file instead.
const KSP_RAW_BASE = 'https://raw.githubusercontent.com/vivian0215/spreading_wiki_pages/main/';

window.openLibraryDoc = async function(i) {
  document.querySelectorAll('.library-button').forEach((b, j) => b.classList.toggle('active', j === i));
  const d = libraryDocs[i];
  const target = document.querySelector('#libraryDetail');
  if (!d || !target) return;
  target.innerHTML = `<div class="loading">Loading ${esc(d[0])}…</div>`;
  try {
    const url = KSP_RAW_BASE + d[2] + '?v=' + Date.now();
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const md = await r.text();
    target.innerHTML = mdToHtml(md);
  } catch (e) {
    target.innerHTML = `<h2>Unable to load document</h2><p>${esc(e.message)}</p><p class="muted">Source: ${esc(d[2])}</p>`;
  }
};
