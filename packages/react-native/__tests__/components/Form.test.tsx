import Form from '../../src/components/Form';
import { renderComponent } from '../utils';

const field = {
  name: 'form',
  label: {
    value: 'Form Title',
  },
  fieldType: 'form',
  visible: true,
};
const helper = renderComponent(Form);

describe('Form', () => {

  test('should render with label', () => {
    const f = {
      ...field,
    };
    const { renderResponse} = helper(f);
    const form = renderResponse.getByText(field.label.value);
    expect(form).toBeTruthy();
  });

  test('should render without label', () => {
    const f = {
      ...field,
      label: {}
    };
    const { renderResponse} = helper(f);
    const form = renderResponse.queryByText(field.label.value);
    expect(form).toBeNull();
  });

})