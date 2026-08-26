---
description: Scaffold a complete new headless form component for react-vanilla-components — interactive, reads HTL from aem-core-forms-components for exact BEM markup, runs af-core state check, generates component + tests + mappings registration.
allowed-tools: Read, Edit, Write, Bash
---

## Trigger
Invoked when the user asks to **create a new headless form component** for the `react-vanilla-components` package. This skill is interactive — it gathers information in phases, confirms interpretation before writing code, then generates the component, tests, and registration.

---

## Phase 0 — Gather required information (interactive)

Do NOT write any code until you have completed this phase.

### 0a — Component name

If the user did not provide a component name, ask:
> What is the component name? (PascalCase, e.g. `RatingInput`, `ColorPicker`, `PhoneInput`)

### 0b — Spawn context-gatherer agent

**Do not read any HTL files or fetch any model.json in the main skill.** Delegate all context gathering to the `core-component-context` subagent. It fetches the component's model.json from aemcomponents.dev AND the HTL from core components, returning a compact JSON summary.

Derive `componentFolder` by lowercasing the component name (e.g. `RatingInput` → `ratinginput`).

Spawn:
```
Agent: core-component-context
Prompt: "Fetch all context for component '{componentFolder}' ('{componentName}'). Return compact JSON summary."
```

Wait for the agent to return its JSON output. Store it as `contextJson`. This single object replaces all manual HTL reading and model.json gathering.

**If `contextJson.modelSource === "not-found"`:** ask the user to paste the model.json item for the component. Then set `contextJson.rawModelItem` to what they provide.

**If `contextJson.htlSource === "not-found"`:** BEM names will be inferred — flag this in the Phase 1 confirmation.

### 0c — Special behaviors

Ask the user (can be answered based on `contextJson` if obvious from `hasItems`, `hasEnum`, widget type):

> Does this component have any of the following special behaviors?
> - **Modal / dialog** (opens a popup — like Scribble)
> - **Canvas drawing** (draws on HTML canvas)
> - **File upload** (file picker + upload flow)
> - **External state** (complex `useRef`/`useState` beyond value binding)
> - **Display only** (no user input — like PlainText, Image)
> - **Container** (wraps child fields — like Panel, Accordion)
> - **None** (simple input field)

Skip this question and infer from `contextJson` when:
- `hasItems: true` → Container
- `hasEnum: true` → simple select (None)
- `widgetElement` is `input`/`select`/`textarea` → None

### 0d — Reference component

Look at `packages/react-vanilla-components/src/components/` and pick the closest existing component based on `contextJson.widgetElement`, `contextJson.type`, and `contextJson.hasEnum`. Show the user what you picked and let them override.

---

## Phase 1 — Analyze context (before writing code)

Use `contextJson` returned by the `core-component-context` agent in Phase 0b. All fields are pre-extracted — do not re-read any files.

### 1a — Key fields from contextJson

| contextJson field | What to derive |
|---|---|
| `fieldType` | Primary key in `mappings.ts` |
| `resourceType` | Secondary key in `mappings.ts` |
| `type` + `format` | HTML element and input type (see table below) |
| `hasEnum: true` | Select-type component |
| `hasItems: true` | Container — use `withRuleEnginePanel` |
| `constraints` array | Which constraint props to destructure and wire as HTML attrs |
| `defaultValue` | Check format compatibility with HTML input |
| `bemBlock` | Exact BEM block class for the outer div |
| `dataCmpIs` | Exact `data-cmp-is` value |
| `stateModifiers` | Exact modifier class strings to use (e.g. `--filled`, `--empty`) |
| `widgetElement` | HTML tag for the interactive element |
| `widgetInputType` | `type` attribute if widget is `<input>` |
| `extraWrapperDivs` | Wrapper div class suffixes to reproduce around widget |

### 1b — `type` + `format` → HTML element (fallback when contextJson.widgetElement is null)

