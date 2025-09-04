/*
 * Copyright 2025 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React from "react";
import TermsAndCondtition from "../../src/components/TermsAndCondition";
import CheckBox from "../../src/components/CheckBox";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

interface IFormContext {
  form: any;
}

const TncWithText = {
  id: "termsandconditions-487758e736",
  fieldType: "panel",
  index: 0,
  name: "termsandconditions1699943580484",
  visible: true,
  type: "object",
  enabled: true,
  required: true,
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

const TncWithLinks = {
  id: "termsandconditions-05c52398a6",
  fieldType: "panel",
  name: "termsandconditions1727766863776",
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
      id: "checkbox-e9faeae444",
      fieldType: "checkbox",
      name: "approvalcheckbox",
      type: "string",
      required: true,
      enabled: false,
      enforceEnum: true,
      label: {
        value: "I agree to the terms & conditions",
      },
      enum: ["true"],
      ":type": "core/fd/components/form/checkbox/v1/checkbox",
    },
    {
      id: "toggleablelink-693ff08ea3",
      fieldType: "checkbox-group",
      name: "link1727766891986",
      visible: true,
      type: "string[]",
      enabled: true,
      readOnly: false,
      enforceEnum: true,
      enumNames: ["Google"],
      label: {
        value: "",
        visible: true,
      },
      properties: {
        "afs:layout": {
          orientation: "vertical",
        },
      },
      enum: ["https://www.google.com/"],
      ":type": "core/fd/components/form/toggleablelink/v1/toggleablelink",
    },
  ],
  ":type": "core/fd/components/form/termsandconditions/v1/termsandconditions",
};

const helper = renderComponent(TermsAndCondtition);

describe("TermsAndCondition Component", () => {
  const f = {
    ...TncWithText,
    properties: {
      "fd:showAsPopup": false,
    },
  };
  const { renderResponse, element } = helper(f);
  const FormContext = React.createContext<IFormContext | null>(null);

  const formMock = {
    getElement: jest.fn((id) => {
      return { enabled: true };
    }),
  };

  const renderWithFormContext = (props: any) => {
    return render(
      <FormContext.Provider value={{ form: formMock }}>
        <TermsAndCondtition {...props} />
      </FormContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.IntersectionObserver = jest.fn((callback) => {
      return {
        observe: jest.fn((element) => {
          callback([{ isIntersecting: true }]);
        }),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("enables checkbox component on scroll", async () => {
    renderWithFormContext(f);
    expect(
      renderResponse.container.querySelectorAll(".cmp-adaptiveform-text")
    ).not.toBeNull();
    expect(
      renderResponse.container.querySelectorAll(
        ".cmp-adaptiveform-checkbox__widget"
      )
    ).not.toBeNull();

    const textIntersect = renderResponse.container.querySelector(
      ".cmp-adaptiveform-termsandcondition__text-intersect"
    ) as Element;
    fireEvent.scroll(textIntersect);

    expect(formMock.getElement(f?.items[1]?.id).enabled).toBe(true);
  });

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
        properties: {
          "afs:layout": {
              tooltipVisible: true
          },
        }
      }
      const { renderResponse } = helper(f);
      expect(renderResponse.getByText("TNC Short Description")).not.toBeNull();
      const button = renderResponse.container.getElementsByClassName(
        "cmp-adaptiveform-termsandcondition__questionmark"
      );
      userEvent.click(button[0]);
      expect(renderResponse.getByText("TNC Long Mandatory")).not.toBeNull();
    });

});
