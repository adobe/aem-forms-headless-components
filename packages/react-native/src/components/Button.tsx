import { Button } from 'native-base';
import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';

import { baseConvertor, combineConvertors, buttonConvertor } from '../utils/mappers';

const ButtonComponent = function (propsaaa: State<FieldJson>) {
  console.log('==== button', propsaaa);   // dummy code
  return propsaaa.visible ? useRenderer(propsaaa, Button, combineConvertors(baseConvertor, buttonConvertor)) : null;
};
export default ButtonComponent;