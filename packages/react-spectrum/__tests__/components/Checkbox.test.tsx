/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Checkbox from '../../src/components/Checkbox';
import userEvent from '@testing-library/user-event';
import {
    elementFetcher,
    filterTestTable,
    ignoredTestTable,
    InputFieldTestCase, jest26CompatibleTable,
    renderComponent,
    DEFAULT_ERROR_MESSAGE,
    FieldExpectType
} from '../utils';

const field = {
    'name': 'name',
    label : {
        value : 'name'
    },
    fieldType: 'checkbox',
    'visible' : true,
    'type' : 'boolean'
};

const labelInputTests: InputFieldTestCase<FieldExpectType>[] = [
    {
        name : 'a checkbox should render if there are no options',
        field : {
            ...field,
            'default': 'john doe'
        },
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null) => {
            expect(label?.textContent).toEqual('name');
            expect(input?.getAttribute('name')).toEqual('name');
            expect(input?.value).toEqual('john doe');
        }
    },
    {
        name: 'field gets rendered without a provider',
        field: field,
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null) => {
            expect(label?.textContent).toEqual('name');
            expect(input?.getAttribute('name')).toEqual('name');
            expect(input?.value).toEqual('');
        }
    },
    {
        name : 'html in the label should be handled for non rich text label',
        field: {
            ...field,
            'label' : {
                'value' : '<script>javascript</script><p>label inside p tags</p>'
            }
        },
        // eslint-disable-next-line no-unused-vars
        expects: (label : HTMLLabelElement | null) => {
            expect(label?.innerHTML).toContain('&lt;script&gt;javascript&lt;/script&gt;' +
                '&lt;p&gt;label inside p tags&lt;/p&gt;');
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
            'required' : true
        },
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-required')).toEqual('true');
        }
    },
    {
        name: 'label is null if label is marked as invisible in the field',
        field: {
            ...field,
            'label' : {
                ...field.label,
                visible: false
            }
        },
        // eslint-disable-next-line no-unused-vars
        expects: (label : HTMLLabelElement | null) => {
            expect(label?.textContent).toEqual('');
        }
    },
    {
        name: 'aria-label property is present if label is hidden',
        field: {
            ...field,
            'label' : {
                ...field.label,
                visible: false
            }
        },
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-label')).toEqual(field.label.value);
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
            ...field
        },
        operation : (form, field) => {
          field.value = 'true';
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
        name : 'a checkbox should be selected if value is on',
        field : {
            ...field,
            'default' : true
        },
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null) => {
            expect(input?.checked).toEqual(true);
        }
    },
    {
        name : 'a checkbox should not be selected if value is not on',
        field : {
            ...field,
            'enum' : [false, true],
            'value' : true
        },
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null) => {
            expect(input?.checked).toEqual(false);
        }
    },
    {
        name : 'a checkbox should not be selected if value is undefined',
        field : {
            ...field
        },
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null) => {
            expect(input?.checked).toEqual(false);
        }
    },
    {
        name : 'a checkbox should not be selected if both value and options are undefined',
        field : {
            'name': 'name',
            label : {
                value : 'name'
            },
            'visible' : true
        },
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null) => {
            expect(input?.checked).toEqual(false);
        }
    },
    {
        name: 'helpText div doesn\'t exists when there is no error and no description',
        field: {
            ...field
        },
        expects: (label, input, container) => {
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
        expects: (label, input, container) => {
            const err = container?.querySelector('.formField__helpText');
            expect(err).not.toBeNull();
            // @ts-ignore
            expect(err.textContent).toEqual('some description');
        }
    },
    {
        name: 'help text exists when the field is invalid',
        field: {
            ...field
        },
        operation: (form: any, field: any) => {
            field.value = 'not a boolean';
        },
        expects: (label, input, container) => {
            const err = container?.querySelector('.formField__helpText');
            expect(err).not.toBeNull();
            //@ts-ignore
            expect(err.textContent).toEqual('There is an error in the field');
        }
    }
];

const helper = renderComponent(Checkbox, elementFetcher);

