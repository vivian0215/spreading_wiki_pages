let requirements=[];
let requirementDetails=new Map();
let selectedId=null;
let catalogMarkdown='';
const knowledgeCache=new Map();
const RAW_BASE='https://raw.githubusercontent.com/vivian0215/spreading_wiki_pages/main/';

const qualityGates=[
  {id:'AC-01',criterion:'Objectives & scope are stated and bounded.',measure:'Objectives list present (≥1); both In-scope and Out-of-scope lists present and non-empty (≥1 exclusion stated).',check:'Open the Objectives and Scope sections. Confirm each exists and is non-empty (Yes/No).',priority:'Must',status:'Not recorded'},
  {id:'AC-02',criterion:'Every functional area is covered by requirements.',measure:'0 business areas / epics with no requirement. Each area in the process flow has ≥1 story in RTM.',check:'Tick each epic in the flow against the backlog; count epics with zero stories (must be 0).',priority:'Must',status:'Not recorded'},
  {id:'AC-03',criterion:'Non-functional, data & compliance items are captured.',measure:'Non-functional section and a data section exist. Every non-functional/data item has a target or is tagged with respective IT owner.',check:'Confirm the sections exist. Scan for any blank target. Confirm the compliance constraints are listed.',priority:'Must',status:'Not recorded'},
  {id:'AC-04',criterion:'Responsible AI needs & guardrail are captured.',measure:'AI capability section present including confidence/accuracy, escalation & human-in-the-loop, monitoring/improvement, and fallback handling.',check:'Confirm the AI section exists and locate each of the four items.',priority:'Must',status:'Not recorded'},
  {id:'AC-05',criterion:'Requirements are well-formed.',measure:'100% of requirements have a unique ID; stories are single-topic, testable, and free of contradictions.',check:'Sort/scan IDs for duplicates & blanks. Spot-check a 10-story sample for atomicity and testability.',priority:'Must',status:'Not recorded'},
  {id:'AC-06',criterion:'Every requirement is prioritised.',measure:'100% of requirements have a priority tagged.',check:'Filter the Priority column for blanks; must be 0.',priority:'Must',status:'Not recorded'},
  {id:'AC-07',criterion:'Requirements are traceable and the BRD matches RTM.',measure:'100% of requirements have a Source recorded. All cross-references use existing IDs.',check:'Filter Source for blanks; validate cross-references; compare BRD counts/IDs to RTM. Confirm a glossary is present.',priority:'Must',status:'Not recorded'},
  {id:'AC-08',criterion:'Assumptions, risks & open items are documented and owned.',measure:'Assumptions/dependencies and a risk log are present.',check:'Confirm the sections exist. Scan the open-items log for any missing owner or date.',priority:'Must',status:'Not recorded'},
  {id:'AC-09',criterion:'Success measures are clear and measurable.',measure:'Each success measure states what is tracked, a starting point or measurement method, and a target.',check:'Read the Success Criteria table. Confirm each measure has a starting point, target and acceptance note.',priority:'Must',status:'Not recorded'},
  {id:'AC-10',criterion:'The BRD is versioned, reviewed and signed off.',measure:'Version/date/author + revision history present; a dated walkthrough record exists; all required approvers have signed.',check:'Confirm version history, walkthrough record and sign-off block.',priority:'Must',status:'Not recorded'}
];

const project={
  definition:'KSP is an AI-assisted financial spreading initiative intended to let users submit borrower financial statements once, read and translate the content when required, map the information to one or more bank financial templates according to spreading guidelines and industry context, perform automated quality checks, allow human review/correction/approval, and deliver the approved spread to downstream systems with full traceability.',
  problem:'The current spreading process contains significant manual work and relies on QUIQSpread for part of the flow. Documented limitations include format/language constraints, incomplete support for required templates, manual preparation/review effort, inconsistent mapping risk, and downstream re-entry/reconciliation effort.',
  principles:['Single entry — submit once and reuse across templates and target systems.','Human-in-the-loop — AI proposes and checks; an analyst remains the final decision-maker.','Guideline-based spreading — mapping follows bank spreading rules and industry context.','No invention — every spread value must be grounded in source evidence.','Bilingual support — Thai, English, and mixed-language financial statements.','Independent QA — quality checking is distinct from initial spreading/mapping.','Versioned and auditable — inputs, corrections, versions and outputs are traceable.','Governed learning — analyst corrections may support improvement only under governance.'],
  scope:['PDF, Excel and scanned statement ingestion','Thai / English / mixed-language understanding','Translation where required','Mapping to MMAS / KTBBANK / SFA concepts','Industry-adapted spreading rules','Automated QA and reconciliation','Analyst review, correction, override and approval','Downstream delivery / integration','Versioning, audit trail and reporting'],
  out:['Credit decisioning, scoring or rating','Full legal/contractual translation beyond financial-statement content','Replacing downstream credit/core systems','Auditing/opining on borrower statement accuracy','Approval or downstream delivery without analyst sign-off']
};

