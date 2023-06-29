import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { FormControl, FormHelperText, InputLabel, OutlinedInput, Input, FilledInput } from '@mui/material';

const input: any = {
  outlined: OutlinedInput,
  standard: Input,
  filled: FilledInput
};

const NumberComponent = (props: PROPS) => {
  const { isError, placeholder, name, required, label, description,
    enabled, readOnly, maximum, minimum, errorMessage, id, value
  } = props;

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event?.target.value);
  }, [props.dispatchChange]);

  const blurHandler = useCallback((event: any) => {
    props.dispatchBlur(event?.target.value);
  }, [props.dispatchBlur]);

  const focusHandler = useCallback((event: any) => {
    props.dispatchFocus(event?.target.value);
  }, [props.dispatchFocus]);

  const InputVariant = input[props.layout?.variant];

  return (
    <FormControl
      variant={props.layout?.variant}
      required={required}
      disabled={!enabled}
      fullWidth>
      {label?.visible ? <InputLabel error={isError} htmlFor={id}>{label.value}</InputLabel> : null}
      <InputVariant
        label={label?.visible ? label.value : ''}
        id={id}
        value={value ? value : ''}
        name={name}
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
