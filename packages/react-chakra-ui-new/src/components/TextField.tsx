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
import { PROPS } from '../utils/type';
import { Input, InputGroup, Button, InputRightElement } from '@chakra-ui/react';
import { MdVisibility , MdVisibilityOff } from 'react-icons/md';
import { Textarea, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';

const TextField = (props: PROPS) => {
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
        <Button
          name="passwordButton"
          onClick={handleClickShowPassword}
          edge="end"
          title="passwordButton"
          disabled={!enabled}
        >
          {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
        </Button>
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

  const Comp = props.fieldType === 'multiline-input' ? Textarea : Input;

  return (
    <FormControl
      variant={props.layout?.variant}
      isRequired={required}
      isDisabled={!enabled}
    >
      {label?.visible ? <FormLabel htmlFor={id}>{label.value}</FormLabel> : null}
      <InputGroup>
      <Comp
        {...props?.properties?.['afs:layout']}
        id={id}
        label={label?.visible ? label.value : ''}
        value={getValue()}
        isRequired={required}
        isDisabled={!enabled}
        isReadOnly={readOnly}
        variant={props.layout?.variant}
        name={name}
        type={getType()}
        onChange={changeHandler} onBlur={blurHandler} onFocus={focusHandler}
        error={isError}
        placeholder={placeholder}
        pattern={pattern}
        maxLength={maxLength}
        minLength={minLength}
      />
        <InputRightElement width='4.5rem'>
          {isPassword ? getPasswordIcon() : null}
        </InputRightElement>
      </InputGroup>
      <FormHelperText>
        {isError ? errorMessage : description}
      </FormHelperText>
    </FormControl>
  );
};

export default withRuleEngine(TextField);