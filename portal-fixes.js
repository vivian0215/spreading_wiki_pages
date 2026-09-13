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
    if (mode === 'priority') {
      return (pRank[a.priority] ?? 99) - (pRank[b.priority] ?? 99) || compareNaturalId(a, b);
    }
    if (mode === 'epic') {
      const [ae] = requirementNumbers(a), [be] = requirementNumbers(b);
      return ae - be || compareNaturalId(a, b);
    }
    if (mode === 'summary') {
      return String(a.summary || '').localeCompare(String(b.summary || ''), undefined, { sensitivity: 'base' }) || compareNaturalId(a, b);
    }
    if (mode === 'subprocess') {
      const ad = detailsMap && detailsMap.get ? (detailsMap.get(a.id) || {}) : {};
      const bd = detailsMap && detailsMap.get ? (detailsMap.get(b.id) || {}) : {};
      return String(ad.sub_process || '').localeCompare(String(bd.sub_process || ''), undefined, { sensitivity: 'base' }) || compareNaturalId(a, b);
    }
    return compareNaturalId(a, b);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { requirementNumbers, compareNaturalId, compareRequirements };
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  function portalIsHealthy() {
    try {
      return Array.isArray(window.requirements) && window.requirements.length === 112 &&
        window.requirementDetails && typeof window.requirementDetails.size === 'number' && window.requirementDetails.size === 112;
    } catch (_) {
      return false;
    }
  }

  function removeStaleLoadWarnings() {
    if (!portalIsHealthy()) return;
    document.querySelectorAll('.notice').forEach(function (n) {
      const text = (n.textContent || '').trim();
      if (text.startsWith('Portal data load issue:') || text.includes('Portal data load issue: Failed to fetch')) n.remove();
    });
  }

  function installSort() {
    const sort = document.getElementById('sortFilter');
    if (!sort) return;

    if (!sort.querySelector('option[value="summary"]')) {
      sort.insertAdjacentHTML('beforeend', '<option value="summary">Sort: Summary A–Z</option><option value="subprocess">Sort: Sub-process</option>');
    }

    window.filtered = function () {
      const qEl = document.getElementById('reqSearch');
      const epicEl = document.getElementById('epicFilter');
      const priorityEl = document.getElementById('priorityFilter');
      const typeEl = document.getElementById('typeFilter');
      const subEl = document.getElementById('subProcessFilter');
      const originEl = document.getElementById('originFilter');
      const sortEl = document.getElementById('sortFilter');
      const q = (qEl ? qEl.value : '').trim().toLowerCase();
      const e = epicEl ? epicEl.value : '';
      const p = priorityEl ? priorityEl.value : '';
      const t = typeEl ? typeEl.value : '';
      const s = subEl ? subEl.value : '';
      const o = originEl ? originEl.value : '';
      const detailMap = window.requirementDetails || new Map();
      const reqs = Array.isArray(window.requirements) ? window.requirements : [];

      const list = reqs.filter(function (r) {
        const d = detailMap.get(r.id) || {};
        const text = [r.id, r.summary, r.epic, r.priority, d.type, d.sub_process, d.user_story, d.pre_condition, d.narrative, d.process, d.origin, d.status].join(' ').toLowerCase();
        return (!e || r.epic === e) && (!p || r.priority === p) && (!t || d.type === t) && (!s || d.sub_process === s) && (!o || d.origin === o) && (!q || text.includes(q));
      });
      return list.sort(function (a, b) { return compareRequirements(a, b, sortEl ? sortEl.value : 'id', detailMap); });
    };

    if (!sort.dataset.kspSortBound) {
      sort.addEventListener('change', function () {
        if (typeof window.renderRequirements === 'function') window.renderRequirements();
      });
      sort.dataset.kspSortBound = '1';
    }
  }

  function refreshHealthyUI() {
    installSort();
    removeStaleLoadWarnings();
    if (portalIsHealthy() && typeof window.renderRequirements === 'function') window.renderRequirements();
  }

  document.addEventListener('DOMContentLoaded', refreshHealthyUI, { once: true });
  window.addEventListener('load', function () {
    refreshHealthyUI();
    setTimeout(refreshHealthyUI, 300);
    setTimeout(refreshHealthyUI, 1200);
  });

  const observer = new MutationObserver(function () {
    if (portalIsHealthy()) removeStaleLoadWarnings();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})(typeof globalThis !== 'undefined' ? globalThis : this);
