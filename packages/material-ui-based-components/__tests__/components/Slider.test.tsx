/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Slider from "../../src/components/Slider";
import { renderComponent, DEFAULT_ERROR_MESSAGE } from "../utils";
import {fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"

const field = {
        ":type": "core/fd/components/form/slider/v1/slider",
        name: "slider",
        visible: true,
        type: "number",
        fieldType:"number-input",
        minimum: 10,
        maximum: 200,
        enabled: true,
        label: {
          "value": "On",
          "visible": true
        }
};
const helper = renderComponent(Slider);

describe('Slider', () => {
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
        valid: false,
        errorMessage: DEFAULT_ERROR_MESSAGE
      };
      const { renderResponse } = await helper(f);
      expect(renderResponse.queryByText(DEFAULT_ERROR_MESSAGE)).not.toBeNull()
    });
  
    test('In case of no error, description should be visible', async () => {
      const f = {
        ...field,
        description: 'Mandatory'
      };
      const { renderResponse } = await helper(f);
      expect(renderResponse.getByText('Mandatory')).not.toBeNull();
    });
  
    test('it should handle maxlength constraint', async () => {
      let { renderResponse } = await helper(field);
      const input = await renderResponse.container.querySelector('input[type="range"]') as HTMLElement;
      expect(input).toHaveAttribute('max', '200');
      expect(input).toHaveAttribute('min', '10');
      const sliderBtn = renderResponse.container.getElementsByClassName("MuiSlider-thumb MuiSlider-thumbSizeMedium MuiSlider-thumbColorPrimary MuiSlider-thumb MuiSlider-thumbSizeMedium MuiSlider-thumbColorPrimary css-eg0mwd-MuiSlider-thumb")
      expect(sliderBtn).toHaveLength(1);
      fireEvent.change(input, {target: {value: 32}});
      expect(input).toHaveAttribute('aria-valuenow', '32');
    });
  });