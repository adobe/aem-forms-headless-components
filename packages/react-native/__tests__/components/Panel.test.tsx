import Panel from '../../src/components/Panel';
import { renderComponent } from '../utils';

const field = {
  name: 'panel',
  label: {
    value: 'Panel Title',
  },
  fieldType: 'panel',
  visible: true,
  items: []
};
const helper = renderComponent(Panel);

describe('Panel', () => {

  test('should render with label', () => {
    const f = {
      ...field,
    };
    const { renderResponse} = helper(f);
    const panel = renderResponse.getByText(field.label.value);
    expect(panel).toBeTruthy();
  });

  test('should not render', () => {
    const f = {
      ...field,
      visible: false
    };
    const { renderResponse} = helper(f);
    const panel = renderResponse.queryByText(field.label.value);
    expect(panel).toBeNull();
  });

  test('render with localize label', () => {
    const f = {
      ...field,
      properties: {
        'afs:translationIds': {
          'label.value':'1234'
        }
      }
    };
    const { renderResponse} = helper(f);
    const panel = renderResponse.queryByText(field.label.value);
    expect(panel).toBeTruthy();
  });

})