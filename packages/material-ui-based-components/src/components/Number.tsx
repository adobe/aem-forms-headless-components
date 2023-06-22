import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';

const NumberComponent = (props: PROPS) => {
  const { isError, placeholder, name, required, label, description,
    enabled, readOnly, maximum, minimum, errorMessage, id, value
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

  return (
    <FormControl
      variant="outlined"
      required={required}
      disabled={!enabled}
      fullWidth>
      <InputLabel error={isError ? true : false} htmlFor={id}>
        {label?.visible ? label.value : ''}
      </InputLabel>
      <OutlinedInput
        label={label?.visible ? label.value : ''}
        id={id}
        value={value ? value : ''}
        name={name}
        multiline={props.fieldType === 'multiline-input' ? true : false}
        type='number'
        onChange={changeHandler} onBlur={blurHandler} onFocus={focusHandler}
        error={isError}
        placeholder={placeholder}
        inputProps={{
          readOnly: readOnly,
          max: maximum,
          min: minimum
        }}
      />
      <FormHelperText error={isError} component="span">
        {isError ? errorMessage : description}
      </FormHelperText>
    </FormControl>
  );
};

export default withRuleEngine(NumberComponent);
