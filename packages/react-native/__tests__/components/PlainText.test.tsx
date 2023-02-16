import PlainText from '../../src/components/PlainText';
import { renderComponent } from '../utils';

const field = {
  name: "text",
  fieldType: "plain-text",
  value: "Plain Text",
  visible: true
};
const helper = renderComponent(PlainText);

describe('Plain Text', () => {

  test('should render with value', () => {
    const f = {
      ...field,
    };
    const { renderResponse} = helper(f);
    const form = renderResponse.getByText(field.value);
    expect(form).toBeTruthy();
  });

  test('should not render without value', () => {
    const f = {
      ...field,
      value: null
    };
    const { renderResponse} = helper(f);
    const form = renderResponse.queryByText(field.value);
    expect(form).toBeNull();
  });

})