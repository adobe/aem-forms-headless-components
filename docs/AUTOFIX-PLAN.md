# Autofix: End-to-End Automated Issue → Fix → PR Plan

This document outlines a plan to automate: **picking GitHub issues → having an AI agent understand and fix them → opening a PR with documentation**, with minimal manual steps.

For AI-native context inferred from a reference repo (e.g. experience-success-studio-ui), see **docs/AI-NATIVE-KNOWLEDGE-INFERENCE.md**. Agent briefing: **AGENTS.md**.

---

## 1. High-Level Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Issue selected │ ──► │  Agent runs in   │ ──► │  PR created     │
│  (label/cron/   │     │  CI (branch      │     │  with "Fixes #N" │
│   manual)       │     │  + fix + commit) │     │  + changelog     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

**Steps in code:**

1. **Trigger** – Workflow runs when an issue is labeled (e.g. `autofix`) or on schedule / `workflow_dispatch`.
2. **Select issue** – Use GitHub API to get one open issue (by label or filter).
3. **Create branch** – Branch from `main`/`dev` named e.g. `autofix/issue-<number>-<slug>`.
4. **Run agent** – Checkout branch, pass issue title + body to AI agent (Cursor CLI or alternative), agent edits code and adds docs.
5. **Commit & push** – Commit all changes with a conventional message, push branch (needs write token).
6. **Open PR** – Create PR with body: `Fixes #<number>`, summary of changes, and link to issue.

---

## 2. Trigger Strategies

| Strategy | Trigger | Use case |
|----------|---------|----------|
| **Label** | `issues: types: [labeled]` when label = `autofix` | Maintainers mark issues as “ok for bot to fix” |
| **Schedule** | `schedule: - cron: '0 12 * * 1'` (e.g. weekly) | Pick one issue with `autofix` and process it |
| **Manual** | `workflow_dispatch` with input `issue_number` | On-demand fix for a specific issue |
| **Comment** | `issue_comment: created` when comment is `/autofix` | Contributor requests bot fix on an issue |

**Recommendation:** Start with **label-based** + **workflow_dispatch** (manual issue number). Add schedule/comment later if needed.

---

## 3. Repository Setup

### 3.1 GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `CURSOR_API_KEY` | Cursor CLI / agent API (or use another provider key) |
| `AUTOFIX_GH_TOKEN` | PAT or GitHub App token with `contents: write`, `pull_requests: write`, `issues: read` (to push branch and create PR; avoid using `GITHUB_TOKEN` for cross-workflow push if you add multiple workflows) |

### 3.2 Optional: Issue branch app

