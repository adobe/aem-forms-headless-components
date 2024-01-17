/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Switch from "../../src/components/Switch";
import { renderComponent } from "../utils";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

const field = {
  ":type": "core/fd/components/form/switch/v1/switch",
  name: "switch",
  label: {
    value: "Switch",
    visible: true,
  },
  visible: true,
  type: "boolean",
};

const helper = renderComponent(Switch);

describe("Switch", () => {
  test("Selection made by the user sets the value", async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    const input = (await renderResponse.queryByRole("switch")) as HTMLElement;
    userEvent.click(input);
    expect(element?.value).toEqual(true);
  });

  test("Switch with no off value should be invalid when unchecked", async () => {
    const f = {
      ...field,
      enum: [true],
      required: true,
    };
    const { renderResponse, element } = await helper(f);
    const input = (await renderResponse.queryByRole("switch")) as HTMLElement;
    userEvent.click(input);
    userEvent.click(input);
    let state = element?.getState();
    expect(state.valid).toBe(false);
  });

  test("HTML in the label should be handled for non rich text", async () => {
    const f = {
      ...field,
      label: {
        value: "<p>title inside p tags</p>",
        richText: true,
        visible: true,
      },
    };
    let { renderResponse } = await helper(f);
    expect(renderResponse.container.innerHTML).toContain(
      "<p>title inside p tags</p>"
    );
  });

  test("Switch should not be selected if value is not on", async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    const input = (await renderResponse.queryByRole("switch")) as HTMLElement;
    expect(input).not.toBeNull();
    const state = element?.getState();
    expect(state.valid).not.toBe(true);
  });

  test("Switch with no off value should get its value undefined when not selected", async () => {
    const f = {
      ...field,
      enum: [true],
    };
    const { renderResponse, element } = await helper(f);
    const input = (await renderResponse.queryByRole("switch")) as HTMLElement;
    userEvent.click(input);
    let state = element?.getState();
    expect(state.value).toBe(true);
    userEvent.click(input);
    state = element?.getState();
    expect(state.value).toBe(null);
  });

  test("On and Off labels should be visible", async () => {
    const f = {
      ...field,
      enumNames: ["ON", "OFF"],
      appliedCssClassNames: "cmp-adaptiveform-switch__unhide-labels",
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText("ON")).not.toBeNull();
    expect(renderResponse.getByText("OFF")).not.toBeNull();
  });

  test("By clicking on the switch, value at zeroth index in enum should get selected and on double clicking the value at first index should be selelcted", async () => {
    const f = {
      ...field,
      enum: ["1", "0"],
    };
    const { renderResponse, element } = await helper(f);
    const input = (await renderResponse.queryByRole("switch")) as HTMLElement;
    userEvent.click(input);
    let state = element?.getState();
    expect(state.value).toBe("1");
    userEvent.click(input);
    state = element?.getState();
    expect(state.value).toBe("0");
  });

  test("If default option is given, switch should be checked", async () => {
    const f = {
      ...field,
      default: "1",
    };
    const { element } = await helper(f);
    let state = element?.getState();
    expect(state.value).toBe("1");
  });
});
