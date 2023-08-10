/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import PlainText from '../../src/components/PlainText';
import { renderComponent } from '../utils';

const field = {
  name: "text",
  fieldType: "plain-text",
  value: "Plain Text",
  visible: true
};
const helper = renderComponent(PlainText);

describe('Plain Text', () => {

  test('should render with value', () => {
    const f = {
      ...field,
    };
    const { renderResponse } = helper(f);
    const form = renderResponse.getByText(field.value);
    expect(form).toBeTruthy();
  });

  test('should not render without value', () => {
    const f = {
      ...field,
      value: null
    };
    const { renderResponse } = helper(f);
    const form = renderResponse.queryByText(field.value);
    expect(form).toBeNull();
  });

})