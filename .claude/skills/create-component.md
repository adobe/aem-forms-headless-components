# Skill: create-component

## Trigger
Use this skill when the user asks to **create a new headless form component** for the `react-vanilla-components` package. They will typically provide a component name and a CRISP JSON (AEM Core Components schema) that describes the component's properties, constraints, and resource type.

If no CRISP JSON is provided, ask for it. If the user does not have one, ask them to describe the component's fields so you can infer the correct mapping.

---

## What this skill produces

1. `packages/react-vanilla-components/src/components/{ComponentName}.tsx` — component source
2. `packages/react-vanilla-components/__tests__/components/{ComponentName}.test.tsx` — test suite
3. `src/utils/mappings.ts` — updated with the new component's field type and resource type keys
4. `src/index.ts` — updated to import and re-export the component

---

## Step 0 — Understand the CRISP JSON before writing any code

Before writing the component, extract and reason about these fields:

| CRISP field | What to derive from it |
|---|---|
| `fieldType` | Primary key in `mappings.ts` |
| `":type"` | Secondary key in `mappings.ts` (resource type string) |
| `type` + `format` | HTML element type (see table below) |
| Constraint fields (`minimum`, `maximum`, `minLength`, etc.) | **Do not assume they reach props** — verify against af-core state (see af-core state contract below) |
| `default` | Becomes `props.value` on first render — check format compatibility with the HTML input |
| `enum` / `enumNames` | Indicates a select-type component |
| `items` present | Container component — use `withRuleEnginePanel` instead of `withRuleEngine` |
| `properties['afs:layout']` | Passed through to `props.layout` by `withRuleEngine` — use as a general-purpose side-channel for data af-core may strip |

### `type` + `format` → HTML element

| `type` | `format` | HTML element / `type` attribute |
|---|---|---|
| `string` | _(none)_ | `<input type="text">` |
| `string` | `date` | `<input type="date">` |
| `string` | `date-time` | `<input type="datetime-local">` |
| `string` | `time` | `<input type="time">` |
| `string` | `email` | `<input type="email">` |
| `string` | `uri` | `<input type="url">` |
| `number` / `integer` | _(any)_ | `<input type="number">` |
| `boolean` | _(any)_ | `<input type="checkbox">` |
| with `enum`/`enumNames` | _(any)_ | `<select>` (add `multiple` if `isMultiSelect`) |
| multiline | _(any)_ | `<textarea>` |

Derive the **BEM block name**: `cmp-adaptiveform-{lowercasecomponentname}` (e.g. `RatingInput` → `cmp-adaptiveform-ratinginput`).

Derive the **`data-cmp-is`** value: `adaptiveForm{PascalCaseComponentName}`.

---

## af-core state contract — what actually reaches props

`withRuleEngine` passes the af-core **state snapshot** to the component as props. The state is not a raw copy of the CRISP JSON — af-core shapes it. **Always verify what is actually in state before using a field from props.**

### How to verify

Run a quick node check before writing the component:

```bash
node -e "
const {createFormInstance} = require('@aemforms/af-core');
const form = createFormInstance({items:[/* paste CRISP JSON item here */]});
console.log(JSON.stringify(form.items[0].getState(), null, 2));
"
```

Read the output and confirm which fields are present and what their values look like. Do this especially for constraint fields and default values.

### Known af-core state shaping rules

**`minimum` / `maximum` in state:**
- af-core only preserves these in state for `type: 'number'`, `type: 'integer'`, and `type: 'string'` with `format: 'date'`.
- For any other `type`+`format` combination, af-core explicitly clears them from state (`Field.js` line ~148). The validation engine still uses them internally and `constraintMessages` still fires, but the component never sees the raw values.
- **Impact:** if you need `min`/`max` HTML attributes for a non-numeric, non-date field, the values will not be in `props`. Use the `afs:layout` side-channel (see below).

