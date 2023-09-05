/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Accordion from "../../src/components/Accordion"
import { renderComponent } from "../utils";
import "@testing-library/jest-dom/extend-expect"
import userEvent from "@testing-library/user-event";

const AccordionWithData = {
    id: "accordion",
    ":type": "core/fd/components/form/accordion/v1/accordion",
    visible: true,
    label: { value: "Accordion" },
    index: 0,
    items: [
        {
          id: "panelcontainer-541adbc656",
          fieldType: "panel",
          name: "item_1",
          visible: true,
          enabled: true,
          items: [
            {
              id: "checkboxgroup-5f5468260f",
              fieldType: "checkbox-group",
              name: "checkboxgroup1675921070268",
              visible: true,
              type: "number[]",
              required: false,
              enumNames: [
                "Male",
                "Female"
              ],
              label: {
                value: "Check Box Group",
                visible: true,
              },
              enum: [
                0,
                1
              ],
            },
          ],
          label: {
            value: "Items",
            visible: true,

          },
        },
        {
          id: "panelcontainer-e48ec263e1",
          fieldType: "panel",
          name: "item_2",
          visible: true,
          enabled: true,
          items: [
            {
              id: "numberinput-d5f36deec8",
              fieldType: "number-input",
              name: "item_16824325701471682432584410",
              visible: true,
              type: "string",
              label: {
                value: "Number Input",
                visible: true,
              },
            }
          ],
          label: {
            value: "Number",
            visible: true,
          }
        }
      ],
  };

  test("First tab should open by default and on clicking it should get collapse", () => {
     const helper = renderComponent(Accordion);
     const { renderResponse } = helper(AccordionWithData);
     const button = renderResponse.getAllByRole('button')
     expect(button).toHaveLength(2);
     expect(button[0]).toHaveAttribute('aria-expanded', 'true');
     userEvent.click(button[0]);
     expect(button[0]).toHaveAttribute('aria-expanded', 'false');
  });

  test('Label of accordion should be visible', () => {
    const helper = renderComponent(Accordion);
    const { renderResponse } = helper(AccordionWithData);
    expect(renderResponse.queryByText(AccordionWithData.label.value)).not.toBeNull();
  });


  test('html in the label should be handled for non rich text', async () => {
    const helper = renderComponent(Accordion);
    const f =  {
      ...AccordionWithData,
      label: {
          value: '<p>title inside p tags</p>',
          richText: true,
          visible: true
      }
  }
   let {renderResponse} = await helper(f);
   expect(renderResponse.container.innerHTML).toContain( '<p>title inside p tags</p>');  
  });  


  test('Individual label should be visible', () => {
    const helper = renderComponent(Accordion);
    const { renderResponse } = helper(AccordionWithData);
    const title = renderResponse.getAllByTestId(`title-accordion-${AccordionWithData.id}`);
    expect(title).toHaveLength(2);
    expect(title).not.toBeNull();
  });