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

import React, { useCallback, useState } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/type';
import {
    FormControl,
    FormLabel,
    FormHelperText,
    Checkbox,
    CheckboxGroup
  } from '@chakra-ui/react';

const CheckboxGroupComponent = (props: PROPS) => {
  const {
    isError, required, label, errorMessage, description,
    value, enumNames, enabled, dispatchChange
  } = props;

  const enums = props.enum || [];
  const options = enumNames?.length ? enumNames : enums;
  const [finalVal, setFinalVal] = useState<any[]>(Array.isArray(value) ? value : []);

  const changeHandler = useCallback((event: any) => {
    let currentVal: any = event.target.value;
    let checked: boolean = event.target.checked;
    if (currentVal === null) { setFinalVal([]); }
    if (checked) {
      setFinalVal([...finalVal, currentVal]);
      dispatchChange([...finalVal, currentVal]);
    }
    else {
      setFinalVal(finalVal.filter((val: string) => val != currentVal));
      dispatchChange(finalVal.filter((val: string) => val != currentVal));
    }
  }, [value, dispatchChange, finalVal]);

  const isChecked = useCallback((val: string) => {
    if (value) {
      return finalVal.includes(val);
    }
    return false;
  }, [value]);

  return (
    <FormControl
      variant={props.layout?.variant}
      isRequired={required}
      isDisabled={!enabled}
    >
      {label?.visible ? <FormLabel> {label.value} </FormLabel> : null}
      <CheckboxGroup direction={props.layout?.orientation === 'horizontal' ? 'row' : ''}>
        {options?.map((text: string, index: number) =>
            <Checkbox {...props?.properties?.['afs:layout']} name={text} onChange={changeHandler} tabIndex={index} value={String(index)} colorScheme={props.layout?.color} isChecked={isChecked(enums[index])}>
                {text}
            </Checkbox>
        )}
      </CheckboxGroup>
      <FormHelperText>
        {isError ? errorMessage : description}
      </FormHelperText>
    </FormControl>
  );
};

export default withRuleEngine(CheckboxGroupComponent);