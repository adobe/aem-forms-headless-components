import { Button } from 'native-base';
import React from 'react';
import { PROPS } from '../utils/types';
import withRuleEngine from '../shared/withRuleEngine';

const ButtonComponent = function (props: PROPS) {
  const { label, enabled, dispatchClick } = props;
  return <Button onPress={dispatchClick} isDisabled={enabled === false}>{label?.value}</Button>;
};
export default withRuleEngine(ButtonComponent);