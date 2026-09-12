---
id: KSP-AI-CAPABILITIES
type: capability-summary
status: Draft
sources: [SRC-001, SRC-002, SRC-003, SRC-008, SRC-011]
---

# AI Capabilities — Current Business View

## 1. Document understanding
- Accept PDF, Excel, scanned-image statements.
- Detect Thai, English, or mixed-language content.
- Read statement structure and account context rather than relying on labels alone.
- Preserve original source text alongside translations where translation is used.

## 2. Translation
- Translate Thai financial-statement content to English where required by the target process.
- Treat English source content as first-class input.
- Preserve source-language evidence for traceability.

## 3. Financial mapping and spreading
- Map source accounts to applicable target-template fields.
- Support more than one financial template from one ingestion.
- Apply spreading guideline rules, sign conventions, aggregation/split logic, and required calculations.
- Adapt treatment based on industry/context where applicable.
- Never invent a figure that is not grounded in source evidence.

## 4. Automated quality assurance
- Run an independent validation step separate from initial mapping/spreading.
- Check arithmetic and reconciliation.
- Check guideline conformance.
- Perform reasonableness/benchmark checks where an approved benchmark exists.
- Explain findings in plain language.
- Surface disagreement/uncertainty to the analyst instead of hiding it.

## 5. Confidence and exception handling
- Express confidence at an appropriate level (for example per mapped value where specified).
- Escalate low-confidence or unmapped items rather than guessing.
- Allow human review and correction.

## 6. Versioning and reproducibility
- Retain versions created by processing, correction, and re-processing.
- Stamp relevant model, guideline, and template versions.
- Preserve enough lineage to reproduce/explain an output.

## 7. Governed learning
- Capture analyst corrections and rationale.
- Do not automatically treat every correction as training truth.
- Curate/approve feedback before using it to improve production models/rules.

## 8. Responsible-AI controls represented in the WIP RTM
- Every output value must be source-grounded.
- AI/spreading-tool adjustments should carry justification and/or guideline references where required.
- Independent QA must occur before human review for relevant flow stages.
- Uploaded document content must be treated as source information, not as trusted instructions to the AI/tool.
- Monitor quality/override/confidence patterns where governance requires it.

## Human accountability
The analyst remains responsible for final review and approval. The AI capability is decision support for spreading, not credit decisioning/scoring/rating.