**`constraintMessages`:** always present in state as-is. af-core sets `props.errorMessage` automatically when a constraint is violated. The component does not handle constraint messages — `FieldWrapper` renders `props.errorMessage`.

**`default` value format:** the CRISP JSON `default` becomes `props.value` on first render. af-core may store it differently from what the HTML input requires (e.g. a string value may have a different date/time separator or include seconds). Always check the actual value in state and normalise if needed.

**`properties` object:** passes through to state unchanged. `withRuleEngine` additionally maps `properties['afs:layout']` → `props.layout` as `{[key: string]: any}`.

**Props not in the `PROPS` TypeScript type:** some state fields exist at runtime but are absent from the `FieldJson` typings. If you need them, access via `(props as any).fieldName`. Do this only when the state check confirms the field exists.

### `afs:layout` as a general side-channel

When a CRISP JSON constraint is cleared by af-core and you still need its value in the component (e.g. for an HTML attribute), the author can duplicate the value into `properties['afs:layout']` under a custom key. `withRuleEngine` maps the entire `afs:layout` object to `props.layout`, so any custom key placed there survives af-core processing intact.

```json
"properties": {
  "afs:layout": {
    "myConstraintValue": "..."
  }
}
```

```tsx
const myValue = layout?.myConstraintValue;
```

Name the custom key clearly (e.g. `sliderMin`, `sliderMax`) to distinguish it from standard af-core layout keys.

---

## Step 1 — Create the component file

File: `packages/react-vanilla-components/src/components/{ComponentName}.tsx`

### Base template (adapt per component type)

```tsx
// *******************************************************************************
//  * Copyright 2023 Adobe
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
    // destructure additional PROPS-typed fields here (minimum, maximum, minLength, maxLength, pattern, etc.)
    // for runtime-only state fields not in PROPS typings, use: const x = (props as any).fieldName;
  } = props;

  // Normalise value if the HTML input format differs from af-core's stored format.
  // Example: number → ensure it's a string; date-time → replace space separator with T.
  const finalValue = value === undefined ? '' : value;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchChange(e.target.value);
  }, [props.dispatchChange]);

  // dispatchBlur: call with no argument for most field types.
  // Call with the current value (e.target.value) only when the field needs to
  // re-submit its value on blur (e.g. text-input, date-input). Match the pattern
  // of the closest existing similar component.
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
          // add constraint HTML attributes derived from state check:
          // min / max / minLength / maxLength / step / pattern / accept / multiple
        />
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine({ComponentName});
```

### Adaptation rules by component category

**Text inputs** (`<input type="text/email/url/tel/password">`):
- `dispatchBlur(event.target.value)` — text inputs re-submit value on blur.
- Destructure `minLength`, `maxLength`, `pattern` from `props` (all typed in `PROPS`).

**Numeric inputs** (`<input type="number">`):
- `minimum` and `maximum` are typed as `number` in `PROPS` — destructure directly.
- Map to `min` / `max` HTML attributes.
- Include `step` if present.

**Date inputs** (`<input type="date">`):
- `minimum` / `maximum` are surfaced as strings in state for `format: 'date'`.
- Map to `min` / `max` HTML attributes.

**Select / options** (components with `enum`/`enumNames`):
- Render `<select>` with `<option>` per enum value.
- Use `isMultiSelect` (from props, set by `withRuleEngine`) to conditionally add `multiple`.
- `handleChange` dispatches `event.target.value`; for multi-select, collect `Array.from(event.target.selectedOptions, o => o.value)`.

**Checkbox / Switch** (`<input type="checkbox">`):
- `value` is boolean — `handleChange` dispatches `event.target.checked`.
- State class modifier: `--checked` / `--unchecked`, not `--filled` / `--empty`.

**Textarea** (`<textarea>`):
- Map `minLength`, `maxLength`, `rows`, `cols` from state/CRISP JSON.
- `dispatchChange(event.target.value)`.

