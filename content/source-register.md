# Source Register — Bootstrap v0.1

This register inventories the source files found in the uploaded ZIP baseline. `Authority` is intentionally conservative until the project owner confirms source-of-truth precedence.

| Source ID | Source artifact | Category | Working status | Authority | Notes |
|---|---|---|---|---|---|
| SRC-001 | `Automated Spreading_BRD_WIP.docx` | Business requirement / narrative BRD | Draft/WIP | Unknown | Defines objectives, scope, journey, AI capabilities, assumptions, constraints, dependencies, success criteria. |
| SRC-002 | `Automated Spreading_RTM_WIP.xlsx` | Requirement backlog / RTM | Draft/WIP | Unknown | Contains 9 epics and detailed requirement rows, priorities, user stories, preconditions, business rules, status/source fields. |
| SRC-003 | `Automated Spreading As-Is & To-Be Process flow.pptx` | Process / journey | Draft/working deck | Unknown | Contains relevant spreading process slides plus unrelated legacy/template slides; only relevant spreading content should be normalized. |
| SRC-004 | `ISAC FS Spreading_ v0.2.pptx` | Architecture / project context | Draft/versioned | Unknown | Technical/project direction source for the spreading initiative. |
| SRC-005 | `Acceptance_Criteria_1.xlsx` | Acceptance criteria | Working | Unknown | Acceptance criteria artifact requiring traceability back to requirements. |
| SRC-006 | `Draft_Requirements Traceability Matrix_V0.1.xlsx` | Historical/draft RTM | Draft | Likely historical/reference | Includes RTM, Additional, AI Capabilities, AI Quality Expectations, Legend. |
| SRC-007 | `Draft_Requirements Traceab - Copy.xlsx` | Historical/draft RTM copy | Draft/copy | Likely historical/reference | Appears structurally similar to SRC-006; requires comparison before deciding whether it is duplicate or divergent. |
| SRC-008 | `Darft_SFA_Spreading_Guideline_Corporate_Generic_V0.1.xlsx` | Spreading guideline | Draft | Unknown | Corporate generic SFA spreading knowledge, including account-level descriptions/considerations and mappings. |
| SRC-009 | `SET industry sector.xlsx` | Industry reference | Reference | Unknown | Industry/sector reference used for classification/mapping. |
| SRC-010 | `CIF mapping to SET industry.xlsx` | Client/industry mapping | Supporting data | Sensitive; authority unknown | Contains client master/mapping data. Avoid reproducing customer-level rows in the wiki unless explicitly approved. |
| SRC-011 | `Audit_Opinion_Types_TH_EN.xlsx` | Audit opinion reference | Reference | Unknown | Thai/English audit opinion terminology and classification reference. |
| SRC-012 | `Sample_audit log.xlsx` | Audit/log sample | Sample/reference | Sample | Demonstrates expected audit/change information; avoid copying person-specific rows unnecessarily. |
| SRC-013 | `MIS_MN_(SCP)_Download Service API_TH_Specification_V1.1 (1).pdf` | External/system API specification | Technical reference | External specification | SET SCP Download Service API: login/token and document download flow. Sensitive credentials/tokens from examples must never be treated as secrets to reuse. |
| SRC-014 | `PSIMS-Equity-FormatFile_v4_7-20240813 (1).xlsx` | SET/market data file specification | Technical reference | External/reference | Large multi-sheet format specification including financial statement and industry/sector related structures. |
| SRC-015 | `KTB_DWH_ER_Diagram.pdf` | Data warehouse ER diagram | Technical reference | Unknown | Internal data model reference; should be summarized without unnecessarily reproducing sensitive internal details. |
| SRC-016 | `[Confirmed] User Story _ Enhance to Aligned with New CA Template 1.pdf` | Confirmed external/reference user story | Confirmed for its own project | Reference only for KSP | Evidence of existing/new CA template behavior. Do not assume every rule is automatically a KSP requirement. |
| SRC-017 | `User Story SR No. 108050_SR2025_108806_0001 ... .pdf` | Existing CBS/customer-segment change user story | Reference | Confirmed for its own project | Relevant to customer segment/ownership/portfolio data context; not automatically a KSP requirement. |

## Source-handling principles
- Original files remain the evidence layer.
- Normalize relevant knowledge into Markdown/CSV/YAML while preserving `SRC-###` traceability.
- Do not copy confidential/customer-level data merely to make the repository “complete”; represent the matter, schema, rule, or dependency instead.
- Historical draft files are retained in the register even when superseded, because they may explain requirement evolution.
- The project owner must confirm which artifacts constitute the authoritative baseline before statuses are promoted to `Confirmed`.
