/* KSP full RTM detail loader. Converts the normalized catalog into usable requirement content. */
(async function () {
  const escLocal = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function getMeta(block, label) {
    const re = new RegExp('^- \\*\\*' + label.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&') + ':\\*\\*\\s*(.+)$', 'm');
    return block.match(re)?.[1]?.trim() || '';
  }

  function getSection(block, title) {
    const marker = '**' + title + '**';
    const start = block.indexOf(marker);
    if (start < 0) return '';
    let body = block.slice(start + marker.length).replace(/^\s{0,2}\n/, '');
    const next = body.search(/\n\*\*[^*\n]+\*\*\s{0,2}\n|\n---\s*$/m);
    if (next >= 0) body = body.slice(0, next);
    return body.trim();
  }

  function parseFullCatalog(md) {
    const map = new Map();
    const blocks = md.split(/\n---\s*\n/);
    for (const block of blocks) {
      const h = block.match(/^####\s+(EPIC\d+_\d+)\s+—\s+(.+)$/m);
      if (!h) continue;
      const id = h[1];
      const proc = getMeta(block, 'Process');
      const source = getMeta(block, 'Source evidence');
      const processMatch = proc.match(/^(.*?)\s*\/\s*`([^`]+)`\s*$/);
      const rowMatch = source.match(/RTM row\s+(\d+)/i);
      map.set(id, {
        id,
        summary: h[2].trim(),
        priority: getMeta(block, 'Priority'),
        type: getMeta(block, 'Type'),
        sub_process: getMeta(block, 'Sub-process'),
        status: getMeta(block, 'Status'),
        origin: getMeta(block, 'Capability origin \\(source column\\)'),
        process: processMatch ? processMatch[1].trim() : proc,
        process_box: processMatch ? processMatch[2].trim() : '',
        source_evidence: source,
        source_row: rowMatch ? rowMatch[1] : '',
        user_story: getSection(block, 'User story'),
        pre_condition: getSection(block, 'Pre-condition'),
        narrative: getSection(block, 'Narrative / source business rules')
      });
    }
    return map;
  }

  function refreshDetailFilters() {
    const configs = [
      ['typeFilter', 'type'],
      ['subProcessFilter', 'sub_process'],
      ['originFilter', 'origin']
    ];
    for (const [id, key] of configs) {
      const select = document.getElementById(id);
      if (!select) continue;
      const selected = select.value;
      while (select.options.length > 1) select.remove(1);
      const values = [...new Set([...requirementDetails.values()].map(x => x[key]).filter(Boolean))].sort((a,b) => a.localeCompare(b));
      for (const value of values) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      }
      if ([...select.options].some(o => o.value === selected)) select.value = selected;
    }
  }

  function showDetailLoadFailure(message) {
    const main = document.querySelector('main');
    if (!main || document.getElementById('detailDataWarning')) return;
    const el = document.createElement('div');
    el.id = 'detailDataWarning';
    el.className = 'notice';
    el.innerHTML = '<strong>Requirement detail load issue:</strong> ' + escLocal(message);
    main.insertAdjacentElement('afterbegin', el);
  }

  try {
    const url = new URL('data/requirements-catalog.b64', document.baseURI);
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('requirements-catalog.b64 HTTP ' + response.status);
    if (!('DecompressionStream' in window)) throw new Error('Browser does not support gzip decompression.');

    const b64 = (await response.text()).trim();
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const md = await new Response(stream).text();
    const parsed = parseFullCatalog(md);

    if (parsed.size !== 112) throw new Error('Expected 112 detailed requirements, parsed ' + parsed.size);
    for (const [id, d] of parsed) {
      if (!d.user_story || !d.pre_condition || !d.narrative || !d.process || !d.sub_process || !d.origin || !d.type) {
        throw new Error('Incomplete normalized detail for ' + id);
      }
    }

    requirementDetails.clear();
    for (const [id, d] of parsed) requirementDetails.set(id, d);
    catalogMarkdown = md;
    refreshDetailFilters();

    const warning = document.getElementById('detailDataWarning');
    if (warning) warning.remove();
    document.querySelectorAll('.notice').forEach(n => {
      if (n.textContent.includes('รายละเอียดเชิงลึกของ RTM')) n.remove();
    });

    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderRequirements === 'function') renderRequirements();
    if (typeof renderGlobalSearch === 'function') renderGlobalSearch();

    const hashMatch = location.hash.match(/^#req=(.+)$/);
    const idToShow = selectedId || (hashMatch ? decodeURIComponent(hashMatch[1]) : null);
    if (idToShow && requirementDetails.has(idToShow) && typeof showRequirement === 'function') showRequirement(idToShow, false);

    console.info('KSP requirement details loaded:', parsed.size);
  } catch (error) {
    console.error('Full RTM detail load failed.', error);
    showDetailLoadFailure(error.message);
  }
})();
