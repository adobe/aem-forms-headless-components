# AI-Native Knowledge Inference (from experience-success-studio-ui)

This document captures **inferred practices** from the reference repo [OneAdobe/experience-success-studio-ui](https://github.com/OneAdobe/experience-success-studio-ui), described as Adobe’s “first AI native” repo. Because that repository is not publicly readable, inferences are drawn from:

- Public **AI-native repository** best practices (AGENTS.md, Cursor rules, MCP, memory-bank patterns)
- Adobe’s public AI/GenStudio projects (e.g. [GenStudio Extensibility SDK](https://github.com/adobe/genstudio-uix-sdk), [AEM GenAI Assistant](https://github.com/adobe/aem-genai-assistant))
- Standard agent workflows: PLAN → BUILD → DIFF → QA → APPROVAL → APPLY → DOCS

These inferences are applied in this repo (aem-forms-headless-components) to support both **human-in-the-loop** and **automated** (e.g. autofix) agent workflows.

---

## 1. Inferred “First AI Native” Traits

| Trait | Inference | Application here |
|-------|-----------|------------------|
| **Single source of truth for agents** | A canonical **AGENTS.md** (or equivalent) that describes build, test, architecture, and how agents should behave. | Added **AGENTS.md** at repo root with build/test, structure, and autofix reference. |
| **Explicit workflow states** | Agents follow a clear flow (e.g. plan → build → diff → QA → approval → apply → docs) so changes are reviewable before apply. | Autofix workflow creates a **branch + PR** (diff) and relies on **CI + human review** as the approval gate; see **docs/AUTOFIX-PLAN.md**. |
| **Structured context, not ad-hoc prompts** | Context is provided via rules, prompts, or a “memory bank” so agents don’t rely only on one-off prompts. | **.cursor/rules/** for project and autofix; **.github/autofix/prompt-template.md** for CI agent. |
| **Reuse over creation** | Prefer existing patterns and dependencies; avoid duplicate or one-off solutions. | AGENTS.md and rules stress “follow existing patterns” and point to packages/examples. |
| **Approval before apply** | No direct apply to main without a reviewable artifact (PR) and passing checks. | Autofix opens a PR; merge only after CI (and optional review). |
| **Docs as part of the change** | Every change is expected to update docs (changelog, JSDoc, README) where relevant. | Autofix prompt and PR template ask for Summary + Changes; AGENTS.md asks agents to update docs. |

---

## 2. Standard AI-Native Patterns Used Here

### 2.1 AGENTS.md

- **Purpose:** One briefing document for any AI agent (Cursor, Claude, Copilot, CI autofix) working in the repo.
- **Content:** Build/test commands, repo layout, code conventions, PR/commit guidelines, pointer to autofix.
- **Placement:** Repo root. Kept under ~150 lines for better agent consumption.

References: [AGENTS.md format](https://agentsmd.online/), [Agentic Coding Context Best Practices](https://claude.ai/public/artifacts/92dae41f-f5ed-49b3-b18c-4d9d9bc0f205).

### 2.2 Cursor rules (`.cursor/rules/`)

- **Purpose:** Persistent, project-specific guidance (standards, file patterns) so the editor agent behaves consistently.
- **Format:** `.mdc` files with frontmatter (`description`, `globs`, `alwaysApply`).
- **Use:** At least one “always apply” rule for project/contributing context; optional file-specific rules (e.g. TypeScript, React).

### 2.3 Autofix as “agent in CI”

- The **autofix workflow** is the CI incarnation of the same workflow: **issue → plan (prompt) → build (agent edit) → diff (branch + PR) → QA (existing checks.yaml) → approval (review/merge)**.
- Prompt and branch naming are structured so the agent gets issue context and repo context (see **.github/autofix/**).

### 2.4 Memory bank (optional)

- Some AI-native repos use a **memory-bank/** (e.g. `projectbrief.md`, `decisions.md`, `systemPatterns.md`) for cross-session context.
- For this repo, **docs/** (AUTOFIX-PLAN.md, this file) and **AGENTS.md** serve that role; a full memory-bank can be added later if needed.

---

## 3. What We Added to This Repo (Concrete)

| Asset | Purpose |
|-------|---------|
| **AGENTS.md** | Canonical agent briefing: build, test, structure, conventions, autofix. |
| **.cursor/rules/** | Cursor rules for project-wide and (optional) autofix/contributing context. |
| **.github/autofix/** | Prompt template, README, and workflow wiring for issue → fix → PR. |
| **docs/AUTOFIX-PLAN.md** | Full design for automated issue → PR. |
| **docs/AI-NATIVE-KNOWLEDGE-INFERENCE.md** | This document: what we inferred and how we applied it. |

---

## 4. How to Align Further with experience-success-studio-ui

If you get access to **OneAdobe/experience-success-studio-ui**, compare and adopt:

1. **Exact AGENTS.md / docs structure** – Mirror section names and workflow states if they use a standard.
2. **Memory bank layout** – If they use `memory-bank/` with `projectbrief.md`, `decisions.md`, etc., consider adding the same here.
3. **MCP usage** – If they configure MCP servers (e.g. GitHub, DB, APIs), add the same or similar in `.cursor/mcp.json` or docs.
4. **Branch/PR conventions** – Match branch naming, PR template, and “Fixes #N” style if different.
5. **Approval gates** – If they use labels or checks for “agent-approved” or “human-approved”, replicate in branch protection or status checks.

You can then update this inference doc with “Confirmed from experience-success-studio-ui: …” and refine AGENTS.md and rules accordingly.
