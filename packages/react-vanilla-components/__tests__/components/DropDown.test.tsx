/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from "react";
import DropDown from "../../src/components/DropDown";
import { renderComponent, Provider } from "../utils";
import { render } from "@testing-library/react";
import { createFormInstance } from "@aemforms/af-core";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

const field = {
  name: "dropdown",
  visible: true,
  label: {
    value: "Drop Down",
  },
  fieldType: "drop-down",
  placeholder: "select",
  enum: [1, 2, 3],
  enumNames: [{
    value: "option 1"
  },
  {
    value: "option 2"
  },
  {
    value: "option 3"
  }],
};

const fieldTwo = {
  name: "dropdown",
  visible: true,
  label: {
    value: "Drop Down",
  },
  fieldType: "drop-down",
  placeholder: "select",
  enum: [1, 2, 3],
  enumNames: ["option 1", "option 2", "option 3"],
};

const fieldThree = {
  "id": "dropdown-9c692ef3f0",
  "fieldType": "drop-down",
  "name": "dropdown1760437590201",
  "visible": true,
  "type": "string",
  "enabled": true,
  "readOnly": false,
  "enforceEnum": true,
  "enumNames": [
      "set value",
      "clear value"
  ],
  "label": {
      "value": "set and clear dropdown below",
      "visible": true
  },
  "properties": {
      "typeIndex": "0",
      "fd:dor": {
          "dorExclusion": false
      },
      "fd:path": "/content/forms/af/test-rule-editor-dropdown/jcr:content/guideContainer/dropdown",
      "fd:rules": {
          "validationStatus": "valid"
      }
  },
  "events": {
      "change": [
          "if(contains($event.payload.changes[].propertyName, 'value'), if($field.$value == '1', dispatchEvent(dropdown_5080086641760437592391, 'custom:setProperty', {value : '1'}), {}), {})",
          "if(contains($event.payload.changes[].propertyName, 'value'), if(!($field.$value == '1'), dispatchEvent(dropdown_5080086641760437592391, 'reset'), {}), {})",
          "if(contains($event.payload.changes[].propertyName, 'value'), if(!($field.$value == '1'), dispatchEvent(dropdown_5080086641760437592391, 'custom:setProperty', {value : `null`}), {}), {})"
      ],
      "custom:setProperty": [
          "$event.payload"
      ]
  },
  "enum": [
      "1",
      "2"
  ],
  "placeholder": "choose the option",
  ":type": "forms-components-examples/components/form/dropdown"
}

const fieldFour = {
  "id": "dropdown-739587fe17",
  "fieldType": "drop-down",
  "name": "dropdown_5080086641760437592391",
  "visible": true,
  "type": "string",
  "enabled": true,
  "readOnly": false,
  "enforceEnum": true,
  "enumNames": [
      "option 1",
      "option 2"
  ],
  "label": {
      "value": "should clear when above changed",
      "visible": true
  },
  "properties": {
      "typeIndex": "0",
      "fd:dor": {
          "dorExclusion": false
      },
      "fd:path": "/content/forms/af/test-rule-editor-dropdown/jcr:content/guideContainer/dropdown_508008664"
  },
  "events": {
      "custom:setProperty": [
          "$event.payload"
      ]
  },
  "enum": [
      "1",
      "2"
  ],
  "placeholder": "choose the option",
  ":type": "forms-components-examples/components/form/dropdown"
}
const helper = renderComponent(DropDown);

describe("Drop Down", () => {
  test("option selected by user is set in the model", async () => {
    const f = {
      ...field,
    };
    const { renderResponse } = await helper(f);
    userEvent.selectOptions(
      renderResponse.getByRole("combobox"),
      renderResponse.getByRole("option", { name: "option 1" })
    );
    expect(
      renderResponse.getByRole("option", { name: "option 1" })
    ).toBeTruthy();
  });

  test("option selected by user is set in the model", async () => {
    const f = {
      ...fieldTwo,
    };
    const { renderResponse } = await helper(f);
    userEvent.selectOptions(
      renderResponse.getByRole("combobox"),
      renderResponse.getByRole("option", { name: "option 1" })
    );
    expect(
      renderResponse.getByRole("option", { name: "option 1" })
    ).toBeTruthy();
  });

  test("selection made by the user sets the value", async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    userEvent.click(renderResponse.getByTestId("select"));
    userEvent.selectOptions(
      renderResponse.getByRole("combobox"),
      renderResponse.getByRole("option", { name: "option 1" })
    );
    expect(element?.value).toEqual(1);
  });

  test("selection made by the user sets the value", async () => {
    const f = {
      ...fieldTwo,
    };
    const { renderResponse, element } = await helper(f);

    userEvent.click(renderResponse.getByTestId("select"));
    userEvent.selectOptions(
      renderResponse.getByRole("combobox"),
      renderResponse.getByRole("option", { name: "option 1" })
    );
    expect(element?.value).toEqual(1);
  });

  test("error message element exists when the field is invalid", async () => {
    const f = {
      ...field,
      valid: false,
      errorMessage: "Error",
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.errorMessage)).not.toBeNull();
  });

  test("it should handle visible property", async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByTestId("select")).toBeNull();
  });

  test("In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible", async () => {
    const f = {
      ...field,
      tooltip: "Short Description",
      description: "Mandatory",
      properties: {
        "afs:layout": {
            tooltipVisible: true
        },
      }
    };
    const helper = renderComponent(DropDown);
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText("Short Description")).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName(
      "cmp-adaptiveform-dropdown__questionmark"
    );
    userEvent.click(button[0]);
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

  test('Aria-describedby should contain long des short desc if present otherwise it should be empty', async () => {
    const f= {
      ...field,
      id: 'dropdown-123',
      tooltip: "short description",
      description: "long description",
      properties: {
        "afs:layout": {
            tooltipVisible: true
        },
      }
    };
    const { renderResponse } = await helper(f);
    const input = renderResponse.container.getElementsByClassName("cmp-adaptiveform-dropdown__widget");
    expect(input).toHaveLength(1);
    expect(input[0]).toHaveAttribute('aria-describedby', `${f.id}__longdescription ${f.id}__shortdescription`)
  });

  test("rule: selecting 'set value' sets target to '1' and selecting 'clear value' resets target", async () => {
    // Build a form with source and target dropdowns so rules can propagate
    const formJson = {
      items: [fieldThree, fieldFour]
    } as any;
    const form = createFormInstance(formJson);

    // Get initial states to render both components
    const sourceState = form.items[0].getState();
    const targetState = form.items[1].getState();

    const wrapper = Provider(form);
    const { getAllByRole } = render(
      <>
        {/* source dropdown with change rules */}
        {/* @ts-ignore */}
        <DropDown {...sourceState} />
        {/* target dropdown that receives set/reset via rules */}
        {/* @ts-ignore */}
        <DropDown {...targetState} />
      </>,
      { wrapper }
    );

    const [sourceSelect, targetSelect] = getAllByRole("combobox");

    // 1) Select 'set value' (enum '1') on source -> target should become '1'
    await userEvent.selectOptions(sourceSelect, "1");
    expect((targetSelect as HTMLSelectElement).value).toBe("1");

    // 2) Select 'clear value' (enum '2') on source -> target should reset to empty
    await userEvent.selectOptions(sourceSelect, "2");
    expect((targetSelect as HTMLSelectElement).value).toBe("");
  });
});
