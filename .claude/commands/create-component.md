---
description: Scaffold a complete new headless form component for react-vanilla-components — interactive, reads HTL from aem-core-forms-components for exact BEM markup, runs af-core state check, generates component + tests + mappings registration.
allowed-tools: Read, Edit, Write, Bash
---

# Skill: create-component

## Trigger
Invoked when the user asks to **create a new headless form component** for the `react-vanilla-components` package. This skill is interactive — it gathers information in phases, confirms interpretation before writing code, then generates the component, tests, and registration.

---

## Phase 0 — Gather required information (interactive)

Do NOT write any code until you have completed this phase.

### 0a — Component name

If the user did not provide a component name, ask:
> What is the component name? (PascalCase, e.g. `RatingInput`, `ColorPicker`, `PhoneInput`)

### 0b — model.json item

Ask the user to paste the **model.json item** for the component. Explain what this is if they look unsure:

> The model.json is the JSON output AEM Core Components returns when you render a form and call the form's `.model.json` endpoint (e.g. `http://localhost:4502/content/forms/af/<form-name>.model.json`).
>
> From the response, find the `items` array and paste the single **object that represents this field**. It will look like:
> ```json
> {
>   "id": "telephoneinput-abc123",
>   "fieldType": "text-input",
>   ":type": "core/fd/components/form/telephoneinput/v1/telephoneinput",
>   "name": "telephoneInput1",
>   "label": { "value": "Phone Number", "visible": true },
>   "type": "string",
>   "visible": true,
>   "required": false,
>   "enabled": true,
>   "readOnly": false,
>   "constraintMessages": {},
>   "properties": {
>     "afs:layout": { "tooltipVisible": false },
>     "fd:path": "/content/forms/af/myform/jcr:content/guideContainer/telephoneinput"
>   }
> }
> ```
>
> If you don't have access to an AEM instance, describe the component's intended behavior and known properties and I'll infer the field shape.

**If the user provides a model.json item:** proceed to Phase 1.
**If the user describes the component instead:** construct a best-guess field object, show it to the user, and ask them to confirm or correct it before proceeding.

### 0c — Special behaviors

After receiving the model.json, ask:

