import Accordion from "../../src/components/Accordion";
import React from "react";
import { render } from "@testing-library/react";
import { createForm, Provider } from "../utils";
import { renderComponent, DEFAULT_ERROR_MESSAGE } from "../utils";
import { jsonString } from "@aemforms/af-core";
import userEvent from "@testing-library/user-event";

const AccordionWithData = {
    id: "accordion",
    ":type": "accordion",
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
          name: "item_3",
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

  test("First tab should open by default and it should collapsed when clicked on other tab", () => {
     const helper = renderComponent(Accordion);
     const { renderResponse } = helper(AccordionWithData);
     const button = renderResponse.container.getElementsByClassName('cmp-accordion__button');
     expect(button).toHaveLength(2);
     expect(renderResponse.container.innerHTML).toContain('cmp-accordion__button cmp-accordion__button--expanded')
     userEvent.click(button[0]);
     expect(renderResponse.container.innerHTML).toContain('cmp-accordion__button');
     userEvent.click(button[1]);
     expect(renderResponse.container.innerHTML).toContain('cmp-accordion__button cmp-accordion__button--expanded');
  });

  test('Label of accordion should be visible', () => {
    const helper = renderComponent(Accordion);
    const { renderResponse } = helper(AccordionWithData);
    expect(renderResponse.queryByText(AccordionWithData.label.value)).not.toBeNull();
  });

  test('Individual label should be visible', () => {
    const helper = renderComponent(Accordion);
    const { renderResponse } = helper(AccordionWithData);
    const title = renderResponse.container.getElementsByClassName('cmp-accordion__title')
    expect(title).toHaveLength(2);
    expect(title).not.toBeNull();
  });

  test('In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible', async () => {
    const f = {
      ...AccordionWithData,
      tooltip: 'Short Description',
      description: 'Mandatory'
    };
    const helper = renderComponent(Accordion);
     const { renderResponse } = await helper(f);
     expect(renderResponse.getByText('Short Description')).not.toBeNull();
     const button = renderResponse.container.getElementsByClassName('cmp-accordion__questionmark');
     userEvent.click(button[0]);
     expect(renderResponse.getByText('Mandatory')).not.toBeNull();
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