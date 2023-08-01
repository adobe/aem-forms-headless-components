/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Tabs from '../../src/components/tabs/Tabs';
import VerticalTab from '../../src/components/tabs/VerticalTabs';
import HorizontalTab from '../../src/components/tabs/HorizontalTabs';
import React from 'react';
import { render } from '@testing-library/react';
import { createForm, Provider } from '../utils';
import { jsonString } from '@aemforms/af-core';
import userEvent from '@testing-library/user-event';

const emptyTabs = {
  'id': 'emptyTabs',
  ':type' : 'custom:tabs',
  'visible': true,
  'label': { value: 'empty label' },
  'items': [],
  index: 0
};

const tabsWithData = {
  'id': 'tabsWithData',
  ':type' : 'custom:tabs',
  'visible': true,
  'label': { value: 'tab label' },
  index: 0,
  'items': [
    {
      'id': 'field',
      'name': 'f1',
      'fieldType': 'text-field',
      ':type' : 'text-field',
      'visible': true,
      index: 0,
      'label': { value: 'text field label' }
    },
    {
      'id': 'field2',
      'name': 'f2',
      'fieldType': 'text-field',
      ':type' : 'text-field',
      'visible': true,
      index: 1,
      'label': { value: 'text field 2 label' }
    }
  ]
};

test('Tabs should not rendered if item length is zero', () => {
  const { container } = render(<Tabs {...emptyTabs} />);
  expect(container.innerHTML).toContain('empty label');
  const tabs = container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(0);
  const tabPanels = container.querySelectorAll('[role="tabpanel"]');
  expect(tabPanels.length).toEqual(0);
});

test('Tabs should not rendered if visible false', () => {
  const sample = {
    ...emptyTabs,
    visible: false
  };
  const { container } = render(<Tabs {...sample} />);
  expect(container.innerHTML.length).toEqual(0);
});

test('Tabs should not rendered if all the items are not visible', () => {
  const sample = {
    ...tabsWithData,
    items: tabsWithData.items.map(x => ({
      ...x,
      visible: false
    }))
  };
  const { container } = render(<Tabs {...sample} />);
  expect(container.innerHTML).toContain('tab label');
  const tabs = container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(0);
  const tabPanels = container.querySelectorAll('[role="tabpanel"]');
  expect(tabPanels.length).toEqual(0);
});

test('tabs should get rendered with undefined element if no mapping is defined', async () => {
  const form = await createForm(tabsWithData);
  const wrapper = Provider(form, {});
  const { container } = render(<Tabs {...tabsWithData} />, { wrapper });
  const tabs = container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(2);
  const tabPanels = container.querySelectorAll('.undefined-element');
  expect(tabPanels.length).toEqual(0);
});

test('clicking on the horizontal tabs should switch from one tab to another', async () => {
  const MyComponent = (p: any) => {
    return <div className={p.name}>{p.label.value}</div>;
  };
  const json = {
    ...tabsWithData,
    ':type' : 'custom:horizontal-tab'
  };
  const form = await createForm(json);
  const wrapper = Provider(form, { 'text-field': MyComponent });
  //@ts-ignore
  const { container } = render(<HorizontalTab {...json} />, { wrapper });
  const tabs = container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(2);
  let tabPanels = container.querySelectorAll('.f1');
  expect(tabPanels.length).toEqual(1);
  tabPanels = container.querySelectorAll('.f2');
  expect(tabPanels.length).toEqual(0);
  userEvent.click(tabs[1]);
  tabPanels = container.querySelectorAll('.f2');
  expect(tabPanels.length).toEqual(1);
  tabPanels = container.querySelectorAll('.f1');
  expect(tabPanels.length).toEqual(0);
});

test('hidden tabs should not be rendered', async () => {
  const MyComponent = (p: any) => {
    return <div className={p.name}>{p.label.value}</div>;
  };
  const sample = {
    ...tabsWithData,
    items: [
      {
        ...tabsWithData.items[0],
        visible: false
      },
      {
        ...tabsWithData.items[1]
      }
    ]
  };
  const form = await createForm(sample);
  const wrapper = Provider(form, { 'text-field': MyComponent });
  const { container } = render(<Tabs {...sample} />, { wrapper });
  const tabs = container.querySelectorAll('[role="tab"]');
  expect(tabs.length).toEqual(1);
  let tabPanels = container.querySelectorAll('.f1');
  expect(tabPanels.length).toEqual(0);
  tabPanels = container.querySelectorAll('.f2');
  expect(tabPanels.length).toEqual(1);
});

test('horizontal tabs children with mapping should render the mapped component', async () => {
  const MyComponent = () => {
    return <div>My Field</div>;
  };

  const form = await createForm(tabsWithData);
  const wrapper = Provider(form, { 'text-field': MyComponent });
  const { container } = render(<HorizontalTab {...tabsWithData} />, { wrapper });
  var expected = '<div><h4>Undefined Element</h4><pre>' + jsonString(tabsWithData.items[0]) + '</pre></div>';
  expect(container.innerHTML).not.toContain(expected);
  expect(container.innerHTML).toContain('<div>My Field</div>');
  const tabList = container.querySelectorAll('[role="tablist"]');
  expect(tabList.length).toEqual(1);
  expect(tabList[0].getAttribute('aria-orientation')).toContain('horizontal');
});

test('vertical tabs children with mapping should render the mapped component', async () => {
  const MyComponent = () => {
    return <div>My Field</div>;
  };

  const form = await createForm(tabsWithData);
  const wrapper = Provider(form, { 'text-field': MyComponent });
  const { container } = render(<VerticalTab {...tabsWithData} />, { wrapper });
  var expected = '<div><h4>Undefined Element</h4><pre>' + jsonString(tabsWithData.items[0]) + '</pre></div>';
  expect(container.innerHTML).not.toContain(expected);
  const tabList = container.querySelectorAll('[role="tablist"]');
  expect(tabList.length).toEqual(1);
  expect(tabList[0].getAttribute('aria-orientation')).toContain('vertical');
});

test('should disable tabs & not clickable', async () => {
  const MyComponent = (p: any) => {
    return <div className={p.name}>{p.label.value}</div>;
  };

  const updatesTabsData = {...tabsWithData};
  // @ts-ignore
  updatesTabsData.items[0].enabled = false;
  const form = await createForm(updatesTabsData);
  const wrapper = Provider(form, { 'text-field': MyComponent });
  const { container } = render(<HorizontalTab {...tabsWithData} />, { wrapper });
  const tabList = container.querySelectorAll('[aria-disabled="true"]');
  expect(tabList.length).toEqual(1);
  let tabPanels = container.querySelectorAll('.f2');
  expect(tabPanels.length).toEqual(1);

  const tabs = container.querySelectorAll('[role="tab"]');
  userEvent.click(tabs[0]);
  tabPanels = container.querySelectorAll('.f1');
  expect(tabPanels.length).toEqual(0);

  tabPanels = container.querySelectorAll('.f2');
  expect(tabPanels.length).toEqual(1);
});
