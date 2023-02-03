import { Button } from 'native-base';
import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';
import { baseConvertor, combineConvertors, buttonConvertor } from '../utils/mappers';

const ButtonComponent = function (props: State<FieldJson>) {
  console.log('====', props);   // dummy code
  return props.visible ? useRenderer(props, Button, combineConvertors(baseConvertor, buttonConvertor)) : null;
};
export default ButtonComponent;