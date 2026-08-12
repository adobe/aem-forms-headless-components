# Introduction

This repository provides components for [Headless Adaptive Forms](https://experienceleague.adobe.com/docs/experience-manager-headless-adaptive-forms/using/overview.html?lang=en). You can use these packages with a React or React Native application.

## Versions

Node > 16.X<br/>
NPM > v8.3.1

The steps in this guide are tested against the above versions only. 
If your version is different then please try to upgrade or log an issue to see if that version can be supported.

# Development

## Getting Started

Our recommendation is to use [Node Version Manager](https://github.com/nvm-sh/nvm) so that you can manage multiple
installation of Node/NPM

### Clone the repository

Use `git clone https://github.com/adobe/aem-forms-headless-components` command to clone the repository.

### Bootstrap

Once you have cloned this repository and run the following command at the root directory of this project 

```
npm install
npx lerna bootstrap
```

### Build

```
npx lerna run build
```

### Tests

```
npx lerna run test
```

# Contributing

Please raise an issue and a PR.

---

# Claude Code Skills

This repo ships Claude Code skills for accelerating component development. Requires [Claude Code](https://claude.ai/code).

## `/create-component` — Scaffold a new headless form component

Generates a complete new component for `react-vanilla-components`: component source, test suite, `mappings.ts` registration, and `index.ts` export.

### Prerequisites

- Claude Code installed and running inside this repo
- AEM instance available **or** ability to describe the component (Claude will infer the field shape)
- (Optional but recommended) `aem-core-forms-components` cloned as a sibling directory — Claude reads the HTL template from it for exact BEM class names and markup structure:

```
parent/
├── aem-forms-headless-components/   ← this repo
└── aem-core-forms-components/       ← sibling (optional)
```

If the sibling repo is absent, Claude fetches the HTL from GitHub automatically via `gh` CLI.

### How to invoke

Type in the Claude Code prompt (no arguments required — the skill is interactive):

```
/create-component
```

### What the skill asks for (interactively)

1. **Component name** — PascalCase, e.g. `RatingInput`
2. **model.json item** — paste the field object from your AEM form's `.model.json` endpoint:
   ```
   http://localhost:4502/content/forms/af/<form-name>.model.json
   ```
   Find the `items` array and paste the object for your field. If you have no AEM instance, describe the component and Claude infers the shape.
3. **Special behaviors** — modal, canvas, file upload, display-only, container, or none
4. **Reference component** — closest existing component to use as style reference (or "none")

### What Claude does automatically

- Reads the HTL template from `aem-core-forms-components` (local or GitHub) for exact BEM names
- Runs an af-core state check to confirm which props actually arrive at runtime
- Shows a confirmation summary — you approve before any code is written
- Generates the component, tests, and registration files
- Runs `npm run build` and Jest — fixes errors before reporting done

### What gets generated

| File | Description |
|---|---|
| `packages/react-vanilla-components/src/components/{Name}.tsx` | Component source |
| `packages/react-vanilla-components/__tests__/components/{Name}.test.tsx` | Test suite |
| `packages/react-vanilla-components/src/utils/mappings.ts` | Updated with new fieldType / resource type keys |
| `packages/react-vanilla-components/src/index.ts` | Updated export |
