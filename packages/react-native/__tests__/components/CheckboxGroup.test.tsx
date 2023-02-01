import { fireEvent } from '@testing-library/react-native';
import { ReactTestInstance } from 'react-test-renderer';
import CheckboxGroup from '../../src/components/CheckboxGroup';
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';

const field = {
  name: 'checkbox',
  visible: true,
  label: {
    value: 'Checkbox group'
  },
  fieldType: 'checkbox-group',
  enum: [1, 2, 3],
  enumNames: ['checkbox 1', 'checkbox 2', 'checkbox 3']
};
const helper = renderComponent(CheckboxGroup);

describe('Checkbox Group', () => {

  test('option selected by user is set in the model', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    expect(element?.getState().value).toBeUndefined();

    fireEvent.press(renderResponse.getByText(f.enumNames[0]));
    expect(element?.value).toEqual([1]);

    fireEvent.press(renderResponse.getByText(f.enumNames[2]));
    expect(element?.value).toEqual([1, 3]);
  });

  test('selection made by the user sets the value', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    fireEvent.press(renderResponse.getByText(f.enumNames[0]));
    expect(element.value).toEqual([1]);

    fireEvent.press(renderResponse.getByText(f.enumNames[1]));
    expect(element.value).toEqual([1, 2]);

    fireEvent.press(renderResponse.getByText(f.enumNames[0]));
    expect(element.value).toEqual([2]);
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
    element.value = [1];
    description = renderResponse.queryByText(f.description);
    expect(description).not.toBeNull();
    element.value = null;
    let error = renderResponse.queryByText(DEFAULT_ERROR_MESSAGE);
    description = renderResponse.queryByText(f.description);
    expect(error).not.toBeNull();
    expect(description).toBeNull();
  });

  test('checkbox group with non array type should allow only single selection', async () => {
    const f = {
      ...field,
      description: 'some description',
      type: 'number',
    };
    const { renderResponse, element } = await helper(f);

    const checkbox1: ReactTestInstance = await renderResponse.findByText(f.enumNames[0]);
    fireEvent.press(checkbox1);
    expect(element.value).toEqual(1);
    fireEvent.press(checkbox1);

    const checkbox2: ReactTestInstance = await renderResponse.findByText(f.enumNames[1]);
    fireEvent.press(checkbox2);
    expect(element.value).toEqual(2);
    fireEvent.press(checkbox2);
    expect(element.value).toEqual(null);
  });

});