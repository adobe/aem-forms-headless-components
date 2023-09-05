/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Wizard from "../../src/components/Wizard";
import React from "react";
import "@testing-library/jest-dom/extend-expect"
import { render } from "@testing-library/react";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";

const WizardWithData = {
  id: "wizard-b1560be6ae",
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
        name: 'number',
        id: 'field3',
        label: {
          value: 'number field',
        },
        fieldType: 'number-input',
        placeholder: 'enter number field',
        visible: true,
        required: true,
        index: 1,
      },
    {
        name: 'number',
        id: 'field3',
        label: {
          value: 'number field',
        },
        fieldType: 'number-input',
        placeholder: 'enter number field',
        visible: true,
        required: true,
        index: 2,
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

test("Initially previous button should be disabled and clicking on the next button, panel should switch from one component to another and on clicking the previous button it should take to the previous component and next button should be disabled at the end",() => {
  const helper = renderComponent(Wizard);
  const { renderResponse } = helper(WizardWithData);
  const tabs = renderResponse.queryAllByTestId(`tab-list-${WizardWithData?.id}`)
  const nextBtn = renderResponse.queryAllByTestId(`Next-btn-${WizardWithData?.id}`);
  const prevBtn = renderResponse.queryAllByTestId(`Back-btn-${WizardWithData?.id}`);
  expect(prevBtn[0]).toHaveAttribute('disabled')
  expect(tabs).toHaveLength(3);
  let tab1Active=  tabs[0].querySelector('.Mui-active');
  expect(tab1Active).toBeInTheDocument();
  userEvent.click(nextBtn[0]);
  let tab2Active=  tabs[1].querySelector('.Mui-active');
  expect(tab2Active).toBeInTheDocument();
  userEvent.click(nextBtn[0]);
  let tab3Active=  tabs[2].querySelector('.Mui-active');
  expect(tab3Active).toBeInTheDocument();
  expect(nextBtn[0]).toHaveAttribute('disabled');
  userEvent.click(prevBtn[0]);
  let tabTwoActive=  tabs[1].querySelector('.Mui-active');
  expect(tabTwoActive).toBeInTheDocument();
});

test("Tabs should not rendered if all the items are not visible", () => {
  const helper = renderComponent(Wizard);
  const sample = {
    ...WizardWithData,
    visible: false,
    items: WizardWithData.items.map((x) => ({
      ...x,
      visible: false,
    })),
  };
  const { renderResponse } = helper(sample);
  const wizard = renderResponse.queryByTestId(`wizard-container-${sample.id}`);
  expect(wizard).not.toBeInTheDocument();
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
  const tabs = renderResponse.queryAllByTestId(`tab-Panel-${sample.items[0].index}`);
  expect(tabs.length).toEqual(0);
});

test("Tabs should not rendered if item length is zero", () => {
  const helper = renderComponent(Wizard);
  const { renderResponse } = helper(emptyWizard);
  const tabs = renderResponse.queryAllByTestId(`tab-list-${emptyWizard?.id}`);
  expect(tabs.length).toEqual(0);
  const tabPanels = renderResponse.queryAllByTestId(`tab-Panel-${emptyWizard?.index}`);
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

