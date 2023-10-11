/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import CheckBox from '../../src/components/CheckBox';
import { renderComponent } from '../utils';
import userEvent from "@testing-library/user-event";

const field = {
  name: 'checkbox',
  label: {
    value: 'CheckBox Button',
    visible: true
  },
  fieldType: 'checkbox',
  visible: true,
  type: 'boolean',
};

const helper = renderComponent(CheckBox);

describe('Checkbox', () => {

  test('Snapshot', async () => {
    const { renderResponse } = await helper(field);
    expect(renderResponse.container).toMatchSnapshot();
  });

  test('selection made by the user sets the value', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.container.getElementsByClassName("cmp-adaptiveform-checkbox__widget");
    userEvent.click(input[0]);
    expect(element?.value).toEqual(true);
  });

  test('clicking on checkbox twice resets the value', async () => {
    const f = {
      ...field,
      enum: [false, true],
      value: [true, false]
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.container.getElementsByClassName("cmp-adaptiveform-checkbox__widget");
    userEvent.click(input[0]);
    userEvent.click(input[0]);
    expect(element?.getState().value).toEqual(element.value);
  });

  test('a checkbox with no off value should get its value undefined when not selected', async () => {
    const f = {
      ...field,
      enum: [true],
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.container.getElementsByClassName("cmp-adaptiveform-checkbox__widget");
    userEvent.click(input[0]);
    let state = element?.getState();
    expect(state.value).toBe(true);
    userEvent.click(input[0]);
    state = element?.getState();
    expect(state.value).toBe(null);
  });

  test('a checkbox with no off value should be valid when not required', async () => {
    const f = {
      ...field,
      enum: [true],
    };
    const { renderResponse, form, element } = await helper(f);
    const input = await renderResponse.container.getElementsByClassName("cmp-adaptiveform-checkbox__widget");
    userEvent.click(input[0]);
    let data = form?.exportData();
    expect(data.checkbox).toEqual(true);
    userEvent.click(input[0]);
    expect(element?.valid).not.toBe(false);
  });

  test('a checkbox should render if there are no options', async () => {
    const { renderResponse, element } = await helper({ ...field });
    const input = await renderResponse.container.getElementsByClassName("cmp-adaptiveform-checkbox__widget");
    userEvent.click(input[0]);
    userEvent.click(input[0]);
    expect(element?.getState().valid).toBe(true);
  });

  test('a checkbox should be selected if value is on', async () => {
    const f = {
      ...field,
      value: true,
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.container.getElementsByClassName("cmp-adaptiveform-checkbox__widget");
    expect(input).not.toBeNull();
    let state = element?.getState();
    expect(state.valid).not.toBe(true);
  });

  test('a checkbox should not be selected if value is not on', async () => {
    const f = {
      ...field,
      enum: [false, true],
      value: true,
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.container.getElementsByClassName("cmp-adaptiveform-checkbox__widget");
    expect(input).not.toBeNull();
    const state = element?.getState();
    expect(state.valid).not.toBe(true);
  });

  test('a required checkbox with no off value should be invalid when unchecked', async () => {
    const f = {
      ...field,
      enum: [true],
      required: true,
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.container.getElementsByClassName("cmp-adaptiveform-checkbox__widget");
    userEvent.click(input[0]);
    userEvent.click(input[0]);
    let state = element?.getState();
    expect(state.valid).toBe(false);
  });

  test('html in the label should be handled for non rich text', async () => {
    const f = {
      ...field,
      label: {
        value: '<p>title inside p tags</p>',
        richText: true,
        visible: true
      }
    }
    let { renderResponse } = await helper(f);
    expect(renderResponse.container.innerHTML).toContain('<p>title inside p tags</p>');
  });

});