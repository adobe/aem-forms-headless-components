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
import { FormControl, Checkbox, FormHelperText } from '@chakra-ui/react';

const CheckBoxComponent = (props: PROPS) => {
    const {
        label, required, enabled, value, errorMessage,
        description, isError, name
    } = props;
    const selectedValue = props.enum?.[0];
    const unselectedValue = (props.enum?.length || 0) < 2 ? null : props.enum?.[1];

    const changeHandler = useCallback((event: any) => {
        const val = (event.target.checked) ? selectedValue : unselectedValue;
        props.dispatchChange(val);
    }, [props.dispatchChange]);

    return (
        <FormControl
            variant={props.layout?.variant}
            isRequired={required}
            isDisabled={!enabled}
        >
            <Checkbox
                {...props?.properties?.['afs:layout']}
                isDisabled={!enabled}
                isRequired={required}
                value={label}
                onChange={changeHandler}
                name={name}
                isChecked={value === props.enum?.[0] || value === true}
            >
                {label?.visible ? label.value : ''}
            </Checkbox>
            <FormHelperText>
                {isError ? errorMessage : description}
            </FormHelperText>
        </FormControl>
    );
};

export default withRuleEngine(CheckBoxComponent);