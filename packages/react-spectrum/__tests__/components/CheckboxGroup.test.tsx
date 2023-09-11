/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import CheckboxGroup from '../../src/components/CheckboxGroup';
import {filterTestTable, InputFieldTestCase, jest26CompatibleTable, renderComponent, DEFAULT_ERROR_MESSAGE} from '../utils';
import userEvent from '@testing-library/user-event';
import { FieldJson } from '@aemforms/af-core';
import "@testing-library/jest-dom/extend-expect"

const field: FieldJson = {
  name: 'checkbox',
  visible: true,
  label: {
    value: 'Checkbox group'
  },
  constraintMessages: {
    required: DEFAULT_ERROR_MESSAGE,
    type: DEFAULT_ERROR_MESSAGE
  },
  fieldType: 'checkbox-group',
  enum: [1, 2, 3],
  enumNames: [
      {
        "value": "checkbox 1",
        "richText": true
      },
      {
        "value": "checkbox 2",
        "richText": true
      },
      {
        "value": "checkbox 3",
        "richText": true
      }]
};

type Input = {
  labels: HTMLLabelElement[],
  inputs: HTMLInputElement[],
  group: Element | null,
  container: Element | null
}

type GroupExpectType = (i: Input) => any

const labelInputTests: InputFieldTestCase<GroupExpectType>[] = [
  {
    name: 'field gets rendered without a provider',
    field: field,
    expects: ({ labels, inputs, container }) => {
      expect(container?.innerHTML).toContain('Checkbox group')
      expect(labels.length).toEqual(3);
      expect(inputs.length).toEqual(3);
      expect(labels[0]?.textContent).toEqual('checkbox 1');
      expect(labels[1]?.textContent).toEqual('checkbox 2');
      expect(labels[2]?.textContent).toEqual('checkbox 3');
      expect(inputs[0]?.name).toEqual('checkbox');
      expect(inputs[0]?.value).toEqual('1');
      expect(inputs[1]?.value).toEqual('2');
      expect(inputs[2]?.value).toEqual('3');
    }
  },
  {
    name: 'html in the label should be handled for non rich text label',
    field: {
      ...field,
      label: {
        value: '<script>javascript</script><p>label inside p tags</p>'
      }
    },
    expects: ({ container }) => {
      expect(container?.innerHTML).toContain('&lt;script&gt;javascript&lt;/script&gt;' +
        '&lt;p&gt;label inside p tags&lt;/p&gt;');
    }
  },
  {
    name: 'labels and inputs are linked with for and id attribute',
    field: field,
    expects: ({ labels, inputs }) => {
      expect(inputs[0]?.getAttribute('id')).toEqual(labels[0]?.getAttribute('for'));
      expect(inputs[1]?.getAttribute('id')).toEqual(labels[1]?.getAttribute('for'));
      expect(inputs[2]?.getAttribute('id')).toEqual(labels[2]?.getAttribute('for'));
    }
  },
  {
    name: 'labels and inputs are also linked with aria-labelledBy attribute',
    field: field,
    expects: ({ labels, inputs }) => {
      expect(labels[0]?.getAttribute('id')).toEqual(inputs[0]?.getAttribute('aria-labelledBy'));
      expect(labels[1]?.getAttribute('id')).toEqual(inputs[1]?.getAttribute('aria-labelledBy'));
      expect(labels[2]?.getAttribute('id')).toEqual(inputs[2]?.getAttribute('aria-labelledBy'));
    }
  },
  {
    name: 'label is empty if label is marked as hidden in the field',
    field: {
      ...field,
      label: {
        ...field.label,
        visible: false
      }
    },
    expects: ({ group }) => {
      expect(group?.textContent).not.toContain('Checkbox group');
    }
  },
  {
    name: 'individual labels are present if label is hidden',
    field: {
      ...field,
      label : {
        ...field.label,
        visible: false
      }
    },
    expects: ({labels , inputs}) => {
      expect(labels[0]?.getAttribute('id')).toEqual(inputs[0]?.getAttribute('aria-labelledBy'));
      expect(labels[1]?.getAttribute('id')).toEqual(inputs[1]?.getAttribute('aria-labelledBy'));
      expect(labels[2]?.getAttribute('id')).toEqual(inputs[2]?.getAttribute('aria-labelledBy'));
    }
  },
  {
    name: 'input is not marked as aria-invalid when the field is valid',
    field: {
      ...field
    },
    expects: ({ group }) => {
      expect(group?.getAttribute('aria-invalid')).toBeNull();
    }
  },
  {
    name: "input is not marked as aria-invalid when the field's valid state is undefined",
    field,
    expects: ({ group }) => {
      expect(group?.getAttribute('aria-invalid')).toBeNull();
    }
  },
  {
    name: 'no option is selected on initial render case 1',
    field,
    expects: ({ inputs }) => {
      expect(inputs[0]?.checked).toEqual(false);
      expect(inputs[0]?.value).toEqual('1');
      expect(inputs[1]?.checked).toEqual(false);
      expect(inputs[1]?.value).toEqual('2');
      expect(inputs[2]?.checked).toEqual(false);
      expect(inputs[2]?.value).toEqual('3');
    }
  },
  {
    name: 'correct option is selected on initial render case 2',
    field: {
      ...field,
      default: [2]
    },
    expects: ({ inputs }) => {
      expect(inputs[0]?.checked).toEqual(false);
      expect(inputs[0]?.value).toEqual('1');
      expect(inputs[1]?.checked).toEqual(true);
      expect(inputs[1]?.value).toEqual('2');
      expect(inputs[2]?.checked).toEqual(false);
      expect(inputs[2]?.value).toEqual('3');
    }
  },
  {
    name: 'helpText div doesn\'t exists when there is no error and no description',
    field: {
      ...field
    },
    expects: ({container}) => {
      const err = container?.querySelector('.formField__helpText');
      expect(err).toBeNull();
    }
  },
  {
    name: 'helpText div exists when there is a description',
    field: {
      ...field,
      description: 'some description'
    },
    expects: ({container}) => {
      const err = container?.querySelector('.formField__helpText');
      expect(err).not.toBeNull();
      // @ts-ignore
      expect(err.textContent).toEqual('some description');
    }
  },
  {
    name: 'help text exists when the field is invalid',
    field: {
      ...field,
      type : 'number'
    },
    operation: (form, field) => {
      field.value = 'not a number';
    },
    expects: ({container}) => {
      const err = container?.querySelector('.formField__helpText');
      expect(err).not.toBeNull();
      //@ts-ignore
      expect(err.textContent).toEqual('There is an error in the field');
    }
  }
];

