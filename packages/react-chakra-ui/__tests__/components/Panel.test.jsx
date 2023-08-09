import Panel from "../../generic_components/Panel";
import React from 'react';
import {render} from '@testing-library/react';
import { renderComponent, createForm, Provider } from '../../utils';
import {jsonString} from '@aemforms/af-core';

const field = {
  name: 'panel',
  label: {
    value: 'Panel Title',
  },
  fieldType: 'panel',
  visible: true,
  items: []
};

const emptyPanel = {
  'id' : 'emptypanel',
  'visible' : true,
  'items' : [],
  index: 0,
  ':type' : 'panel'
};

const panelWithField = {
  'id' : 'panelWithField',
  'visible' : true,
    'label': {
      'value': 'panel title'
    },
  index: 0,
  ':type' : 'panel',
  'items' : [
      {
          'id' : 'field',
          'name' : 'f1',
          'fieldType' : 'text-field',
          ':type' : 'text-field',
          'title' : 'name',
          'visible' : true,
          index: 0
      }
  ]
};


const helper = renderComponent(Panel);

describe('Panel', () => {

  test('should render with label', () => {
    const f = {
      ...field,
    };
    const { renderResponse } = helper(f);
    const panel = renderResponse.getByText(field.label.value);
    expect(panel).toBeTruthy();
  });

  test('should not render', () => {
    const f = {
      ...field,
      visible: false
    };
    const { renderResponse} = helper(f);
    const panel = renderResponse.queryByText(field.label.value);
    expect(panel).toBeNull();
  });

  test('render with localize label', () => {
    const f = {
      ...field,
      properties: {
        'afs:translationIds': {
          'label.value':'1234'
        }
      }
    };
    const { renderResponse} = helper(f);
    const panel = renderResponse.queryByText(field.label.value);
    expect(panel).toBeTruthy();
  });

  test('children without mapping should get rendered as undefined', async () => {
    const panel = <Panel {...panelWithField} />;
    const form = await createForm(emptyPanel);
    const wrapper = Provider(form, {});
    const {container} = render(panel, {wrapper});
    var expected = '<div class="undefined-element"><h4>Undefined Element</h4><pre>' + jsonString(panelWithField.items[0]) + '</pre></div>';
    expect(container.innerHTML).not.toContain(expected);
});

  test('children with mapping should render the mapped component', async () => {
    const MyComponent = () => {
        return <div>My Field</div>;
    };

    const panel = <Panel {...panelWithField} />;
    const form = await createForm(emptyPanel);
    const wrapper = Provider(form, {'text-field' : MyComponent});
    const {container} = render(panel, {wrapper});
    var expected = '<div><h4>Undefined Element</h4><pre>' + jsonString(panelWithField.items[0]) + '</pre></div>';
    expect(container.innerHTML).not.toContain(expected);
    expect(container.innerHTML).toContain('<div>My Field</div>');
});

})