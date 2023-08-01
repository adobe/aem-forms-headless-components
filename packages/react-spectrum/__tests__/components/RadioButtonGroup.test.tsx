/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import RadioButtonGroup from '../../src/components/RadioButtonGroup';
import {
    filterTestTable,
    InputFieldTestCase,
    renderComponent,
    DEFAULT_ERROR_MESSAGE
} from '../utils';
import userEvent from '@testing-library/user-event';
import {FieldJson} from '@aemforms/af-core';


const field : FieldJson = {
    name: 'EmploymentStatus',
    default : true,
    visible : true,
    label : {
        value : 'Are you Employed'
    },
    constraintMessages: {
        required: DEFAULT_ERROR_MESSAGE,
        type: DEFAULT_ERROR_MESSAGE
    },
    fieldType : 'radio-group',
    type : 'boolean',
    enum : [true, false],
    enumNames : ['Yes',  'No']
};

type Input = {
    labels: HTMLLabelElement[],
    inputs: HTMLInputElement[],
    group: Element | null,
    container: HTMLElement | null
}

type GroupExpectType = (i : Input) => any

const labelInputTests: InputFieldTestCase<GroupExpectType>[] = [
    {
        name: 'field gets rendered without a provider',
        field: field,
        expects: ({labels, inputs, group}) => {
            expect(group?.textContent).toContain('Are you Employed');
            expect(labels.length).toEqual(2);
            expect(inputs.length).toEqual(2);
            expect(labels[0]?.textContent).toEqual('Yes');
            expect(labels[1]?.textContent).toEqual('No');
            expect(inputs[0]?.name).toEqual('EmploymentStatus');
            expect(inputs[0]?.value).toEqual('true');
            expect(inputs[1]?.value).toEqual('false');
        }
    },
    {
        name : 'html in the label should be handled for non rich text label',
        field: {
            ...field,
            label : {
                value: '<script>javascript</script><p>label inside p tags</p>'
            }
        },
        expects: ({group}) => {
            expect(group?.innerHTML).toContain('&lt;script&gt;javascript&lt;/script&gt;' +
                '&lt;p&gt;label inside p tags&lt;/p&gt;');
        }
    },
    {
        name: 'labels and inputs are linked with for and id attribute',
        field: field,
        expects: ({labels, inputs}) => {
            expect(inputs[0]?.getAttribute('id')).toEqual(labels[0]?.getAttribute('for'));
            expect(inputs[1]?.getAttribute('id')).toEqual(labels[1]?.getAttribute('for'));
        }
    },
    {
        name: 'labels and inputs are also linked with aria-labelledBy attribute',
        field: field,
        expects: ({labels, inputs}) => {
            expect(labels[0]?.getAttribute('id')).toEqual(inputs[0]?.getAttribute('aria-labelledBy'));
            expect(labels[1]?.getAttribute('id')).toEqual(inputs[1]?.getAttribute('aria-labelledBy'));
        }
    },
    {
        name: 'accessibility attributes are properly set for required field',
        field: {
            ...field,
            required: true
        },
        expects: ({group}) => {
            expect(group?.getAttribute('aria-required')).toEqual('true');
        }
    },
    {
        name: 'label is empty if label is marked as hidden in the field',
        field: {
            ...field,
            label : {
                ...field.label,
                visible: false
            }
        },
        expects: ({group}) => {
            expect(group?.textContent).not.toContain('Are you Employed');
        }
    },
    {
        name: 'input is marked as aria-invalid when the field is invalid',
        field: {
            ...field
        },
        operation : (form, field) => {
          field.value =  'non boolean';
        },
        expects: ({group}) => {
            expect(group?.getAttribute('aria-invalid')).toBe('true');
        }
    },
    {
        name: 'input is not marked as aria-invalid when the field is valid',
        field: {
            ...field
        },
         expects: ({group}) => {
            expect(group?.getAttribute('aria-invalid')).toBeNull();
        }
    },
    {
        name: "input is not marked as aria-invalid when the field's valid state is undefined",
        field,
        expects: ({group}) => {
            expect(group?.getAttribute('aria-invalid')).toBeNull();
        }
    },
    {
        name: "group's label property is accessible",
        field,
        expects: ({group}) => {
            const labelID = group?.getAttribute('aria-labelledby');
            const glabel = group?.querySelector('#' + labelID);
            expect(glabel?.textContent).toEqual('Are you Employed');
        }
    },
    {
        name: 'correct option is selected on initial render case 1',
        field,
        expects: ({inputs}) => {
            expect(inputs[0]?.checked).toEqual(true);
            expect(inputs[0]?.value).toEqual('true');
            expect(inputs[1]?.checked).toEqual(false);
            expect(inputs[1]?.value).toEqual('false');
        }
    },
    {
        name: 'correct option is selected on initial render case 2',
        field: {
            ...field,
            default : false
        },
        expects: ({inputs}) => {
            expect(inputs[1]?.checked).toEqual(true);
            expect(inputs[1]?.value).toEqual('false');
            expect(inputs[0]?.checked).toEqual(false);
            expect(inputs[0]?.value).toEqual('true');
        }
    },
    {
        name: 'no option is selected on initial render when value is null',
        field: {
            ...field,
            default : null
        },
        expects: ({inputs}) => {
            expect(inputs[0]?.checked).toEqual(false);
            expect(inputs[0]?.value).toEqual('true');
            expect(inputs[1]?.checked).toEqual(false);
            expect(inputs[1]?.value).toEqual('false');
        }
    },
    {
        name: "no option is selected on initial render when value doesn't belong to any options" ,
        field: {
            ...field,
            type : 'string',
            default : 'some other option',
            enum : ['option 1', 'option 2']
        },
        expects: ({inputs}) => {
            expect(inputs[0]?.checked).toEqual(false);
            expect(inputs[0]?.value).toEqual('option 1');
            expect(inputs[1]?.checked).toEqual(false);
            expect(inputs[1]?.value).toEqual('option 2');
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
            ...field
        },
        operation : (form, field) => {
          field.value = 'not a boolean';
        },
        expects: ({container}) => {
            const err = container?.querySelector('.formField__helpText');
            expect(err).not.toBeNull();
            //@ts-ignore
            expect(err.textContent).toEqual(DEFAULT_ERROR_MESSAGE);
        }
    }
];

