import { fireEvent } from '@testing-library/react-native';
import { ReactTestInstance } from 'react-test-renderer';
import RadioGroup from '../../src/components/RadioGroup';
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';

const field = {
  name: 'radio',
  visible: true,
  label: {
    value: 'radio group'
  },
  fieldType: 'radio-group',
  enum: [1, 2, 3],
  enumNames: ['radio 1', 'radio 2', 'radio 3']
};
const helper = renderComponent(RadioGroup);

describe('radio Group', () => {

  test('option selected by user is set in the model', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    expect(element?.getState().value).toBeUndefined();

    fireEvent.press(renderResponse.getByText(f.enumNames[0]));
    expect(element?.value).toEqual(1);

    fireEvent.press(renderResponse.getByText(f.enumNames[2]));
    expect(element?.value).toEqual(3);
  });

  test('selection made by the user sets the value', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    fireEvent.press(renderResponse.getByText(f.enumNames[0]));
    expect(element.value).toEqual(1);

    fireEvent.press(renderResponse.getByText(f.enumNames[1]));
    expect(element.value).toEqual(2);

    fireEvent.press(renderResponse.getByText(f.enumNames[0]));
    expect(element.value).toEqual(1);
  });

  test('it should handle visible property', async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.enumNames[0])).toBeNull();
    expect(renderResponse.queryByText(f.enumNames[1])).toBeNull();
    expect(renderResponse.queryByText(f.enumNames[2])).toBeNull();
  });

  test('help text content changes when field becomes invalid', async () => {
    const f = {
      ...field,
      description: 'some description',
      required: true,
    };

    const { renderResponse, element } = await helper(f);
    let description = renderResponse.queryByText(f.description);
    expect(description).not.toBeNull();
    element.value = 1;
    description = renderResponse.queryByText(f.description);
    expect(description).not.toBeNull();
    element.value = null;
    let error = renderResponse.queryByText(DEFAULT_ERROR_MESSAGE);
    description = renderResponse.queryByText(f.description);
    expect(error).not.toBeNull();
    expect(description).toBeNull();
  });

});