| `type` | `format` | HTML element / `type` attr |
|---|---|---|
| `string` | _(none)_ | `<input type="text">` |
| `string` | `date` | `<input type="date">` |
| `string` | `date-time` | `<input type="datetime-local">` |
| `string` | `time` | `<input type="time">` |
| `string` | `email` | `<input type="email">` |
| `string` | `uri` | `<input type="url">` |
| `string` | `tel` | `<input type="tel">` |
| `number` / `integer` | _(any)_ | `<input type="number">` |
| `boolean` | _(any)_ | `<input type="checkbox">` |
| `hasEnum: true` | _(any)_ | `<select>` |
| multiline | _(any)_ | `<textarea>` |

### 1c — Naming

Use `contextJson.bemBlock` and `contextJson.dataCmpIs` directly — they are read from the authoritative HTL. If `htlSource: "not-found"`, infer:
- BEM block = `cmp-adaptiveform-{lowercasename}`
- `data-cmp-is` = `adaptiveForm{PascalName}`

Flag inferred values clearly in the confirmation block.

### 1d — Show analysis and confirm

Before writing any code, output a confirmation block like this:

```
Component: RatingInput
File: src/components/RatingInput.tsx
fieldType: "rating-input"
":type": "core/fd/components/form/ratinginput/v1/ratinginput"
HTML element: <input type="number">
BEM block: cmp-adaptiveform-ratinginput
data-cmp-is: adaptiveFormRatingInput
Extra wrappers: none
State modifiers: --filled / --empty
HOC: withRuleEngine
Reference component: NumberField.tsx

Constraints: minimum, maximum
Constraints af-core may clear: none for type=number
Value normalisation needed: no
afs:layout side-channel needed: no

Special behaviors: none

model.json source: aemcomponents.dev  [or: core-components-repo, repo-fixture, not found — user provided]
HTL source: local sibling repo        [or: github, or: not found — inferred]

Does this look right? Any corrections before I proceed?
```

**Wait for user to confirm or correct before proceeding to Phase 2.**

---

## Phase 2 — af-core state check

Run this check to confirm which fields actually reach props at runtime (af-core shapes the state — it is not a raw pass-through of the JSON):

```bash
cd packages/react-vanilla-components
node -e "
const {createFormInstance} = require('@aemforms/af-core');
const form = createFormInstance({items:[
  /* paste contextJson.rawModelItem here */
]});
console.log(JSON.stringify(form.items[0].getState(), null, 2));
"
```

### Known af-core state shaping rules

**`minimum` / `maximum`:**
- Preserved in state for `type: 'number'`, `type: 'integer'`, and `type: 'string'` with `format: 'date'`.
- **Cleared from state** for all other `type`+`format` combinations. The validation engine still fires internally, but the component never sees the raw values as props.
- If the component needs these as HTML attributes and they are cleared, use the `afs:layout` side-channel (see below).

**`constraintMessages`:** always present in state as-is. af-core sets `props.errorMessage` when a constraint fires. The component never handles this — `FieldWrapper` renders it.

**`default` value format:** af-core may store the default in a different format than the HTML input requires (e.g. `datetime-local` requires `YYYY-MM-DDTHH:MM` but af-core may surface `YYYY-MM-DD HH:MM:SS`). Always check the actual state value and normalise if needed.

**`properties` object:** passes through to state unchanged. `withRuleEngine` additionally maps `properties['afs:layout']` → `props.layout` as `{[key: string]: any}`.

### `afs:layout` side-channel

When af-core clears a constraint that the component still needs for an HTML attribute, the author duplicates the value into `properties['afs:layout']` under a named key. `withRuleEngine` maps the entire `afs:layout` object to `props.layout`, so it survives af-core processing.

```json
"properties": {
  "afs:layout": {
    "sliderMin": 1,
    "sliderMax": 10
  }
}
```

```tsx
const sliderMin = layout?.sliderMin;
const sliderMax = layout?.sliderMax;
```

Name custom keys clearly (e.g. `sliderMin`, not `min`) to distinguish from standard af-core layout keys.

