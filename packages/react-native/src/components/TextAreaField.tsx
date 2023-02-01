import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import { TextArea } from 'native-base';
import { combineConvertors, baseConvertor, textFieldConvertor } from '../utils/mappers';
import InputField from '../shared/InputField';

const Comp = InputField(TextArea);
const TextAreaFieldComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Comp, combineConvertors(baseConvertor, textFieldConvertor));
  return renderedComponent;
};

export default TextAreaFieldComponent;