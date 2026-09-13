/* KSP portal production fixes: health-aware load warning cleanup + deterministic sorting. */
(function (root) {
  'use strict';

  function requirementNumbers(r) {
    const id = String((r && r.id) || '');
    const idMatch = id.match(/^EPIC(\d+)_(\d+)$/i);
    if (idMatch) return [Number(idMatch[1]), Number(idMatch[2])];
    const epic = String((r && r.epic) || '');
    const epicMatch = epic.match(/Epic\s+(\d+)/i);
    return [epicMatch ? Number(epicMatch[1]) : 9999, 9999];
  }

  function compareNaturalId(a, b) {
    const [ae, ai] = requirementNumbers(a);
    const [be, bi] = requirementNumbers(b);
    return ae - be || ai - bi || String(a.id || '').localeCompare(String(b.id || ''), undefined, { numeric: true });
  }

  function compareRequirements(a, b, sortMode, detailsMap) {
    const pRank = { '0-Critical': 0, '1-High': 1, '2-Medium': 2, '3-Low': 3 };
    const mode = sortMode || 'id';
    if (mode === 'priority') return (pRank[a.priority] ?? 99) - (pRank[b.priority] ?? 99) || compareNaturalId(a, b);
    if (mode === 'epic') {
      const [ae] = requirementNumbers(a), [be] = requirementNumbers(b);
      return ae - be || compareNaturalId(a, b);
    }
    if (mode === 'summary') return String(a.summary || '').localeCompare(String(b.summary || ''), undefined, { sensitivity: 'base' }) || compareNaturalId(a, b);
    if (mode === 'subprocess') {
      const ad = detailsMap && detailsMap.get ? (detailsMap.get(a.id) || {}) : {};
      const bd = detailsMap && detailsMap.get ? (detailsMap.get(b.id) || {}) : {};
      return String(ad.sub_process || '').localeCompare(String(bd.sub_process || ''), undefined, { sensitivity: 'base' }) || compareNaturalId(a, b);
    }
    return compareNaturalId(a, b);
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { requirementNumbers, compareNaturalId, compareRequirements };
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  function getRequirements() {
    try { return (typeof requirements !== 'undefined' && Array.isArray(requirements)) ? requirements : []; }
    catch (_) { return []; }
  }
  function getDetailMap() {
    try { return (typeof requirementDetails !== 'undefined' && requirementDetails && typeof requirementDetails.get === 'function') ? requirementDetails : new Map(); }
    catch (_) { return new Map(); }
  }
  function portalIsHealthy() {
    const reqs = getRequirements(), details = getDetailMap();
    return reqs.length === 112 && details.size === 112;
  }

  function removeStaleLoadWarnings() {
    if (!portalIsHealthy()) return;
    document.querySelectorAll('.notice').forEach(function (n) {
      const text = (n.textContent || '').trim();
      if (text.startsWith('Portal data load issue:')) n.remove();
    });
  }

  function installSort() {
    const sort = document.getElementById('sortFilter');
    if (!sort) return;
    if (!sort.querySelector('option[value="summary"]')) sort.insertAdjacentHTML('beforeend', '<option value="summary">Sort: Summary A–Z</option><option value="subprocess">Sort: Sub-process</option>');

    filtered = function () {
      const q = (document.getElementById('reqSearch')?.value || '').trim().toLowerCase();
      const e = document.getElementById('epicFilter')?.value || '';
      const p = document.getElementById('priorityFilter')?.value || '';
      const t = document.getElementById('typeFilter')?.value || '';
      const s = document.getElementById('subProcessFilter')?.value || '';
      const o = document.getElementById('originFilter')?.value || '';
      const sortMode = document.getElementById('sortFilter')?.value || 'id';
      const details = getDetailMap();
      const list = getRequirements().filter(function (r) {
        const d = details.get(r.id) || {};
        const text = [r.id,r.summary,r.epic,r.priority,d.type,d.sub_process,d.user_story,d.pre_condition,d.narrative,d.process,d.origin,d.status].join(' ').toLowerCase();
        return (!e || r.epic===e) && (!p || r.priority===p) && (!t || d.type===t) && (!s || d.sub_process===s) && (!o || d.origin===o) && (!q || text.includes(q));
      });
      return list.sort(function (a,b) { return compareRequirements(a,b,sortMode,details); });
    };

    if (!sort.dataset.kspSortBound) {
      sort.addEventListener('change', function () { if (typeof renderRequirements === 'function') renderRequirements(); });
      sort.dataset.kspSortBound = '1';
    }
  }

  function refreshHealthyUI() {
    installSort();
    removeStaleLoadWarnings();
    if (portalIsHealthy() && typeof renderRequirements === 'function') renderRequirements();
  }

  document.addEventListener('DOMContentLoaded', refreshHealthyUI, { once: true });
  window.addEventListener('load', function () {
    refreshHealthyUI();
    setTimeout(refreshHealthyUI, 300);
    setTimeout(refreshHealthyUI, 1200);
  });
  const observer = new MutationObserver(function () { if (portalIsHealthy()) removeStaleLoadWarnings(); });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})(typeof globalThis !== 'undefined' ? globalThis : this);
