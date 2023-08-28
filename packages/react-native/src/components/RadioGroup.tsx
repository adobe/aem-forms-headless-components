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
      {errorMessage ? <FormControl.ErrorMessage testID={`${props.id}-error`}>{errorMessage}</FormControl.ErrorMessage> : null}
      {description && !errorMessage ? <FormControl.HelperText testID={`${props.id}-description`}>{description}</FormControl.HelperText> : null}
    </FormControl>
  );
};

export default withRuleEngine(RadioGroupComponent);