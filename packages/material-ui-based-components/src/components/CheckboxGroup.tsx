import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel } from '@mui/material';

const CheckboxGroupComponent = (props: PROPS) => {
  const {
    label, id, required, enum: enums, enabled, errorMessage,
    description, enumNames, isError, properties
  } = props;
  const k = 'afs:layout';
  let row = false;
  if (properties && properties[k]) {
    row = properties[k].orientation === 'horizontal';
  }

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event.target.value);
  }, [props.dispatchChange]);


  let options = [{ value: enums ? enums[0] : '', label: enumNames ? enumNames[0] : enums ? enums[0] : '' }];

  if (enums) {
    for (let i = 1; i < enums.length; i++) {
      let ob = { value: enums[i], label: enumNames ? enumNames[i] : enums[i] };
      options = [...options, ob];
    }
  }

  return (
    <FormControl
      variant="outlined"
      required={required}
      disabled={!enabled}
      fullWidth
    >
      <FormLabel error={isError}>
        {label?.visible ? label.value : ''}
      </FormLabel>
      <FormGroup row={row} onChange={changeHandler} id={id}>
        {options.map((option, index) => {
          return (
            <FormControlLabel
              value={option.value}
              name={option.label}
              key={index}
              control={<Checkbox name={option.label} />}
              label={option.label}
              onChange={changeHandler}
            />
          );
        })}
      </FormGroup>
      <FormHelperText error={isError} component="span">
        {isError ? errorMessage : description}
      </FormHelperText>
    </FormControl>
  );
};

export default withRuleEngine(CheckboxGroupComponent);