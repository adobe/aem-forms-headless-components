import React, { useCallback } from 'react';
import { Radio, FormControl } from 'native-base';
import { PROPS } from '../utils/types';
import withRuleEngine from '../shared/withRuleEngine';

const RadioGroupComponent = function (props: PROPS) {
  const {
    isError, required, label, errorMessage, description,
    value, enumNames, name, dispatchChange
  } = props;
  const enums = props.enum || [];
  const options = enumNames?.length ? enumNames : enums;

  const changeHandler = useCallback((val: any) => {
    dispatchChange(val);
  }, [dispatchChange]);

  return (
    <FormControl isInvalid={isError} isRequired={required}>
      {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
      <Radio.Group onChange={changeHandler} value={value} name={name || 'radio'}>
        {options?.map((text: string, index) => (
          <Radio key={enums[index]} value={enums[index]}  style={{ marginTop: 3 }}>{text}</Radio>
        ))}
      </Radio.Group>
      {errorMessage && <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>}
      {description && !errorMessage && <FormControl.HelperText>{description}</FormControl.HelperText>}
    </FormControl>
  );
};

export default withRuleEngine(RadioGroupComponent);