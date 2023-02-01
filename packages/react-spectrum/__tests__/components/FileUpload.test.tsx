/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import FileUpload from '../../src/components/FileUpload';
import userEvent from '@testing-library/user-event';
import {
    elementFetcher,
    filterTestTable,
    ignoredTestTable,
    InputFieldTestCase,
    renderComponent
} from '../utils';
import {FileObject} from '@aemforms/af-core';

const fieldWithValueAndMaxFileSize = {
    name: 'profile_image',
    type: 'file',
    maxFileSize: '5MB',
    label: {
        value: 'Profile Image'
    },
    default: {
        mediaType : 'application/pdf',
        name : 'abc.pdf',
        size : 2891829,
        data : 'http://abc.com/abc.pdf'
    }
};

const field = {
    name: 'profile',
    format: 'data-url',
    type: 'string',
    maxFileSize: '8MB',
    label: {
        value: 'Profile'
    }
};

const fieldWithMultipleFiles = {
    name: 'profiles',
    format: 'data-url',
    type: 'string[]',
    maxFileSize: '10MB',
    fieldType: 'file-input',
    label: {
        value: 'Multiple Profile'
    },
    default: [{
        mediaType : 'application/pdf',
        name : 'abc.pdf',
        size : 2891829,
        data : 'http://abc.com/abc.pdf'
    },{
        mediaType : 'application/pdf',
        name : 'def.pdf',
        size : 2891829,
        data : 'http://def.com/def.pdf'
    }]
};

type FileUploadExpectType = (l: HTMLLabelElement | null, i: HTMLInputElement | null, c: HTMLElement | null) => any

const labelInputTests: InputFieldTestCase<FileUploadExpectType>[] = [
    {
        name : 'a file input should render with value',
        field : fieldWithValueAndMaxFileSize,
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null, container : HTMLElement | null) => {
            expect(label?.textContent).toEqual('Profile Image');
            expect(input?.getAttribute('name')).toEqual('profile_image');
            expect(container?.querySelector('.file-metadata')?.textContent).toEqual('abc.pdf2892 kb');
        }
    },
    {
        name : 'a file input should render the description',
        field : {
            ...field,
            description : 'This description should be rendered in html'
        },
        x: true,
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null, container : HTMLElement | null) => {
            expect(container?.textContent).toContain('This description should be rendered in html');
        }
    },
    {
        name: 'field gets rendered without value',
        field: fieldWithValueAndMaxFileSize,
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null) => {
            expect(label?.textContent).toEqual('Profile Image');
            expect(input?.getAttribute('name')).toEqual('profile_image');
        }
    },
    {
        name : 'html in the label should be handled for non rich text label',
        field: {
            ...fieldWithValueAndMaxFileSize,
            label : {
                value : '<script>javascript</script><p>label inside p tags</p>'
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
        field: fieldWithValueAndMaxFileSize,
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('id')).not.toBeNull();
            expect(label?.getAttribute('for')).not.toBeNull();
            expect(input?.getAttribute('id')).toEqual(label?.getAttribute('for'));
        }
    },
    {
        name: 'labels and inputs are also linked with aria-labelledBy attribute',
        field: fieldWithValueAndMaxFileSize,
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-labelledBy')).not.toBeNull();
            expect(label?.getAttribute('id')).toEqual(input?.getAttribute('aria-labelledBy'));
        }
    },
    {
        name: 'required attribute properly set for required field',
        field: {
            ...fieldWithValueAndMaxFileSize,
            required : true
        },
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('required')).toEqual('');
        }
    },
    {
        name: 'disabled attribute properly set for readonly field',
        field: {
            ...fieldWithValueAndMaxFileSize,
            readOnly : true
        },
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('disabled')).toEqual('');
        }
    },
    {
        name: 'accessibility attributes are properly set for required field',
        field: {
            ...fieldWithValueAndMaxFileSize,
            required : true
        },
        x:true,
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-required')).not.toBeNull();
            expect(input?.getAttribute('aria-required')).toEqual('true');
        }
    },
    {
        name: 'label is null if label is marked as invisible in the field',
        field: {
            ...fieldWithValueAndMaxFileSize,
            label : {
                ...fieldWithValueAndMaxFileSize.label,
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
            label : {
                ...field.label,
                visible: false
            }
        },
        x: true,
        expects: (label : HTMLLabelElement | null, input : HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-label')).toEqual(field.label);
        }
    },
    {
        name: 'input is marked as aria-invalid when the field is invalid',
        field: {
            ...field,
            required: true
        },
        operation : (form, field) => {
            field.value = null;
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
        expects: (label ?: HTMLLabelElement | null, input?: HTMLInputElement | null) => {
            expect(input?.getAttribute('aria-invalid')).toEqual('false');
        }
    },
    {
        name : 'a file input should have undefined files property set if value is set',
        field : fieldWithValueAndMaxFileSize,
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null) => {
            expect(input?.files?.length).toEqual(0);
        }
    },
    {
        name : 'a file input should have undefined file property if data in value is set to web file API',
        field : {
            ...field,
            default : {
                mediaType : 'application/pdf',
                name : 'def.pdf',
                size : 2891829,
                data : new File([], 'def.pdf')
            }
        },
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null, container) => {
            // @ts-ignore
            expect(input?.files?.length).toEqual(0);
            expect(container?.querySelector('.file-metadata')?.textContent).toEqual('def.pdf2892 kb');
        }
    },
    {
        name : 'a file input should have undefined files property if data in value is set to URL',
        field : {
            ...field,
            default : {
                mediaType : 'application/pdf',
                name : 'def.pdf',
                size : 2891829,
                data : 'http://def.com/def.pdf'
            }
        },
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null, container) => {
            // @ts-ignore
            expect(input?.files?.length).toEqual(0);
            expect(container?.querySelector('.file-metadata')?.textContent).toEqual('def.pdf2892 kb');
        }
    },
    {
        name : 'a file input should not be set if data is not present',
        field : {
            name: 'name',
            label : {
                value : 'name'
            },
            visible : true
        },
        expects: (label : HTMLLabelElement | null, input: HTMLInputElement|null, container : HTMLElement | null) => {
            expect(input?.files?.length).toEqual(0);
            expect(container?.querySelector('.file-metadata')?.textContent).toBeUndefined();
        }
    }
];

