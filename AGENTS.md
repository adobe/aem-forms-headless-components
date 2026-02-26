# Agent briefing: aem-forms-headless-components

Canonical context for AI agents (Cursor, Claude, Copilot, CI autofix). Keep this file under 150 lines.

## Repo overview

- **What:** Headless Adaptive Forms components for React and React Native ([docs](https://experienceleague.adobe.com/docs/experience-manager-headless-adaptive-forms/using/overview.html)).
- **Layout:** Lerna monorepo — `packages/*` (libraries), `examples/*` (apps). Root has no app code.
- **Versions:** Node > 16, npm > 8.3.1. Prefer [nvm](https://github.com/nvm-sh/nvm).

## Build and test (always run from repo root)

```bash
npm install
npx lerna bootstrap
npx lerna run build
npx lerna run test
```

- **Build** must pass before committing. **Tests** must pass before merging.
- Do not run destructive or non-deterministic commands. Prefer minimal, targeted edits.

## Code and conventions

- **Reuse over creation:** Follow existing patterns in `packages/` and `examples/`. Do not duplicate patterns or add one-off solutions.
- **Style:** Match surrounding code (TypeScript/React in packages and examples). No new style guides unless the repo adopts one.
- **APIs:** Preserve existing public APIs; prefer backward-compatible changes.

## Commits and PRs

- **Commits:** Prefer [conventional commits](https://www.conventionalcommits.org/) (e.g. `fix: …`, `feat: …`, `docs: …`).
- **PRs:** One logical change per PR. Description should state what and why; link issues with `Fixes #N` where applicable.
- **Docs:** When changing behavior or APIs, update relevant docs (README, JSDoc, CHANGELOG if present).

## Autofix (automated issue → PR)

- **Design:** See **docs/AUTOFIX-PLAN.md**. Workflow: pick issue → branch → agent fixes → commit → open PR. PR is the diff; CI + review are the approval gate.
- **Trigger:** Label issue with `autofix`, or run workflow manually with issue number. Secrets: `AUTOFIX_GH_TOKEN`, `CURSOR_API_KEY` (or agent key).
- **Agent prompt:** `.github/autofix/` (prompt template, README). When fixing an issue, use the same conventions as above (build/test, reuse, docs).

## AI-native alignment

- **Inference doc:** **docs/AI-NATIVE-KNOWLEDGE-INFERENCE.md** explains practices inferred from an AI-native reference repo and how they are applied here (AGENTS.md, rules, autofix).
- **Workflow:** Plan (prompt/issue) → Build (edits) → Diff (branch/PR) → QA (CI) → Approval (review/merge) → Docs (in PR and repo).
