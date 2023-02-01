import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import { Checkbox } from 'native-base';
import { combineConvertors, baseConvertor, checkboxGroupConvertor } from '../utils/mappers';
import InputField from '../shared/InputField';

const Comp = InputField(Checkbox.Group);
const CheckboxGroupComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Comp, combineConvertors(baseConvertor, checkboxGroupConvertor));
  return renderedComponent;
};

export default CheckboxGroupComponent;