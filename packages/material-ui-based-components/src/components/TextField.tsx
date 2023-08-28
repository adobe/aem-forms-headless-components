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

import React, { useCallback, useState } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Input, FilledInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const input: any = {
  outlined: OutlinedInput,
  standard: Input,
  filled: FilledInput
};

const TextFieldComponent = (props: PROPS) => {
  const { isError, placeholder, name, required, label, format, errorMessage,
    description, enabled, readOnly, maxLength, minLength, pattern, id, value
  } = props;

  const isPassword = props.fieldType === 'password-input';
  const [showPassword, setShowPassword] = useState(true);

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event?.target.value);

  }, [props.dispatchChange]);

  const blurHandler = useCallback((event: any) => {
    props.dispatchBlur(event?.target.value);
  }, [props.dispatchBlur]);

  const focusHandler = useCallback((event: any) => {
    props.dispatchFocus(event?.target.value);
  }, [props.dispatchFocus]);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword((show) => !show);
  }, []);

  const getValue = useCallback(() => {
    return value ? value : '';
  }, [value]);

  const getPasswordIcon = useCallback(() => {
    return (
      <InputAdornment position="end">
        <IconButton
          name="passwordButton"
          onClick={handleClickShowPassword}
          edge="end"
          title="passwordButton"
          disabled={!enabled}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    );
  }, [showPassword]);


  const getType = useCallback(() => {
    if (isPassword) {
      if (showPassword) {
        return 'password';
      }
      return 'text';
    }
    else if (format === 'email') {
      return 'email';
    }
    return 'text';
  }, [isPassword, showPassword, format]);

  const InputVariant = input[props.layout?.variant];

  return (
    <FormControl
      variant={props.layout?.variant}
      disabled={!enabled}
      required={required}
      fullWidth
      sx={{ mt: 2 }}>
      {label?.visible ? <InputLabel error={isError} htmlFor={id}>{label.value}</InputLabel> : null}
      <InputVariant
        id={id}
        label={label?.visible ? label.value : ''}
        value={getValue()}
        name={name}
        multiline={props.fieldType === 'multiline-input'}
        type={getType()}
        onChange={changeHandler} onBlur={blurHandler} onFocus={focusHandler}
        error={isError}
        placeholder={placeholder}
        endAdornment={isPassword ? getPasswordIcon() : null}
        inputProps={{
          readOnly: readOnly,
          maxLength: maxLength,
          minLength: minLength,
          pattern: pattern
        }}
      />
      <FormHelperText error={isError} component="span">
        {isError ? errorMessage : description}
      </FormHelperText>
    </FormControl>
  );
};

export default withRuleEngine(TextFieldComponent);