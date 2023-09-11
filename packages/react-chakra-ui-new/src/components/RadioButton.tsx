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
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/type';
import { Radio, RadioGroup, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';

const RadioGroupComponent = (props: PROPS) => {
  const {
    label, required, enumNames, enabled, value,
    description, name, isError, errorMessage
  } = props;

  const enums = props.enum || [];
  const options = enumNames?.length ? enumNames : enums;

  const changeHandler = useCallback((value: any) => {
    props.dispatchChange(value);
  }, [props.dispatchChange]);

  return (
    <FormControl
      variant={props.layout?.variant}
      isRequired={required}
      isDisabled={!enabled}
    >
      {label?.visible ? <FormLabel> {label?.value} </FormLabel> : null}
      <RadioGroup name={name} value={value ? value : ''}
        onChange={changeHandler}
        direction={props.layout?.orientation === 'horizontal' ? 'row' : ''}
        isRequired={required}
        isDisabled={!enabled}
      >
        {options.map((text: string, index) => {
          return (
            <Radio {...props?.properties?.['afs:layout']} key={enums[index]} value={enums[index]}>{text}</Radio>
          );
        })}
      </RadioGroup>
      <FormHelperText>{isError ? errorMessage : description}</FormHelperText>
    </FormControl>
  );

};

export default withRuleEngine(RadioGroupComponent);