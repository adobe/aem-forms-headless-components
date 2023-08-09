import { fireEvent } from '@testing-library/react';
import SelectComp from "../../generic_components/SelectComp";
import { renderComponent } from '../../utils';

const field = {
  name: 'dropdown',
  visible: true,
  label: {
    value: 'Drop Down',
    visible: true
  },
  fieldType: 'drop-down',
  enum: [1, 2, 3],
  enumNames: ['option 1', 'option 2', 'option 3']
};
const helper = renderComponent(SelectComp);

describe('Drop Down', () => {

  test('option selected by user is set in the model', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    expect(element?.getState().value).toBeUndefined();

    fireEvent.change(renderResponse.getByTestId('select'));
    fireEvent.change(renderResponse.getByText(f.enumNames[0]));
    expect(element?.value).toEqual(1);
  });

  test('selection made by the user sets the value', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    fireEvent.change(renderResponse.getByTestId('select'));
    fireEvent.change(renderResponse.getByText(f.enumNames[0]));
    expect(element?.value).toEqual(1);
  });

  test('it should handle visible property', async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByPlaceholderText('select')).toBeNull();
  });

  test('help text content should be render', async () => {
    const f = {
      ...field,
      description: 'some description',
      required: true,
    };

    const { renderResponse } = await helper(f);
    let description = renderResponse.queryByText(f.description);
    expect(description).not.toBeNull();
  });

});