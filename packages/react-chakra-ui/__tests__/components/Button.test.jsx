import ButtonComponent from "../../generic_components/ButtonComp"
import { renderComponent } from '../../utils';

const field = {
  name: 'button',
  label: {
    value: 'button',
    visible: true
  },
  fieldType: 'button',
  visible: true
};
const helper = renderComponent(ButtonComponent);

describe('Button', () => {

  test('should render with label', () => {
    const f = {
      ...field,
    };
    const { renderResponse} = helper(f);
    const button = renderResponse.getByText(field.label.value);
    expect(button).toBeTruthy();
  });

  test('it should handle visible property', () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse} = helper(f);
    const button = renderResponse.queryByText(field.label.value);
    expect(button).toBeNull();
  });

  test('it should handle disable property', () => {
    const f = {
      ...field,
      enabled: false
    };
    const { renderResponse} = helper(f);
    const button = renderResponse.queryByText(field.label.value);
    expect(button.disabled).toBe(true);
  });
})