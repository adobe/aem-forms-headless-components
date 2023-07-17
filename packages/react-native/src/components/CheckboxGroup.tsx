import React, { useCallback } from 'react';
import { Checkbox, FormControl } from 'native-base';
import { PROPS } from '../utils/types';
import withRuleEngine from '../shared/withRuleEngine';

const CheckboxGroupComponent = function (props: PROPS) {
  const {
    isError, required, label, errorMessage, description,
    value, type, enumNames, dispatchChange
  } = props;
  const enums = props.enum || [];
  const isArray = (type || '[]').indexOf('[]') > -1;
  const options = enumNames?.length ? enumNames : enums;

  const changeHandler = useCallback((val: any) => {
    let finalVal;
    if (val === null) { finalVal = null; }
    if (isArray) {
      finalVal = val;
    } else if (val.length > 0) {
      finalVal = val.filter((x: any) => value !== x)[0];
    } else {
      finalVal = null;
    }
    dispatchChange(finalVal);
  }, [value, isArray, dispatchChange]);

  return (
    <FormControl isInvalid={isError} isRequired={required}>
      {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
      <Checkbox.Group onChange={changeHandler}>
        {options?.map((text: string, index)=>(
          <Checkbox key={enums[index]} value={enums[index]}>{text}</Checkbox>
        ))}
      </Checkbox.Group>
      {errorMessage && <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>}
      {description && !errorMessage && <FormControl.HelperText>{description}</FormControl.HelperText>}
    </FormControl>
  );
};

export default withRuleEngine(CheckboxGroupComponent);