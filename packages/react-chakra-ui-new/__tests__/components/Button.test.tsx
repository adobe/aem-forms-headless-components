/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Button from '../../src/components/Button';
import { renderComponent } from '../utils';

const field = {
  name: 'button',
  label: {
    value: 'button'
  },
  fieldType: 'button',
  visible: true
};
const helper = renderComponent(Button);

describe('Button', () => {

  test('should render with label', () => {
    const f = {
      ...field
    };
    const { renderResponse } = helper(f);
    const button = renderResponse.getByText(field.label.value);
    expect(button).toBeTruthy();
  });

  test('it should handle visible property', () => {
    const f = {
      ...field,
      visible: false
    };
    const { renderResponse } = helper(f);
    const button = renderResponse.queryByText(field.label.value);
    expect(button).toBeNull();
  });

  test('html in the label should be handled for non rich text', async () => {
    const f = {
      ...field,
      label: {
        value: '<p>title inside p tags</p>',
        richText: true,
        visible: true
      }
    };
    let { renderResponse } = await helper(f);
    expect(renderResponse.container.innerHTML).toContain('<p>title inside p tags</p>');
  });

});