const helper = renderComponent(FileUpload, elementFetcher);

test.each(filterTestTable(labelInputTests))('$name', async ({field, expects, operation}) => {
    let x = await helper(field, operation);
    expects(x.label, x.input, x.container);
});

ignoredTestTable(labelInputTests).forEach((v) => {
    test.todo(v.name);
});

test('file input with type file[] or string[] should have correct data and model value', async () => {
    const f = {
        ...fieldWithMultipleFiles
    };

    const {input, form, element} = await helper(f);
    let data = form.exportData();
    expect(data.profiles).toEqual(['http://abc.com/abc.pdf', 'http://def.com/def.pdf']);
    let state = element?.getState();
    let value = state.value;
    expect(value).not.toBeUndefined();
    expect(value).toBeInstanceOf(Array);
    // @ts-ignore
    expect(value.length).toEqual(2);
    // @ts-ignore
    expect(value[0]).toBeInstanceOf(FileObject);
    let file = new File(['(⌐□_□)'], 'chucknorris.pdf', { type: 'application/pdf' });
    // simulate upload event
    userEvent.upload(input as HTMLInputElement, file);
    state = element?.getState();
    value = state.value;
    // @ts-ignore
    expect(value.length).toEqual(3);
    // @ts-ignore
    expect(value[2]).toBeInstanceOf(FileObject);
});

test('file input with type file should have correct data and model value', async () => {
    const f = {
        ...fieldWithValueAndMaxFileSize
    };

    const {form, element} = await helper(f);
    let data = form.exportData();
    expect(data.profile_image).toEqual({data: 'http://abc.com/abc.pdf', mediaType: 'application/pdf', name: 'abc.pdf', size: 2891829});
    let state = element?.getState();
    let fieldJson = state;
    let value = fieldJson.value;
    expect(value).not.toBeUndefined();
    // @ts-ignore
    let controller = form?.getElement(fieldJson?.id);
    // in json, max file size is not serialized and is stored as a string
    expect(fieldJson.maxFileSize).toEqual('5MB');
    // in model, maxFileSize should be as number and in bytes so that it can be used in rules
    expect(controller.maxFileSize).toEqual(5242880);
    expect(value).toBeInstanceOf(FileObject);
});

test('file input with change in view should update model', async () => {
    const f = {
        ...field,
        required: true
    };

    const {input, form, element} = await helper(f);
    let file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    // in case of png this is called
    // @ts-ignore
    global.URL.createObjectURL = jest.fn();
    // simulate upload event
    userEvent.upload(input as HTMLInputElement, file);
    let state = element?.getState();
    expect(state.value).toBeInstanceOf(FileObject);
    // @ts-ignore
    expect(state.value?.data).toBeInstanceOf(File);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    // check attachments which is to be sent during submit
    //@ts-ignore
    let attachments = form?.getState().attachments;
    expect(Object.keys(attachments).length).toEqual(1);
});

test.todo('file input with minItems');
test.todo('file input with maxItems');
test.todo('file input with multipleMaxFilSize');

test('file input with accept validation', async () => {
  const f = {
      id:'fileid',
      type:'file',
      maxFileSize: '8MB',
      required: true,
      accept: ['image/png']
  };
  const {input, element, container} = await helper(f);
  const str = JSON.stringify({a:'aaaa'});
  const blob = new Blob([str]);
  const file = new File([blob], 'values.json', {
    type: 'application/JSON'
  });
  File.prototype.text = jest.fn().mockResolvedValueOnce(str);
  userEvent.upload(input as HTMLInputElement, file);
  let state = element?.getState();
  expect(state.valid).toEqual(false);
  const expected = 'There is an error in the field';
  expect(container.innerHTML).toContain(expected);
});

test('file input with value set as null in module should reflect view', async () => {
    const f = {
        ...field
    };

    const {input, element, container} = await helper(f);
    let file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    // in case of png this is called
    // @ts-ignore
    global.URL.createObjectURL = jest.fn();
    // simulate upload event
    userEvent.upload(input as HTMLInputElement, file);
    let state = element?.getState();
    expect(state.value).toBeInstanceOf(FileObject);
    // @ts-ignore
    expect(state.value?.data).toBeInstanceOf(File);
    // change the value to null and check view
    element.value = null;
    expect(container.innerHTML).not.toContain('chucknorris.png');
});
