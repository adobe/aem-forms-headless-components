/*
 * Copyright 2025 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import ToggleableLink from "../../src/components/ToggleableLink";
import { renderComponent } from "../utils";
import { fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const TncWithLink = {
  id: "toggleablelink-fbe77bf5a6",
  fieldType: "checkbox-group",
  name: "link1700040668210",
  visible: true,
  type: "string[]",
  enabled: true,
  readOnly: false,
  enforceEnum: true,
  enum: ["https://www.google.com", "https://www.youtube.com"],
  ":type": "core/fd/components/form/toggleablelink/v1/toggleablelink",
  enumNames: [
    {
      value: "label for the link",
    },
    {
      value: "link",
    },
  ],
};

describe("ToggleableLink component", () => {
  test("When clicked on links, filled class should be added", async () => {
    const helper = renderComponent(ToggleableLink);
    const { renderResponse } = await helper(TncWithLink);
    const linkElement = renderResponse.getByText("label for the link");
    expect(linkElement).toBeInTheDocument();
    fireEvent.click(linkElement);
    expect(renderResponse.container.innerHTML).toContain(
      "cmp-adaptiveform-checkboxgroup cmp-adaptiveform-checkboxgroup--filled"
    );
  });
});
