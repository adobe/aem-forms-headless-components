/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import TextField from '../../src/components/TextField';
import {
    elementFetcher,
    filterTestTable,
    InputFieldTestCase,
    jest26CompatibleTable,
    renderComponent,
    FieldExpectType,
    DEFAULT_ERROR_MESSAGE
} from '../utils';
import userEvent from '@testing-library/user-event';

const field = {
    'name': 'name',
    'fieldType' : 'text-input',
    'default': 'john doe',
    label: {
        value: 'name'
    },
    'visible' : true
};


const labelInputTests: InputFieldTestCase<FieldExpectType>[] = [
    {
        name: 'field gets rendered',
        field: field,
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null) => {
            expect(label?.innerHTML).toEqual('name');
            expect(input?.getAttribute('name')).toEqual('name');
            expect(input?.value).toEqual('john doe');
        }
    },
    {
        name : 'html in the label should be handled for non rich text',
        field: {
            ...field,
            'label' : {
                value: '<script>javascript</script><p>title inside p tags</p>'
            }
        },
        expects: (label : HTMLLabelElement | null) => {
            expect(label?.innerHTML).toEqual('&lt;script&gt;javascript&lt;/script&gt;' +
                '&lt;p&gt;title inside p tags&lt;/p&gt;');
        }
    },
    {
        name: 'labels and inputs are linked with for and id attribute',
        field: field,
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('id')).toEqual(label?.getAttribute('for'));
        }
    },
    {
        name: 'labels and inputs are also linked with aria-labelledBy attribute',
        field: field,
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(label?.getAttribute('id')).toEqual(input?.getAttribute('aria-labelledBy'));
        }
    },
    {
        name: 'accessibility attributes are properly set for required field',
        field: {
            ...field,
            'required': true
        },
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-required')).toEqual('true');
        }
    },
    {
        name: 'label is null if title is marked as hidden in the field',
        field: {
            ...field,
            label : {
                ...field.label,
                visible: false
            }
        },
        expects: (label : HTMLLabelElement | null) => {
            expect(label).toBeNull();
        }
    },
    {
        name: 'input is marked as aria-invalid when the field is invalid',
        field: {
            ...field,
            'valid': false
        },
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-invalid')).toBe('true');
        }
    },
    {
        name: 'input is not marked as aria-invalid when the field is valid',
        field: {
            ...field,
            'valid': true
        },
        expects: (label ?: HTMLLabelElement | null, input?: HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-invalid')).toBeNull();
        }
    },
    {
        name: "input is not marked as aria-invalid when the field's valid state is undefined",
        field,
        expects: (label ?: HTMLLabelElement | null, input?: HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-invalid')).toBeNull();
        }
    },
    {
        name: 'description exists when the field is valid',
        field: {
            ...field,
            'valid': true,
            'description' : 'some description'
        },
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null, container: HTMLElement) => {
            //@ts-ignore
            expect(container.textContent).toContain('some description');
        }
    },
    {
        name: 'error message element exists when the field is invalid',
        field: {
            ...field,
            'valid': false,
            'errorMessage' : 'there is an error in the field'
        },
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null, container: HTMLElement) => {
            expect(container.textContent).toContain('there is an error in the field');
        }
    },
    {
        name: 'error message doesn\'t exists when there is no error',
        field: {
            ...field,
            'valid': true,
            'errorMessage' : DEFAULT_ERROR_MESSAGE
        },
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null, container: HTMLElement) => {
            expect(container.textContent).not.toContain(DEFAULT_ERROR_MESSAGE);
        }
    }
];

const helper = renderComponent(TextField, elementFetcher);

test.each(jest26CompatibleTable(filterTestTable(labelInputTests)))('%s', async (name, {field, expects}) => {
    let x = await helper(field);
    expects(x.label, x.input, x.container);
});

test('value entered by user in text field is set in model', async () => {
    const f = {
        ...field
    };
    let {input, element} = await helper(f);
    // @ts-ignore
    userEvent.clear(input);
    const inputValue = 'hello world';
    // @ts-ignore
    userEvent.type(input, inputValue);
    const state = element.getState();
    expect(state.value).toEqual(inputValue);
    expect(input?.value).toEqual(inputValue);
});

test('help text content changes when field becomes invalid', async () => {
    const f = {
        ...field,
        description: 'some description',
        'required' : true
    };

    const {container, input} = await helper(f);

    // @ts-ignore
    expect(container.textContent).toContain('some description');
    expect(container.textContent).not.toContain(DEFAULT_ERROR_MESSAGE);
    // @ts-ignore
    userEvent.clear(input);
    expect(container.textContent).toContain(DEFAULT_ERROR_MESSAGE);
    expect(container.textContent).not.toContain('some description');
    // @ts-ignore
    userEvent.type(input, 'some value');
    // @ts-ignore
    expect(container.textContent).toContain('some description');
    expect(container.textContent).not.toContain(DEFAULT_ERROR_MESSAGE);
});


test.todo('it should handle disable property');
test.todo('it should handle richTextTitle property');
test.todo('it should handle readOnly property');
test('it should handle visible property', async () => {
    const f = {
        ...field,
        'visible' : false
    };

    let {container} = await helper(f);
    expect(container.innerHTML).toContain('display: none'); //todo: find a better check
});

const emptyValues = [null, '', undefined];

test.each(emptyValues)('empty value %s should be honored in the field', async (x) => {
    let f = {
        ...field,
        'emptyValue' : x,
        'visible' : false
    };

    let {input, element} = await helper(f);
    // @ts-ignore
    userEvent.clear(input);
    expect(element.value).toEqual('');
    // @ts-ignore
    expect(input.value).toEqual('');
});

test.todo('it should handle screenReaderText property');
test.todo('it should handle minLength constraint');
test.todo('it should handle maxLength constraint');

test.skip('it should dispatch focus event to controller', async () => {
    let f = {
        ...field,
        events : {
            focus : '{properties : {focus : true}}'
        }
    };
    let {input, element} = await helper(f);
    input?.focus();
    expect(element.properties.focus).toEqual(true);
});

test('it should show edit value for date fields on focus', async () => {
    let f = {
        ...field,
        format: 'date',
        fieldType : 'date-input',
        editFormat:  'MM-dd-yyyy',
        displayFormat:  'eeee MM dd yyyy',
        type : 'string',
        default : '2010-10-10'
    };
    let {input, element} = await helper(f);
    expect(element.editValue).toEqual('10-10-2010');
    expect(element.displayValue).toEqual('Sun 10 10 2010');
    input?.focus();
    expect(input?.value).toEqual('10-10-2010');

    // @ts-ignore
    userEvent.clear(input);
    // @ts-ignore
    userEvent.type(input, '09-14-2022');
    input?.blur();
    expect(element.value).toEqual('2022-09-14');
    expect(input?.value).toEqual('Wed 09 14 2022');
});

test('Text Field show empty string if model value null', async () => {
  let f = {
      ...field
  };
  let {input, element} = await helper(f);
  expect(input?.value).toEqual('john doe');
  element.value= null;
  expect(input?.value).toEqual('');
});
