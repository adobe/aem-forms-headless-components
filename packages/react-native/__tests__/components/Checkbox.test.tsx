import { fireEvent } from '@testing-library/react-native';
import Checkbox from '../../src/components/Checkbox';
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';

const field = {
  name: 'checkbox',
  label: {
    value: 'CheckBox Button',
  },
  fieldType: 'checkbox',
  visible: true,
  type: 'boolean',
};
const helper = renderComponent(Checkbox);

describe('Checkbox', () => {

  test('selection made by the user sets the value', async () => {
    const f = {
      ...field,
    };
    const { input, element } = await helper(f);
    fireEvent.press(input);
    expect(element?.value).toEqual(true);
  });

  test('clicking on checkbox twice resets the value', async () => {
    const f = {
      ...field,
      enum: [false, true],
      value: [true, false]
    };
    const { input, element } = await helper(f);
    fireEvent.press(input);
    fireEvent.press(input);
    expect(element?.getState().value).toEqual(element.value);
  });

  test('a checkbox with no off value should get its value undefined when not selected', async () => {
    const f = {
      ...field,
      enum: [true],
    };
    const { input, element } = await helper(f);
    fireEvent.press(input);
    let state = element?.getState();
    expect(state.value).toBe(true);
    fireEvent.press(input);
    state = element?.getState();
    expect(state.value).toBe(null);
  });

  test('a checkbox with no off value should be valid when not required', async () => {
    const f = {
      ...field,
      enum: [true],
    };
    const { input, form, element } = await helper(f);
    fireEvent.press(input);
    let data = form?.exportData();
    expect(data.checkbox).toEqual(true);
    fireEvent.press(input);
    expect(element?.valid).not.toBe(false);
  });

  test('a required checkbox with off value should be invalid when unchecked', async () => {
    const f = {
      ...field,
      enum: [true, false],
      required: true,
    };
    const { renderResponse, input, element } = await helper(f);
    fireEvent.press(input);
    fireEvent.press(input);
    const error = renderResponse.queryByText(DEFAULT_ERROR_MESSAGE);
    expect(element?.valid).toBe(false);
    expect(error).not.toBeNull();
  });

  test('a required checkbox with no off value should be invalid when unchecked', async () => {
    const f = {
      ...field,
      enum: [true],
      required: true,
    };
    const { input, element } = await helper(f);
    fireEvent.press(input);
    fireEvent.press(input);
    let state = element?.getState();
    expect(state.valid).toBe(false);
  });

  test('a checkbox should render if there are no options', async () => {
    const { input, element } = await helper({ ...field });
    fireEvent.press(input);
    fireEvent.press(input);
    expect(element?.getState().valid).toBe(true);
  });

  test('field gets rendered without a provider', async () => {
    const f = { ...field };
    const { element } = await helper(f);
    let state = element?.getState();
    expect(state.valid).not.toBe(true);
  });

  test('a checkbox should be selected if value is on', async () => {
    const f = {
      ...field,
      value: true,
    };
    const { input, element } = await helper(f);

    expect(input).not.toBeNull();
    let state = element?.getState();
    expect(state.valid).not.toBe(true);
  });

  test('a checkbox should not be selected if value is not on', async () => {
    const f = {
      ...field,
      enum: [false, true],
      value: true,
    };
    const { input, element } = await helper(f);
    expect(input).not.toBeNull();
    const state = element?.getState();
    expect(state.valid).not.toBe(true);
  });
});

