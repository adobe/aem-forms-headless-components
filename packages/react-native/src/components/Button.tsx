import { Button } from 'native-base';
import { State, FieldJson } from '@aemforms/af-core';
import { useRenderer } from '@aemforms/af-react-renderer';

import { baseConvertor, combineConvertors, buttonConvertor } from '../utils/mappers';

const ButtonComponent = function (propsaa: State<FieldJson>) {
  console.log('==== button', propsaa);   // dummy code
  return propsaa.visible ? useRenderer(propsaa, Button, combineConvertors(baseConvertor, buttonConvertor)) : null;
};
export default ButtonComponent;