**Container components** (CRISP JSON has `items`):
- Use `withRuleEnginePanel` instead of `withRuleEngine`.
- Accept `PROPS_PANEL` type.
- Render children via the AEM renderer. Follow `Panel.tsx` or `Accordion/Accordion.tsx` as the pattern.

**Display-only components** (no user input — e.g. `PlainText`, `Image`):
- Omit all handlers and `FieldWrapper`.
- Render only the relevant markup using props directly.

**Constraints cleared by af-core** (verify via state check — see af-core contract above):
- If a constraint the component needs is not in state, read it from `props.layout` using the `afs:layout` side-channel pattern.
- Name the layout key clearly to distinguish it from standard af-core layout keys.

**Value format mismatch** (verify via state check):
- If `props.value` does not match the format required by the HTML input, write a pure normalisation helper function and apply it to `finalValue`.
- Keep the helper small and self-contained next to the component.

---

## Step 2 — Register in `mappings.ts`

File: `packages/react-vanilla-components/src/utils/mappings.ts`

Add an import (maintain alphabetical order):
```ts
import {ComponentName} from '../components/{ComponentName}';
```

Add entries in the `mappings` object:
```ts
'{fieldType}': {ComponentName},
// If CRISP JSON includes a ":type" resource type string:
'{":type" value}': {ComponentName},
```

Keep simple `fieldType` keys grouped together; core-components resource-type strings grouped together — match the existing file structure.

---

## Step 3 — Export from `src/index.ts`

File: `packages/react-vanilla-components/src/index.ts`

Add import (maintain alphabetical order):
```ts
import {ComponentName} from './components/{ComponentName}';
```

Add to the `export { ... }` block:
```ts
{ComponentName},
```

---

## Step 4 — Create the test file

File: `packages/react-vanilla-components/__tests__/components/{ComponentName}.test.tsx`

### Core testing rules

**1. Value input — choose the right API by input type**

| Input type | Method | Reason |
|---|---|---|
| `text`, `email`, `tel`, `url`, `password` | `userEvent.type(input, value)` | JSDOM simulates keystrokes correctly |
| `date`, `datetime-local`, `time`, `number`, `range` | `fireEvent.change(input, { target: { value } })` | JSDOM doesn't simulate native picker events; `userEvent.type` produces undefined in model |
| `checkbox` | `userEvent.click(input)` | Toggles checked state correctly |
| `select` | `fireEvent.change(select, { target: { value } })` | Most reliable for select elements |

**2. Label/input linking**
The `FieldWrapper` sets `label.for = input.id = "${id}-widget"`. Assert them directly:
```tsx
expect(input.getAttribute('id')).toEqual(label.getAttribute('for'));
// Do NOT manually append '-widget' to label.for — it is already the full id
```

**3. Finding inputs that have no placeholder**
Use `querySelector` with the element type:
```tsx
const input = renderResponse.container.querySelector('input[type="text"]') as HTMLInputElement;
```

**4. Constraint attributes**
Test constraint HTML attributes by passing the constraint in the field object. Only include constraints that your state check confirmed actually reach props. If a constraint is read from `props.layout`, pass it under `properties['afs:layout']` in the test field object.

**5. Value normalisation**
If you wrote a normalisation helper in the component, add a dedicated test that passes a raw af-core-style value (as confirmed by the state check) and asserts the HTML input shows the normalised form.

**6. Full CRISP JSON smoke test**
Always include a `fullField` object that mirrors the complete CRISP JSON exactly as provided, and a test that renders it without errors.

### Test template

