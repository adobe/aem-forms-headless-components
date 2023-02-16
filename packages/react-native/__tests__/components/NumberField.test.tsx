import { fireEvent } from '@testing-library/react-native';
import NumberField from '../../src/components/NumberField';
import { ReactTestInstance } from 'react-test-renderer';
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';

const field = {
  name: 'number',
  label: {
    value: 'number field',
  },
  fieldType: 'number-input',
  placeholder:'enter number field',
  visible: true,
  required: true,
};
const helper = renderComponent(NumberField);

describe('Number Field', () => {

  test('value entered by user in text field is set in model', async () => {
    const f = {
      ...field,
    };
    const {renderResponse, element} = await helper(f);
    const input: ReactTestInstance = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = 1992;
    fireEvent.changeText(input, inputVal);
    const state = element.getState();
    expect(state.value).toEqual(inputVal);
  });

  test('help text content changes when field becomes invalid', async () => {
    const f = {
      ...field,
      description: 'some description',
    };
    const {renderResponse, element} = await helper(f);
    let description = renderResponse.queryByText('some description');
    expect(description).not.toBeNull();
  
    element.value = null;
    let error = renderResponse.queryByText(DEFAULT_ERROR_MESSAGE);
    description = renderResponse.queryByText('some description');
    expect(error).not.toBeNull();
    expect(description).toBeNull();
  
    element.value = 123;
    error = renderResponse.queryByText(DEFAULT_ERROR_MESSAGE);
    description = renderResponse.queryByText('some description');
    expect(error).toBeNull();
    expect(description).not.toBeNull();
  });

  test('it should handle visible property', async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.label.value)).toBeNull();
  });
  
  test('it should handle maximum constraint', async () => {
    const f = {
      ...field,
      maximum: 100,
    };
    let {renderResponse} = await helper(f);
    const input: ReactTestInstance = await renderResponse.findByPlaceholderText(f.placeholder);
    fireEvent.changeText(input, 900);
    const errorMsg = renderResponse.queryByText(DEFAULT_ERROR_MESSAGE);
    expect(errorMsg).not.toBeNull();
  });
  
});

