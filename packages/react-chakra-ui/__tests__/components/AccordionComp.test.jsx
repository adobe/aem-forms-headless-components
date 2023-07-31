import AccordionComp from "../../generic_components/Panel";
import { renderComponent } from '../../utils';

const field = {
  name: 'accordion',
  label: {
    value: 'accordion Title',
  },
  fieldType: 'accordion',
  visible: true,
  items: []
};


const helper = renderComponent(AccordionComp);

describe('Accordion', () => {

  test('should render with label', () => {
    const f = {
      ...field,
    };
    const { renderResponse } = helper(f);
    const accordion = renderResponse.getByText(field.label.value);
    expect(accordion).toBeTruthy();
  });

  test('should not render', () => {
    const f = {
      ...field,
      visible: false
    };
    const { renderResponse} = helper(f);
    const accordion = renderResponse.queryByText(field.label.value);
    expect(accordion).toBeNull();
  });

})