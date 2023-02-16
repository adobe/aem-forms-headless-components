import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'native-base';
import {createFormInstance, FieldsetJson, State} from '@aemforms/af-core';
import Repeater from '../../src/components/Repeater';
import Panel from '../../src/components/Panel'
import { Provider } from '../utils';

const repeatableField = {
  name: 'repeat',
  label: {
      value: 'panel title'
  },
  type: 'array',
  minItems: 1,
  maxItems: 3,
  ':type': 'panel',
  items: [
      {
        fieldType: 'text-field',
        ':type': 'text-field',
        title: 'name',
        visible: true
      }
  ]
};

const MyComponent = () => {
  return <Text>My Field</Text>;
};

describe('Text Area Field', () => {

test('add/remove button should be visible for repeatable elements', () => {
  const form = createFormInstance({
      items : [repeatableField]
  });
  const panelState = form.items[0].getState() as State<FieldsetJson>;
  const wrapper = Provider(form, {'text-field' : MyComponent, repeater: Repeater});
  const panel = <Panel {...panelState} />;
  const renderResponse = render(panel, {wrapper});
  expect(renderResponse.getByText(repeatableField.label.value)).toBeTruthy();
  expect(renderResponse.getByText('My Field')).toBeTruthy();
});

test('add/remove button should be clickable', async () => {
  const form = createFormInstance({
      items : [repeatableField]
  });
  const panelState = form.items[0].getState() as State<FieldsetJson>;
  const wrapper = Provider(form, {'text-field' : MyComponent, repeater: Repeater});
  const panel = <Panel {...panelState} />;
  const renderResponse = render(panel, {wrapper});
  const addButton = await renderResponse.findByTestId('add-button');
  expect(renderResponse.queryByTestId('add-button')).toBeTruthy();
  fireEvent.press(addButton);
  fireEvent.press(addButton);
  expect(renderResponse.queryByTestId('add-button')).not.toBeTruthy();
  expect(renderResponse.getAllByText('My Field').length).toEqual(3);
});

});
