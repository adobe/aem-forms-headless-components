/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import NumberField from '../../src/components/NumberField';
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
import {FieldJson} from '@aemforms/af-core';

const field = {
    name: 'birthYear',
    default: '1992',
    label: {
        value: 'birthYear'
    },
    constraintMessages: {
        required: DEFAULT_ERROR_MESSAGE,
        type: DEFAULT_ERROR_MESSAGE
    },
    type: 'number',
    fieldType: 'number-input',
    visible: true
};


const labelInputTests: InputFieldTestCase<FieldExpectType>[] = [
    {
        name: 'field gets rendered without a provider',
        field: field,
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(label?.innerHTML).toEqual('birthYear');
            expect(input?.value).toEqual('1,992');
        }
    },
    {
        name: 'default value is honored',
        field: field,
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(input?.value).toEqual('1,992');
        }
    },
    {
        name: 'description exists when the field is valid',
        field: {
            ...field,
            description: 'some description'
        },
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null, container: HTMLElement) => {
            //@ts-ignore
            expect(container.textContent).toContain('some description');
        }
    },
    {
        name: 'error message element exists when the field is invalid',
        field: {
            ...field
        },
        operation: (form, field) => {
            field.value = 'not a number';
        },
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null, container: HTMLElement) => {
            expect(container.textContent).toContain(DEFAULT_ERROR_MESSAGE);
        }
    },
    {
        name: 'error message doesn\'t exists when there is no error',
        field: {
            ...field
        },
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null, container: HTMLElement) => {
            expect(container.textContent).not.toContain(DEFAULT_ERROR_MESSAGE);
        }
    },
    {
        name: 'aria-label property is present if label is hidden',
        field: {
            ...field,
            label: {
                ...field.label,
                visible: false
            }
        },
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-label')).toEqual(field.label.value);
        }
    },
    {
        name: 'html in the label should be handled for non rich text',
        field: {
            ...field,
            label: {
                value: '<script>javascript</script><p>title inside p tags</p>'
            }
        },
        expects: (label: HTMLLabelElement | null) => {
            expect(label?.innerHTML).toEqual('&lt;script&gt;javascript&lt;/script&gt;' +
                '&lt;p&gt;title inside p tags&lt;/p&gt;');
        }
    },
    {
        name: 'labels and inputs are linked with for and id attribute',
        field: field,
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(input?.getAttribute('id')).toEqual(label?.getAttribute('for'));
        }
    },
    {
        name: 'labels and inputs are also linked with aria-labelledBy attribute',
        field: field,
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(label?.getAttribute('id')).toEqual(input?.getAttribute('aria-labelledBy'));
        }
    },
    {
        name: 'accessibility attributes are properly set for required field',
        field: field,
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(label?.getAttribute('id')).toEqual(input?.getAttribute('aria-labelledBy'));
        }
    },
    {
        name: 'accessibility attributes are properly set for required field',
        field: {
            ...field,
            required: true
        },
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-required')).toEqual('true');
        }
    },
    {
        name: 'label is null if title is marked as hidden in the field',
        field: {
            ...field,
            label: {
                ...field.label,
                visible: false
            }
        },
        expects: (label: HTMLLabelElement | null) => {
            expect(label).toBeNull();
        }
    },
    {
        name: 'input is marked as aria-invalid when the field is invalid',
        field: {
            ...field
        },
        operation: (form, field) => {
            field.value = 'not a number';
        },
        expects: (label: HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-invalid')).toBe('true');
        }
    },
    {
        name: 'input is not marked as aria-invalid when the field is valid',
        field: {
            ...field
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
    }
];

const helper = renderComponent(NumberField, elementFetcher);

test.each(jest26CompatibleTable(filterTestTable(labelInputTests)))('%s', async (name,
                                                                                {field, expects, operation}) => {
    let x = await helper(field, operation);
    expects(x.label, x.input, x.container);
});

test('value entered by user in number field is set in model', async () => {
    const f = {
        ...field,
        id: 'x'
    };
    const {input, form} = await helper(f);
    // @ts-ignore
    userEvent.clear(input);
    const inputValue = '1992';
    // @ts-ignore
    userEvent.type(input, inputValue);
    expect((form?.items[0] as FieldJson).value).toEqual(1992);
    expect(input?.value).toEqual(inputValue);

});

//test.todo('it should handle readOnly property');
test('it should handle visible property', async () => {
    const f = {
        ...field,
        id: 'x',
        visible: false
    };
    const {container} = await helper(f);
    expect(container.innerHTML).toContain('display: none'); //todo: find a better check
});

test('help text content changes when field becomes invalid', async () => {
    const f = {
        ...field,
        description: 'some description',
        required: true
    };

    const {container, input} = await helper(f);

    // @ts-ignore
    expect(container.textContent).toContain('some description');
    expect(container.textContent).not.toContain(DEFAULT_ERROR_MESSAGE);
    // @ts-ignore
    userEvent.clear(input);
    // input type=number doesn't trigger change event on type, so tab out to trigger the change event.
    //https://github.com/testing-library/user-event/issues/411#issuecomment-727081538
    userEvent.tab();
    // @ts-ignore
    expect(container.textContent).toContain(DEFAULT_ERROR_MESSAGE);
    expect(container.textContent).not.toContain('some description');
    // @ts-ignore
    userEvent.type(input, '1234');
    userEvent.tab();
    // @ts-ignore
    expect(container.textContent).toContain('some description');
    expect(container.textContent).not.toContain(DEFAULT_ERROR_MESSAGE);
});
