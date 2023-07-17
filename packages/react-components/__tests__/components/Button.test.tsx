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
    const { renderResponse } = helper(f);
    const button = renderResponse.getByText(field.label.value);
    expect(button).toBeTruthy();
  });

  test('it should handle visible property', () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = helper(f);
    const button = renderResponse.queryByText(field.label.value);
    expect(button).toBeNull();
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