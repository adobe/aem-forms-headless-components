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
import { PROPS } from '../utils/types';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel } from '@mui/material';

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

  return (
    <FormControl
      variant={props.layout?.variant}
      required={required}
      disabled={!enabled}
      fullWidth
      sx={{ mt: 2 }}
    >
      {label?.visible ? <FormLabel error={isError}> {label.value} </FormLabel> : null}
      <FormGroup row={props.layout?.orientation === 'horizontal'}>
        {options?.map((text: string, index) => {
          return (
            <FormControlLabel
              value={value ? value : []}
              name={text}
              key={enums[index]}
              control={<Checkbox checked={value?.includes(enums[index])} value={enums[index]} color={props.layout?.color}  />}
              label={text}
              onChange={changeHandler}
            />
          );
        })}
      </FormGroup>
      <FormHelperText error={isError} component="span">
        {isError ? errorMessage : description}
      </FormHelperText>
    </FormControl>
  );
};

export default withRuleEngine(CheckboxGroupComponent);