### After running the state check

Report to the user:
- Which fields are present in state and their actual types/values
- Which fields from the constructed schema are absent from state
- Whether value normalisation is needed
- Whether any constraints need the `afs:layout` side-channel

**If the state check output contradicts the schema analysis, update Phase 1 confirmation before generating code.**

---

## Phase 3 — Generate the component file

File: `packages/react-vanilla-components/src/components/{ComponentName}.tsx`

Use the **exact** BEM block, `data-cmp-is`, wrapper div structure, and state modifier classes extracted from the HTL in Phase 0d. Do not invent or guess these — they must match the core components markup so that the existing core component CSS applies correctly to the headless output.

### License header (always include)

```tsx
// *******************************************************************************
//  * Copyright 2026 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  *
//  * BEM markup follows AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components
//  ******************************************************************************
```

### Base template (simple input field)

```tsx
import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const {ComponentName} = (props: PROPS) => {
  const {
    id,
    value,
    label,
    required,
    readOnly = false,
    placeholder,
    enabled,
    visible,
    name,
    appliedCssClassNames,
    valid,
    layout,
    // add constraint props confirmed by state check:
    // minimum, maximum, minLength, maxLength, pattern, etc.
    // for runtime-only fields not in PROPS typings: const x = (props as any).fieldName;
  } = props;

  // Normalise value if the HTML input format differs from af-core's stored format.
  const finalValue = value === undefined ? '' : value;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchChange(e.target.value);
  }, [props.dispatchChange]);

  // dispatchBlur: call with e.target.value for text-like inputs that re-submit on blur.
  // Call with no argument for date, number, select, checkbox, file inputs.
  const handleBlur = useCallback(() => {
    props.dispatchBlur();
  }, [props.dispatchBlur]);

  const handleFocus = useCallback(() => {
    props.dispatchFocus();
  }, [props.dispatchFocus]);

  return (
    <div
      className={`{bemBlock} {bemBlock}--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="{dataCmpIs}"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='{bemBlock}'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <input
          type="{htmlInputType}"
          id={`${id}-widget`}
          className='{bemBlock}__widget'
          title={props.tooltipText || ''}
          value={finalValue}
          name={name}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          disabled={!enabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={label?.value}
          aria-invalid={!valid}
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
          // constraint HTML attributes confirmed by state check:
          // min / max / minLength / maxLength / step / pattern / accept / multiple
        />
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine({ComponentName});
```

### Adaptation rules by category

**Text inputs** (`type="text/email/url/tel/password"`):
- `dispatchBlur(event.target.value)` — text inputs re-submit value on blur
- Destructure `minLength`, `maxLength`, `pattern` from `props`

**Numeric inputs** (`type="number"`):
- `minimum` and `maximum` typed as `number` in `PROPS` — destructure directly
- Map to `min` / `max` HTML attributes
- Include `step` if present in state

**Date inputs** (`type="date"`):
- `minimum` / `maximum` surfaced as strings for `format: 'date'`
- Map to `min` / `max` HTML attributes

**datetime-local** (`type="datetime-local"`):
- af-core stores value with space separator and seconds (`YYYY-MM-DD HH:MM:SS`)
- datetime-local input requires `YYYY-MM-DDTHH:MM` — write normalisation helper
- `minimum` / `maximum` may be cleared by af-core — use `afs:layout` side-channel or verify via state check

**Select / options** (with `enum`/`enumNames`):
- Render `<select>` with `<option>` per enum value
- Use `isMultiSelect` from props for conditional `multiple` attribute
- Multi-select: `Array.from(event.target.selectedOptions, o => o.value)`

**Checkbox / Switch** (`type="checkbox"`):
- `value` is boolean — dispatch `event.target.checked`
- State class modifier: `--checked` / `--unchecked` (not `--filled` / `--empty`)

**Textarea** (`<textarea>`):
- Map `minLength`, `maxLength`, `rows`, `cols` from state
- `dispatchChange(event.target.value)`

**Container components** (Sling Model has `getItems()`):
- Import and use `withRuleEnginePanel` instead of `withRuleEngine`
- Accept `PROPS_PANEL` type instead of `PROPS`
- Render children via the AEM renderer — use `Panel.tsx` or `Accordion/Accordion.tsx` as reference

**Display-only components** (no user input — e.g. PlainText, Image):
- Omit all event handlers and `FieldWrapper`
- Render only relevant markup from props directly

**Complex input with modal / canvas** (e.g. Scribble):
- Use `useRef`, `useState` for internal state beyond value binding
- Keep the modal markup inside the same component file
- Use `dispatchChange(dataUrl)` or similar when user confirms the input
- Reference `Scribble.tsx` as the pattern

---

## Phase 4 — Register in `mappings.ts`

File: `packages/react-vanilla-components/src/utils/mappings.ts`

Add import (alphabetical order):
```ts
import {ComponentName} from '../components/{ComponentName}';
```

Add entries in the `mappings` object:
```ts
'{fieldType}': {ComponentName},
// Resource type string from Sling Model @Model resourceType:
'core/fd/components/form/{componentfolder}/v1/{componentfolder}': {ComponentName},
```

Keep simple `fieldType` keys grouped; resource-type strings grouped — match existing file structure.

---

## Phase 5 — Export from `src/index.ts`

File: `packages/react-vanilla-components/src/index.ts`

Add import (alphabetical order):
```ts
import {ComponentName} from './components/{ComponentName}';
```

Add to the `export { ... }` block:
```ts
{ComponentName},
```

---

## Phase 6 — Generate the test file

File: `packages/react-vanilla-components/__tests__/components/{ComponentName}.test.tsx`

### Core testing rules

**1. Input method by type**

| Input type | Method | Reason |
|---|---|---|
| `text`, `email`, `tel`, `url`, `password` | `userEvent.type(input, value)` | JSDOM simulates keystrokes |
| `date`, `datetime-local`, `time`, `number`, `range` | `fireEvent.change(input, { target: { value } })` | Native picker events not simulated in JSDOM |
| `checkbox` | `userEvent.click(input)` | Toggles checked state |
| `select` | `fireEvent.change(select, { target: { value } })` | Most reliable for select |

**2. Label/input linking**
`FieldWrapper` sets `label.for = input.id = "${id}-widget"`. Assert directly:
```tsx
expect(input.getAttribute('id')).toEqual(label.getAttribute('for'));
// Do NOT manually append '-widget' to label.for — it is already the full id
```

**3. Finding inputs without placeholder**
```tsx
const input = renderResponse.container.querySelector('input[type="text"]') as HTMLInputElement;
```

**4. Constraint attributes**
Only test constraints confirmed by state check. For constraints read from `props.layout`, pass them under `properties['afs:layout']` in the test field object.

**5. Value normalisation**
If the component normalises the value, write a dedicated test: pass the raw af-core format, assert the HTML input shows the normalised form.

**6. `fullField` — use the canonical schema constructed from code**
`fullField` is the minimal field object constructed in Phase 0e Step 5, not a user-pasted form-specific JSON. This keeps tests stable across different AEM form instances.

### Test template

```tsx
/*
 * Copyright 2026 Adobe, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import {ComponentName} from '../../src/components/{ComponentName}';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';
import '@testing-library/jest-dom/extend-expect';

// Minimal field — only properties needed to render
const field = {
  name: '{fieldName}',
  label: { value: '{Human Readable Label}', visible: true },
  fieldType: '{fieldType}',
  type: '{type}',
  // format: '{format}',  // include if present in schema
  visible: true,
  required: true,
  enabled: true,
  readOnly: false,
};

// Full field — canonical schema derived from Sling Model + HTL.
// Stable across form instances — not a user-pasted model.json snippet.
const fullField = {
  fieldType: '{fieldType}',
  ':type': 'core/fd/components/form/{componentfolder}/v1/{componentfolder}',
  name: '{fieldName}',
  label: { value: '{Human Readable Label}', visible: true },
  type: '{type}',
  // format: '{format}',
  visible: true,
  required: false,
  enabled: true,
  readOnly: false,
  constraintMessages: {},
  // include only constraints confirmed by Sling Model getters + state check:
  // minimum: ..., maximum: ..., minLength: ..., maxLength: ..., pattern: ...
};

const helper = renderComponent({ComponentName});

describe('{ComponentName}', () => {

  test('value changed by user is set in model', async () => {
    const { renderResponse, element } = await helper(field);
    const input = renderResponse.container.querySelector('input[type="{htmlInputType}"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '{sampleValue}' } });
    expect(element.getState().value).toEqual('{sampleValue}');
  });

  test('it should handle visible property', async () => {
    const { renderResponse } = await helper({ ...field, visible: false });
    expect(renderResponse.queryByText(field.label.value)).toBeNull();
  });

  test('error message element exists when the field is invalid', async () => {
    const { renderResponse } = await helper({ ...field, valid: false, errorMessage: DEFAULT_ERROR_MESSAGE });
    expect(renderResponse.queryByText(DEFAULT_ERROR_MESSAGE)).not.toBeNull();
  });

  test('labels and inputs are linked with for and id attribute', async () => {
    const { renderResponse } = await helper(field);
    const input = renderResponse.container.querySelector('input[type="{htmlInputType}"]') as HTMLInputElement;
    const label = renderResponse.queryByText(field.label.value);
    expect(input?.getAttribute('id')).toEqual(label?.getAttribute('for'));
  });

  test('disabled attribute is set when enabled is false', async () => {
    const { renderResponse } = await helper({ ...field, enabled: false });
    const input = renderResponse.container.querySelector('input[type="{htmlInputType}"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  test('tooltip and description toggle correctly', async () => {
    const f = {
      ...field,
      tooltip: 'Short Description',
      description: 'Long Description',
      properties: { 'afs:layout': { tooltipVisible: true } },
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText('Short Description')).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName('{bemBlock}__questionmark');
    userEvent.click(button[0]);
    expect(renderResponse.getByText('Long Description')).not.toBeNull();
  });

  test('aria-describedby contains long and short description ids when both are present', async () => {
    const f = {
      ...field,
      id: '{fieldName}-123',
      tooltip: 'short desc',
      description: 'long desc',
      properties: { 'afs:layout': { tooltipVisible: true } },
    };
    const { renderResponse } = await helper(f);
    const widget = renderResponse.container.querySelector('input[type="{htmlInputType}"]') as HTMLInputElement;
    expect(widget).toHaveAttribute('aria-describedby', `${f.id}__longdescription ${f.id}__shortdescription`);
  });

  test('html in the label should be rendered for rich text', async () => {
    const f = {
      ...field,
      label: { value: '<strong>{Human Readable Label}</strong>', richText: true, visible: true },
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.container.innerHTML).toContain('<strong>{Human Readable Label}</strong>');
  });

  // Add constraint-specific tests based on state check results:
  // - min/max: helper({ ...field, minimum: X, maximum: Y }) → expect(input).toHaveAttribute('min', String(X))
  // - minLength/maxLength: type a long string, assert model value is capped
  // - pattern: expect(input).toHaveAttribute('pattern', '...')
  // - Value normalisation: pass raw af-core value, assert input.value shows normalised form
  // - afs:layout side-channel: pass properties['afs:layout'] key, assert HTML attribute is set

  test('full canonical schema field renders without errors', async () => {
    const { renderResponse } = await helper(fullField);
    expect(renderResponse.container.querySelector('input[type="{htmlInputType}"]')).not.toBeNull();
    expect(renderResponse.queryByText('{Human Readable Label}')).not.toBeNull();
  });
});
```

---

## Phase 7 — Verify

Run **from inside the package directory**:

```bash
cd packages/react-vanilla-components
npm run build
npx jest __tests__/components/{ComponentName}.test.tsx --no-coverage
```

Fix all errors before reporting done. Common failures and their causes:

| Symptom | Cause | Fix |
|---|---|---|
| `Property 'X' does not exist on type 'PROPS'` | Runtime state field not in TS typings | `(props as any).X` |
| `value` is `undefined` after `userEvent.type` | Input type doesn't accept keystroke simulation in JSDOM | Switch to `fireEvent.change` |
| Label/input ID mismatch with double `-widget` | Assertion manually appended `-widget` to `label.for` | Assert `input.id === label.for` directly — `label.for` already is the full id |
| `Missing semicolon` on `as Type` cast | Jest ran from repo root — Babel config without TS support | Always `cd packages/react-vanilla-components` first |
| Constraint is `undefined` in props | af-core cleared it from state | Run state check; use `afs:layout` if HTML attribute is needed |
| HTML input shows wrong value format | af-core stores value in different format | Add normalisation helper; confirm expected format via state check |

---

## Phase 8 — Iterative validation loop

After Phase 7 build + tests pass, spawn the `component-validator` agent. This is a feedback loop — iterate until all checks pass or 3 attempts are exhausted.

```
build + tests pass
  → spawn component-validator (iteration 1)
  → read validation report
  → if any FAILs:
      apply fixes from report to TSX (and tests if needed)
      re-run: cd packages/react-vanilla-components && npm run build && npx jest ...
      spawn component-validator again (iteration 2), passing previous output
      ... repeat up to 3 total iterations
  → exit when all 15 checks pass OR 3 iterations done
  → if still failing after 3: report remaining issues to user with full context
```

Spawn prompt:
```
Validate {ComponentName}.
TSX: packages/react-vanilla-components/src/components/{ComponentName}.tsx
Test: packages/react-vanilla-components/__tests__/components/{ComponentName}.test.tsx
fieldType: {contextJson.fieldType}
resourceType: {contextJson.resourceType}
contextJson: {paste contextJson JSON}
previousValidationOutput: {output from prior iteration, or "none"}
iteration: {1|2|3}
```

The validator uses `previousValidationOutput` to acknowledge fixes ("FIXED"), flag regressions ("NEW FAIL"), and confirm remaining issues ("STILL FAIL"). Apply each FAIL's exact fix instruction before re-running.

---

## Checklist before finishing

- [ ] `core-component-context` agent spawned in Phase 0b — no raw HTL read by main skill
- [ ] `contextJson.modelSource` not "not-found" — or user provided model.json as fallback
- [ ] af-core state check run using `contextJson.rawModelItem` — props match actual state
- [ ] BEM block and `data-cmp-is` from `contextJson` (HTL-authoritative), or flagged as inferred
- [ ] Outer `<div>` has all five `data-cmp-*` attributes
- [ ] Widget element has `id="${id}-widget"`, `aria-label`, `aria-invalid`, `aria-describedby`
- [ ] `FieldWrapper` receives `bemBlock`, `label`, `id`, `tooltip`, `description`, `isError`, `errorMessage`
- [ ] Typed constraint props destructured from `props`; runtime-only ones via `(props as any).X` or `props.layout.X`
- [ ] `dispatchBlur` called correctly — with value for text-like inputs, without for others
- [ ] Default export is `withRuleEngine({ComponentName})` (or `withRuleEnginePanel` for containers)
- [ ] `mappings.ts` has entries for `fieldType` and `resourceType`
- [ ] `src/index.ts` imports and re-exports the component
- [ ] Value normalisation applied if state check showed format mismatch
- [ ] Test uses correct input method per input type
- [ ] `fullField` in tests is `contextJson.rawModelItem` (the real aemcomponents.dev item)
- [ ] `npm run build` clean — run from inside package dir
- [ ] All Jest tests pass — run from inside package dir
- [ ] `component-validator` agent reports all 15 checks PASS
