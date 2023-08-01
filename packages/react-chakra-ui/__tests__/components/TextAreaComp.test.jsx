import { fireEvent } from '@testing-library/react';
import TextAreaComponent from "../../generic_components/TextAreaComp";
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../../utils';

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
const helper = renderComponent(TextAreaComponent);

describe('Text Area Field', () => {

  test('value entered by user in text field is set in model', async () => {
    const f = {
      ...field,
    };
    const {renderResponse, element} = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = 'abc';
    fireEvent.change(input, {
      target: {
        value: inputVal
      }
    });
    const state = element.getState();
    expect(state.value).toEqual(inputVal);
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