> Does this component have any of the following special behaviors? (answer all that apply)
> - **Modal / dialog** (opens a popup for input — like Scribble's canvas dialog)
> - **Canvas drawing** (draws on an HTML canvas)
> - **Rich options list** (custom option rendering beyond a plain `<select>`)
> - **File upload** (file picker + upload flow)
> - **External state** (uses `useRef`, `useState` beyond simple value binding)
> - **Display only** (renders data, no user input)
> - **Container** (wraps other fields — like Panel, Accordion)
> - **None of the above** (simple input field — text, number, date, select, checkbox, etc.)

This determines the component template and which HOC (`withRuleEngine` vs `withRuleEnginePanel`) to use.

### 0d — Reference component

Ask:
> Is there an existing component in this repo that is most similar? (e.g. "similar to DateTimeInput", "similar to Scribble", "similar to DropDown")
>
> If unsure, say "none" and I'll pick the closest match automatically.

Look at `packages/react-vanilla-components/src/components/` and pick the closest existing component as a reference for the implementation style.

### 0e — Read core components HTL for ground-truth markup

The HTL template in `aem-core-forms-components` is the authoritative source for BEM class names, `data-cmp-*` attributes, CSS modifier classes, and widget element structure. Read it before writing any code.

Derive the component folder name from the `":type"` resource type path. For example:
- `":type": "core/fd/components/form/telephoneinput/v1/telephoneinput"` → folder `telephoneinput`
- `":type": "core/fd/components/form/ratinginput/v1/ratinginput"` → folder `ratinginput`

If `":type"` is absent, derive from the component name lowercased.

**Step 1 — Check for local sibling repo:**
```bash
ls ../aem-core-forms-components/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/ 2>/dev/null | head -5
```

**Step 2a — If local repo exists, read HTL directly:**
```bash
cat "../aem-core-forms-components/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentfolder}/v1/{componentfolder}/{componentfolder}.html"
```

Also read the CRISP JSON (component dialog / schema definition) if present:
```bash
cat "../aem-core-forms-components/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentfolder}/v1/{componentfolder}/.content.xml" 2>/dev/null
# or look for _cq_dialog or model JSON files in the component folder
ls "../aem-core-forms-components/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentfolder}/"
```

**Step 2b — If local repo does not exist, fetch from GitHub:**
```bash
gh api "repos/adobe/aem-core-forms-components/contents/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentfolder}/v1/{componentfolder}/{componentfolder}.html" \
  --jq '.content' | base64 -d
```

If `gh` is unavailable, fall back to listing the folder to find the right filename:
```bash
gh api "repos/adobe/aem-core-forms-components/contents/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentfolder}/v1/{componentfolder}" \
  --jq '.[].name'
```

**Step 3 — Extract from HTL:**

Read the HTL output and extract:

| HTL element | What to record |
|---|---|
| Root `<div>` class string | Exact BEM block name (e.g. `cmp-adaptiveform-telephoneinput`) |
| `data-cmp-is` value | Exact `data-cmp-is` string (e.g. `adaptiveFormTelephoneInput`) |
| All `data-cmp-*` attributes | Any beyond the standard five — note names and values |
| State modifier classes | `--filled`/`--empty`, `--checked`/`--unchecked`, `--disabled`, custom |
| Widget element | Tag name, nesting depth, wrapper divs, class names |
| Extra wrapper divs | e.g. `__input-wrapper`, `__options-wrapper` present in DateTimeInput |
| CSS custom properties | Any `--cmp-*` CSS variables set inline |

If the HTL file is not found (new/private component), fall back to inferring BEM names from the model.json `fieldType` and component name. State this explicitly in the Phase 1 confirmation.

**Step 4 — Read the existing headless implementation if any:**

Check if a reference headless component for this field type already exists (e.g. a partial or older implementation):
```bash
ls packages/react-vanilla-components/src/components/ | grep -i {componentfolder}
```

---

## Phase 1 — Analyze the model.json (before writing code)

Extract and verify these fields from the model.json item. Show your analysis to the user before proceeding.

### 1a — Key fields to extract

| model.json field | What to derive |
|---|---|
| `fieldType` | Primary key in `mappings.ts` |
| `":type"` | Secondary key in `mappings.ts` (resource type string) — may be absent if custom |
| `type` + `format` | HTML element and input type (see table below) |
| `enum` / `enumNames` | Indicates select-type component |
| `items` present | Container component — use `withRuleEnginePanel` |
| `minimum` / `maximum` | Check type compatibility (see af-core contract) |
| `constraintMessages` | Lists which constraints are active |
| `properties['afs:layout']` | Layout side-channel keys the author already uses |
| `default` | Becomes `props.value` on first render — check format compatibility |

### 1b — `type` + `format` → HTML element

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
| with `enum`/`enumNames` | _(any)_ | `<select>` |
| multiline | _(any)_ | `<textarea>` |

### 1c — Naming derivations

Use values read from the HTL template (Phase 0e) as the authoritative source. Fall back to inference only when HTL was unavailable.

- **BEM block**: read from HTL root `<div>` class — e.g. `cmp-adaptiveform-telephoneinput`
- **`data-cmp-is`**: read from HTL `data-cmp-is` attribute — e.g. `adaptiveFormTelephoneInput`
- **Extra wrapper divs**: any `__input-wrapper` or similar nesting present in HTL must be reproduced in the React component
- **State modifier classes**: use exactly the modifiers from HTL (`--filled`/`--empty`, `--checked`, etc.)
- **File name**: `{ComponentName}.tsx`

If HTL was not available, infer: BEM block = `cmp-adaptiveform-{lowercasename}`, `data-cmp-is` = `adaptiveForm{PascalName}`, and flag this in the confirmation.

### 1d — Show analysis and confirm

Before writing any code, output a confirmation block like this:

```
Component: RatingInput
File: src/components/RatingInput.tsx
fieldType: "rating-input"
":type": "core/fd/components/form/ratinginput/v1/ratinginput"  (or absent)
HTML element: <input type="number">
BEM block: cmp-adaptiveform-ratinginput          ← from HTL (or inferred)
data-cmp-is: adaptiveFormRatingInput             ← from HTL (or inferred)
Extra wrappers: none                             ← or e.g. "__input-wrapper div present"
State modifiers: --filled / --empty              ← from HTL
HOC: withRuleEngine
Reference component: NumberField.tsx

Constraints present: minimum, maximum
Constraints af-core may clear: none for type=number
Value normalisation needed: no
afs:layout side-channel needed: no

Special behaviors: none

HTL source: local sibling repo  (or: GitHub fetch, or: not found — inferred)

Does this look right? Any corrections before I proceed?
```

**Wait for user to confirm or correct before proceeding to Phase 2.**

---

## Phase 2 — af-core state check

Run this check to confirm which fields actually reach props at runtime (af-core shapes the state — it is not a raw copy of model.json):

```bash
cd packages/react-vanilla-components
node -e "
const {createFormInstance} = require('@aemforms/af-core');
const form = createFormInstance({items:[
  /* paste the model.json item here */
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
- Which fields from model.json are absent from state
- Whether value normalisation is needed
- Whether any constraints need the `afs:layout` side-channel

**If the state check output contradicts the model.json analysis, update Phase 1 confirmation before generating code.**

---

## Phase 3 — Generate the component file

File: `packages/react-vanilla-components/src/components/{ComponentName}.tsx`

Use the **exact** BEM block, `data-cmp-is`, wrapper div structure, and state modifier classes extracted from the HTL in Phase 0e. Do not invent or guess these — they must match the core components markup so that the existing core component CSS applies correctly to the headless output.

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

**Container components** (model.json has `items` array):
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
// If model.json has a ":type" resource type string:
'{":type" value}': {ComponentName},
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

**6. Use the model.json item as `fullField`**
Use the exact model.json item provided by the user as the `fullField` object. This is the most realistic test fixture — it mirrors what AEM will actually send.

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
  // format: '{format}',  // include if present in model.json
  visible: true,
  required: true,
  enabled: true,
  readOnly: false,
};

// Full field — exact model.json item as provided by the user.
// This is what AEM will actually send at runtime.
const fullField = {
  // paste model.json item here exactly
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

  test('full model.json field renders without errors', async () => {
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

## Checklist before finishing

- [ ] model.json item analysed and confirmed with user before writing any code
- [ ] af-core state check run — props match actual state, not raw model.json
- [ ] BEM block: `cmp-adaptiveform-{lowercasename}` — `data-cmp-is`: `adaptiveForm{PascalName}`
- [ ] Outer `<div>` has all five `data-cmp-*` attributes
- [ ] Widget element (`input`/`select`/`textarea`/custom) has `id="${id}-widget"`, `aria-label`, `aria-invalid`, `aria-describedby`
- [ ] `FieldWrapper` receives `bemBlock`, `label`, `id`, `tooltip`, `description`, `isError`, `errorMessage`
- [ ] Typed constraint props destructured from `props`; runtime-only ones via `(props as any).X` or `props.layout.X`
- [ ] `dispatchBlur` called correctly — with value for text-like inputs, without for others
- [ ] Default export is `withRuleEngine({ComponentName})` (or `withRuleEnginePanel` for containers), not the bare function
- [ ] `mappings.ts` has entries for `fieldType` and `":type"` resource type (if present in model.json)
- [ ] `src/index.ts` imports and re-exports the component
- [ ] Value normalisation applied if state check showed format mismatch
- [ ] Test uses correct input method per input type
- [ ] Test label/input linking: `input.id === label.for` (no manual `-widget` suffix)
- [ ] `fullField` in tests uses the exact model.json item provided by the user
- [ ] `npm run build` clean — run from inside package dir
- [ ] All Jest tests pass — run from inside package dir
