/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2026 Adobe
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
import { Input, FormControl, Pressable, Text } from 'native-base';
import { PROPS, INPUT } from '../utils/types';
import withRuleEngine from '../shared/withRuleEngine';

const PasswordComponent = function (props: PROPS) {
  const { isError, required, label, errorMessage, description } = props;
  const [revealed, setRevealed] = useState(false);

  // Mirrors PasswordInput.isShowHidePasswordEnabled() (default true) from the core component.
  const showHidePasswordEnabled = (props as any).properties?.['fd:showHidePassword'] !== false;

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event);
  }, [props.dispatchChange]);

  const blurHandler = useCallback((event: any) => {
    props.dispatchBlur(event);
  }, [props.dispatchBlur]);

  const focusHandler = useCallback((event: any) => {
    props.dispatchFocus(event);
  }, [props.dispatchFocus]);

  const toggleLabel = revealed ? 'Hide password' : 'Show password';

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
    type: revealed ? 'text' : 'password'
  };

  return (
    <FormControl isInvalid={isError} isRequired={required} {...props.layout}>
      {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
      <Input
        {...inputProps as any}
        InputRightElement={showHidePasswordEnabled ? (
          <Pressable
            onPress={() => setRevealed((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={toggleLabel}
            accessibilityState={{ selected: revealed }}
            testID={`${props.id}-toggle`}
          >
            <Text mx={3}>{toggleLabel}</Text>
          </Pressable>
        ) : undefined}
      />
      {errorMessage && <FormControl.ErrorMessage testID={`${props.id}-error`}>{errorMessage}</FormControl.ErrorMessage>}
      {description && !errorMessage && <FormControl.HelperText testID={`${props.id}-description`}>{description}</FormControl.HelperText>}
    </FormControl>
  );
};

export default withRuleEngine(PasswordComponent);
