import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';

const RadioGroupComponent = (props: PROPS) => {
  const {
    label, required, enumNames, enabled, value,
    description, name, isError, errorMessage
  } = props;

  const enums = props.enum || [];
  const options = enumNames?.length ? enumNames : enums;

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event.target.value);
  }, [props.dispatchChange]);
  return (

    <FormControl disabled={!enabled} required={required} sx={{ mt: 5 }}>
      {label?.visible ? <FormLabel error={isError}> {label.value} </FormLabel> : null}
      <RadioGroup name={name} value={value ? value : ''}
        onChange={changeHandler}
        row={props.layout?.orientation === 'horizontal'}
      >
        {options.map((text: string, index) => {
          return (
            <FormControlLabel
              key={enums[index]}
              value={enums[index]}
              control={<Radio />}
              label={text}
            />
          );
        })}
      </RadioGroup>
      <FormHelperText error={isError} component="span">{isError ? errorMessage : description}</FormHelperText>
    </FormControl>
  );

};

export default withRuleEngine(RadioGroupComponent);