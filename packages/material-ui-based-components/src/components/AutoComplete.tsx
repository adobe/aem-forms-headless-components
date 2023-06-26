import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { Autocomplete, FormControl, FormHelperText, TextField } from '@mui/material';

const AutoCompleteComponent = (props: PROPS) => {
    const {
        label, required, enumNames, enum: enums, enabled, id,
        isError, description, errorMessage, name, value
    } = props;

    const changeHandler = useCallback((event: any, newValue: any) => {
        console.log(event, newValue);
        props.dispatchChange(newValue !== null ? newValue.value : undefined);
    }, [props.dispatchChange]);

    const blurHandler = useCallback((event: any) => {
        props.dispatchBlur(event.target.value);
    }, [props.dispatchBlur]);

    const focusHandler = useCallback((event: any) => {
        props.dispatchFocus(event.target.value);
    }, [props.dispatchFocus]);

    let options = [{ value: enums ? enums[0] : '', label: enumNames ? enumNames[0] : enums ? enums[0] : '' }];

    if (enums) {
        for (let i = 1; i < enums.length; i++) {
            let ob = { value: enums[i], label: enumNames ? enumNames[i] : enums[i] };
            options = [...options, ob];
        }
    }

    return (
        <FormControl
            variant="outlined"
            fullWidth
        >
            <Autocomplete
                fullWidth
                autoComplete
                disabled={!enabled}
                id={id}
                onChange={changeHandler}
                onBlur={blurHandler}
                onFocus={focusHandler}
                options={options}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => <TextField {...params}
                    label={label?.visible ? label.value : ''}
                    required={required}
                    error={isError}
                    name={name}
                    value={value ? value : ''}
                />}
            />
            <FormHelperText error={isError} component="span">
                {isError ? errorMessage : description}
            </FormHelperText>
        </FormControl>
    );

};

export default withRuleEngine(AutoCompleteComponent);