const process={
  asis:['Obtain financial statements from SET or clients','Prepare / compile and sometimes convert source files','Upload supported cases to QUIQSpread / existing automation','Moody’s QA reviews and adjusts based on guidelines','RM / analyst reviews and adjusts','Finalized spread is imported to CreditLens','SFA coverage remains partial/manual in existing flows'],
  limitations:['Incomplete support for KTBBANK use cases','Thai statements are not fully supported in the current automated path','Existing automated input has constrained file expectations','Preparation / RPA output can require manual correction','SFA mapping is incomplete/manual','Downstream reconciliation is required'],
  tobe:['Obtain statements from SET and/or client-provided sources','Ingest supported PDF, Excel and scanned-image inputs','Read Thai and English content','Produce applicable MMAS / KTBBANK / SFA spreads','Apply spreading guidelines and rounding / normalization rules','Run independent automated QA / LLM-as-Judge style checks','Analyst reviews exceptions and proposed adjustments','Analyst approves / finalizes the spread','Deliver approved results to CreditLens and SFA','Perform reconciliation / interlock control']
};

const ai=[
  ['Document understanding',['Accept PDF, Excel and scanned statements','Detect Thai, English or mixed-language content','Read statement structure and context, not labels alone','Preserve source text for traceability']],
  ['Translation',['Translate Thai financial-statement content where required','Treat English as first-class input','Preserve source-language evidence']],
  ['Financial mapping & spreading',['Map source accounts to target-template fields','Support multiple templates from one ingestion','Apply guideline, sign, aggregation/split and calculation rules','Adapt treatment based on industry/context','Never invent a figure not grounded in source evidence']],
  ['Automated QA',['Run validation separately from initial mapping','Check arithmetic, reconciliation and guideline conformance','Perform benchmark/reasonableness checks where approved','Explain findings and surface uncertainty']],
  ['Confidence & exceptions',['Expose confidence where required','Escalate low-confidence or unmapped items','Allow human review and correction']],
  ['Versioning & reproducibility',['Retain processing/correction/reprocessing versions','Stamp model, guideline and template versions','Preserve lineage sufficient to explain outputs']],
  ['Governed learning',['Capture analyst corrections and rationale','Do not automatically treat every correction as training truth','Curate/approve feedback before model/rule improvement']],
  ['Responsible AI controls',['Every output value must be source-grounded','Adjustments require justification and/or guideline reference where specified','Independent QA before human review','Uploaded document content is treated as source data, not trusted instructions','Human approval remains mandatory']]
];

const issues=[
  ['CONFLICT-001','BRD story count vs current RTM','BRD says 70 user stories across 9 epics while the current RTM has 112 populated rows. Which artifact/version is the current requirement baseline?'],
  ['OQ-001','Source-of-truth precedence','Several requirement artifacts coexist: WIP BRD, WIP RTM, earlier/draft RTMs, separate acceptance criteria, and reference user stories. What precedence should apply when wording differs?'],
  ['OQ-002','Approval semantics','What statuses are formally used by KSP for requirement approval and baseline management?'],
  ['OQ-003','Template scope and ownership','Which templates are mandatory for the first release, who owns each authoritative template definition, and how are template versions governed?'],
  ['OQ-004','Industry-rule authority','Which industry classification is authoritative for spreading behavior, how are overrides handled, and who owns industry-specific spreading rules?'],
  ['OQ-005','Data privacy and GitHub retention','What data-classification and retention rules apply to the knowledge repository?'],
  ['OQ-006','Quantitative AI quality thresholds','What metrics and thresholds govern extraction/mapping accuracy, override rate, confidence and QA effectiveness?'],
  ['OQ-007','Downstream interface contract','What are the approved payloads, error/retry behavior, reconciliation rules and ownership for each integration?'],
  ['OQ-008','Reuse of reference user stories','External/reference stories are contextual evidence only unless an explicit KSP requirement or dependency links to them.']
];

