/*
 * Copyright 2024 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import ReCaptcha from "../../src/components/ReCaptcha";
import { renderComponent } from '../utils';

const field = {
  name: 'recaptcha',
  label: {
    value: 'ReCaptcha',
    visible: true,
  },
  fieldType: 'captcha',
  required: true,
  properties: {
    'fd:captcha': {
      config: {
        siteKey: 'test-site-key',
        size: 'normal',
        theme: 'light',
        type: 'image'
      }
    }
  }
};

const helper = renderComponent(ReCaptcha);

describe('ReCaptcha', () => {

  test('Should render label', async () => {
    const f = {
      ...field,
    };
    const { renderResponse } = await helper(f);
    const res = await renderResponse.findByText(f.label.value)
    expect(res.innerHTML).toEqual(f.label.value);
  });

  test('Should  not render label', async () => {
    const f = {
      ...field,
      label: {
        value: 'ReCaptcha',
        visible: false,
      },
    };
    const { renderResponse } = await helper(f);
    const res = await renderResponse.queryByText(f.label.value)
    expect(res).toEqual(null);
  });

});





