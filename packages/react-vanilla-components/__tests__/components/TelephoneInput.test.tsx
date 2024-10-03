/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import TelephoneInput from "../../src/components/TelephoneInput";
import userEvent from "@testing-library/user-event";
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';
import "@testing-library/jest-dom/extend-expect"

const field = {
    id: "telephoneinput-1b2c0a1fe8",
    fieldType: "text-input",
    name: "telephoneinput1701918444784",
    visible: true,
    type: "string",
    required: true,
    enabled: true,
    placeholder: 'Enter phone number',
    readOnly: false,
    pattern: "^[+]1[0-9]{0,10}$",
    label: {
      value: "Telephone Input",
      visible: true
    },
    ":type": "forms-components-examples/components/form/telephoneinput"
};
const helper = renderComponent(TelephoneInput);

describe('Telephone-input', () => {

    test('value entered by user in telephone input is set in model', async () => {
      const f = {
        ...field,
      };
      const { renderResponse, element } = await helper(f);
      const input = await renderResponse.findByPlaceholderText(f.placeholder);
      const inputVal = '98105';
      userEvent.type(input, inputVal);
      const state = element.getState();
      expect(state.value).toEqual(inputVal);
    });

  test('it should handle visible property', async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.label.value)).toBeNull();
  });

  test('error message element exists when the field is invalid', async () => {
    const f = {
      ...field,
      constraintMessages: {
        "pattern": "Enter correct number"
      },
    };
    let { renderResponse } = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = 'abc';
    userEvent.type(input, inputVal);
    expect(renderResponse.container.innerHTML).toContain('Enter correct number');
  });

  test('In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible', async () => {
    const f = {
      ...field,
      tooltip: 'Short Description',
      description: 'Mandatory',
      properties: {
        "afs:layout": {
            tooltipVisible: true
        },
      }
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText('Short Description')).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName('cmp-adaptiveform-telephoneinput__questionmark');
    userEvent.click(button[0]);
    expect(renderResponse.getByText('Mandatory')).not.toBeNull();
  });

  test('value entered by user in telephone input field is set in model', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = '+198105';
    userEvent.type(input, inputVal);
    const state = element.getState();
    expect(state.value).toMatch(inputVal);
  });

  test('Aria-describedby should contain long des short desc if present otherwise it should be empty', async () => {
    const f= {
      ...field,
      tooltip: "short description",
      description: "long description",
      properties: {
        "afs:layout": {
            tooltipVisible: true
        },
      }
    };
    const { renderResponse } = await helper(f);
    const input = renderResponse.container.getElementsByClassName("cmp-adaptiveform-telephoneinput__widget");
    expect(input).toHaveLength(1);
    expect(input[0]).toHaveAttribute('aria-describedby', `${f.id}__longdescription ${f.id}__shortdescription`)
  });

  test('it should handle maxlength constraint(entered value is more than max limit)', async () => {
    const f = {
      ...field,
      maxLength: 5
    };
    let { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    userEvent.type(input, '+192345');
    expect(element.getState().value).toEqual('+192345');
    const errorMsg = renderResponse.container.querySelector(`#${f.id}__errormessage`);
    expect(errorMsg).not.toBeNull();
  });

  test('it should handle maxlength constraint(entered value is equal to max limit)', async () => {
    const f = {
      ...field,
      maxLength: 5
    };
    let { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    userEvent.type(input, '+1923');
    expect(element.getState().value).toEqual('+1923');
    const errorMsg = renderResponse.container.querySelector(`#${f.id}__errormessage`);
    expect(errorMsg).toBeNull();
  });

  test('it should handle minLength constraint(entered value is less than min limit)', async () => {
    const f = {
      ...field,
      minLength: 5
    };
    let { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    userEvent.type(input, '+19');
    expect(element.getState().value).toEqual('+19');
    const errorMsg = renderResponse.container.querySelector(`#${f.id}__errormessage`);
    expect(errorMsg).not.toBeNull();
  });

  test('it should handle minLength constraint(entered value is more than min limit)', async () => {
    const f = {
      ...field,
      minLength: 5
    };
    let { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    userEvent.type(input, '+19234');
    expect(element.getState().value).toEqual('+19234');
    const errorMsg = renderResponse.container.querySelector(`#${f.id}__errormessage`);
    expect(errorMsg).toBeNull();
  });
});