const sources=[
  {id:'SRC-001',name:'Automated Spreading_BRD_WIP.docx',category:'Business requirement / narrative BRD',status:'Draft/WIP',authority:'Unknown',notes:'Objectives, scope, journey, AI capabilities, assumptions, constraints, dependencies and success criteria.'},
  {id:'SRC-002',name:'Automated Spreading_RTM_WIP.xlsx',category:'Requirement backlog / RTM',status:'Draft/WIP',authority:'Unknown',notes:'9 epics and 112 detailed requirement rows with priorities, user stories, pre-conditions, narrative/business rules, process mapping, status and source fields.'},
  {id:'SRC-003',name:'Automated Spreading As-Is & To-Be Process flow.pptx',category:'Process / journey',status:'Draft/working deck',authority:'Unknown',notes:'Spreading process flow and supporting working slides.'},
  {id:'SRC-004',name:'ISAC FS Spreading_ v0.2.pptx',category:'Architecture / project context',status:'Draft/versioned',authority:'Unknown',notes:'Technical/project direction and solution context.'},
  {id:'SRC-005',name:'Acceptance_Criteria_1.xlsx',category:'Acceptance criteria',status:'Working',authority:'Unknown',notes:'BRD/package-level quality gates requiring traceability to the requirement baseline.'},
  {id:'SRC-006',name:'Draft_Requirements Traceability Matrix_V0.1.xlsx',category:'Historical/draft RTM',status:'Draft',authority:'Likely historical/reference',notes:'Earlier RTM with Additional, AI Capabilities, AI Quality Expectations and Legend sheets.'},
  {id:'SRC-007',name:'Draft_Requirements Traceab - Copy.xlsx',category:'Historical/draft RTM copy',status:'Draft/copy',authority:'Likely historical/reference',notes:'Structurally similar to SRC-006; compare before deciding whether duplicate or divergent.'},
  {id:'SRC-008',name:'Darft_SFA_Spreading_Guideline_Corporate_Generic_V0.1.xlsx',category:'Spreading guideline',status:'Draft',authority:'Unknown',notes:'Corporate generic SFA account-level descriptions, considerations and mappings.'},
  {id:'SRC-009',name:'SET industry sector.xlsx',category:'Industry reference',status:'Reference',authority:'Unknown',notes:'Industry/sector reference used for classification and mapping.'},
  {id:'SRC-010',name:'CIF mapping to SET industry.xlsx',category:'Client/industry mapping',status:'Supporting data',authority:'Unknown',notes:'Client master and industry mapping context; business rules can be represented without exposing unnecessary customer rows.'},
  {id:'SRC-011',name:'Audit_Opinion_Types_TH_EN.xlsx',category:'Audit opinion reference',status:'Reference',authority:'Unknown',notes:'Thai/English audit-opinion terminology and classification reference.'},
  {id:'SRC-012',name:'Sample_audit log.xlsx',category:'Audit/log sample',status:'Sample/reference',authority:'Sample',notes:'Expected change/audit information such as mapped account, values, status, user and timestamps.'},
  {id:'SRC-013',name:'MIS_MN_(SCP)_Download Service API_TH_Specification_V1.1 (1).pdf',category:'External/system API specification',status:'Technical reference',authority:'External specification',notes:'SET SCP download-service flow including authentication/token and document download.'},
  {id:'SRC-014',name:'PSIMS-Equity-FormatFile_v4_7-20240813 (1).xlsx',category:'SET/market data file specification',status:'Technical reference',authority:'External/reference',notes:'Large multi-sheet SET/market data format specification including financial statement and industry structures.'},
  {id:'SRC-015',name:'KTB_DWH_ER_Diagram.pdf',category:'Data warehouse ER diagram',status:'Technical reference',authority:'Unknown',notes:'Internal data-model reference supporting entity/integration context.'},
  {id:'SRC-016',name:'[Confirmed] User Story _ Enhance to Aligned with New CA Template 1.pdf',category:'Confirmed external/reference user story',status:'Confirmed for its own project',authority:'Reference only for KSP',notes:'Context for existing/new CA-template behavior; not automatically a KSP requirement.'},
  {id:'SRC-017',name:'User Story SR No. 108050 / SR2025_108806_0001',category:'Existing CBS/customer-segment change user story',status:'Reference',authority:'Confirmed for its own project',notes:'Customer segment/ownership/portfolio data context; not automatically a KSP requirement.'}
];

