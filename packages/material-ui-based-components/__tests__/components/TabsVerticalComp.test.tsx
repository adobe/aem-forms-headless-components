/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import TabsHorizontalComp from '../../src/components/TabsHorizontalComp'
import React from "react";
import { render } from "@testing-library/react";
import { renderComponent } from "../utils";
import "@testing-library/jest-dom/extend-expect"
import userEvent from "@testing-library/user-event";

const emptyTabs = {
  id: "emptyTabs",
  ":type": "core/fd/components/form/verticaltabs/v1/verticaltabs",
  visible: true,
  label: { value: "empty label" },
  items: [],
  index: 0,
};

const tabsWithData = {
  id: "tabsWithData",
  ":type": "core/fd/components/form/verticaltabs/v1/verticaltabs",
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
};

const helper = renderComponent(TabsHorizontalComp);

test("Tabs should not rendered if item length is zero", () => {
  const { renderResponse } = helper(emptyTabs);
  const tabs = renderResponse.queryAllByRole("tab");
  expect(tabs.length).toEqual(0);
  const tabPanels = renderResponse.queryAllByRole("tabpanel");
  expect(tabPanels.length).toEqual(0);
});

test("Tabs should not rendered if visible is false", () => {
  const sample = {
    ...emptyTabs,
    visible: false,
  };
  const { container } = render(<TabsHorizontalComp {...sample} />);
  expect(container.innerHTML.length).toEqual(0);
});

test("clicking on the horizontal tabs should switch from one tab to another",() => {
  const { renderResponse } = helper(tabsWithData);
  const tablist = renderResponse.getAllByRole('tab');
  expect(tablist).toHaveLength(2);
  expect(tablist[0]).toHaveAttribute('aria-selected', 'true');
  expect(tablist[1]).toHaveAttribute('aria-selected', 'false');
  userEvent.click(tablist[1]);
  expect(tablist[0]).toHaveAttribute('aria-selected', 'false');
  expect(tablist[1]).toHaveAttribute('aria-selected', 'true');
});

test("tabs should get rendered with undefined element if no mapping is defined", () => {
  const { renderResponse } = helper(tabsWithData);
  const tabs = renderResponse.container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(2);
  const tabPanels = renderResponse.container.querySelectorAll(".undefined-element");
  expect(tabPanels.length).toEqual(0);
});

test("hidden tabs should not be rendered", () => {
  const sample = {
    ...tabsWithData,
    items: [
      {
        ...tabsWithData.items[0],
        visible: false,
      },
      {
        ...tabsWithData.items[1],
      },
    ],
  };
  const { renderResponse } = helper(sample);
  const tabs = renderResponse.container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(1);
});

test("Tabs should not rendered if all the items are not visible", () => {
  const sample = {
    ...tabsWithData,
    items: tabsWithData.items.map((x) => ({
      ...x,
      visible: false,
    })),
  };
  const { renderResponse } = helper(sample);
  const tabs = renderResponse.queryAllByRole("tab");
  expect(tabs.length).toEqual(0);
  const tabPanels = renderResponse.queryAllByRole("tabpanel");
  expect(tabPanels.length).toEqual(0);
});

