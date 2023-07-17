import Panel from '../../src/components/Panel';
import React from 'react';
import { render } from '@testing-library/react';
import { createForm, Provider, renderComponent } from '../utils';
import { jsonString } from '@aemforms/af-core';

const emptyPanel = {
  'id': 'emptypanel',
  'visible': true,
  'items': [],
  'label': {
    'value': 'panel title'
  },
  index: 0,
  ':type': 'panel',
  "properties": {
    "afs:translationIds": {
      "label.value": "firstName##7081##title##1335",
      "description": "firstName##7081##description##9756"
    }
  },
};

const panelWithField = {
  'id': 'panelWithField',
  'visible': true,
  'label': {
    'value': 'panel title'
  },
  "properties": {
    "afs:translationIds": {
      "label.value": "firstName##7081##title##1335",
      "description": "firstName##7081##description##9756"
    }
  },
  index: 0,
  ':type': 'panel',
  'items': [
    {
      'id': 'field',
      'name': 'f1',
      'fieldType': 'text-field',
      ':type': 'text-field',
      'title': 'name',
      'visible': true,
      index: 0
    }
  ]
};

test('panel should get rendered if it is visible', () => {
  const helper = renderComponent(Panel);
  const { renderResponse } = helper(emptyPanel);
  expect(renderResponse.container.innerHTML.length).toBeGreaterThan(0);
});

test('panel should get rendered if it has no children', () => {
  const helper = renderComponent(Panel);
  const { renderResponse } = helper(emptyPanel);
  expect(renderResponse.container.innerHTML.length).toBeGreaterThan(0);
});


test('panel should get rendered if no mapping is defined', async () => {
  const panel = <Panel {...panelWithField} />;
  const form = await createForm(emptyPanel);
  const wrapper = Provider(form, {});
  const { container } = render(panel, { wrapper });
  expect(container.innerHTML.length).toBeGreaterThan(0);
});

test('children with mapping should render the mapped component', async () => {
  const MyComponent = () => {
    return <div>My Field</div>;
  };

  const panel = <Panel {...panelWithField} />;
  const form = await createForm(emptyPanel);
  const wrapper = Provider(form, { 'text-field': MyComponent });
  const { container } = render(panel, { wrapper });
  var expected = '<div><h4>Undefined Element</h4><pre>' + jsonString(panelWithField.items[0]) + '</pre></div>';
  expect(container.innerHTML).not.toContain(expected);
  expect(container.innerHTML).toContain('<div>My Field</div>');
});

test('panel should get rendered with label', async () => {
  const helper = renderComponent(Panel);
  const { renderResponse } = helper(panelWithField);
  expect(renderResponse.queryByText(panelWithField.label.value)).not.toBeNull();
});

test('html in the label should be handled for non rich text', async () => {
  const helper = renderComponent(Panel);
  const f = {
    ...panelWithField,
    label: {
      value: '<p>title inside p tags</p>',
      richText: true,
      visible: true
    }
  }
  let { renderResponse } = await helper(f);
  expect(renderResponse.container.innerHTML).toContain('<p>title inside p tags</p>');
});



