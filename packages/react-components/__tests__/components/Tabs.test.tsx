import HorizontalTab from "../../src/components/tabs/HorizontalTab";
import React from "react";
import { render } from "@testing-library/react";
import { createForm, Provider } from "../utils";
import { renderComponent } from "../utils";
import userEvent from "@testing-library/user-event";

const emptyTabs = {
  id: "emptyTabs",
  ":type": "custom:horizontal-tab",
  visible: true,
  label: { value: "empty label" },
  items: [],
  index: 0,
};

const tabsWithData = {
  id: "tabsWithData",
  ":type": "custom:horizontal-tab",
  visible: true,
  label: { value: "tab label" },
  index: 0,
  items: [
    {
      id: "field",
      name: "f1",
      fieldType: "text-field",
      ":type": "text-field",
      visible: true,
      index: 0,
      label: { value: "text field label" },
    },
    {
      id: "field2",
      name: "f2",
      fieldType: "text-field",
      ":type": "text-field",
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

test("clicking on the horizontal tabs should switch from one tab to another", async () => {
  const MyComponent = (p: any) => {
    return <div className={p.name}>{p.label.value}</div>;
  };
  const json = {
    ...tabsWithData,
    ":type": "custom:horizontal-tab",
  };
  const form = await createForm(json);
  const wrapper = Provider(form, { "text-field": MyComponent });
  //@ts-ignore
  const { container } = render(<HorizontalTab {...json} />, { wrapper });
  const tabs = container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(2);
  let tabPanels = container.querySelectorAll(".f1");
  expect(tabPanels.length).toEqual(1);
  tabPanels = container.querySelectorAll(".f2");
  expect(tabPanels.length).toEqual(0);
  userEvent.click(tabs[1]);
  tabPanels = container.querySelectorAll(".f2");
  expect(tabPanels.length).toEqual(1);
  tabPanels = container.querySelectorAll(".f1");
  expect(tabPanels.length).toEqual(0);
});

test("tabs should get rendered with undefined element if no mapping is defined", async () => {
  const form = await createForm(tabsWithData);
  const wrapper = Provider(form, {});
  const { container } = render(<HorizontalTab {...tabsWithData} />, {
    wrapper,
  });
  const tabs = container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(2);
  const tabPanels = container.querySelectorAll(".undefined-element");
  expect(tabPanels.length).toEqual(0);
});

test("hidden tabs should not be rendered", async () => {
  const MyComponent = (p: any) => {
    return <div className={p.name}>{p.label.value}</div>;
  };
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
  const form = await createForm(sample);
  const wrapper = Provider(form, { "text-field": MyComponent });
  const { container } = render(<HorizontalTab {...sample} />, { wrapper });
  const tabs = container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(1);
  let tabPanels = container.querySelectorAll(".f1");
  expect(tabPanels.length).toEqual(0);
  tabPanels = container.querySelectorAll(".f2");
  expect(tabPanels.length).toEqual(1);
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

test('html in the label should be handled for non rich text', async () => {
  const f =  {
    ...tabsWithData,
    label: {
        value: '<p>title inside p tags</p>',
        richText: true,
        visible: true
    }
}
 let {renderResponse} = await helper(f);
 expect(renderResponse.container.innerHTML).toContain( '<p>title inside p tags</p>');  
});
