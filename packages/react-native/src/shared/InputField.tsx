import React, { JSXElementConstructor } from 'react';
import { FormControl } from 'native-base';
import { InputFieldTypes } from '../utils/types';

const InputField = (Comp: JSXElementConstructor<any>) => React.forwardRef((props: InputFieldTypes) => {
  const { label, description, errorMessage, isHidden, isInvalid, inputProps } = props;
  if (isHidden) {
    return null;
  }
  return (
    <FormControl isInvalid={isInvalid} isRequired={inputProps.isRequired && label}>
      <FormControl.Label>{label}</FormControl.Label>
      <Comp {...inputProps} />
      {errorMessage && <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>}
      {description && !errorMessage && <FormControl.HelperText>{description}</FormControl.HelperText>}
    </FormControl>
  );
});

export default InputField;