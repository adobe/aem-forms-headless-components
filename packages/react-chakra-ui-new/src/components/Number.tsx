 
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
import { Input, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';

const TextField = (props: PROPS) => {
  const { isError, placeholder, name, required, label, errorMessage,
    description, enabled, readOnly, maxLength, minLength, id, value, maximum, minimum
  } = props;

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event?.target.value);

  }, [props.dispatchChange]);

  const blurHandler = useCallback((event: any) => {
    props.dispatchBlur(event?.target.value);
  }, [props.dispatchBlur]);

  const focusHandler = useCallback((event: any) => {
    props.dispatchFocus(event?.target.value);
  }, [props.dispatchFocus]);

  const getValue = useCallback(() => {
    return value ? value : '';
  }, [value]);

  return (
    <FormControl
    variant={props.layout?.variant}
    isRequired={required}
    isDisabled={!enabled}
  >
    {label?.visible ? <FormLabel htmlFor={id}>{label.value}</FormLabel> : null}
    <Input
        {...props?.properties?.['afs:layout']}
        id={id}
        label={label?.visible ? label.value : ''}
        value={getValue()}
        isRequired={required}
        isDisabled={!enabled}
        isReadOnly={readOnly}
        variant={props.layout?.variant}
        name={name}
        type='number'
        onChange={changeHandler} onBlur={blurHandler} onFocus={focusHandler}
        size="lg"
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        max={maximum}
        min={minimum}
      />
      <FormHelperText>
      {isError ? errorMessage : description}
    </FormHelperText>
   </FormControl>
  );
};

export default withRuleEngine(TextField);