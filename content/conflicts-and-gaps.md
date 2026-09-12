# Conflicts, Gaps, and Open Questions — Bootstrap v0.1

## CONFLICT-001 — BRD story count vs current RTM
**Status:** Open  
**Sources:** SRC-001, SRC-002

The BRD states that the companion backlog contains **70 user stories across 9 epics**. The current WIP RTM contains substantially more rows and reaches the Epic 9 range. The repository must not assume the BRD count is current or that the RTM is approved.

**Question:** Which artifact/version is the current requirement baseline?

---

## OQ-001 — Source-of-truth precedence
**Status:** Open

Several requirement artifacts coexist:
- WIP BRD
- WIP RTM
- two earlier/draft RTMs
- separate acceptance criteria
- confirmed/reference user stories from other initiatives

**Question:** What precedence should apply when wording differs?

A proposed order may be documented later, but it must not be treated as approved until confirmed by the project owner.

---

## OQ-002 — Approval semantics
**Status:** Open

The current source files contain terms such as Draft, WIP, Confirmed, Existing Function, and Not Existing. These terms do not necessarily mean the same thing.

**Question:** What statuses are formally used by KSP for requirement approval and baseline management?

---

## OQ-003 — Template scope and ownership
**Status:** Open

Current materials refer to MMAS, KTBBANK, and SFA. The To-Be process suggests one ingestion may support multiple output templates.

**Questions:**
- Which templates are mandatory for the first release?
- Which system owns the authoritative definition of each template?
- How will template version changes be governed?

---

## OQ-004 — Industry-rule authority
**Status:** Open

There are SET industry/sector references, CIF-to-industry mapping data, and draft spreading guidelines.

**Questions:**
- Which industry classification is authoritative for spreading behavior?
- How are exceptions/overrides handled?
- Which team owns industry-specific spreading rules?

---

## OQ-005 — Data privacy and GitHub retention
**Status:** Open / governance

The ZIP includes customer/CIF mapping and sample/internal audit data. The normalized knowledge repository should represent related business rules and schemas without copying unnecessary customer-level records.

**Question:** What data-classification and retention rules apply to this private GitHub repository?

---

## OQ-006 — Quantitative AI quality thresholds
**Status:** Open

The BRD describes AI quality expectations but states quantitative targets will be set with Model Risk in a later phase.

**Question:** What metrics and thresholds will govern mapping accuracy, extraction accuracy, override rate, confidence, QA effectiveness, and production acceptance?

---

## OQ-007 — Downstream interface contract
**Status:** Open

CreditLens and SFA are visible downstream targets, and SET SCP is a source-side integration reference.

**Question:** What are the approved interface contracts, target payloads, error/retry behavior, reconciliation rules, and ownership for each integration?

---

## OQ-008 — Reuse of external/reference user stories
**Status:** Open

The ZIP includes confirmed user stories for other systems/projects (for example CA Template and CBS customer-segment/owner changes).

**Rule for now:** treat them as contextual/reference evidence only. Do not import their requirements into KSP unless an explicit KSP requirement or dependency links to them.
