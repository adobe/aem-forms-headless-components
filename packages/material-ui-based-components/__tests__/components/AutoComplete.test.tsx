/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import AutoComplete from "../../src/components/AutoComplete";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect"

const field = {
  ":type":"core/fd/components/form/autocomplete/v1/autocomplete",
  name: "dropdown",
  visible: true,
  label: {
    value: "Select an option",
  },
  enum: [1, 2, 3],
  enumNames: ["Swift", "Alto", "Nexon"],
};
const helper = renderComponent(AutoComplete);

describe("Autocomplete", () => {
  test("option selected by user is set in the model", async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    expect(renderResponse.getByLabelText('Select an option')).toBeInTheDocument();
    const dropdownButton = renderResponse.getByRole("button");
    userEvent.click(dropdownButton);
    const dropdownItem = await renderResponse.findByRole("combobox");
    expect(dropdownItem).toHaveAttribute('aria-expanded', 'true');
    expect(element.getState().value).toEqual(undefined);
    const dropdownItemList = await renderResponse.findByRole("option", { name: /swift/i });
    userEvent.click(dropdownItemList);
    expect(dropdownItem).toHaveAttribute('value', 'Swift');
    expect(element.getState().value).toEqual(1);
    userEvent.click(dropdownButton);
    const dropdownItemListTwo = await renderResponse.findByRole("option", { name: /alto/i });
    userEvent.click(dropdownItemListTwo);
    expect(dropdownItem).toHaveAttribute('value', 'Alto');
    expect(element.getState().value).toEqual(2);
    userEvent.click(dropdownButton);
    const dropdownItemListThree = await renderResponse.findByRole("option", { name: /nexon/i });
    userEvent.click(dropdownItemListThree);
    expect(dropdownItem).toHaveAttribute('value', 'Nexon');
    expect(element.getState().value).toEqual(3);
});

  test("Error message element exists when the field is invalid", async () => {
    const f = {
      ...field,
      valid: false,
      errorMessage: "Error",
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.errorMessage)).not.toBeNull();
  });

  test("In case of no error, description should be visible", async () => {
    const f = {
      ...field,
      description: "Mandatory",
    };
    const helper = renderComponent(AutoComplete);
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText("Mandatory")).not.toBeNull();
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
 })