import userEvent from "@testing-library/user-event";
import RadioButtonGroup from '../../src/components/RadioButtonGroup';
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
const helper = renderComponent(RadioButtonGroup);

describe('radio Group', () => {

  test('option selected by user is set in the model', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    expect(element?.getState().value).toBeUndefined();

    userEvent.click(renderResponse.getByText(f.enumNames[0]));
    expect(element?.value).toEqual(1);

    userEvent.click(renderResponse.getByText(f.enumNames[2]));
    expect(element?.value).toEqual(3);
  });

  test('selection made by the user sets the value', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    userEvent.click(renderResponse.getByText(f.enumNames[0]));
    expect(element.value).toEqual(1);

    userEvent.click(renderResponse.getByText(f.enumNames[1]));
    expect(element.value).toEqual(2);

    userEvent.click(renderResponse.getByText(f.enumNames[0]));
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

  test('In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible', async () => {
    const f = {
      ...field,
      tooltip: 'Short Description',
      description: 'Mandatory'
    };
    const helper = renderComponent(RadioButtonGroup);
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText('Short Description')).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName('cmp-adaptiveform-radiobutton__questionmark');
    userEvent.click(button[0]);
    expect(renderResponse.getByText('Mandatory')).not.toBeNull();
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