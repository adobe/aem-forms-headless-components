import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import { Text } from 'native-base';
import { combineConvertors, baseConvertor, plainTextConvertor } from '../utils/mappers';

const PlainTextComponent = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, Text, combineConvertors(baseConvertor, plainTextConvertor));
  return renderedComponent;
};

export default PlainTextComponent;