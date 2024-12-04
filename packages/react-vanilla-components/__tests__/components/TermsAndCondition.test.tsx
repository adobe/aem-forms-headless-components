/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import TermsAndCondtition from "../../src/components/TermsAndCondition";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const TncWithText = {
  id: "termsandconditions-487758e736",
  fieldType: "panel",
  name: "termsandconditions1699943580484",
  visible: true,
  type: "object",
  enabled: true,
  readOnly: false,
  label: {
    value: "Terms And Conditions",
    visible: true,
  },
  items: [
    {
      id: "text-897353d003",
      fieldType: "plain-text",
      name: "consenttext",
      value:
        "<p>Coal is a valuable hard, black material extracted from mines. Wood that has been buried for a long time becomes coal due to a chemical change. Earthquakes cause vast forest areas to sink underground and contribute to such changes as a result of tremendous heat and pressure. Coal mines can be found in our country at&nbsp; Dhanbad, Jharia, Giridih, Chaibasa, and other locations. Coal is exported from India to Japan, Nepal, and Bangladesh. Coal is used as a fuel in both homes and factories and industries. The majority of trains and steamers move by burning coal in steam engines.Text related to the terms and conditions come here&nbsp;Coal is a valuable hard, black material extracted from mines. Wood that has been buried for a long time becomes coal due to a chemical change. Earthquakes cause vast forest areas to sink underground and contribute to such changes as a result of tremendous heat and pressure. Coal mines can be found in our country at&nbsp; Dhanbad, Jharia, Giridih, Chaibasa, and other locations. Coal is exported from India to Japan, Nepal, and Bangladesh. Coal is used as a fuel in both homes and factories and industries. The majority of trains and steamers move by burning coal in steam engines.Coal is a valuable hard, black material extracted from mines. Wood that has been buried for a long time becomes coal due to a chemical change. Earthquakes cause vast forest areas to sink underground and contribute to such changes as a result of tremendous heat and pressure. Coal mines can be found in our country at&nbsp; Dhanbad, Jharia, Giridih, Chaibasa, and other locations. Coal is exported from India to Japan, Nepal, and Bangladesh. Coal is used as a fuel in both homes and factories and industries. The majority of trains and steamers move by burning coal in steam engines.Coal is a valuable hard, black material extracted from mines. Wood that has been buried for a long time becomes coal due to a chemical change. Earthquakes cause vast forest areas to sink underground and contribute to such changes as a result of tremendous heat and pressure. Coal mines can be found in our country at&nbsp; Dhanbad, Jharia, Giridih, Chaibasa, and other locations. Coal is exported from India to Japan, Nepal, and Bangladesh. Coal is used as a fuel in both homes and factories and industries. The majority of trains and steamers move by burning coal in steam engines.</p>\r\n",
      richText: true,
      ":type": "core/fd/components/form/text/v1/text",
    },
    {
      id: "checkbox-51ef7198cd",
      fieldType: "checkbox",
      name: "approvalcheckbox",
      type: "string",
      enabled: false,
      enforceEnum: true,
      label: {
        value: "I agree to the terms & conditions",
      },
      enum: ["true"],
    },
  ],
  ":type": "forms-components-examples/components/form/termsandconditions",
};

const helper = renderComponent(TermsAndCondtition);

describe("Tnc", () => {
  test("it should handle visible property", async () => {
    const f = {
      ...TncWithText,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.label.value)).toBeNull();
  });

  test("In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible", () => {
    const f = {
      ...TncWithText,
      tooltip: "TNC Short Description",
      description: "TNC Long Mandatory",
    };
    const { renderResponse } = helper(f);
    expect(renderResponse.getByText("TNC Short Description")).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName(
      "cmp-adaptiveform-termsandcondition__questionmark"
    );
    userEvent.click(button[0]);
    expect(renderResponse.getByText("TNC Long Mandatory")).not.toBeNull();
  });

  test("Modal pop-up", async () => {
    const f = {
      ...TncWithText,
      properties: {
        isPopUp: true,
      },
    };
    const { renderResponse } = helper(f);
    expect(renderResponse.container.innerHTML).toContain(
      "cmp-adaptiveform-termsandcondition__header"
    );
    expect(renderResponse.container.innerHTML).toContain(
      "cmp-adaptiveform-termsandcondition__content-container cmp-adaptiveform-termsandcondition__content-container--modal"
    );
  });

  it("enables checkboxes when intersection occurs", () => {});
});
