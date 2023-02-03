import { Button } from 'native-base';
import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';

import { baseConvertor, combineConvertors, buttonConvertor } from '../utils/mappers';

const ButtonComponent = function (a: State<FieldJson>) {
  console.log('==== button', a);   // dummy code
  return a.visible ? useRenderer(a, Button, combineConvertors(baseConvertor, buttonConvertor)) : null;
};
export default ButtonComponent;