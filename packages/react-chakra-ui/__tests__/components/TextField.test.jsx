import { fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import TextFieldComponent from "../../generic_components/TextFieldComp";
import { renderComponent } from '../../utils';

const field = {
  name: 'text',
  label: {
    value: 'text field',
  },
  fieldType: 'text-input',
  placeholder:'enter text field',
  visible: true,
  required: true,
};
const helper = renderComponent(TextFieldComponent);

describe('Text Field', () => {

  test('value entered by user in text field is set in model', async () => {
    const f = {
      ...field,
    };
    const {renderResponse, element} = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = 'abcd';
    fireEvent.change(input, {
      target: { value: inputVal }
    });
    const state = element.getState();
    expect(state.value).toEqual(inputVal);
  });

  test('check if tooltip is not null', async () => {
    const f = {
      ...field,
      description: 'some description',
    };
    const {renderResponse} = await helper(f);
    let description = renderResponse.queryByText('some description');
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
  
  test('it should handle maxlength constraint', async () => {
    const f = {
      ...field,
      maxLength: 5,
    };
    let {renderResponse, element} = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);

    userEvent.type(input, '01234657890');
    expect(input.maxLength).toBe(5);
    expect(input.value).toBe('01234');
  });

  test('it should handle minLength constraint', async () => {
    const f = {
      ...field,
      minLength: 5,
      "constraintMessages": {
        "minLength": "Please enter atleast 5 characters of your Last name"
      }
    };
    let {renderResponse} = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = 'abc';
    fireEvent.change(input, {
      target: {
        value: inputVal
      }
    });
    const errorMsg = renderResponse.queryByText("Please enter atleast 5 characters of your Last name");
    expect(errorMsg).not.toBeNull();
  });

  test('it should handle pattern constraint', async () => {
    const f = {
      ...field,
      "pattern": "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
      "constraintMessages": {
        "pattern": "Please enter a valid email address"
      }
    };
    let {renderResponse} = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = 'aa434';
    fireEvent.change(input, {
      target: {
        value: inputVal
      }
    });
    const errorMsg = renderResponse.queryByText('Please enter a valid email address');
    expect(errorMsg).not.toBeNull();
  });
  
});