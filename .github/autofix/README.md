# Autofix workflow

This directory supports the **Autofix** GitHub Action that turns an issue into a branch, runs an AI agent to fix it, and opens a PR.

- **Plan:** See [docs/AUTOFIX-PLAN.md](../../docs/AUTOFIX-PLAN.md) for the full design and implementation phases.
- **Workflow:** [../workflows/autofix.yaml](../workflows/autofix.yaml)

## Implementing the agent step

The workflow currently has a **placeholder** step that exits with an error. To make the flow end-to-end:

1. **Cursor CLI**  
   Install Cursor CLI in the job, then run it in headless mode with the prompt built in `.github/autofix/current-prompt.md`.  
   Example (adjust to actual Cursor CLI usage):
   ```yaml
   - run: curl -fsS https://cursor.com/install | bash
   - run: cursor-agent -p .github/autofix/current-prompt.md
     env:
       CURSOR_API_KEY: ${{ secrets.CURSOR_API_KEY }}
   ```
   Note: Some users report headless mode hanging; add a timeout and consider fallbacks.

2. **API-based script**  
   Write a small script (Node or Python) that:
   - Reads `.github/autofix/current-prompt.md` and optionally relevant files
   - Calls OpenAI/Anthropic API with a “fix this issue” prompt
   - Applies suggested edits (e.g. via patch or direct file writes)  
   Run this script in the workflow instead of the placeholder.

3. **Third-party action**  
   Adapt an action like [erans/autoagent](https://github.com/erans/autoagent) to “fix an issue” rather than “review a PR” (e.g. run on the new branch with a custom prompt that includes the issue body).

## Secrets

- `AUTOFIX_GH_TOKEN` (recommended): PAT or GitHub App token with `contents: write`, `pull_requests: write`, `issues: read` so the workflow can push the branch and create the PR. If unset, the workflow falls back to `GITHUB_TOKEN` (may have limitations for cross-event pushes).
- `CURSOR_API_KEY` (or your agent’s API key): For the agent step.

## Triggering

- **Manual:** Actions → Autofix → Run workflow, then enter an issue number.
- **Label:** Add the `autofix` label to an issue; the workflow runs for that issue.
- **Schedule:** (Optional) Uncomment the `schedule` in the workflow to pick one open `autofix` issue weekly.