test.each(jest26CompatibleTable(filterTestTable(labelInputTests)))('%s', async (name, {field, expects, operation}) => {
    //let x = await helper(field, false);
    //expects(x.label, x.input);
    let x = await helper(field, operation);
    expects(x.label, x.input, x.container);
});

ignoredTestTable(labelInputTests).forEach((v) => {
    test.todo(v.name);
});

test('if no options are defined then value cannot be selected', async () => {
    const f = {
        'name' : 'name',
        'label' : {
            value: 'name'
        },
        'visible' : true
    };
    const {input, element} = await helper(f);
    // @ts-ignore
    userEvent.click(input);
    const state = element?.getState();
    expect(state?.value).toEqual(undefined);
    expect(input?.checked).toEqual(false);
    expect(input?.value).toEqual('');
    // @ts-ignore
    userEvent.click(input);
    expect(input?.checked).toEqual(false);
});

test('selection made by the user sets the value', async () => {
    const f = {
        ...field
    };
    const {input, label, element} = await helper(f);
    // @ts-ignore
    userEvent.click(label);
    expect(element?.value).toEqual(true);
    expect(input?.checked).toEqual(true);
    expect(input?.value).toEqual('true');
});

test('clicking on checkbox twice resets the value', async () => {
    const f = {
        ...field,
        'enum' : [false, true],
        'default' : [true, false][Math.round(Math.random())]
    };
    const {input, element} = await helper(f);
    const value = input?.value;
    const checked = input?.checked;
    // @ts-ignore
    userEvent.click(input);
    // @ts-ignore
    userEvent.click(input);
    const state = element?.getState();
    expect(state.value).toEqual(f.default);
    expect(input?.checked).toEqual(checked);
    expect(input?.value).toEqual(`${value}`);
});


test('deselecting the checkbox sets the value to off value', async () => {
    const f = {
        ...field,
        'enum' : [false, true],
        'default' : false
    };
    const {input, element} = await helper(f);
    // @ts-ignore
    userEvent.click(input);
    const state = element?.getState();
    expect(state.value).toBe(true);
    expect(input?.checked).toEqual(false);
    expect(input?.value).toEqual('true');
});

test('it should handle visible property', async () => {
    const f = {
        ...field,
        'visible' : false
    };

    const {label} = await helper(f);
    expect(label?.getAttribute('style')).toEqual('display: none;');
});

test('a checkbox with no off value should get its value undefined when not selected', async () => {
    const f = {
        ...field,
        enum: [true]
    };

    const {input, element} = await helper(f);
    expect(input?.checked).toEqual(false);
    expect(input?.value).toEqual('');
    // @ts-ignore
    userEvent.click(input);
    let state = element?.getState();
    expect(state.value).toBe(true);
    expect(input?.checked).toEqual(true);
    expect(input?.value).toEqual('true');

    // @ts-ignore
    userEvent.click(input);
    expect(input?.checked).toEqual(false);
    expect(input?.value).toEqual('');
    state = element?.getState();
    expect(state.value).toBe(null);
});

test('a checkbox with no off value should be valid when not required', async () => {
    const f = {
        ...field,
        enum: [true]
    };

    const {input, form, element} = await helper(f);
    // @ts-ignore
    userEvent.click(input);
    let data = form?.exportData();
    expect(data.name).toEqual(true);
    // @ts-ignore
    userEvent.click(input);
    expect(element?.valid).not.toBe(false);

});

test('a required checkbox with off value should be invalid when unchecked', async () => {
    const f = {
        ...field,
        enum: [true, false],
        required: true
    };

    const {input, element, container} = await helper(f);
    // @ts-ignore
    userEvent.click(input);
    // @ts-ignore
    userEvent.click(input);
    const err = container.querySelector('.formField__helpText');
    expect(element?.valid).toBe(false);
    // @ts-ignore
    expect(err.textContent).toEqual(DEFAULT_ERROR_MESSAGE);
});

test('a required checkbox with no off value should be invalid when unchecked', async () => {
    const f = {
        ...field,
        enum: [true],
        required: true
    };

    const {input, element} = await helper(f);
    // @ts-ignore
    userEvent.click(input);
    // @ts-ignore
    userEvent.click(input);
    let state = element?.getState();
    expect(state.valid).toBe(false);
});
