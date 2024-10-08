/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import NumberField from '../../src/components/NumberField';
import userEvent from "@testing-library/user-event";
import { renderComponent } from '../utils';
import "@testing-library/jest-dom/extend-expect";

const field = {
  name: 'number',
  label: {
    value: 'number field',
  },
  fieldType: 'number-input',
  placeholder: 'enter number field',
  visible: true,
  required: true,
};
const helper = renderComponent(NumberField);

describe('Number Field', () => {

  test('value entered by user in text field is set in model', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = '1992';
    userEvent.type(input, inputVal);
    const state = element.getState();
    expect(state.value).toEqual(1992);
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
    const button = renderResponse.container.getElementsByClassName('cmp-adaptiveform-numberinput__questionmark');
    userEvent.click(button[0]);
    expect(renderResponse.getByText('Mandatory')).not.toBeNull();
  });

  test('label is null if title is marked as hidden in the field', async () => {
    const f = {
      ...field,
      label: {
        ...field.label,
        visible: false
      }
    };
    const { renderResponse } = helper(f);
    expect(renderResponse.queryByText(f.label.value)).toBeNull();
  });

  test('labels and inputs are linked with for and id attribute', async () => {
    let { renderResponse } = await helper(field);
    const input = await renderResponse.findByPlaceholderText(field.placeholder);
    const label = await renderResponse.queryByText(field.label.value)
    expect(input?.getAttribute('id')).toEqual(label?.getAttribute('for'));
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

  test('Aria-describedby should contain long des short desc if present otherwise it should be empty', async () => {
    const f= {
      ...field,
      id: 'number-123',
      tooltip: "short description",
      description: "long description",
      properties: {
        "afs:layout": {
            tooltipVisible: true
        },
      }
    };
    const { renderResponse } = await helper(f);
    const input = renderResponse.container.getElementsByClassName("cmp-adaptiveform-numberinput__widget");
    expect(input).toHaveLength(1);
    expect(input[0]).toHaveAttribute('aria-describedby', `${f.id}__longdescription ${f.id}__shortdescription`)
  });
});