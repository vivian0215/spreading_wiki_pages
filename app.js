const sections = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'overview', label: 'Project Overview' },
  { id: 'knowledge', label: 'Knowledge Areas' },
  { id: 'governance', label: 'Publishing Rules' }
];

const publicData = {
  overview: 'This is the public presentation layer for a private project knowledge repository. Detailed project information remains private unless it is explicitly reviewed and approved for public release.',
  areas: [
    ['Project context', 'High-level, non-confidential project orientation.'],
    ['Process knowledge', 'Sanitized process concepts suitable for public presentation.'],
    ['Requirements', 'Only explicitly approved public requirement summaries.'],
    ['AI knowledge', 'General AI capability themes without internal implementation details.'],
    ['Traceability', 'Public-safe references only; no private source paths or customer data.'],
    ['Delivery', 'Public-safe demonstrations and documentation.']
  ],
  rules: [
    'Do not publish customer, CIF, employee, audit-log or personal data.',
    'Do not publish credentials, secrets, internal endpoints or private API specifications.',
    'Do not publish raw source files or private SharePoint paths.',
    'Do not copy detailed internal requirements unless they have been explicitly approved for public release.',
    'Treat the private repository as the authoritative project second brain.'
  ]
};

const nav = document.getElementById('nav');
const content = document.getElementById('content');
const title = document.getElementById('page-title');
const subtitle = document.getElementById('page-subtitle');
const search = document.getElementById('search');

function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

function renderNav(active='dashboard') {
  nav.innerHTML = sections.map(s => `<button data-id="${s.id}" class="${s.id===active?'active':''}">${s.label}</button>`).join('');
  nav.querySelectorAll('button').forEach(b => b.onclick = () => render(b.dataset.id));
}

function render(id='dashboard') {
  renderNav(id);
  search.value='';
  if (id==='dashboard') {
    title.textContent='KSP Second Brain — Public View';
    subtitle.textContent='A sanitized online interface backed by a separate private knowledge repository.';
    content.innerHTML=`
      <div class="cards">
        <div class="card"><div class="value">Private</div><div class="label">Authoritative knowledge repo</div></div>
        <div class="card"><div class="value">Public</div><div class="label">This presentation layer</div></div>
        <div class="card"><div class="value">Read-only</div><div class="label">Current web experience</div></div>
        <div class="card"><div class="value">Reviewed</div><div class="label">Content required before publishing</div></div>
      </div>
      <div class="panel"><h2>Purpose</h2><p>${publicData.overview}</p></div>
      <div class="panel"><h2>Knowledge areas</h2><div class="grid">${publicData.areas.map(a=>`<div class="item"><h3>${a[0]}</h3><p>${a[1]}</p></div>`).join('')}</div></div>`;
  } else if (id==='overview') {
    title.textContent='Project Overview';
    subtitle.textContent='Public-safe orientation only.';
    content.innerHTML=`<div class="panel"><h2>Overview</h2><p>${publicData.overview}</p><p>Detailed project scope, internal requirements and source evidence are intentionally retained in the private repository.</p></div>`;
  } else if (id==='knowledge') {
    title.textContent='Knowledge Areas';
    subtitle.textContent='How the future public-safe portal can be organized.';
    content.innerHTML=`<div class="grid">${publicData.areas.map(a=>`<div class="panel"><h2>${a[0]}</h2><p>${a[1]}</p></div>`).join('')}</div>`;
  } else {
    title.textContent='Publishing Rules';
    subtitle.textContent='Security boundary between the private second brain and this public site.';
    content.innerHTML=`<div class="panel"><h2>Rules</h2>${publicData.rules.map(r=>`<div class="item"><p>${r}</p></div>`).join('')}</div>`;
  }
}

search.addEventListener('input', e => {
  const q=e.target.value.trim().toLowerCase();
  if(!q){render('dashboard');return;}
  renderNav('');
  title.textContent='Search';
  subtitle.textContent='Searches only content that is already approved for this public site.';
  const rows=[...publicData.areas.map(a=>({title:a[0],text:a[1]})),...publicData.rules.map(r=>({title:'Publishing rule',text:r}))]
    .filter(x=>(x.title+' '+x.text).toLowerCase().includes(q));
  content.innerHTML=`<div class="panel search-results">${rows.length?rows.map(x=>`<div class="item"><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.text)}</p></div>`).join(''):'<div class="empty">No public content matched.</div>'}</div>`;
});

render();
