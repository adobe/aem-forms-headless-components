/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import HorizontalTab from "../../src/components/tabs/HorizontalTab";
import React from "react";
import { render } from "@testing-library/react";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";

const emptyTabs = {
  id: "emptyTabs",
  ":type": "core/fd/components/form/tabsontop/v1/tabsontop",
  visible: true,
  label: { value: "empty label" },
  items: [],
  index: 0,
};

const tabsWithData = {
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
};

const helper = renderComponent(HorizontalTab);

test("Tabs should not rendered if item length is zero", () => {
  const { renderResponse } = helper(emptyTabs);
  expect(renderResponse.queryByText(emptyTabs.label.value)).not.toBeNull();
  const tabs = renderResponse.queryAllByRole("tablist");
  expect(tabs.length).toEqual(0);
  const tabPanels = renderResponse.queryAllByRole("tabpanel");
  expect(tabPanels.length).toEqual(0);
});

test("Tabs should not rendered if visible is false", () => {
  const sample = {
    ...emptyTabs,
    visible: false,
  };
  const { container } = render(<HorizontalTab {...sample} />);
  expect(container.innerHTML.length).toEqual(0);
});

test("clicking on the horizontal tabs should switch from one tab to another",() => {
  const { renderResponse } = helper(tabsWithData);
  const tablist = renderResponse.getAllByRole('tab');
  expect(tablist).toHaveLength(2);
  expect(tablist[0].className.includes('cmp-tabs__tab cmp-tabs__tab--active'))
  expect(tablist[1].className.includes('cmp-tabs__tab'))
  userEvent.click(tablist[1]);
  expect(tablist[0].className.includes('cmp-tabs__tab'))
  expect(tablist[1].className.includes('cmp-tabs__tab cmp-tabs__tab--active'))
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
  expect(renderResponse.queryByText(sample.label.value)).not.toBeNull();
  const tabs = renderResponse.queryAllByRole("tab");
  expect(tabs.length).toEqual(0);
  const tabPanels = renderResponse.queryAllByRole("tabpanel");
  expect(tabPanels.length).toEqual(0);
});

test('html in the label should be handled for non rich text', () => {
  const f = {
    ...tabsWithData,
    label: {
      value: '<p>title inside p tags</p>',
      richText: true,
      visible: true
    }
  }
  let { renderResponse } = helper(f);
  expect(renderResponse.container.innerHTML).toContain('<p>title inside p tags</p>');
});
