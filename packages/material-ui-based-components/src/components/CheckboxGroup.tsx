import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel } from '@mui/material';

const CheckboxGroupComponent = (props: PROPS) => {
  const {
    isError, required, label, errorMessage, description,
    value, enumNames, enabled, dispatchChange
  } = props;

  const enums = props.enum || [];
  const options = enumNames?.length ? enumNames : enums;

  const changeHandler = useCallback((event: any) => {
    let currentVal = event.target.value;
    let checked = event.target.checked;
    let finalVal = Array.isArray(value) ? value : [];
    if (currentVal === null) { finalVal = []; }
    if (checked) {
      finalVal.push(currentVal);
    }
    else {
      finalVal = finalVal.filter((val: string) => val != currentVal);
    }
    dispatchChange(finalVal);
  }, [value, dispatchChange]);

  return (
    <FormControl
      variant={props.layout?.variant}
      required={required}
      disabled={!enabled}
      fullWidth
    >
      {label?.visible ? <FormLabel error={isError}> {label.value} </FormLabel> : null}
      <FormGroup row={props.layout?.orientation === 'horizontal'}>
        {options?.map((text: string, index) => {
          return (
            <FormControlLabel
              value={value ? value : []}
              name={text}
              key={enums[index]}
              control={<Checkbox value={enums[index]} color={props.layout?.color} />}
              label={text}
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