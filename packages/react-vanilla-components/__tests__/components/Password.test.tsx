/*
 * Copyright 2026 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdaptiveForm } from "@aemforms/af-react-renderer";
import Password from "../../src/components/Password";
import mappings from "../../src/utils/mappings";
import { renderComponent, DEFAULT_ERROR_MESSAGE } from "../utils";
import "@testing-library/jest-dom/extend-expect";

const field = {
  name: "password",
  label: {
    value: "Password",
  },
  fieldType: "password",
  placeholder: "enter password",
  visible: true,
  required: true,
};

const helper = renderComponent(Password);

describe("Password Field", () => {
  test("value entered by user in password field is set in model", async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = "abc";
    userEvent.type(input, inputVal);
    const state = element.getState();
    expect(state.value).toEqual(inputVal);
  });

  test("the widget renders as a masked password input by default", async () => {
    const { renderResponse } = await helper(field);
    const input = await renderResponse.findByPlaceholderText(field.placeholder);
    expect(input).toHaveAttribute("type", "password");
  });

  test("the show/hide toggle reveals and re-masks the value", async () => {
    const { renderResponse } = await helper(field);
    const input = await renderResponse.findByPlaceholderText(field.placeholder);
    const toggle = renderResponse.container.getElementsByClassName("cmp-adaptiveform-passwordinput__toggle-visibility")[0];
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  test("the toggle is not rendered when fd:showHidePassword is false", async () => {
    const f = {
      ...field,
      properties: {
        "fd:showHidePassword": false,
      },
    };
    const { renderResponse } = await helper(f);
    const toggle = renderResponse.container.getElementsByClassName("cmp-adaptiveform-passwordinput__toggle-visibility");
    expect(toggle).toHaveLength(0);
  });

  test("it should handle visible property", async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.label.value)).toBeNull();
  });

  test("error message element exists when the field is invalid", async () => {
    const f = {
      ...field,
      valid: false,
      errorMessage: DEFAULT_ERROR_MESSAGE,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(DEFAULT_ERROR_MESSAGE)).not.toBeNull();
  });

  test('labels and inputs are linked with for and id attribute', async () => {
    let { renderResponse } = await helper(field);
    const input = await renderResponse.findByPlaceholderText(field.placeholder);
    const label = await renderResponse.queryByText(field.label.value)
    expect(input?.getAttribute('id')).toEqual(label?.getAttribute('for'));
  });

  test('Aria-describedby should contain long des short desc if present otherwise it should be empty', async () => {
    const f= {
      ...field,
      id: 'password-123',
      tooltip: "short description",
      description: "long description",
      properties: {
        "afs:layout": {
            tooltipVisible: true
        },
      }
    };
    const { renderResponse } = await helper(f);
    const input = renderResponse.container.getElementsByClassName("cmp-adaptiveform-passwordinput__widget");
    expect(input).toHaveLength(1);
    expect(input[0]).toHaveAttribute('aria-describedby', `${f.id}__longdescription ${f.id}__shortdescription`)
  });
});

describe("AEM-exported password form resolved via mappings", () => {
  // Minimal adaptive-form model mirroring what AEM exports for the password core component.
  // The field carries fieldType "password" but a :type of "forms-components-examples/components/form/passwordinput"
  // (the examples proxy resource type, which is NOT in mappings) — so headless resolution relies on the fieldType key.
  const formJson: any = {
    id: "passwordform",
    fieldType: "form",
    adaptiveform: "0.15.2",
    metadata: { grammar: "json-formula-1.0.0", version: "1.0.0" },
    ":itemsOrder": ["passwordinput1"],
    ":items": {
      passwordinput1: {
        id: "passwordinput-1",
        fieldType: "password",
        name: "passwordinput1",
        type: "string",
        label: { value: "Password Input 1" },
        ":type": "forms-components-examples/components/form/passwordinput",
      },
    },
  };

  test("resolves the password field via its fieldType and renders a masked widget", async () => {
    const { container } = render(<AdaptiveForm formJson={formJson} mappings={mappings} />);

    const widget = await waitFor(() => {
      const w = container.getElementsByClassName("cmp-adaptiveform-passwordinput__widget");
      expect(w.length).toBe(1);
      return w[0];
    });

    // Masked by default, confirming resolution to our Password component (not the :type key).
    expect(widget).toHaveAttribute("type", "password");
  });
});
