import React from 'react';
import { Text } from 'native-base';
import withRuleEngine from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';

const PlainTextComponent = function (props: PROPS) {
  return (
    <Text>{props.value || ''}</Text>
  );
};

export default withRuleEngine(PlainTextComponent);