#!/usr/bin/env node
/**
 * Autofix agent script: reads an issue prompt and applies fixes using AI API.
 * 
 * Supports:
 *   - Azure OpenAI (set AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT)
 *   - Anthropic Claude (set ANTHROPIC_API_KEY)
 * 
 * Usage: 
 *   AZURE_OPENAI_API_KEY=... AZURE_OPENAI_ENDPOINT=... AZURE_OPENAI_DEPLOYMENT=... node scripts/autofix-agent.js
 *   or
 *   ANTHROPIC_API_KEY=... node scripts/autofix-agent.js
 * 
 * Expects:
 *   - .github/autofix/current-prompt.md (built by the workflow)
 * 
 * Outputs:
 *   - File edits applied directly to the repo
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const PROMPT_FILE = '.github/autofix/current-prompt.md';

// Azure OpenAI config
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT; // e.g., https://your-resource.openai.azure.com
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT; // e.g., gpt-4o
const AZURE_API_VERSION = process.env.AZURE_API_VERSION || '2024-02-15-preview';

// Anthropic config
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.AUTOFIX_MODEL || 'claude-sonnet-4-20250514';

// Determine which provider to use
const USE_AZURE = !!(AZURE_OPENAI_API_KEY && AZURE_OPENAI_ENDPOINT && AZURE_OPENAI_DEPLOYMENT);
const USE_ANTHROPIC = !!ANTHROPIC_API_KEY;

if (!USE_AZURE && !USE_ANTHROPIC) {
  console.error('Error: Set either Azure OpenAI env vars (AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT) or ANTHROPIC_API_KEY');
  process.exit(1);
}

console.log(`Provider: ${USE_AZURE ? 'Azure OpenAI' : 'Anthropic Claude'}`);

if (!fs.existsSync(PROMPT_FILE)) {
  console.error(`Error: Prompt file not found: ${PROMPT_FILE}`);
  process.exit(1);
}

const issuePrompt = fs.readFileSync(PROMPT_FILE, 'utf8');

// Build context: list key files in packages and examples
function getRepoContext() {
  const context = [];
  
  // Read AGENTS.md if exists
  if (fs.existsSync('AGENTS.md')) {
    context.push('=== AGENTS.md ===\n' + fs.readFileSync('AGENTS.md', 'utf8'));
  }
  
  // List packages
  if (fs.existsSync('packages')) {
    const packages = fs.readdirSync('packages');
    context.push('=== packages/ ===\n' + packages.join('\n'));
  }
  
  // List examples
  if (fs.existsSync('examples')) {
    const examples = fs.readdirSync('examples');
    context.push('=== examples/ ===\n' + examples.join('\n'));
  }
  
  return context.join('\n\n');
}

const repoContext = getRepoContext();

const systemPrompt = `You are an expert developer fixing issues in a GitHub repository.

IMPORTANT RULES:
1. Output ONLY file edits in the exact format below. No explanations outside the format.
2. For each file you want to create or edit, use this exact format:

<<<FILE: path/to/file.ext>>>
entire file contents here
<<<END_FILE>>>

3. You can output multiple files.
4. If you need to read a file first, assume standard patterns from the AGENTS.md and repo structure provided.
5. Make minimal, targeted changes. Follow existing patterns.
6. Update documentation (README, JSDoc, CHANGELOG) if you change behavior.

REPO CONTEXT:
${repoContext}
`;

const userPrompt = `Fix the following issue. Output only the file edits in the specified format.

${issuePrompt}`;

function callAzureOpenAI(system, user) {
  return new Promise((resolve, reject) => {
    const url = new URL(AZURE_OPENAI_ENDPOINT);
    const apiPath = `/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;
    
    const data = JSON.stringify({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_tokens: 8192,
      temperature: 0.2
    });

    const options = {
      hostname: url.hostname,
      port: 443,
      path: apiPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Azure API error ${res.statusCode}: ${body}`));
          return;
        }
        try {
          const json = JSON.parse(body);
          const text = json.choices?.[0]?.message?.content || '';
          resolve(text);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function callAnthropic(system, user) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 8192,
      system: system,
      messages: [{ role: 'user', content: user }]
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Anthropic API error ${res.statusCode}: ${body}`));
          return;
        }
        try {
          const json = JSON.parse(body);
          const text = json.content?.[0]?.text || '';
          resolve(text);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function callAI(system, user) {
  if (USE_AZURE) {
    return callAzureOpenAI(system, user);
  } else {
    return callAnthropic(system, user);
  }
}

function parseAndApplyEdits(response) {
  const fileRegex = /<<<FILE:\s*(.+?)>>>([\s\S]*?)<<<END_FILE>>>/g;
  let match;
  let filesWritten = 0;

  while ((match = fileRegex.exec(response)) !== null) {
    const filePath = match[1].trim();
    let content = match[2];
    
    // Remove leading/trailing newline from content
    if (content.startsWith('\n')) content = content.slice(1);
    if (content.endsWith('\n\n')) content = content.slice(0, -1);

    // Create directory if needed
    const dir = path.dirname(filePath);
    if (dir && dir !== '.' && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
    console.log(`Wrote: ${filePath}`);
    filesWritten++;
  }

  return filesWritten;
}

async function main() {
  console.log('Autofix agent starting...');
  console.log(`Model: ${MODEL}`);
  console.log(`Prompt file: ${PROMPT_FILE}`);
  console.log('');

  try {
    console.log('Calling AI API...');
    const response = await callAI(systemPrompt, userPrompt);
    
    console.log('\n--- Agent response ---');
    console.log(response.slice(0, 500) + (response.length > 500 ? '...' : ''));
    console.log('--- End response preview ---\n');

    const filesWritten = parseAndApplyEdits(response);
    
    if (filesWritten === 0) {
      console.log('No file edits found in response. The agent may not have produced changes.');
      console.log('Full response:');
      console.log(response);
      process.exit(1);
    }

    console.log(`\nAutofix complete. ${filesWritten} file(s) written.`);
  } catch (err) {
    console.error('Autofix agent error:', err.message);
    process.exit(1);
  }
}

main();
