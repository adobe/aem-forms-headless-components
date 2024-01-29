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
import { Input, TextArea, FormControl } from 'native-base';
import { PROPS, INPUT } from '../utils/types';
import withRuleEngine from '../shared/withRuleEngine';

const TextFieldComponent = function (props: PROPS) {
  const { isError, required, label, errorMessage, description } = props;

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event);
  }, [props.dispatchChange]);

  const blurHandler = useCallback((event: any) => {
    props.dispatchBlur(event);
  }, [props.dispatchBlur]);

  const focusHandler = useCallback((event: any) => {
    props.dispatchFocus(event);
  }, [props.dispatchFocus]);

  const inputProps: INPUT = {
    placeholder: props.placeholder || '',
    value: props.value == null ? '' : props.value,
    onChangeText: changeHandler,
    onBlur: blurHandler,
    onFocus: focusHandler,
    isReadOnly: props.readOnly === true,
    isRequired: props.required === true,
    isDisabled: props.enabled === false,
    KeyboardTypeOptions: 'default',
    maxLength: props.maxLength,
    minLength: props.minLength,
    pattern: props.pattern,
    type: props[':type'] === 'password-input' ? 'password' : 'text'
  };
  const Comp = props.fieldType === 'multiline-input' ? TextArea: Input;

  return (
    <FormControl isInvalid={isError} isRequired={required} {...props.layout}>
      {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
      <Comp {...inputProps as any} />
      {errorMessage && <FormControl.ErrorMessage testID={`${props.id}-error`}>{errorMessage}</FormControl.ErrorMessage>}
      {description && !errorMessage && <FormControl.HelperText testID={`${props.id}-description`}>{description}</FormControl.HelperText>}
    </FormControl>
  );
};

export default withRuleEngine(TextFieldComponent);