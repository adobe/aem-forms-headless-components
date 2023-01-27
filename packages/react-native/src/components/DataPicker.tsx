import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import DatePicker from 'react-native-datepicker';
import { combineConvertors, baseConvertor, dateFieldConvertor } from '../utils/mappers';
import InputField from '../shared/InputField';

const Comp = InputField(DatePicker);
const DateFieldComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Comp, combineConvertors(baseConvertor, dateFieldConvertor));
  return renderedComponent;
};

export default DateFieldComponent;