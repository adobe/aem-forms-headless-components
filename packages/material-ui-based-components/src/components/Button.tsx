import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import Button from '@mui/material/Button';

const ButtonComponent = (props: PROPS) => {

  const { label, enabled, id, name } = props;

  const clickHandler = useCallback((event: any) => {
    props.dispatchClick(event);
  }, [props.dispatchClick]);

  return (
    <Button variant={props.layout?.variant} disabled={!enabled} onClick={clickHandler} id={id} name={name} color={props.layout?.color}>
      {label?.visible ? label.value : ''}
    </Button>
  );
};
export default withRuleEngine(ButtonComponent);