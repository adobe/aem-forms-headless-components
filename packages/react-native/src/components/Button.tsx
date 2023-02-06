import { Button } from 'native-base';
import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';

import { baseConvertor, combineConvertors, buttonConvertor } from '../utils/mappers';

const ButtonComponent = function (propsaaaaaa: State<FieldJson>) {
  console.log('==== button', propsaaaaaa);   // dummy code
  return propsaaaaaa.visible ? useRenderer(propsaaaaaa, Button, combineConvertors(baseConvertor, buttonConvertor)) : null;
};
export default ButtonComponent;