---
id: KSP-PROJECT-OVERVIEW
type: project-overview
status: Draft
baseline: v0.1
sources: [SRC-001, SRC-002, SRC-003, SRC-004]
---

# KSP / Automated Financial Statement Spreading — Project Overview

## Working definition
KSP is an AI-assisted financial spreading initiative intended to let users submit borrower financial statements once, read and translate the content when required, map the information to one or more bank financial templates according to spreading guidelines and industry context, perform automated quality checks, allow human review/correction/approval, and deliver the approved spread to downstream systems with full traceability.

## Business problem
The current spreading process contains significant manual work and relies on QUIQSpread for part of the flow. Key limitations documented in project materials include format/language constraints, incomplete support for required templates, manual preparation and review effort, inconsistent mapping risk, and downstream re-entry/reconciliation effort.

## Target principles
- **Single entry:** submit a borrower’s statements once and reuse the processed information across required templates and target systems.
- **Human-in-the-loop:** AI proposes and checks; an analyst remains the final decision-maker before downstream delivery.
- **Guideline-based spreading:** mapping must follow bank spreading rules, including industry-specific treatment where applicable.
- **No invention:** every spread value must be grounded in the source documents.
- **Bilingual support:** Thai, English, and mixed-language financial statements are in scope.
- **Independent QA:** quality checking is a distinct step from initial spreading/mapping.
- **Versioned and auditable:** inputs, spread versions, corrections, model/template/guideline versions, and outputs must be traceable.
- **Governed learning:** analyst corrections may support improvement only under governance.

## High-level target flow
1. Obtain financial statements from supported sources (for example SET or client-provided files).
2. Ingest PDF, Excel, and scanned-image inputs.
3. Read/extract statement content and translate Thai content where needed.
4. Map source accounts to applicable financial templates (including MMAS, KTBBANK, and SFA concepts present in the current materials).
5. Calculate/normalize values and apply spreading rules.
6. Run automated QA / independent validation with explanations and exception flags.
7. Analyst reviews, corrects/overrides where appropriate, and approves.
8. Deliver approved output to downstream systems such as CreditLens and SFA.
9. Retain source-to-output lineage, versions, corrections, audit data, and delivery status.

## In scope (current BRD baseline)
- Single-entry submission.
- PDF, Excel, scanned statements.
- Thai / English / mixed-language understanding.
- Translation where needed.
- Mapping to one or more templates.
- Industry-adapted spreading rules.
- Ratio calculation and automated QA.
- Analyst review, correction, override, approval.
- Downstream delivery/integration.
- Versioning and storage.
- Correction capture and governed improvement.
- Audit trail, reporting, administration.

## Out of scope (current BRD baseline)
- Credit decisioning, scoring, or rating.
- Full legal/contractual translation beyond financial-statement content.
- Replacing downstream credit/core systems.
- Auditing/opining on the accuracy of borrower statements.
- Approval or downstream delivery without analyst sign-off.

## Main stakeholder groups
- Credit / Risk sponsor
- Credit Analysts / RMs
- Team Leads / CCOE-related operational roles
- Business Analysis
- IT / AI delivery team
- Model Risk / Validation
- Compliance / DPO / InfoSec
- Internal Audit
- Owners of downstream/legacy systems

## Current repository status
This file is a normalized project summary built from WIP/draft project artifacts. It is not itself an approval record. Where project sources disagree, see `09_open-questions/conflicts-and-gaps.md`.
