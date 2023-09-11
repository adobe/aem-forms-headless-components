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
import { Select, FormLabel, FormControl, FormHelperText } from '@chakra-ui/react';

const DropDownComponent = (props: PROPS) => {
  const {
    label, required, enumNames, enabled, id,
    isError, description, errorMessage, name, value, type
  } = props;

  const enums = props.enum || [];
  const options = enumNames?.length ? enumNames : enums;
  const isArray = (type || '[]').indexOf('[]') > -1;

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event.target.value);
  }, [props.dispatchChange]);

  const blurHandler = useCallback((event: any) => {
    props.dispatchBlur(event.target.value);
  }, [props.dispatchBlur]);

  const focusHandler = useCallback((event: any) => {
    props.dispatchFocus(event.target.value);
  }, [props.dispatchFocus]);

  const getValue = useCallback(() => {
    if (isArray) {
      if (value) {
        return value;
      }
      return [];
    }
    else {
      if (value) {
        return value;
      }
      return '';
    }
  }, [isArray, value]);

  return (
    <>
    <FormControl
      variant={props.layout?.variant}
      isRequired={required}
      isDisabled={!enabled}
      fullWidth
      sx={{ mt: 2 }}
    >
          {label?.visible ?  <FormLabel htmlFor={id}>{label.value}</FormLabel> : null}
          <Select
            {...props?.properties?.['afs:layout']}
            name={name}
            isDisabled={!enabled}
            isRequired={required}
            variant={props.layout?.variant}
            value={getValue()}
            label={label?.visible ? label.value : ''}
            onChange={changeHandler}
            onBlur={blurHandler}
            onFocus={focusHandler}
          >
            {options?.map((text: string, index) => {
              return (
                <option key={enums[index]} value={enums[index]}>
                  {text}
                </option>
              );
            })}
          </Select>
          <FormHelperText>
            {isError ? errorMessage : description}
          </FormHelperText>
      </FormControl>
    </>
  );

};

export default withRuleEngine(DropDownComponent);