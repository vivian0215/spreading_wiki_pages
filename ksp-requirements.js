/* KSP-side requirement workspace. These are separated from business alignment requirements. */
(function () {
  'use strict';

  const kspRequirements = [
    {
      id:'KSP-REQ-001',
      summary:'Acquire financial statement source data from approved channels',
      category:'Source Acquisition', status:'Derived — Needs confirmation',
      statement:'KSP shall support acquisition of financial statement source data from approved project channels, including SET-related sources and client-provided inputs, while preserving the original source for downstream traceability.',
      rationale:'The KSP technical solution needs a controlled entry point before extraction, spreading, QA and downstream delivery can occur.',
      sources:['SRC-004','SRC-013'],
      sourceNotes:['ISAC FS Spreading_ v0.2.pptx — KSP solution/project context','SET Download Service API specification — technical reference for SET source acquisition'],
      alignment:['Epic 1 — Submission & Intake'],
      open:'Confirm release-1 source channels, ownership and fallback handling.'
    },
    {
      id:'KSP-REQ-002',
      summary:'Integrate with SET Download Service for supported financial statement retrieval',
      category:'Integration', status:'Derived — Needs confirmation',
      statement:'KSP shall integrate with the approved SET Download Service interface for supported retrieval scenarios, including the authentication/download flow defined by the applicable technical specification.',
      rationale:'Automated retrieval reduces manual preparation and creates a repeatable ingestion path for listed-company data.',
      sources:['SRC-013'],
      sourceNotes:['SET Download Service API specification — authentication/token and document-download technical flow'],
      alignment:['Epic 1 — Submission & Intake','Epic 8 — Data Management'],
      open:'Confirm production endpoint ownership, retry/error policy and credential-management responsibility.'
    },
    {
      id:'KSP-REQ-003',
      summary:'Interpret SET financial and reference data structures used by spreading',
      category:'Data', status:'Derived — Needs confirmation',
      statement:'KSP shall interpret the approved SET/market-data structures required for financial statements, company/security context and industry information used by the spreading process.',
      rationale:'Source data must be mapped into a stable internal representation before business spreading rules can be applied.',
      sources:['SRC-014'],
      sourceNotes:['PSIMS-Equity-FormatFile specification — multi-sheet SET/market-data reference including financial statement and industry structures'],
      alignment:['Epic 2 — Reading, Mapping & Spreading','Epic 8 — Data Management'],
      open:'Confirm the exact sheets/fields in scope for release 1 and the canonical internal data model.'
    },
    {
      id:'KSP-REQ-004',
      summary:'Ingest and understand supported financial statement documents',
      category:'Extraction', status:'Derived — Needs confirmation',
      statement:'KSP shall ingest supported financial statement documents and preserve sufficient document structure and source context for later extraction, mapping, review and traceability.',
      rationale:'Document understanding is the foundation for AI-assisted spreading and source-grounded review.',
      sources:['SRC-004'],
      sourceNotes:['ISAC FS Spreading_ v0.2.pptx — technical/project direction for automated spreading'],
      alignment:['Epic 1 — Submission & Intake','Epic 2 — Reading, Mapping & Spreading'],
      open:'Confirm authoritative supported file types, size limits and scan/image quality thresholds.'
    },
    {
      id:'KSP-REQ-005',
      summary:'Support Thai, English and mixed-language statement content',
      category:'Document Understanding', status:'Derived — Needs confirmation',
      statement:'KSP shall support Thai, English and mixed-language financial statement content required by the target spreading process, including translation or normalization where required by the target template.',
      rationale:'Language limitations are a documented constraint of the current process and must not block the target automated flow.',
      sources:['SRC-004'],
      sourceNotes:['ISAC FS Spreading_ v0.2.pptx — target solution/project context'],
      alignment:['Epic 1 — Submission & Intake','Epic 2 — Reading, Mapping & Spreading'],
      open:'Confirm translation scope, terminology authority and review rules for translated content.'
    },
    {
      id:'KSP-REQ-006',
      summary:'Create reusable spreading output from a single source submission',
      category:'Spreading', status:'Derived — Needs confirmation',
      statement:'KSP shall process a financial statement submission once and reuse the normalized financial information to produce applicable target spreading outputs without requiring duplicate source submission.',
      rationale:'Single entry is a core target-state principle and reduces duplicate work and inconsistency between downstream templates.',
      sources:['SRC-004'],
      sourceNotes:['ISAC FS Spreading_ v0.2.pptx — target automated spreading direction'],
      alignment:['Epic 2 — Reading, Mapping & Spreading'],
      open:'Confirm mandatory target templates and template-version ownership for each release.'
    },
    {
      id:'KSP-REQ-007',
      summary:'Preserve source-to-spread lineage for every mapped value',
      category:'Traceability', status:'Derived — Needs confirmation',
      statement:'KSP shall preserve traceability from normalized/mapped spread values back to the relevant source evidence so that analysts can understand where a value came from and how it was transformed.',
      rationale:'Source-grounded lineage is required for reviewability, auditability and safe use of AI-assisted spreading.',
      sources:['SRC-004'],
      sourceNotes:['ISAC FS Spreading_ v0.2.pptx — solution context and traceable automated-spreading principle'],
      alignment:['Epic 2 — Reading, Mapping & Spreading','Epic 6 — Reporting & Audit'],
      open:'Confirm required granularity: document/page/table/cell/footnote and transformation-step lineage.'
    },
    {
      id:'KSP-REQ-008',
      summary:'Run automated quality checks independently from initial spreading',
      category:'Quality Assurance', status:'Derived — Needs confirmation',
      statement:'KSP shall perform automated quality checks on spreading results independently from the initial extraction/mapping step and surface exceptions for analyst review.',
      rationale:'Independent validation reduces silent mapping/calculation errors and supports human-in-the-loop control.',
      sources:['SRC-004'],
      sourceNotes:['ISAC FS Spreading_ v0.2.pptx — target architecture/project direction including automated QA'],
      alignment:['Epic 3 — Quality Assurance'],
      open:'Confirm the approved checks, thresholds, exception severities and pass/fail ownership.'
    },
    {
      id:'KSP-REQ-009',
      summary:'Support analyst review, correction and approval before final delivery',
      category:'Human Review', status:'Derived — Needs confirmation',
      statement:'KSP shall allow authorized analysts to review, correct and approve spreading results before the approved result is treated as final for downstream delivery.',
      rationale:'The target operating model keeps the analyst as the final decision-maker rather than allowing autonomous finalization by AI.',
      sources:['SRC-004'],
      sourceNotes:['ISAC FS Spreading_ v0.2.pptx — human-in-the-loop target process context'],
      alignment:['Epic 4 — Review, Correction & Approval'],
      open:'Confirm roles, approval states, segregation-of-duty rules and re-open/reprocess behavior.'
    },
    {
      id:'KSP-REQ-010',
      summary:'Deliver approved spreading results to CreditLens and applicable downstream systems',
      category:'Downstream Integration', status:'Derived — Needs confirmation',
      statement:'KSP shall deliver approved spreading results to CreditLens and other approved downstream targets using controlled interfaces with delivery status and reconciliation visibility.',
      rationale:'The automated spreading solution only completes the business flow when approved output can be consumed reliably by downstream credit processes.',
      sources:['SRC-004'],
      sourceNotes:['ISAC FS Spreading_ v0.2.pptx — system/solution context for downstream spreading integration'],
      alignment:['Epic 5 — Downstream Delivery & Integration'],
      open:'Confirm payload contracts, target systems by release, retry/idempotency and reconciliation ownership.'
    },
    {
      id:'KSP-REQ-011',
      summary:'Map KSP data to approved internal data entities and warehouse context',
      category:'Data Architecture', status:'Derived — Needs confirmation',
      statement:'KSP shall align relevant persistent/integration data with the approved internal entity and data-warehouse context required by the solution interfaces and reporting needs.',
      rationale:'A stable data model is needed for integration, reporting, traceability and reproducibility across systems.',
      sources:['SRC-015'],
      sourceNotes:['KTB_DWH_ER_Diagram.pdf — internal data-model reference'],
      alignment:['Epic 8 — Data Management','Epic 5 — Downstream Delivery & Integration'],
      open:'Confirm which DWH entities are authoritative versus reference-only and define field-level mappings.'
    },
    {
      id:'KSP-REQ-012',
      summary:'Maintain processing versions and audit evidence for reproducibility',
      category:'Auditability', status:'Derived — Needs confirmation',
      statement:'KSP shall retain sufficient version and audit evidence for source inputs, processing outcomes, analyst corrections and final outputs so that a completed spreading result can be explained and reproduced.',
      rationale:'Versioned evidence is required to investigate changes and demonstrate how an approved result was produced.',
      sources:['SRC-004','SRC-015'],
      sourceNotes:['ISAC FS Spreading_ v0.2.pptx — solution context','KTB_DWH_ER_Diagram.pdf — supporting data-model context'],
      alignment:['Epic 6 — Reporting & Audit','Epic 9 — AI Governance & Responsible AI'],
      open:'Confirm retention period, required version identifiers and immutable audit fields.'
    }
  ];

  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  let selected = null;

  function unique(key){return [...new Set(kspRequirements.map(x=>x[key]).flat().filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b)));}
  function addOptions(id,values){const el=$(id);if(!el)return;values.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o);});}
  function idNum(id){const m=String(id).match(/(\d+)$/);return m?Number(m[1]):9999;}

  function filtered(){
    const q=($('#kspReqSearch')?.value||'').trim().toLowerCase();
    const category=$('#kspCategoryFilter')?.value||'';
    const status=$('#kspStatusFilter')?.value||'';
    const source=$('#kspSourceFilter')?.value||'';
    const sort=$('#kspSortFilter')?.value||'id';
    const list=kspRequirements.filter(r=>{
      const text=[r.id,r.summary,r.category,r.status,r.statement,r.rationale,...r.sources,...r.sourceNotes,...r.alignment,r.open].join(' ').toLowerCase();
      return (!q||text.includes(q))&&(!category||r.category===category)&&(!status||r.status===status)&&(!source||r.sources.includes(source));
    });
    return list.sort((a,b)=>{
      if(sort==='category') return a.category.localeCompare(b.category)||idNum(a.id)-idNum(b.id);
      if(sort==='status') return a.status.localeCompare(b.status)||idNum(a.id)-idNum(b.id);
      if(sort==='summary') return a.summary.localeCompare(b.summary)||idNum(a.id)-idNum(b.id);
      return idNum(a.id)-idNum(b.id);
    });
  }

  function renderList(){
    const list=filtered();
    if($('#kspReqCount')) $('#kspReqCount').textContent=`${list.length} of ${kspRequirements.length} KSP requirement candidates`;
    if($('#kspRequirementsList')) $('#kspRequirementsList').innerHTML=list.map(r=>`<div class="req-card ${selected===r.id?'active':''}" data-ksp-id="${esc(r.id)}"><div class="req-top"><span class="req-id">${esc(r.id)}</span><span class="chip warn">Derived</span></div><div class="req-summary">${esc(r.summary)}</div><div class="chips"><span class="chip">${esc(r.category)}</span>${r.sources.map(s=>`<span class="chip subtle">${esc(s)}</span>`).join('')}</div></div>`).join('');
    document.querySelectorAll('[data-ksp-id]').forEach(el=>el.addEventListener('click',()=>show(el.dataset.kspId)));
  }

  function show(id){
    selected=id;
    const r=kspRequirements.find(x=>x.id===id);if(!r)return;
    const target=$('#kspRequirementDetail');if(!target)return;
    target.innerHTML=`
      <div class="detail-head"><div><div class="req-id">${esc(r.id)}</div><h2>${esc(r.summary)}</h2></div></div>
      <div class="chips"><span class="chip">${esc(r.category)}</span><span class="chip warn">${esc(r.status)}</span>${r.sources.map(s=>`<span class="chip">${esc(s)}</span>`).join('')}</div>
      <section class="evidence-block"><h3>Requirement Statement</h3><div class="evidence-text">${esc(r.statement)}</div></section>
      <section class="evidence-block"><h3>Why KSP needs this</h3><div class="evidence-text">${esc(r.rationale)}</div></section>
      <section class="evidence-block"><h3>Technical Source Grounding</h3>${r.sourceNotes.map((n,i)=>`<p><strong>${esc(r.sources[i]||'Source')}:</strong> ${esc(n)}</p>`).join('')}<p class="muted">This requirement is derived from KSP-side technical evidence. It is not copied from the 112-row business RTM and remains unconfirmed until the technical baseline is reviewed.</p></section>
      <section class="evidence-block"><h3>Alignment to Business Requirements</h3><div class="chips">${r.alignment.map(x=>`<span class="chip subtle">${esc(x)}</span>`).join('')}</div><p class="muted">These links identify the business areas that KSP must align with; they do not transfer ownership of the business requirement to KSP.</p></section>
      <section class="evidence-block"><h3>Open Confirmation</h3><div class="evidence-text">${esc(r.open)}</div></section>
      <section class="evidence-block"><h3>Baseline Status</h3><div class="readiness"><span class="not-ready">○ Confirmation required</span><span class="ready">✓ Technical source identified</span><span class="ready">✓ Business-alignment area identified</span></div></section>`;
    renderList();
  }

  function init(){
    if(!$('#kspRequirementsList'))return;
    addOptions('#kspCategoryFilter',unique('category'));
    addOptions('#kspStatusFilter',unique('status'));
    addOptions('#kspSourceFilter',unique('sources'));
    ['#kspReqSearch','#kspCategoryFilter','#kspStatusFilter','#kspSourceFilter','#kspSortFilter'].forEach(id=>$(id)?.addEventListener('input',renderList));
    renderList();
    show(kspRequirements[0].id);
  }

  window.kspRequirements = kspRequirements;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();