const helper = renderComponent(RadioButtonGroup, (container) => {
    return {
        group : container.querySelector('[role="radiogroup"]'),
        inputs : Array.from(container.querySelectorAll('input')),
        labels : Array.from(container.querySelectorAll('label'))
    };
});

test.each(filterTestTable(labelInputTests))('$name', async ({field, expects, operation}) => {
    expects(await helper(field, operation));
});

test('option selected by user is set in the model', async () => {
    const f = {
        ...field,
        default : null
    };
    const {inputs, element} = await helper(f);
    let state = element?.getState();
    expect(state.value).toBeNull();
    userEvent.click(inputs[0]);
    state = element?.getState();
    expect(state.value).toEqual(true);
    expect(inputs[0]?.checked).toEqual(true);
    expect(inputs[1]?.checked).toEqual(false);
    userEvent.click(inputs[1]);
    state = element?.getState();
    expect(state.value).toEqual(false);
    expect(inputs[0]?.checked).toEqual(false);
    expect(inputs[1]?.checked).toEqual(true);
});

test('it should handle visible property', async () => {
    const f = {
        ...field,
        visible : false
    };

    const {container} = await helper(f);
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

    element.value = true;
    // @ts-ignore
    expect(err.textContent).toEqual('some description');

    element.value = null;
    // @ts-ignore
    expect(err.textContent).toEqual(DEFAULT_ERROR_MESSAGE);
});



test.todo('it should handle disable property');
test.todo('it should handle richTextTitle property');
test.todo('it should handle screenReaderText property');
test.todo('it should dispatch click event to controller');
