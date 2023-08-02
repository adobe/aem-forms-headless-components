/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Wizard from "../../src/components/Wizard";
import React from "react";
import { render } from "@testing-library/react";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";

const WizardWithData = {
  id: "wizard",
  ":type": "core/fd/components/form/wizard/v1/wizard",
  visible: true,
  label: { value: "Wizard" },
  index: 0,
  items: [
    {
      id: "field",
      fieldType: "text-field",
      visible: true,
      index: 0,
      label: { value: "text field label" },
    },
    {
      id: "tabsWithData",
      ":type": "core/fd/components/form/tabsontop/v1/tabsontop",
      visible: true,
      label: { value: "tab label" },
      index: 0,
      items: [
        {
          id: "field",
          name: "f1",
          fieldType: "text-field",
          visible: true,
          index: 0,
          label: { value: "text field label" },
        },
        {
          id: "field2",
          name: "f2",
          fieldType: "text-field",
          visible: true,
          index: 1,
          label: { value: "text field 2 label" },
        },
      ],
    }
  ],
};

const emptyWizard = {
  id: "emptyWizard",
  ":type": "core/fd/components/form/wizard/v1/wizard",
  visible: true,
  label: { value: "empty label" },
  items: [],
  index: 0,
};

test("clicking on the next tab should switch from one component to another and on clicking the previous button it should take to the previous component",() => {
  const helper = renderComponent(Wizard);
  const { renderResponse } = helper(WizardWithData);
  const NextTab = renderResponse.container.getElementsByClassName(
    "cmp-adaptiveform-wizard__nextNav"
  );
  const PrevTab = renderResponse.container.getElementsByClassName(
    "cmp-adaptiveform-wizard__previousNav"
  );
  expect(NextTab.length).toEqual(1);
  expect(PrevTab.length).toEqual(0);
  const tablist = renderResponse.getAllByRole('tab');
  expect(tablist).toHaveLength(2);
  expect(tablist[0].className.includes('cmp-adaptiveform-wizard__tab cmp-adaptiveform-wizard__tab--active'))
  expect(tablist[1].className.includes('cmp-adaptiveform-wizard__tab'))
  userEvent.click(NextTab[0])
  expect(NextTab.length).toEqual(0)
  expect(tablist[0].className.includes('cmp-adaptiveform-wizard__tab'))
  expect(tablist[1].className.includes('cmp-adaptiveform-wizard__tab cmp-adaptiveform-wizard__tab--active'))
  expect(PrevTab.length).toEqual(1);
});

test("Tabs should not rendered if all the items are not visible", () => {
  const helper = renderComponent(Wizard);
  const sample = {
    ...WizardWithData,
    items: WizardWithData.items.map((x) => ({
      ...x,
      visible: false,
    })),
  };
  const { renderResponse } = helper(sample);
  expect(renderResponse.queryByText(sample.label.value)).not.toBeNull();
  const tabs = renderResponse.queryAllByRole("navigation");
  expect(tabs.length).toEqual(0);
});

test("Hidden component should not be rendered",() => {
  const helper = renderComponent(Wizard);
  const sample = {
    ...WizardWithData,
    items: [
      {
        ...WizardWithData.items[0],
        visible: false,
      }
    ],
  };
  const { renderResponse } = helper(sample);
  const tabs = renderResponse.container.querySelectorAll('[role="navigation"]');
  expect(tabs.length).toEqual(0);
  let tabPanels = renderResponse.container.querySelectorAll(".f1");
  expect(tabPanels.length).toEqual(0);
});

test("Tabs should not rendered if item length is zero", () => {
  const helper = renderComponent(Wizard);
  const { renderResponse } = helper(emptyWizard);
  expect(renderResponse.queryByText(emptyWizard.label.value)).not.toBeNull();
  const tabs = renderResponse.queryAllByRole("navigation");
  expect(tabs.length).toEqual(0);
  const tabPanels = renderResponse.queryAllByRole("tabpanel");
  expect(tabPanels.length).toEqual(0);
});

test("Tabs should not rendered if visible is false", () => {
  const sample = {
    ...emptyWizard,
    visible: false,
  };
  const { container } = render(<Wizard {...sample} />);
  expect(container.innerHTML.length).toEqual(0);
});

test('In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible', () => {
  const f = {
    ...WizardWithData,
    tooltip: 'Short Description',
    description: 'Mandatory'
  };
  const helper = renderComponent(Wizard);
  const { renderResponse } = helper(f);
  expect(renderResponse.getByText('Short Description')).not.toBeNull();
  const button = renderResponse.container.getElementsByClassName('cmp-adaptiveform-wizard__questionmark');
  userEvent.click(button[0]);
  expect(renderResponse.getByText('Mandatory')).not.toBeNull();
});