const helper = renderComponent(CheckboxGroup, (container) => {
  return {
    group: container.querySelector('[role="group"]'),
    inputs: Array.from(container.querySelectorAll('input')),
    labels: Array.from(container.querySelectorAll('label'))
  };
});

test.each(jest26CompatibleTable(filterTestTable(labelInputTests)))('%s', async (name, { field, expects, operation }) => {
  expects(await helper(field, operation));
});

test('option selected by user is set in the model', async () => {
  const f = {
    ...field
  };
  const { inputs, element } = await helper(f);
  let state = element?.getState();
  expect(state.value).toBeUndefined();
  userEvent.click(inputs[0]);
  state = element?.getState();
  expect(state.value).toEqual([1]);
  expect(inputs[0]?.checked).toEqual(true);
  expect(inputs[1]?.checked).toEqual(false);
  expect(inputs[2]?.checked).toEqual(false);

  userEvent.click(inputs[1]);
  state = element?.getState();
  expect(state.value).toEqual([1, 2]);
  expect(inputs[0]?.checked).toEqual(true);
  expect(inputs[1]?.checked).toEqual(true);
  expect(inputs[2]?.checked).toEqual(false);
});

test('value set in the model selects the checkbox', async () => {
  const f = {
    ...field
  };
  const { inputs, element } = await helper(f);
  expect(inputs[0]?.checked).toEqual(false);
  expect(inputs[1]?.checked).toEqual(false);
  expect(inputs[2]?.checked).toEqual(false);

  element.value = [1];
  expect(inputs[0]?.checked).toEqual(true);
  expect(inputs[1]?.checked).toEqual(false);
  expect(inputs[2]?.checked).toEqual(false);

  element.value = [2];
  expect(inputs[0]?.checked).toEqual(false);
  expect(inputs[1]?.checked).toEqual(true);
  expect(inputs[2]?.checked).toEqual(false);

  element.value = [1,3];
  expect(inputs[0]?.checked).toEqual(true);
  expect(inputs[1]?.checked).toEqual(false);
  expect(inputs[2]?.checked).toEqual(true);
});

test('clicking a checkbox should set the value', async () => {
  const f = {
    ...field
  };
  const { inputs, element } = await helper(f);
  userEvent.click(inputs[0]);
  expect(element.value).toEqual([1]);

  userEvent.click(inputs[1]);
  expect(element.value).toEqual([1, 2]);

  userEvent.click(inputs[0]);
  expect(element.value).toEqual([2]);
});


test('it should handle visible property', async () => {
  const f = {
    ...field,
    visible: false
  };
  const { container } = await helper(f);
  expect(container?.innerHTML).toContain('display: none;');

  const x = await helper(field);
  expect(x.container?.innerHTML).not.toContain('display: none;');
});

test('help text content changes when field becomes invalid', async () => {
  const f = {
    ...field,
    description: 'some description',
    required : true
  };

  const {container, element} = await helper(f);
  const err = container?.querySelector('.formField__helpText');
  // @ts-ignore
  expect(err.textContent).toEqual('some description');

  //@ts-ignore
  element.value = [1];
  // @ts-ignore
  expect(err.textContent).toEqual('some description');

  element.value = null;
  // @ts-ignore
  expect(err.textContent).toEqual(DEFAULT_ERROR_MESSAGE);
});

test('checkbox group with non array type should allow only single selection', async () => {
  const f = {
    ...field,
    description: 'some description',
    type : 'number'
  };
  const {element, inputs} = await helper(f);
  userEvent.click(inputs[0]);
  expect(element.value).toEqual(1);

  userEvent.click(inputs[1]);
  expect(element.value).toEqual(2);

  expect(inputs[0].checked).toEqual(false);
  expect(inputs[1].checked).toEqual(true);

  userEvent.click(inputs[1]);
  expect(element.value).toEqual(null);
});

test.todo('it should handle disable property');
test.todo('it should handle richTextTitle property');
test.todo('it should handle screenReaderText property');
test.todo('it should dispatch click event to controller');
