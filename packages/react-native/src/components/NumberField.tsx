import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import { Input } from 'native-base';
import { combineConvertors, baseConvertor, numberFieldConvertor } from '../utils/mappers';
import InputField from '../shared/InputField';

const Comp = InputField(Input);
const NumberComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Comp, combineConvertors(baseConvertor, numberFieldConvertor));
  return renderedComponent;
};

export default NumberComponent;