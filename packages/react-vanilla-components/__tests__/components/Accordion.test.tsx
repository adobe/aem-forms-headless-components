import Accordion from "../../src/components/Accordion/Accordion"
import { renderComponent } from "../utils";
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

  const AccordionwithRepeatData = { "fieldType": "panel",
  ":type": "accordion",
  "name": "guests",
  "items": [
      {
          "fieldType": "panel",
          "name": "guestDetails",
          "repeatable": true,
          "minOccur": 1,
          "maxOccur": 3,
          "label": {
              "value": "Guest Details",
              "visible": false
          },
          "items": [
            {
              "fieldType": "panel",
              "items": [
                {
                  "fieldType": "text-input",
                  "name": "guestName",
                  "label": {
                      "value": "Full Name"
                  },
                  "required": true,
                  "constraintMessages": {
                      "required": "Required field"
                  }
              },
              {
                  "fieldType": "text-input",
                  "name": "guestAadhar",
                  "label": {
                      "value": "Enter your <b>Aadhar Number</b>",
                      "richText": true
                  },
                  "format": "XXXX XXXX XXXX",
                  "maxLength": 14,
                  "description": "Your format is XXXX XXXX XXXX",
                  "placeholder": "XXXX XXXX XXXX",
                  "required": true,
                  "constraintMessages": {
                      "required": "Required field"
                  }
              }
              ]
            }
          ]
      }]}

  test("First tab should open by default and on clicking it should get collapse", () => {
     const helper = renderComponent(Accordion);
     const { renderResponse } = helper(AccordionWithData);
     const button = renderResponse.container.getElementsByClassName('cmp-accordion__button');
     expect(button).toHaveLength(2);
     expect(button[0].className.includes("cmp-accordion__button cmp-accordion__button--expanded"))
     expect(button[1].className.includes("cmp-accordion__button"));
     userEvent.click(button[0])
     expect(button[0].className.includes("cmp-accordion__button"))
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

  test('On click of add button, panel should be added and by reaching to max item limit, add button should get disappear', () => {
    const helper = renderComponent(Accordion);
    const { renderResponse } = helper(AccordionwithRepeatData);
    const button = renderResponse.container.getElementsByClassName("cmp-accordion__add-button");
    expect(button.length).toBe(1);
    const panel = renderResponse.container.getElementsByClassName("cmp-accordion__item")
    userEvent.click(button[0]);
    expect(button.length).toBe(2)
    expect(panel.length).toBe(2)
    userEvent.click(button[1])
    expect(panel.length).toBe(3);
    expect(button.length).toBe(0)
  });

  test('Initially remove button should not be visible in the panel and when panel is added, it must appear', () => {
    const helper = renderComponent(Accordion);
    const { renderResponse } = helper(AccordionwithRepeatData);
    const AddButton = renderResponse.container.getElementsByClassName("cmp-accordion__add-button");
    expect(AddButton.length).toBe(1);
    const RemoveButton = renderResponse.container.getElementsByClassName("cmp-accordion__remove-button");
    expect(RemoveButton.length).toBe(0);
    const panel = renderResponse.container.getElementsByClassName("cmp-accordion__item");
    expect(panel.length).toBe(1)
    userEvent.click(AddButton[0])
    expect(RemoveButton.length).toBe(2);
    userEvent.click(RemoveButton[1]);
    expect(panel.length).toBe(1)
    expect(RemoveButton.length).toBe(0);
  })
