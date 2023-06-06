import React from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';

const TextField = (props: PROPS)=>{
  console.log('====props', props);
  return <div></div>;
};

export default withRuleEngine(TextField);