```tsx
/*
 * Copyright 2023 Adobe, Inc.
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

// Minimal field — only the properties needed to render the component
const field = {
  name: '{fieldName}',
  label: { value: '{Human Readable Label}', visible: true },
  fieldType: '{fieldType}',
  type: '{type}',
  // format: '{format}',  // include if present in CRISP JSON
  visible: true,
  required: true,
  enabled: true,
  readOnly: false,
};

// Full CRISP JSON — all properties exactly as provided. Include workaround keys
// (e.g. in properties['afs:layout']) for any constraints cleared by af-core.
const fullField = {
  // paste full CRISP JSON item here
};

const helper = renderComponent({ComponentName});

describe('{ComponentName}', () => {

  test('value changed by user is set in model', async () => {
    const { renderResponse, element } = await helper(field);
    // Choose method based on input type — see testing rules above
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

  // Add constraint-specific tests based on what your state check confirmed reaches props:
  // - min/max: test({ ...field, minimum: X, maximum: Y }) → expect(input).toHaveAttribute('min', X)
  // - minLength/maxLength: type a long string, assert model value is capped
  // - pattern: assert the attribute is on the input element
  // - accept (file): assert the attribute is on the input element
  // - Value normalisation: pass raw af-core value, assert input.value shows normalised form

  test('full CRISP JSON renders without errors', async () => {
    const { renderResponse } = await helper(fullField);
    expect(renderResponse.container.querySelector('input[type="{htmlInputType}"]')).not.toBeNull();
    expect(renderResponse.queryByText('{Human Readable Label}')).not.toBeNull();
  });
});
```

---

## Step 5 — Verify

Run **from inside the package directory** (critical — see troubleshooting below):

```bash
cd packages/react-vanilla-components
npm run build
npx jest __tests__/components/{ComponentName}.test.tsx --no-coverage
```

Fix all errors before reporting done.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Property 'X' does not exist on type 'PROPS'` | State field exists at runtime but is absent from TypeScript typings | Access via `(props as any).X` |
| Test fails: `value` is `undefined` after `userEvent.type` | Input type doesn't accept keystroke simulation in JSDOM | Switch to `fireEvent.change` |
| Test fails: label/input ID mismatch with double `-widget` | Assertion manually appended `-widget` to `label.for` which already contains it | Assert `input.id === label.for` directly |
| Test fails: `Missing semicolon` on `as Type` cast | Jest ran from repo root, picked up Babel config without TS support | Always `cd packages/react-vanilla-components` first |
| Constraint (min/max/etc.) is `undefined` in props despite being in CRISP JSON | af-core clears it from state for this `type`+`format` combination | Run state check; use `afs:layout` side-channel if value is needed as HTML attribute |
| HTML input shows wrong value format | af-core stores default/value in a different format than the input requires | Add a normalisation helper; verify expected format with state check |

---

## Checklist before finishing

- [ ] State check run (`createFormInstance` + `getState()`) before writing the component — props match state, not raw CRISP JSON
- [ ] BEM block name: `cmp-adaptiveform-{lowercasename}`; `data-cmp-is`: `adaptiveForm{PascalName}`
- [ ] Outer `<div>` has all five `data-cmp-*` attributes
- [ ] `<input>` / `<select>` / `<textarea>` has `id="${id}-widget"`, `aria-label`, `aria-invalid`, `aria-describedby`
- [ ] `FieldWrapper` receives `bemBlock`, `label`, `id`, `tooltip`, `description`, `isError`, `errorMessage`
- [ ] Constraint props: typed ones destructured from `props`; runtime-only ones via `(props as any).X` or `props.layout.X`
- [ ] `dispatchBlur` called correctly for the field type (with or without value argument)
- [ ] Default export is `withRuleEngine({ComponentName})`, not the bare component function
- [ ] `mappings.ts` has entries for `fieldType` and `":type"` resource type (if present)
- [ ] `src/index.ts` imports and re-exports the component
- [ ] Value normalisation applied if state check showed format mismatch
- [ ] Test uses correct input method per input type (see testing rules table)
- [ ] Test label/input linking: `input.id === label.for` (no manual `-widget` suffix)
- [ ] `fullField` smoke test covers the complete CRISP JSON
- [ ] `npm run build` clean (no TS errors) — run from inside package dir
- [ ] All Jest tests pass — run from inside package dir
