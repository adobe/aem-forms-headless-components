import Button from '../../src/components/Button';
import { renderComponent } from '../utils';

const field = {
  name: 'button',
  label: {
    value: 'button',
  },
  fieldType: 'button',
  visible: true
};
const helper = renderComponent(Button);

describe('Button', () => {

  test('should render with label', () => {
    const f = {
      ...field,
    };
    const { renderResponse} = helper(f);
    const button = renderResponse.getByText(field.label.value);
    expect(button).toBeTruthy();
  });

})