import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

const DropDownComponent = (props: PROPS) => {
  const {
    label, required, enumNames, enum: enums, enabled, id,
    isError, description, errorMessage, name, value, type
  } = props;

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
    <FormControl
      variant="outlined"
      required={required}
      disabled={!enabled}
      fullWidth
    >
      <InputLabel error={isError} htmlFor={id}>
        {label?.visible ? label.value : ''}
      </InputLabel>
      <Select
        name={name}
        value={type?.includes('[]') ? value ? value : [] : value ? value : ''}
        multiple={type?.includes('[]')}
        label={label?.visible ? label.value : ''}
        onChange={changeHandler}
        onBlur={blurHandler}
        onFocus={focusHandler}
        error={isError ? true : false}
        inputProps={{
          id: id
        }}
      >
        {options?.map((option: any) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText error={isError ? true : false} component="span">
        {isError ? errorMessage : description}
      </FormHelperText>
    </FormControl>
  );

};

export default withRuleEngine(DropDownComponent);