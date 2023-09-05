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
import { Autocomplete, FormControl, FormHelperText, TextField } from '@mui/material';

const AutoCompleteComponent = (props: PROPS) => {
    const {
        label, required, enumNames, enabled, id,
        isError, description, errorMessage, name, value
    } = props;

    const enums = props.enum || [];
    const options = enumNames?.length ? enumNames : enums;

    const list = () => {
        let index = enums.indexOf(value);
        return index !== -1 ? options[index] : null;
    };

    const changeHandler = useCallback((event: any, newValue: number) => {
        let index = options.indexOf(newValue);
        props.dispatchChange(index === -1 ? undefined : enums[index]);
    }, [props.dispatchChange, enums]);

    const blurHandler = useCallback((event: any) => {
        props.dispatchBlur(event.target.value);
    }, [props.dispatchBlur]);

    const focusHandler = useCallback((event: any) => {
        props.dispatchFocus(event.target.value);
    }, [props.dispatchFocus]);

    return (
        <FormControl
            fullWidth
            sx={{ mt: 2 }}
        >
            <Autocomplete
                fullWidth
                autoComplete
                disabled={!enabled}
                value={list()}
                id={id}
                onChange={changeHandler}
                onBlur={blurHandler}
                onFocus={focusHandler}
                options={options}
                getOptionLabel={(text) => text}
                isOptionEqualToValue={(index, value) => enums[index] === value.value}
                renderInput={(params) => <TextField {...params}
                    label={label?.visible ? label.value : ''}
                    required={required}
                    error={isError}
                    name={name}
                    variant={props.layout?.variant}
                />}
            />
            <FormHelperText error={isError} component="span">
                {isError ? errorMessage : description}
            </FormHelperText>
        </FormControl>
    );

};

export default withRuleEngine(AutoCompleteComponent);