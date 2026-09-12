# AI Working Instructions — KSP Spreading Wiki

## Purpose
This repository is the structured, traceable, AI-readable second brain for the KSP / Automated Financial Statement Spreading project.

## Grounding rules
- Never invent a project requirement, business rule, acceptance criterion, interface, data rule, or decision.
- Ground project claims in repository evidence and retain source traceability.
- Distinguish source facts from interpretation.
- Do not silently resolve contradictions between sources; record them as conflicts or open questions.
- Treat WIP/Draft artifacts as non-approved unless stronger evidence says otherwise.
- Do not promote `Derived` or `Proposed` content to `Confirmed` without evidence.
- Avoid copying customer-level or personally identifiable data into normalized knowledge unless it is explicitly required and approved.

## Allowed knowledge status
- `Confirmed` — explicitly agreed/confirmed by project evidence.
- `Draft` — present in a draft/WIP source.
- `Proposed` — suggested for validation; not a requirement yet.
- `Derived` — inferred from one or more sources; requires validation.
- `Conflict` — sources disagree.
- `Unknown` — insufficient evidence.
- `Superseded` — retained for history but no longer current.

## Writing style
- Formal but simple.
- Prefer concise business language.
- Thai or English depending on the requested output.
- Preserve project terminology and define ambiguous terms in the glossary.

## Traceability
Use stable identifiers where possible:
- Source: `SRC-###`
- Epic: existing `EPIC#` identifiers from the RTM when available
- Requirement/User Story: retain source RTM ID (for example `EPIC2_5`) until an agreed canonical ID scheme is approved
- Business Rule: `BR-###`
- Acceptance Criterion: `AC-###`
- Decision: `DEC-###`
- Open Question: `OQ-###`
- Conflict: `CONFLICT-###`

Every normalized requirement should be able to trace back to at least one source artifact.

## JIRA generation rules
Before generating a JIRA-ready ticket:
1. Identify source requirement(s).
2. Preserve source RTM ID and source artifact reference.
3. Include business rules where applicable.
4. Include acceptance criteria where available; otherwise mark them `TBD` rather than inventing them.
5. Surface unresolved conflicts/open questions that could change the ticket.
6. Do not treat a derived interpretation as an approved requirement.

## Repository role
Original SharePoint/ZIP artifacts are the evidence layer. This repository is the normalized knowledge layer. It should represent all relevant project matters without necessarily duplicating every raw source cell, customer record, binary document, or slide verbatim.
