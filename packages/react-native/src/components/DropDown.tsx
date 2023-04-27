import React, { useCallback } from 'react';
import { Select, FormControl } from 'native-base';
import { PROPS } from '../utils/types';
import withRuleEngine from '../shared/withRuleEngine';

const DropDownComponent = function (props: PROPS) {
  const {
    isError, required, label, errorMessage, description,
    value, enumNames, placeholder, dispatchChange
  } = props;
  const enums = props.enum || [];
  const options = enumNames?.length ? enumNames : enums;

  const changeHandler = useCallback((val: any) => {
    dispatchChange(val);
  }, [dispatchChange]);

  return (
    <FormControl isInvalid={isError} isRequired={required}>
      {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
      <Select onValueChange={changeHandler} selectedValue={value} placeholder={placeholder}>
        {options?.map((text: string, index) => (
          <Select.Item key={enums[index]} value={enums[index]} label={text} />
        ))}
      </Select>
      {errorMessage && <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>}
      {description && !errorMessage && <FormControl.HelperText>{description}</FormControl.HelperText>}
    </FormControl>
  );
};

export default withRuleEngine(DropDownComponent);