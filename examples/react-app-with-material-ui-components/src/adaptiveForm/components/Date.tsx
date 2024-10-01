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

import React,{ useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const DateComponent = (props: PROPS) => {

    const { isError, name, required, label, errorMessage,
        description, enabled, readOnly, id, value, minimum, maximum
    } = props;

    const changeHandler = useCallback((event: any) => {

        props.dispatchChange(dayjs(event.$d).format('YYYY-MM-DD'));
    }, [props.dispatchChange]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label={label?.visible ? label.value : ''}
                    disabled={!enabled}
                    readOnly={readOnly}
                    onChange={changeHandler}
                    // defaultValue={string}
                    value={value === undefined ? null : dayjs(value)}
                    minDate={minimum ? dayjs(minimum) : undefined}
                    maxDate={maximum ? dayjs(maximum) : undefined}
                    views={['year', 'month', 'day']}
                    slotProps={{
                        textField: {
                            helperText: isError ? errorMessage : description,
                            id: id,
                            error: isError,
                            name: name,
                            required: required,
                            fullWidth: true,
                            sx: { mt: 2 }
                        }
                    }}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
};

export default withRuleEngine(DateComponent);