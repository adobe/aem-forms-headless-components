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
import { PROPS } from '../utils/types';
import {
    Checkbox,
    FormControl, FormControlLabel, FormGroup, FormHelperText
} from '@mui/material';

const CheckboxComponent = (props: PROPS) => {
    const {
        label, id, required, enabled, value, errorMessage,
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
            required={required}
            disabled={!enabled}
            id={id}
            fullWidth
            error={isError}
            sx={{ mt: 2 }}
        >
            <FormGroup row={props.layout?.orientation === 'horizontal'}>
                <FormControlLabel
                    required={required}
                    value={label?.value}
                    name={name}
                    control={<Checkbox color={props.layout?.color} />}
                    label={label?.visible ? label.value : ''}
                    onChange={changeHandler}
                    checked={value === props.enum?.[0] || value === true}
                />
            </FormGroup>
            <FormHelperText error={isError} component="span">
                {isError ? errorMessage : description}
            </FormHelperText>
        </FormControl>
    );
};

export default withRuleEngine(CheckboxComponent);