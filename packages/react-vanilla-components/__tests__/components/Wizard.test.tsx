import Wizard from "../../src/components/Wizard";
import React from "react";
import { render } from "@testing-library/react";
import { createForm, Provider } from "../utils";
import { renderComponent, DEFAULT_ERROR_MESSAGE } from "../utils";
import userEvent from "@testing-library/user-event";

const WizardWithData = {
  id: "wizard",
  ":type": " wizard",
  visible: true,
  label: { value: "Wizard" },
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

const emptyWizard = {
  id: "emptyWizard",
  ":type": "wizard",
  visible: true,
  label: { value: "empty label" },
  items: [],
  index: 0,
};

test("clicking on the next tab should switch from one component to another and on clicking the previous button it should take to the previous component", async () => {
  const MyComponent = (p: any) => {
    return <div className={p.name}>{p.label.value}</div>;
  };
  const json = {
    ...WizardWithData,
    ":type": "wizard",
  };
  const form = await createForm(json);
  const wrapper = Provider(form, { "text-field": MyComponent });
  //@ts-ignore
  const { container } = render(<Wizard {...json} />, { wrapper });
  const NextTab = container.getElementsByClassName(
    "cmp-adaptiveform-wizard__nextNav"
  );
  const PrevTab = container.getElementsByClassName(
    "cmp-adaptiveform-wizard__previousNav"
  );
  expect(NextTab.length).toEqual(1);
  expect(PrevTab.length).toEqual(1);
  let tabPanels = container.querySelectorAll(".f1");
  expect(tabPanels.length).toEqual(1);
  tabPanels = container.querySelectorAll(".f2");
  expect(tabPanels.length).toEqual(0);
  userEvent.click(NextTab[0]);
  tabPanels = container.querySelectorAll(".f2");
  expect(tabPanels.length).toEqual(1);
  userEvent.click(PrevTab[0]);
  tabPanels = container.querySelectorAll(".f1");
  expect(tabPanels.length).toEqual(1);
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
  const tabPanels = renderResponse.queryAllByRole("tabpanel");
  expect(tabPanels.length).toEqual(0);
});

test("Hidden component should not be rendered", async () => {
  const MyComponent = (p: any) => {
    return <div className={p.name}>{p.label.value}</div>;
  };
  const sample = {
    ...WizardWithData,
    items: [
      {
        ...WizardWithData.items[0],
        visible: false,
      },
      {
        ...WizardWithData.items[1],
      },
    ],
  };
  const form = await createForm(sample);
  const wrapper = Provider(form, { "text-field": MyComponent });
  const { container } = render(<Wizard {...sample} />, { wrapper });
  const tabs = container.querySelectorAll('[role="navigation"]');
  expect(tabs.length).toEqual(2);
  let tabPanels = container.querySelectorAll(".f1");
  expect(tabPanels.length).toEqual(0);
  tabPanels = container.querySelectorAll(".f2");
  expect(tabPanels.length).toEqual(1);
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

test('In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible', async () => {
  const f = {
    ...WizardWithData,
    tooltip: 'Short Description',
    description: 'Mandatory'
  };
  const helper = renderComponent(Wizard);
  const { renderResponse } = await helper(f);
  expect(renderResponse.getByText('Short Description')).not.toBeNull();
  const button = renderResponse.container.getElementsByClassName('cmp-adaptiveform-wizard__questionmark');
  userEvent.click(button[0]);
  expect(renderResponse.getByText('Mandatory')).not.toBeNull();
});
