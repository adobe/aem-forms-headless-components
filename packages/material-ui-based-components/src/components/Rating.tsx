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
import { Box, FormHelperText, InputLabel, Rating } from '@mui/material';

const RatingComponent = (props: PROPS) => {
    const { isError, name, label, required, description, enabled, readOnly, maximum, errorMessage, id, value } = props;

    const changeHandler = useCallback((event: any) => {
        props.dispatchChange(event.target.value);
    }, [props.dispatchChange]);

    const blurHandler = useCallback((event: any) => {
        props.dispatchBlur(event.target.value);
    }, [props.dispatchBlur]);

    const focusHandler = useCallback((event: any) => {
        props.dispatchFocus(event.target.value);
    }, [props.dispatchFocus]);

    return (
        <Box sx={{ mt: 2 }}>
            {label?.visible ? <InputLabel error={isError} id={id} required={required}>
                {label.value}
            </InputLabel> : null}
            <Rating
                aria-labelledby={id}
                name={name}
                value={value ? value : null}
                disabled={!enabled}
                readOnly={readOnly}
                max={maximum ? maximum : 5}
                onChange={changeHandler}
                onBlur={blurHandler}
                onFocus={focusHandler}
            />
            <FormHelperText error={isError} component="div">
                {isError ? errorMessage : description}
            </FormHelperText>
        </Box>
    );
};

export default withRuleEngine(RatingComponent);