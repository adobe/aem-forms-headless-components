import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';

const RadioGroupComponent = (props: PROPS) => {
  const {
    label, id, required, enumNames, enum: enums, enabled,
    description, name, isError, errorMessage, properties
  } = props;
  const k = 'afs:layout';
  let row = false;
  if (properties && properties[k]) {
    row = properties[k].orientation === 'horizontal';
  }

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event.target.value);
  }, [props.dispatchChange]);

  const blurHandler = useCallback((event: any) => {
    props.dispatchBlur(event.target.value);
  }, [props.dispatchBlur]);

  const focusHandler = useCallback((event: any) => {
    props.dispatchFocus(event.target.value);
  }, [props.dispatchFocus]);

  let options = [{ value: enums ? enums[0] : '', label: enumNames ? enumNames[0] : enums ? enums[0] : '' }];

  if (enums) {
    for (let i = 1; i < enums.length; i++) {
      let ob = { value: enums[i], label: enumNames ? enumNames[i] : enums[i] };
      options = [...options, ob];
    }
  }

  return (
    <div className="Margin">
      <FormControl disabled={!enabled} required={required}>
        <FormLabel error={isError}>
          {label?.visible ? label.value : ''}
        </FormLabel>
        <RadioGroup name={name}
          onChange={changeHandler}
          onBlur={blurHandler}
          onFocus={focusHandler}
          defaultValue=''
          row={row}
          id={id}
        >
          {options.map((option) => {
            return (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            );
          })}
        </RadioGroup>
        <FormHelperText error={isError} component="span">{isError ? errorMessage : description}</FormHelperText>
      </FormControl>
    </div>
  );

};

export default withRuleEngine(RadioGroupComponent);