const libraryDocs=[
  ['Full Requirements Catalog','All 112 requirements with user stories, pre-conditions, business rules and process mapping','__catalog__'],
  ['Project Overview','Project context, objectives, scope and principles','content/project-overview.md'],
  ['As-Is / To-Be','Current and target spreading process','content/as-is-to-be.md'],
  ['Requirements Index','Epic structure, requirement taxonomy and normalization strategy','content/requirements-index.md'],
  ['AI Capabilities','Current business view of AI capabilities and controls','content/ai-capabilities.md'],
  ['Conflicts & Open Questions','Known conflicts, gaps and unresolved questions','content/conflicts-and-gaps.md'],
  ['Source Register','Inventory of source artifacts and their working status','content/source-register.md'],
  ['AI Working Instructions','Grounding, traceability and JIRA-generation rules','content/agents.md'],
  ['Repository Overview','Second-brain structure and operating model','content/repository-readme.md']
];

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const nl=v=>esc(v||'').replace(/\n/g,'<br>');

function switchView(id){
  document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.view===id));
  document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id===id));
  window.scrollTo({top:0,behavior:'smooth'});
}

function countBy(key){return requirements.reduce((m,r)=>{const k=(r[key]||'Unknown').trim();m[k]=(m[k]||0)+1;return m},{})}
function barList(c){const max=Math.max(...Object.values(c),1);return Object.entries(c).map(([k,v])=>`<div class="bar-row"><div>${esc(k)}</div><div class="bar"><span style="width:${v/max*100}%"></span></div><strong>${v}</strong></div>`).join('')}

function renderDashboard(){
  const high=requirements.filter(r=>r.priority==='1-High').length, medium=requirements.filter(r=>r.priority==='2-Medium').length;
  const stats=[['Requirements',requirements.length],['Epics',new Set(requirements.map(r=>r.epic)).size],['High Priority',high],['Medium Priority',medium],['Sources',sources.length],['Open Questions',issues.length]];
  $('#stats').innerHTML=stats.map(([l,v])=>`<div class="stat"><div class="value">${v}</div><div class="label">${l}</div></div>`).join('');
  $('#epicSummary').innerHTML=barList(countBy('epic'));
  $('#prioritySummary').innerHTML=barList(countBy('priority'));
  const origin={};requirements.forEach(r=>{const d=requirementDetails.get(r.id);const k=d?.origin||'Not normalized';origin[k]=(origin[k]||0)+1});$('#originSummary').innerHTML=barList(origin);
  $('#attentionSummary').innerHTML=`<div class="attention"><strong>Baseline conflict</strong><span>BRD states 70 user stories while the current RTM contains 112 rows.</span></div><div class="attention"><strong>Story-level acceptance criteria</strong><span>Not yet mapped for all individual requirements; BRD quality gates are package-level.</span></div><div class="attention"><strong>Approval state</strong><span>The current RTM rows are Draft until stronger approval evidence is added.</span></div>`;
}

function renderOverview(){
  $('#overviewContent').innerHTML=`<div class="panel prose"><h2>Working definition</h2><p>${project.definition}</p><h2>Business problem</h2><p>${project.problem}</p><h2>Target principles</h2><ul>${project.principles.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="grid two"><div><h2>In scope</h2><ul>${project.scope.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h2>Out of scope</h2><ul>${project.out.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div></div>`;
}

function renderProcess(){
  const flow=process.tobe.map((x,i)=>`<span>${i+1}. ${esc(x)}</span>${i<process.tobe.length-1?'<b>→</b>':''}`).join('');
  $('#processContent').innerHTML=`<div class="grid two"><div class="panel prose"><h2>As-Is</h2><ol>${process.asis.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><h3>Key limitations</h3><ul>${process.limitations.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="panel prose"><h2>To-Be</h2><ol>${process.tobe.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div></div><div class="panel"><h2>End-to-end target flow</h2><div class="flow">${flow}</div><p class="muted">Human review and approval remain mandatory. The target design requires lineage from source statement to final output, including versions, corrections, approvals and delivery outcomes.</p></div>`;
}