- Use [create-issue-branch](https://github.com/robvanderleek/create-issue-branch) in “chatops” mode so commenting `/cib` on an issue creates the branch; then a **separate** workflow can run the agent on that branch and open the PR.  
- Or skip the app and have the autofix workflow **create the branch itself** (simpler, single workflow).

### 3.3 Labels

- **`autofix`** – Issues eligible for the bot. Only these are picked when using label or schedule triggers.
- Optionally: `autofix-skip` to exclude specific issues even if they have `autofix`.

---

## 4. Workflow Design

### 4.1 Single workflow (recommended)

One workflow that:

1. Triggers on: `issues.labeled` (label = `autofix`), `workflow_dispatch` (optional input: `issue_number`), and optionally `schedule`.
2. Resolves **which issue** to process:
   - For `workflow_dispatch`: use input `issue_number`.
   - For `issues.labeled`: use `github.event.issue.number`.
   - For `schedule`: use GitHub API to list open issues with label `autofix`, pick one (e.g. oldest).
3. Creates branch from default branch (e.g. `main`): `autofix/issue-<number>-<slug>`.
4. Checks out that branch (using `AUTOFIX_GH_TOKEN` so it can push later).
5. Builds a **prompt file** with:
   - Issue title
   - Issue body
   - Repo context (e.g. “This is aem-forms-headless-components; use Node 16, Lerna, existing patterns.”)
6. Runs the **agent** (see below) with this prompt.
7. If there are file changes:
   - Commit with message like: `fix: resolve issue #<number> - <title>`.
   - Push branch.
   - Create PR via `gh pr create` (or `peter-evans/create-pull-request`) with:
     - Title: `Fix: <issue title> (fixes #<number>)`
     - Body: `Fixes #<number>` + optional “## Summary” / “## Changes” (from agent or template).
8. Optionally post a comment on the issue: “Autofix PR opened: <link>.”

### 4.2 Two-workflow variant

- **Workflow A (e.g. create-issue-branch):** On `autofix` label or `/cib`, create branch and optionally open a **draft** PR.
- **Workflow B:** Triggered when that branch is pushed (or when draft PR is opened), runs the agent on the branch, commits, pushes; then either update the existing draft PR or create the final PR.

This is more flexible but more moving parts; the single-workflow approach is easier to operate first.

---

## 5. Agent Execution

### 5.1 Cursor CLI

- Install in job: e.g. `curl https://cursor.com/install -fsS | bash` (or use a published action if available).
- Run in **headless** mode with a prompt that includes the issue and instructions, e.g.:
  - “You are fixing a GitHub issue. Repo: aem-forms-headless-components (Lerna, Node 16). Issue title: … Issue body: … Implement the fix. Update or add documentation (e.g. CHANGELOG or inline docs) as needed. Do not run destructive commands.”
- **Caveat:** Some users report `cursor-agent -p` hanging in CI; have a timeout and fallback (e.g. fail the step and notify).

### 5.2 Alternative agents

If Cursor CLI is unstable in CI:

- **Claude Code / Codex / Gemini CLI** – Same idea: install CLI, pass prompt file, run in non-interactive mode.
- **OpenAI/Anthropic API from a script** – A small script (Node/Python) that:
  - Reads the issue and repo context.
  - Calls the API with a “fix this issue” prompt and optional file context.
  - Writes suggested patches to files and applies them (e.g. via `patch` or direct file writes).  
  This gives full control but requires more custom code.

### 5.3 Prompt and context

- Put in the prompt:
  - Issue title and body.
  - Branch name and issue number.
  - Instructions: “Fix the issue in the codebase. Add or update documentation for your changes. Prefer minimal, targeted changes. Follow existing code style and project structure.”
- Optionally: attach relevant file paths (e.g. from issue body or a small “scope” list) so the agent focuses on the right packages (e.g. `packages/*`, `examples/*`).

---

## 6. PR Content and Documentation

- **PR title:** e.g. `Fix: <issue title> (fixes #<number>)`.
- **PR body:**
  - First line: `Fixes #<number>` (so GitHub auto-closes the issue on merge).
  - Section **## Summary** – Short description of the fix (can be agent-generated or from a template).
  - Section **## Changes** – Bullet list of files/behavior changes (agent can fill this from its edits).
- **In-repo docs:** Instruct the agent (in the prompt) to:
  - Update `CHANGELOG.md` or a similar file if the project uses one.
  - Add/update JSDoc or README sections if the fix adds or changes APIs/behavior.

Use a **pull request template** (e.g. `.github/pull_request_template.md`) so every PR (including autofix) gets the same structure; the agent can fill the template placeholders.

---

## 7. Implementation Phases

### Phase 1 – Minimal path (single issue, manual trigger)

- Add workflow: `workflow_dispatch` with input `issue_number`.
- Steps: get issue via `gh issue view`, create branch, checkout with token, build prompt, run Cursor CLI (or one alternative), commit + push, `gh pr create`.
- No schedule, no label trigger yet.
- Validate end-to-end: run once, verify PR and “Fixes #N”.

### Phase 2 – Label and optional schedule

- Add trigger: `issues: types: [labeled]`, filter for label `autofix`.
- Use `github.event.issue.number` when triggered by label.
- Optionally add `schedule` and logic to pick one open `autofix` issue (e.g. oldest by creation date).
- Add `.github/issue-branch.yml` or similar only if you adopt create-issue-branch; otherwise keep branch creation inside the workflow.

### Phase 3 – Robustness and docs

- Add timeouts and retries for the agent step.
- Add a “Summary” / “Changes” section to PR body (from agent output or a small script that parses diff).
- Document in main README or CONTRIBUTING: how to request an autofix (add `autofix` label or run workflow with issue number), and that PRs are automated and should be reviewed.

### Phase 4 – Optional enhancements

- Comment on the issue when the PR is created (with PR link).
- Add `autofix-skip` handling.
- Support comment trigger: e.g. `/autofix` in issue comment runs the workflow for that issue (using `github.event.issue.number`).

---

## 8. File Layout (suggested)

```
.github/
  workflows/
    autofix.yaml              # Main autofix workflow
  pull_request_template.md    # Optional; PR body template
  autofix/
    prompt-template.md        # Template for agent prompt (issue title/body injected)
scripts/                      # Optional
  autofix-build-prompt.js     # Builds prompt from issue + template
  autofix-pr-body.js          # Builds PR body from diff or agent output
docs/
  AUTOFIX-PLAN.md             # This file
```

---

## 9. Security and Safety

- **Token:** Use a PAT or GitHub App token with minimal scope; store in `AUTOFIX_GH_TOKEN`. Prefer a dedicated “bot” user or app.
- **Branch protection:** Consider requiring one review for `autofix/*` branches so autofix PRs are never merged without human review.
- **Agent:** Instruct the agent not to run arbitrary shell commands (e.g. only suggest file edits). Run agent in a sandboxed job; avoid passing secrets in the prompt.
- **Rate limits:** If using schedule, process one issue per run to avoid API and provider rate limits.

---

## 10. Success Criteria

- An issue (with `autofix` or chosen via `workflow_dispatch`) is processed without manual steps after trigger.
- A branch is created, agent applies a fix and documentation updates, and a PR is opened that:
  - Contains “Fixes #<number>”.
  - Includes a short summary and list of changes.
- Existing CI (e.g. `checks.yaml`) runs on the autofix PR; merge only after CI passes and (optional) review.

---

## 11. Next Steps

1. Create `.github/workflows/autofix.yaml` with Phase 1 (manual dispatch + single-issue flow).
2. Add `AUTOFIX_GH_TOKEN` and `CURSOR_API_KEY` (or chosen provider) in repo secrets.
3. Add `.github/autofix/prompt-template.md` and wire it into the workflow.
4. Test with a real or test issue; iterate on prompt and agent stability.
5. Add label/schedule triggers (Phase 2) and then PR/issue documentation (Phase 3).

Once Phase 1 is working, the rest can be added incrementally without changing the core flow.
