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
    <FormControl isInvalid={isError} isRequired={required}>
      {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
      <Comp {...inputProps as any} />
      {errorMessage && <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>}
      {description && !errorMessage && <FormControl.HelperText>{description}</FormControl.HelperText>}
    </FormControl>
  );
};

export default withRuleEngine(TextFieldComponent);