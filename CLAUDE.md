# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Lerna monorepo containing React components for Adobe Experience Manager (AEM) Headless Adaptive Forms. Components render dynamic, JSON-driven forms in headless environments by integrating with `@aemforms/af-core` (form model/business logic) and `@aemforms/af-react-renderer` (rendering engine).

Two packages:
- `packages/react-vanilla-components` — web React components (`@aemforms/af-react-vanilla-components`)
- `packages/react-native-components` — mobile React Native components (`@aemforms/af-react-native`)

## Commands

### Root (all packages)
```bash
npm install
npx lerna bootstrap        # link monorepo packages
npx lerna run build        # build all packages
npx lerna run test         # test all packages
```

### Within a package (e.g. `cd packages/react-vanilla-components`)
```bash
npm run build              # clean → lint → tsc
npm run test               # Jest
npm run test:ci            # Jest with coverage (outputs to target/coverage/)
npm run eslint             # lint + auto-fix TS files
```

### Running a single test
```bash
cd packages/react-vanilla-components
npx jest __tests__/components/Button.test.tsx
npx jest --testNamePattern="should render with label"
```

## Architecture

### Component Pattern

Every field component follows the same structure:

1. A functional React component receives props typed as `PROPS` (from `src/utils/type.tsx`)
2. It is wrapped with `withRuleEngine()` HOC (`src/utils/withRuleEngine.tsx`) before export
3. `withRuleEngine` wires the component to `useRuleEngine` and `useFormIntl` from `@aemforms/af-react-renderer`, handling state sync, validation, and localization automatically
4. Components dispatch form events via `dispatchChange()`, `dispatchBlur()`, `dispatchFocus()` (provided through props by the HOC)

### Layout / Field Wrapper

Field components compose `FieldWrapper` → `Label` + `Description` + widget + error message. This keeps accessibility attributes (`aria-invalid`, `aria-describedby`) and error rendering consistent. Container components (Panel, Accordion, Wizard, Tabs) follow a similar composition but nest child components via the renderer.

### Component Registration

`src/utils/mappings.ts` maps AEM form field type strings to React components (e.g. `'text-input' → TextField`). The renderer uses this map to instantiate components from a form JSON definition.

### CSS Conventions

BEM naming under the `cmp-adaptiveform-` prefix (e.g. `cmp-adaptiveform-textinput__widget`). Spectrum CSS is mocked in tests via `__mocks__`.

### TypeScript

Strict mode. All components and utilities are typed. Output compiled to `lib/` (CommonJS + `.d.ts` declarations).

### Testing Utilities

`__tests__/utils/index.tsx` provides:
- `renderComponent()` — renders a component inside `FormContext` + `IntlProvider`
- `createForm()` — builds a `FormModel` from field JSON for integration-style tests

## Key Dependencies

| Package | Role |
|---|---|
| `@aemforms/af-core` | Form model, state machine, validation rules |
| `@aemforms/af-react-renderer` | `useRuleEngine` hook, `FormContext`, component renderer |
| `@aemforms/af-formatters` | Date/number display formatting |
| `react-intl` | i18n / translation IDs |
| `sanitize-html` | Rich text XSS prevention |

## CI/CD

- PRs to `main`/`dev` → `.github/workflows/checks.yaml` (build + test on Node 16)
- Merges to `main` → `.github/workflows/publish.yaml` (Lerna patch version bump, npm publish, pushes version tag)

## Claude Code Skills

### `/create-component`

Scaffolds a complete new headless form component for `react-vanilla-components`. Invoke with:

```
/create-component

I want to add a RatingInput component. Here is the CRISP JSON:
{ ... }
```

Context gathering (model.json + HTL markup) is delegated to the `core-component-context` subagent (`.claude/agents/core-component-context.md`), which falls back through aemcomponents.dev → the `aem-core-forms-components` repo → local test fixtures. After codegen, build, and tests pass, the `component-validator` subagent (`.claude/agents/component-validator.md`) runs a 15-check structural/markup review against the generated files and the skill applies fixes iteratively (up to 3 passes).

The skill generates:
- `src/components/{ComponentName}.tsx` — component following BEM + `withRuleEngine` patterns
- `__tests__/components/{ComponentName}.test.tsx` — test suite covering value binding, visibility, errors, a11y
- Updates `src/utils/mappings.ts` to register the field type / resource type
- Updates `src/index.ts` to export the component

If you do not have a CRISP JSON, describe the component's properties and the skill will infer a reasonable implementation.
