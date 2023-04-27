import React, { useCallback } from 'react';
import { Checkbox, FormControl } from 'native-base';
import { PROPS } from '../utils/types';
import withRuleEngine from '../shared/withRuleEngine';

const CheckboxComponent = function (props: PROPS) {
  const { isError, required, label, errorMessage, description, value, dispatchChange } = props;
  const selectedValue = props.enum?.[0];
  const unselectedValue = (props.enum?.length || 0) < 2 ? null : props.enum?.[1];

  const changeHandler = useCallback((val: any) => {
    const updatedValue = val ? selectedValue : unselectedValue;
    dispatchChange(updatedValue);
  }, [dispatchChange, selectedValue, unselectedValue]);

  return (
    <FormControl isInvalid={isError} isRequired={required}>
      <Checkbox onChange={changeHandler} value={value}>{label?.visible ? label?.value : ''}</Checkbox>
      {errorMessage && <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>}
      {description && !errorMessage && <FormControl.HelperText>{description}</FormControl.HelperText>}
    </FormControl>
  );
};

export default withRuleEngine(CheckboxComponent);