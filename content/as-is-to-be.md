---
id: KSP-PROCESS-001
type: process-summary
status: Draft
sources: [SRC-001, SRC-003]
---

# Financial Statement Spreading — As-Is and To-Be

## As-Is summary
Current materials show two broad operating patterns.

### Listed-company path
1. Obtain financial statements from SET.
2. Prepare/compile statements, including file conversion/preparation steps.
3. Upload to QUIQSpread, with RPA used in parts of the flow.
4. QUIQSpread performs automated spreading for supported cases/templates.
5. Moody's QA reviews/adjusts the spread based on guidelines.
6. RM/analyst reviews and adjusts.
7. Finalized spread is imported to CreditLens.
8. SFA is only partially covered for some existing flows and may require manual mapping.

### Non-listed / exception path
- Source financials may be received directly from clients.
- Thai statements and KTBBANK-template needs have limitations in the current QUIQSpread flow.
- Manual preparation and/or direct entry into CreditLens may be required.

## Key As-Is limitations recorded in project materials
- QUIQSpread support is centered on MMAS and does not cover all required KTBBANK use cases.
- Thai financial statements are not fully supported in the current automated path.
- Current automated input expects a constrained file pattern (for example a single prepared PDF in relevant flows).
- File-preparation/RPA output can require manual correction when incomplete or inaccurate.
- SFA mapping is incomplete/manual in existing paths.
- Reconciliation is required between downstream results.

## To-Be summary
1. Obtain financial statements from SET and/or client-provided sources.
2. Upload or ingest supported source files into the AI Spreading Tool.
3. Read PDF, Excel, and scanned-image formats; support Thai and English content.
4. Produce spreads for applicable templates, including MMAS, KTBBANK, and SFA concepts present in the current design materials.
5. Apply spreading guidelines and rounding/normalization rules.
6. Execute an independent automated QA / LLM-as-Judge style validation step.
7. RM/analyst reviews grouping, accuracy, exceptions, and proposed adjustments.
8. Analyst approves/finalizes the spread.
9. Load approved results into CreditLens and SFA as applicable.
10. Perform CreditLens/SFA reconciliation or interlock control.

## Business-control principle
The To-Be process remains human-in-the-loop. Automated spreading and QA support the analyst; they do not replace analyst approval.

## Traceability implications
The target process requires lineage from each final value back to its source statement, together with versions, corrections, approvals, and target-system delivery outcomes.
