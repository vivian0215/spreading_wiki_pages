# KSP Spreading Wiki

Private knowledge repository for the KSP / Automated Financial Statement Spreading project.

This repository serves as a structured, traceable, AI-readable project second brain derived from project source documents. Original source artifacts remain the evidence layer; normalized knowledge in this repository must retain source traceability and clearly distinguish confirmed facts, drafts, derived interpretations, conflicts, and open questions.

## Main knowledge areas

- `00_project/` — project context, purpose and scope
- `01_process/` — As-Is / To-Be process knowledge
- `02_requirements/` — epics, requirements and future traceability
- `04_ai/` — AI capabilities and governance
- `09_open-questions/` — conflicts, gaps and unresolved questions
- `_sources/` — source artifact register and evidence references
- `AGENTS.md` — working rules for ChatGPT and other AI agents

## GitHub Pages-ready dashboard

A read-only dashboard is prepared to expose the normalized knowledge as an interactive portal. It includes project-level statistics, a searchable/filterable inventory of all 112 populated rows in the current WIP RTM, source-row traceability, project context, process knowledge, AI capabilities, open questions, and BRD quality-gate navigation.

The dashboard is a consumption layer. It must not become an independent source of truth.

## Working model

```text
Project source files
      ↓ extraction / normalization
Repository knowledge layer
      ├── Human-readable project wiki
      ├── ChatGPT grounding / second brain
      ├── GitHub Pages dashboard
      └── Future JIRA / testing / project tools
```

> Publishing this portal on public GitHub Pages means all content copied to the Pages repository is publicly accessible. Do not publish secrets, credentials, customer-level data, or unnecessary personally identifiable data.
