import { fireEvent } from '@testing-library/react';
import CheckboxComponent from "../../generic_components/CheckBoxComp";
import { renderComponent } from '../../utils';

const field = {
  name: 'checkbox',
  label: {
    value: 'CheckBox Button',
    visible: true
  },
  fieldType: 'checkbox',
  visible: true,
  type: 'boolean',
};
const helper = renderComponent(CheckboxComponent);

describe('Checkbox', () => {

  test('selection made by the user sets the value', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByText(f?.label?.value);
    fireEvent.click(input);
    expect(element?.value).toEqual(true);
  });

  test('clicking on checkbox twice resets the value', async () => {
    const f = {
      ...field,
      enum: [false, true],
      value: [true, false]
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByText(f?.label?.value);
    fireEvent.click(input);
    fireEvent.click(input);
    expect(element?.getState().value).toEqual(element.value);
  });

  test('a checkbox with no off value should get its value undefined when not selected', async () => {
    const f = {
      ...field,
      enum: [true],
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByText(f?.label?.value);
    fireEvent.click(input);
    let state = element?.getState();
    expect(state.value).toBe(true);
    fireEvent.click(input);
    state = element?.getState();
    expect(state.value).toBe(false);
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
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByText(f?.label?.value);
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
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByText(f?.label?.value);
    expect(input).not.toBeNull();
    const state = element?.getState();
    expect(state.valid).not.toBe(true);
  });
});
