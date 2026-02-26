# Autofix Quick Start Guide

Get the end-to-end automated issue → fix → PR experience in 5 minutes.

---

## Prerequisites

1. **Push the autofix branch to GitHub** (you're on `autofix-agent` branch)
2. **Add secrets** to your GitHub repo (Settings → Secrets and variables → Actions)

## Step 1: Add GitHub Secrets

Go to your repo on GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Option A: Azure OpenAI (recommended for Adobe)

| Secret Name | Value | Required |
|-------------|-------|----------|
| `AZURE_OPENAI_API_KEY` | Your Azure OpenAI API key | **Yes** |
| `AZURE_OPENAI_ENDPOINT` | Your Azure endpoint (e.g., `https://your-resource.openai.azure.com`) | **Yes** |
| `AZURE_OPENAI_DEPLOYMENT` | Your deployment name (e.g., `gpt-4o` or `gpt-4-turbo`) | **Yes** |

### Option B: Anthropic Claude

| Secret Name | Value | Required |
|-------------|-------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/) | **Yes** |

### Optional

| Secret Name | Value | Required |
|-------------|-------|----------|
| `AUTOFIX_GH_TOKEN` | A GitHub PAT with `repo` scope (for better cross-workflow compatibility) | No |

## Step 2: Push Your Changes

```bash
cd /Users/armaang/aem-forms-headless-components

# Check status
git status

# Add all autofix files
git add -A

# Commit
git commit -m "feat: add autofix workflow for automated issue fixing"

# Push to your branch
git push -u origin autofix-agent
```

## Step 3: Create a Test Issue

1. Go to your repo on GitHub → **Issues** → **New issue**
2. Create a simple issue, for example:
   - **Title:** `Add a greeting utility function`
   - **Body:**
     ```
     Add a simple utility function in `packages/react-vanilla-components/src/utils/greeting.ts` that exports a function `getGreeting(name: string): string` which returns "Hello, {name}!".
     
     Also add a basic test for it.
     ```
3. Note the issue number (e.g., `#42`)

## Step 4: Run the Autofix Workflow

### Option A: Manual trigger (recommended for testing)

1. Go to your repo on GitHub → **Actions** → **Autofix** (in left sidebar)
2. Click **Run workflow** (top right)
3. Enter the issue number (e.g., `42`)
4. Click **Run workflow**

### Option B: Label trigger

1. Add the label `autofix` to your issue
2. The workflow will start automatically

## Step 5: Watch It Work

1. Go to **Actions** tab and click on the running workflow
2. Watch the steps:
   - ✅ Resolve issue number
   - ✅ Fetch issue details  
   - ✅ Checkout and create branch
   - ✅ Build agent prompt
   - ✅ Run autofix agent (Claude API call)
   - ✅ Commit and push
   - ✅ Create Pull Request

3. When complete, you'll see a new PR in the **Pull requests** tab with:
   - Title: `Fix: <issue title> (fixes #<number>)`
   - Body: `Fixes #<number>` + summary
   - Linked to your issue

## Step 6: Review and Merge

1. Review the PR diff
2. CI (checks.yaml) will run build/test
3. If it looks good, merge it
4. The issue will auto-close (because of `Fixes #N` in PR body)

---

## Troubleshooting

### "ANTHROPIC_API_KEY environment variable is required"
→ Add the `ANTHROPIC_API_KEY` secret in GitHub (Step 1)

### "API error 401"
→ Your Anthropic API key is invalid. Get a new one from [console.anthropic.com](https://console.anthropic.com/)

### "No file edits found in response"
→ The agent didn't produce code. Check the workflow logs for the full response. Try a more specific issue description.

### Workflow doesn't trigger on label
→ Make sure the label is exactly `autofix` (case-sensitive)

### Push/PR creation fails with permission error
→ Add `AUTOFIX_GH_TOKEN` secret with a PAT that has `repo` scope

---

## Local Testing (Optional)

You can test the agent script locally before running in CI:

```bash
cd /Users/armaang/aem-forms-headless-components

# Create a test prompt
mkdir -p .github/autofix
cat > .github/autofix/current-prompt.md << 'EOF'
Issue number: 1
Issue title: Add greeting utility

Issue body:
Add a simple utility function in packages/react-vanilla-components/src/utils/greeting.ts
that exports a function getGreeting(name: string): string which returns "Hello, {name}!".
EOF

# Run the agent (requires ANTHROPIC_API_KEY)
export ANTHROPIC_API_KEY="your-key-here"
node scripts/autofix-agent.js

# Check what files were created/modified
git status
```

---

## What's Next?

- **Tune the agent prompt:** Edit `.github/autofix/prompt-template.md` for better results
- **Add more context:** The agent reads `AGENTS.md` automatically; improve it for better fixes
- **Enable schedule:** Uncomment the `schedule` trigger in `.github/workflows/autofix.yaml` to auto-process `autofix` issues weekly
- **Add comment trigger:** See `docs/AUTOFIX-PLAN.md` Phase 4 for `/autofix` comment support
