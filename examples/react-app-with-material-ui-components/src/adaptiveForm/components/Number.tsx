/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2023 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/

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
      fullWidth
      sx={{ mt: 2 }}>
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