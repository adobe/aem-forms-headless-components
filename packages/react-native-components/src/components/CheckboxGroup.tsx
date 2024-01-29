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
    <FormControl isInvalid={isError} isRequired={required} {...props.layout}>
      {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
      <Checkbox.Group onChange={changeHandler}>
        {options?.map((text: string, index)=>(
          <Checkbox key={enums[index]} value={enums[index]}>{text}</Checkbox>
        ))}
      </Checkbox.Group>
      {errorMessage ? <FormControl.ErrorMessage testID={`${props.id}-error`}>{errorMessage}</FormControl.ErrorMessage> : null}
      {description && !errorMessage ? <FormControl.HelperText testID={`${props.id}-description`}>{description}</FormControl.HelperText> : null}
    </FormControl>
  );
};

export default withRuleEngine(CheckboxGroupComponent);