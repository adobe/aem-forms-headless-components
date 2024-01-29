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

const CheckboxComponent = function (props: PROPS) {
  const { isError, required, label, errorMessage, description, value, dispatchChange } = props;
  const selectedValue = props.enum?.[0];
  const unselectedValue = (props.enum?.length || 0) < 2 ? null : props.enum?.[1];

  const changeHandler = useCallback((val: any) => {
    const updatedValue = val ? selectedValue : unselectedValue;
    dispatchChange(updatedValue);
  }, [dispatchChange, selectedValue, unselectedValue]);

  return (
    <FormControl isInvalid={isError} isRequired={required} {...props.layout}>
      <Checkbox onChange={changeHandler} value={value}>{label?.visible ? label?.value : ''}</Checkbox>
      {errorMessage ? <FormControl.ErrorMessage testID={`${props.id}-error`}>{errorMessage}</FormControl.ErrorMessage> : null}
      {description && !errorMessage ? <FormControl.HelperText testID={`${props.id}-description`}>{description}</FormControl.HelperText> : null}
    </FormControl>
  );
};

export default withRuleEngine(CheckboxComponent);