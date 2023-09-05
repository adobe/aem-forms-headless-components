/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import DropDown from "../../src/components/DropDown";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect"

const field = {
  name: "dropdown",
  id: 'dropdown1234',
  visible: true,
  label: {
    value: "Select an option",
  },
  fieldType: "drop-down",
  placeholder: "select",
  enum: [1, 2, 3],
  enumNames: ["Swift", "Alto", "Nexon"],
};
const helper = renderComponent(DropDown);

describe("Drop Down", () => {
  test("option selected by user is set in the model", async () => {
    const f = {
      ...field,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByLabelText('Select an option')).toBeInTheDocument();
    const dropdownButton = renderResponse.getByRole("button");
    userEvent.click(dropdownButton);
    const dropdownItem = await renderResponse.findByRole("option", { name: /swift/i });
    userEvent.click(dropdownItem);
    const typographyEl = await renderResponse.findByText(/swift/i);
    expect(typographyEl).toBeInTheDocument();
    userEvent.click(dropdownButton);
    const dropdownItem2 = await renderResponse.findByRole("option", { name: /alto/i });
    userEvent.click(dropdownItem2);
    const typographyEl2 = await renderResponse.findByText(/alto/i);
    expect(typographyEl2).toBeInTheDocument();
    userEvent.click(dropdownButton);
    const dropdownItem3 = await renderResponse.findByRole("option", { name: /nexon/i });
    userEvent.click(dropdownItem3);
    const typographyEl3 = await renderResponse.findByText(/nexon/i);
    expect(typographyEl3).toBeInTheDocument();
});

  
test("Selection made by the user sets the value", async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    const dropdownButton = renderResponse.getByRole("button");
    userEvent.click(dropdownButton);
    const dropdownItem = await renderResponse.findByRole("option", { name: /swift/i });
    userEvent.click(dropdownItem);
    const typographyEl = await renderResponse.findByText(/swift/i);
    expect(typographyEl).toBeInTheDocument();
    expect(element?.value).toEqual(1);
    userEvent.click(dropdownButton);
    const dropdownItem2 = await renderResponse.findByRole("option", { name: /alto/i });
    userEvent.click(dropdownItem2);
    const typographyEl2 = await renderResponse.findByText(/alto/i);
    expect(typographyEl2).toBeInTheDocument();
    expect(element?.value).toEqual(2);
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

  test("It should handle visible property", async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByTestId(`dropdown-select-${f?.id}`)).toBeNull();
  });

  test("In case of no error, description should be visible", async () => {
    const f = {
      ...field,
      description: "Mandatory",
    };
    const helper = renderComponent(DropDown);
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