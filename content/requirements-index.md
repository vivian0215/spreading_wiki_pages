---
id: KSP-REQ-INDEX
type: requirements-index
status: Draft
sources: [SRC-001, SRC-002, SRC-006, SRC-007]
---

# Requirements Index

The current WIP RTM organizes requirements into 9 epics. Until an approved baseline is identified, source RTM IDs should be preserved rather than renumbered.

## Epic structure

1. **Epic 1 — Submission & Intake**  
   Submission, file intake, ingestion entry points, and related controls.
2. **Epic 2 — Reading, Mapping & Spreading**  
   Reading statements, language handling, account interpretation, mapping, template population, spreading rules, calculations, and related AI behavior.
3. **Epic 3 — Quality Assurance**  
   Automated checks, validation, reconciliation, guideline conformance, exception handling, and quality findings.
4. **Epic 4 — Review, Correction & Approval**  
   Human review, correction/override, rationale capture, approval, and review workflow.
5. **Epic 5 — Downstream Delivery & Integration**  
   Delivery of approved spreads to target/legacy systems, integration status, and reconciliation/interlock behavior.
6. **Epic 6 — Reporting & Audit**  
   Operational, accuracy, correction-rate, version-comparison, workload/rework, and audit-oriented reporting.
7. **Epic 7 — Administration, Monitoring & Configuration**  
   Notifications, SLA/aging, template/guideline/rounding/validation/reconciliation configuration, RBAC, workflow routing, workload assignment, glossary/dictionary, confidence thresholds, and tool error handling.
8. **Epic 8 — Data Management**  
   Spread-version history, version stamping, source/document storage, archive, and retrieval.
9. **Epic 9 — AI Governance & Responsible AI**  
   Source-grounded values, justification/guideline references, independent QA before human review, monitoring, and protection against document content being treated as executable instructions.

## Requirement classification used by the WIP RTM
- `R` Report
- `I` Integration
- `C` Conversion
- `E` Extension
- `F` Form
- `W` Workflow
- `AI` AI use case
- `NFR` Non-functional requirement

## Priority convention in the WIP RTM
- `0-Critical` — external/regulatory/mandatory control obligation.
- `1-High` — essential to the tool's primary job or a key operating control.
- `2-Medium` — meaningful efficiency/quality/usability/oversight enhancement.
- `3-Low` — convenience/cosmetic improvement.

## Important status note
The BRD states “70 user stories across 9 epics,” while the current WIP RTM extends beyond 70 rows and reaches the Epic 9 range. This is logged as a baseline conflict and must not be silently resolved.

## Normalization strategy
For the next migration pass, each RTM row should be converted into an AI-readable Markdown record while preserving:
- RTM ID
- Epic
- Type
- Priority
- Sub-process
- Summary
- User story
- Pre-condition
- Business rules / narrative
- Process mapping
- Source status
- Existing/new capability indicator
- Source artifact reference

The original wording should be retained where it is necessary for delivery traceability, while analysis/derived notes should be kept in a separate clearly labeled section.
