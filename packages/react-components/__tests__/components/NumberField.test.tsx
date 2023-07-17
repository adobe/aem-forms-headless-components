import NumberField from '../../src/components/NumberField';
import userEvent from "@testing-library/user-event";
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';

const field = {
  name: 'number',
  label: {
    value: 'number field',
  },
  fieldType: 'number-input',
  placeholder: 'enter number field',
  visible: true,
  required: true,
};
const helper = renderComponent(NumberField);

describe('Number Field', () => {

  test('value entered by user in text field is set in model', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);
    const input = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = '1992';
    userEvent.type(input, inputVal);
    const state = element.getState();
    expect(state.value).toEqual(1992);
  });

  test('In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible', async () => {
    const f = {
      ...field,
      tooltip: 'Short Description',
      description: 'Mandatory'
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText('Short Description')).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName('cmp-adaptiveform-numberinput__questionmark');
    userEvent.click(button[0]);
    expect(renderResponse.getByText('Mandatory')).not.toBeNull();
  });

  test('label is null if title is marked as hidden in the field', async () => {
    const f = {
      ...field,
      label: {
        ...field.label,
        visible: false
      }
    };
    const { renderResponse } = helper(f);
    expect(renderResponse.queryByText(f.label.value)).toBeNull();
  });

  test('labels and inputs are linked with for and id attribute', async () => {
    let { renderResponse } = await helper(field);
    const input = await renderResponse.findByPlaceholderText(field.placeholder);
    const label = await renderResponse.queryByText(field.label.value)
    expect(input?.getAttribute('id')).toEqual(label?.getAttribute('for'));
  });

  test('html in the label should be handled for non rich text', async () => {
    const f = {
      ...field,
      label: {
        value: '<p>title inside p tags</p>',
        richText: true,
        visible: true
      }
    }
    let { renderResponse } = await helper(f);
    expect(renderResponse.container.innerHTML).toContain('<p>title inside p tags</p>');
  });
});