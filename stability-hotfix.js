/* KSP portal stability layer. Keeps core navigation/data usable even if optional knowledge assets fail. */
(async function () {
  const removeLoadErrors = () => {
    document.querySelectorAll('.notice').forEach(n => {
      if (n.textContent.includes('Portal data load issue')) n.remove();
    });
  };

  const showWarning = (message) => {
    const main = document.querySelector('main');
    if (!main || document.getElementById('stabilityWarning')) return;
    const el = document.createElement('div');
    el.id = 'stabilityWarning';
    el.className = 'notice';
    el.innerHTML = '<strong>บางข้อมูลยังโหลดไม่ครบ:</strong> ' + String(message).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
    main.insertAdjacentElement('afterbegin', el);
  };

  try {
    /* Core requirement index is mandatory. Load it independently so one optional asset cannot blank the portal. */
    const url = new URL('data/requirements.json', document.baseURI);
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('requirements.json HTTP ' + response.status);
    const data = await response.json();
    if (!Array.isArray(data) || data.length !== 112) throw new Error('Expected 112 requirements but received ' + (Array.isArray(data) ? data.length : 'invalid data'));

    requirements = data;
    removeLoadErrors();

    /* Reset filter options before re-binding to avoid duplicates if the original init partly succeeded. */
    ['epicFilter','priorityFilter','typeFilter','subProcessFilter','originFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) while (el.options.length > 1) el.remove(1);
    });

    if (typeof initFilters === 'function') initFilters();
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderRequirements === 'function') renderRequirements();
    if (typeof renderGlobalSearch === 'function') renderGlobalSearch();

    /* Detailed catalog is optional at runtime. Failure must never break the core portal. */
    try {
      const catalogUrl = new URL('data/requirements-catalog.b64', document.baseURI);
      const catalogResponse = await fetch(catalogUrl, { cache: 'no-store' });
      if (catalogResponse.ok && typeof gunzipBase64Text === 'function' && typeof parseCatalog === 'function') {
        const decoded = await gunzipBase64Text(await catalogResponse.text());
        catalogMarkdown = decoded;
        parseCatalog(decoded);
        if (typeof renderDashboard === 'function') renderDashboard();
        if (typeof renderRequirements === 'function') renderRequirements();
        if (typeof renderGlobalSearch === 'function') renderGlobalSearch();
      }
    } catch (catalogError) {
      console.warn('Detailed catalog unavailable; core portal remains available.', catalogError);
      showWarning('รายละเอียดเชิงลึกของ RTM ยังโหลดไม่สำเร็จ แต่รายการ Requirement หลักและ navigation ยังใช้งานได้');
    }
  } catch (error) {
    console.error('Core portal data failed to load.', error);
    showWarning('ไม่สามารถโหลด requirement index หลักได้: ' + error.message);
  }
})();
