import { fireEvent } from '@testing-library/react-native';
import TextAreaField from '../../src/components/TextField';
import { ReactTestInstance } from 'react-test-renderer';
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';

const field = {
  name: 'multiline',
  label: {
    value: 'multi line field',
  },
  fieldType: 'multiline-input',
  placeholder:'multiline field',
  visible: true,
  required: true,
};
const helper = renderComponent(TextAreaField);

describe('Text Area Field', () => {

  test('value entered by user in text field is set in model', async () => {
    const f = {
      ...field,
    };
    const {renderResponse, element} = await helper(f);
    const input: ReactTestInstance = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = 'abc';
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
  
    element.value = 'abc';
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
  
});

