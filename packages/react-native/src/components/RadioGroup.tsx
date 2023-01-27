import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import { Radio } from 'native-base';
import { combineConvertors, baseConvertor, radioGroupConvertor } from '../utils/mappers';
import InputField from '../shared/InputField';

const Comp = InputField(Radio.Group);
const RadioGroupComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Comp, combineConvertors(baseConvertor, radioGroupConvertor));
  return renderedComponent;
};

export default RadioGroupComponent;