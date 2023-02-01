import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import { Checkbox } from 'native-base';
import { combineConvertors, baseConvertor, checkboxConvertor } from '../utils/mappers';
import InputField from '../shared/InputField';

const Comp = InputField(Checkbox);
const CheckboxComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Comp, combineConvertors(baseConvertor, checkboxConvertor));
  return renderedComponent;
};

export default CheckboxComponent;