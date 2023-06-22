import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import {
  Checkbox,
  FormControl, FormControlLabel, FormGroup, FormHelperText, Switch
} from '@mui/material';

const CheckboxComponent = (props: PROPS) => {
  const {
    label, id, required, enabled, value, errorMessage,
    description, isError, properties, name
  } = props;
  const selectedValue = props.enum?.[0];
  const unselectedValue = (props.enum?.length || 0) < 2 ? null : props.enum?.[1];
  const k = 'afs:layout';
  let row = false;
  if (properties && properties[k]) {
    row = properties[k].orientation === 'horizontal';
  }

  const control = () => {
    if (props[':type'] === 'switch') {
      return (<Switch />);
    }
    else {
      return (<Checkbox />);
    }
  };

  const changeHandler = useCallback((event: any) => {
    const val = (event.target.checked) ? selectedValue : unselectedValue;
    props.dispatchChange(val);
  }, [props.dispatchChange]);

  return (
    <FormControl
      variant="standard"
      required={required}
      disabled={!enabled}
      id={id}
      fullWidth
      error={isError}
    >
      <FormGroup row={row} onChange={changeHandler}>
        <FormControlLabel
          required={required}
          value={label}
          name={name}
          control={control()}
          label={label?.visible ? label.value : ''}
          onChange={changeHandler}
          checked={value === 'on'}
        />
      </FormGroup>
      <FormHelperText error={isError} component="span">
        {isError ? errorMessage : description}
      </FormHelperText>
    </FormControl>
  );
};

export default withRuleEngine(CheckboxComponent);