function renderAI(){$('#aiContent').innerHTML=`<div class="grid two">${ai.map(([h,items])=>`<div class="panel"><h2>${esc(h)}</h2><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>`}
function renderIssues(){$('#issuesContent').innerHTML=`<div class="panel"><h2>Conflicts, gaps and open questions</h2>${issues.map(([id,h,t])=>`<div class="issue"><div class="chips"><span class="chip">${esc(id)}</span><span class="chip warn">Open</span></div><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('')}</div>`}

function uniqueDetail(field){return [...new Set(requirements.map(r=>requirementDetails.get(r.id)?.[field]).filter(Boolean))].sort()}
function addOptions(sel,values){values.forEach(v=>sel.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`))}
function initFilters(){
  addOptions($('#epicFilter'),[...new Set(requirements.map(r=>r.epic))]);
  addOptions($('#priorityFilter'),[...new Set(requirements.map(r=>r.priority))]);
  addOptions($('#typeFilter'),uniqueDetail('type'));
  addOptions($('#subProcessFilter'),uniqueDetail('sub_process'));
  addOptions($('#originFilter'),uniqueDetail('origin'));
  ['reqSearch','epicFilter','priorityFilter','typeFilter','subProcessFilter','originFilter','sortFilter'].forEach(id=>$('#'+id).addEventListener('input',renderRequirements));
}

function requirementText(r){const d=requirementDetails.get(r.id)||{};return [r.id,r.summary,r.epic,r.priority,d.type,d.sub_process,d.user_story,d.pre_condition,d.narrative,d.process,d.origin,d.status].join(' ').toLowerCase()}
function filtered(){
  const q=$('#reqSearch').value.trim().toLowerCase(),e=$('#epicFilter').value,p=$('#priorityFilter').value,t=$('#typeFilter').value,s=$('#subProcessFilter').value,o=$('#originFilter').value;
  let list=requirements.filter(r=>{const d=requirementDetails.get(r.id)||{};return(!e||r.epic===e)&&(!p||r.priority===p)&&(!t||d.type===t)&&(!s||d.sub_process===s)&&(!o||d.origin===o)&&(!q||requirementText(r).includes(q))});
  const sort=$('#sortFilter').value;
  const pRank={'0-Critical':0,'1-High':1,'2-Medium':2,'3-Low':3};
  list.sort((a,b)=>sort==='priority'?(pRank[a.priority]??9)-(pRank[b.priority]??9)||a.id.localeCompare(b.id,{numeric:true}):sort==='epic'?a.epic.localeCompare(b.epic)||a.id.localeCompare(b.id,{numeric:true}):a.id.localeCompare(b.id,{numeric:true}));
  return list;
}

function renderRequirements(){
  const list=filtered();$('#resultCount').textContent=`${list.length} of ${requirements.length} requirements`;
  $('#requirementsList').innerHTML=list.map(r=>{const d=requirementDetails.get(r.id)||{};return `<div class="req-card ${r.id===selectedId?'active':''}" data-id="${esc(r.id)}"><div class="req-top"><span class="req-id">${esc(r.id)}</span><span class="chip">${esc(r.priority)}</span></div><div class="req-summary">${esc(r.summary)}</div><div class="chips"><span class="chip">${esc(r.epic.replace(/^Epic \d+: /,''))}</span>${d.type?`<span class="chip">${esc(d.type)}</span>`:''}${d.sub_process?`<span class="chip subtle">${esc(d.sub_process)}</span>`:''}</div></div>`}).join('');
  document.querySelectorAll('.req-card').forEach(el=>el.addEventListener('click',()=>showRequirement(el.dataset.id,true)));
}

function fieldBlock(title,value){return value?`<section class="evidence-block"><h3>${esc(title)}</h3><div class="evidence-text">${nl(value)}</div></section>`:''}
function jiraDraft(r,d){return `[${r.id}] ${r.summary}\n\nEpic: ${r.epic}\nPriority: ${r.priority}\nType: ${d.type||'TBD'}\nSub-process: ${d.sub_process||'TBD'}\nStatus: ${d.status||'Draft'}\n\nUser Story\n${d.user_story||'TBD'}\n\nPre-condition\n${d.pre_condition||'TBD'}\n\nBusiness Rules / Narrative\n${d.narrative||'TBD'}\n\nAcceptance Criteria\nTBD — story-level acceptance criteria have not yet been normalized for this requirement.\n\nSource Evidence\nAutomated Spreading_RTM_WIP.xlsx / RTM row ${d.source_row||r.source_row||''}`}

function showRequirement(id,updateHash=false){
  selectedId=id;const r=requirements.find(x=>x.id===id);if(!r)return;const d=requirementDetails.get(id)||{};
  const readiness=[['User story',!!d.user_story],['Pre-condition',!!d.pre_condition],['Business rules / narrative',!!d.narrative],['Process mapping',!!d.process],['Story-level AC',false]];
  $('#requirementDetail').innerHTML=`
    <div class="detail-head"><div><div class="req-id">${esc(r.id)}</div><h2>${esc(r.summary)}</h2></div><div class="detail-actions"><button id="copyJiraBtn" class="secondary-btn">Copy JIRA draft</button><button id="copyLinkBtn" class="secondary-btn">Copy link</button></div></div>
    <div class="chips"><span class="chip">${esc(r.epic)}</span><span class="chip">${esc(r.priority)}</span>${d.type?`<span class="chip">${esc(d.type)}</span>`:''}<span class="chip ${d.status==='Draft'?'warn':''}">${esc(d.status||'Draft')}</span>${d.origin?`<span class="chip">${esc(d.origin)}</span>`:''}</div>
    ${fieldBlock('User Story',d.user_story)}
    ${fieldBlock('Pre-condition',d.pre_condition)}
    ${fieldBlock('Narrative / Source Business Rules',d.narrative)}
    <section class="evidence-block"><h3>Process Mapping</h3><div class="kv-grid"><div><span>Process Flow</span><strong>${esc(d.process||'—')}</strong></div><div><span>Process Box</span><strong>${esc(d.process_box||'—')}</strong></div><div><span>Sub-process</span><strong>${esc(d.sub_process||'—')}</strong></div><div><span>Capability Origin</span><strong>${esc(d.origin||'—')}</strong></div></div></section>
    <section class="evidence-block source-evidence"><h3>Source Evidence</h3><p><strong>Artifact:</strong> Automated Spreading_RTM_WIP.xlsx</p><p><strong>Sheet:</strong> RTM &nbsp; • &nbsp; <strong>Row:</strong> ${esc(d.source_row||r.source_row||'—')}</p><p>The user story, pre-condition, narrative/business rules and process mapping shown above are the normalized content from this RTM row — not merely a pointer to where the information can be found.</p></section>
    <section class="evidence-block"><h3>JIRA Readiness</h3><div class="readiness">${readiness.map(([k,v])=>`<span class="${v?'ready':'not-ready'}">${v?'✓':'○'} ${esc(k)}</span>`).join('')}</div><p class="muted">A JIRA draft can be generated now, but story-level acceptance criteria should remain TBD until normalized/confirmed.</p></section>`;
  $('#copyJiraBtn').onclick=()=>navigator.clipboard.writeText(jiraDraft(r,d)).then(()=>toast('JIRA draft copied'));
  $('#copyLinkBtn').onclick=()=>{const url=location.origin+location.pathname+'#req='+encodeURIComponent(id);navigator.clipboard.writeText(url).then(()=>toast('Requirement link copied'))};
  if(updateHash)history.replaceState(null,'','#req='+encodeURIComponent(id));
  renderRequirements();
}

function toast(msg){let t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.classList.add('show'),10);setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),250)},1800)}

function renderQuality(){$('#qualityList').innerHTML=qualityGates.map(q=>`<div class="quality-card panel"><div class="quality-head"><h3>${q.id} — ${esc(q.criterion)}</h3><span class="chip">${q.priority}</span></div><div class="grid two compact"><div><div class="label-title">Measure / pass threshold</div><p>${esc(q.measure)}</p></div><div><div class="label-title">How to check</div><p>${esc(q.check)}</p></div></div><div class="chips"><span class="chip subtle">Status: ${esc(q.status)}</span><span class="chip subtle">Package-level quality gate</span></div></div>`).join('')}

function renderSources(){
  addOptions($('#sourceCategoryFilter'),[...new Set(sources.map(s=>s.category))]);
  const draw=()=>{const q=$('#sourceSearch').value.trim().toLowerCase(),c=$('#sourceCategoryFilter').value;const list=sources.filter(s=>(!c||s.category===c)&&(!q||[s.id,s.name,s.category,s.status,s.authority,s.notes].join(' ').toLowerCase().includes(q)));$('#sourceCount').textContent=`${list.length} of ${sources.length} source artifacts`;$('#sourceList').innerHTML=list.map(s=>`<article class="source-card panel"><div class="source-top"><span class="req-id">${esc(s.id)}</span><span class="chip">${esc(s.status)}</span></div><h3>${esc(s.name)}</h3><div class="chips"><span class="chip">${esc(s.category)}</span><span class="chip subtle">Authority: ${esc(s.authority)}</span></div><p>${esc(s.notes)}</p></article>`).join('')};
  $('#sourceSearch').addEventListener('input',draw);$('#sourceCategoryFilter').addEventListener('input',draw);draw();
}

function mdInline(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>')}
function mdToHtml(md){let lines=md.replace(/\r/g,'').split('\n');let out='',inCode=false,inUl=false,inOl=false,inTable=false;const closeLists=()=>{if(inUl){out+='</ul>';inUl=false}if(inOl){out+='</ol>';inOl=false}};for(let i=0;i<lines.length;i++){let line=lines[i];if(line.startsWith('```')){closeLists();if(inTable){out+='</tbody></table>';inTable=false}inCode=!inCode;out+=inCode?'<pre><code>':'</code></pre>';continue}if(inCode){out+=esc(line)+'\n';continue}if(/^---\s*$/.test(line)){closeLists();continue}if(/^\|/.test(line)&&/^\|?[- :|]+\|?$/.test(lines[i+1]||'')){closeLists();let heads=line.split('|').filter(Boolean).map(x=>x.trim());out+='<table><thead><tr>'+heads.map(x=>`<th>${mdInline(x)}</th>`).join('')+'</tr></thead><tbody>';inTable=true;i++;continue}if(inTable&&/^\|/.test(line)){let cells=line.split('|').filter(Boolean).map(x=>x.trim());out+='<tr>'+cells.map(x=>`<td>${mdInline(x)}</td>`).join('')+'</tr>';continue}else if(inTable){out+='</tbody></table>';inTable=false}let m=line.match(/^(#{1,4})\s+(.+)/);if(m){closeLists();let n=Math.min(m[1].length,4);out+=`<h${n}>${mdInline(m[2])}</h${n}>`;continue}m=line.match(/^[-*]\s+(.+)/);if(m){if(inOl){out+='</ol>';inOl=false}if(!inUl){out+='<ul>';inUl=true}out+=`<li>${mdInline(m[1])}</li>`;continue}m=line.match(/^\d+\.\s+(.+)/);if(m){if(inUl){out+='</ul>';inUl=false}if(!inOl){out+='<ol>';inOl=true}out+=`<li>${mdInline(m[1])}</li>`;continue}if(/^>\s?/.test(line)){closeLists();out+=`<blockquote>${mdInline(line.replace(/^>\s?/,''))}</blockquote>`;continue}if(!line.trim()){closeLists();continue}closeLists();out+=`<p>${mdInline(line)}</p>`}closeLists();if(inTable)out+='</tbody></table>';return out}

function renderLibrary(){const list=$('#libraryList');list.innerHTML='<input id="librarySearch" class="library-search" type="search" placeholder="Filter documents..."><div id="libraryButtons"></div>';const draw=()=>{const q=$('#librarySearch').value.trim().toLowerCase();$('#libraryButtons').innerHTML=libraryDocs.map((d,i)=>({d,i})).filter(x=>(x.d[0]+' '+x.d[1]).toLowerCase().includes(q)).map(x=>`<button class="library-button" data-i="${x.i}"><strong>${esc(x.d[0])}</strong><span>${esc(x.d[1])}</span></button>`).join('');document.querySelectorAll('.library-button').forEach(b=>b.addEventListener('click',()=>openLibraryDoc(Number(b.dataset.i))))};$('#librarySearch').addEventListener('input',draw);draw()}

async function fetchKnowledge(path){if(knowledgeCache.has(path))return knowledgeCache.get(path);const r=await fetch(RAW_BASE+path+'?v=20260912-5');if(!r.ok)throw new Error('HTTP '+r.status);const text=await r.text();knowledgeCache.set(path,text);return text}
async function openLibraryDoc(i){document.querySelectorAll('.library-button').forEach((b)=>b.classList.toggle('active',Number(b.dataset.i)===i));const d=libraryDocs[i],target=$('#libraryDetail');target.innerHTML=`<div class="loading">Loading ${esc(d[0])}…</div>`;try{const md=d[2]==='__catalog__'?catalogMarkdown:await fetchKnowledge(d[2]);target.innerHTML=mdToHtml(md)}catch(e){target.innerHTML=`<h2>Unable to load document</h2><p>${esc(e.message)}</p>`}}

async function gunzipBase64Text(b64){const bytes=Uint8Array.from(atob(b64.trim()),c=>c.charCodeAt(0));if(!('DecompressionStream' in window))throw new Error('This browser does not support DecompressionStream.');const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));return await new Response(stream).text()}

function parseCatalog(md){
  const parts=md.split(/\n---\n/);for(const part of parts){const h=part.match(/####\s+(EPIC\d+_\d+)\s+—\s+([^\n]+)/);if(!h)continue;const id=h[1];const get=(label)=>{const re=new RegExp(`- \\*\\*${label}:\\*\\*\\s*([^\\n]+)`);return part.match(re)?.[1]?.trim()||''};const section=(start,next)=>{const re=new RegExp(`\\*\\*${start}\\*\\*\\s*\\n([\\s\\S]*?)${next?`\\n\\n\\*\\*${next}\\*\\*`:'$'}`);return (part.match(re)?.[1]||'').replace(/  \n/g,'\n').trim()};const processLine=get('Process');let processName=processLine,box='';const pm=processLine.match(/^(.*?)\s*\/\s*`([^`]+)`\s*$/);if(pm){processName=pm[1].trim();box=pm[2].trim()}const row=Number(part.match(/RTM row\s+(\d+)/)?.[1]||0);requirementDetails.set(id,{title:h[2].trim(),priority:get('Priority'),type:get('Type'),sub_process:get('Sub-process'),status:get('Status'),origin:get('Capability origin \\(source column\\)'),process:processName,process_box:box,source_row:row,user_story:section('User story','Pre-condition'),pre_condition:section('Pre-condition','Narrative / source business rules'),narrative:section('Narrative / source business rules',null)});}
}

function renderGlobalSearch(){
  const input=$('#globalSearchInput'),results=$('#globalSearchResults'),count=$('#globalSearchCount');
  const run=()=>{const q=input.value.trim().toLowerCase();if(!q){count.textContent='Type a keyword to search across the full working knowledge set.';results.innerHTML='';return}const reqHits=requirements.filter(r=>requirementText(r).includes(q)).slice(0,120);const docHits=[...knowledgeCache.entries()].filter(([p,t])=>(p+' '+t).toLowerCase().includes(q)).slice(0,40);count.textContent=`${reqHits.length} requirement matches${docHits.length?` • ${docHits.length} knowledge-document matches`:''}`;results.innerHTML=`${reqHits.length?`<div class="search-group"><h3>Requirements</h3>${reqHits.map(r=>`<button class="search-result req-search-result" data-id="${esc(r.id)}"><strong>${esc(r.id)} — ${esc(r.summary)}</strong><span>${esc(r.epic)} • ${esc(r.priority)}</span><p>${esc((requirementDetails.get(r.id)?.user_story||'').slice(0,240))}</p></button>`).join('')}</div>`:''}${docHits.length?`<div class="search-group"><h3>Knowledge documents</h3>${docHits.map(([p,t])=>`<div class="search-result"><strong>${esc(p)}</strong><p>${esc(snippet(t,q))}</p></div>`).join('')}</div>`:''}${!reqHits.length&&!docHits.length?'<div class="panel empty">No matches found.</div>':''}`;document.querySelectorAll('.req-search-result').forEach(b=>b.onclick=()=>{switchView('requirements');showRequirement(b.dataset.id,true)})};
  input.addEventListener('input',run);run();
}
function snippet(text,q){const low=text.toLowerCase(),i=low.indexOf(q);const s=Math.max(0,i-110),e=Math.min(text.length,i+q.length+220);return (s?'…':'')+text.slice(s,e).replace(/[#*_`|>\n]/g,' ').replace(/\s+/g,' ')+(e<text.length?'…':'')}

async function preloadKnowledge(){await Promise.all(libraryDocs.filter(d=>d[2]!=='__catalog__').map(async d=>{try{await fetchKnowledge(d[2])}catch(e){}}))}

function bindTabs(){document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.view)));document.querySelectorAll('.quick-link').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.go)))}

async function init(){
  bindTabs();renderOverview();renderProcess();renderAI();renderIssues();renderQuality();renderLibrary();renderSources();
  try{
    const [summaryRes,b64Res]=await Promise.all([fetch('data/requirements.json?v=20260912-5'),fetch('data/requirements-catalog.b64?v=20260912-5')]);
    if(!summaryRes.ok)throw new Error('Unable to load requirement index: HTTP '+summaryRes.status);requirements=await summaryRes.json();
    if(b64Res.ok){catalogMarkdown=await gunzipBase64Text(await b64Res.text());parseCatalog(catalogMarkdown)}
    initFilters();renderDashboard();renderRequirements();
    await preloadKnowledge();renderGlobalSearch();
    const m=location.hash.match(/^#req=(.+)$/);if(m){switchView('requirements');showRequirement(decodeURIComponent(m[1]),false)}
  }catch(err){document.querySelector('main').insertAdjacentHTML('afterbegin',`<div class="notice"><strong>Portal data load issue:</strong> ${esc(err.message)}</div>`)}
}

init();