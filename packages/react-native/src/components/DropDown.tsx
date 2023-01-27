import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import { Select } from 'native-base';
import { combineConvertors, baseConvertor, dropDownConvertor } from '../utils/mappers';
import InputField from '../shared/InputField';

const Comp = InputField(Select);
const DropDownComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Comp, combineConvertors(baseConvertor, dropDownConvertor));
  return renderedComponent;
};

export default DropDownComponent;