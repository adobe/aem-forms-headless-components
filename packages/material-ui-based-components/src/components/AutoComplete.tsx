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

    const changeHandler = useCallback((event: any, newValue: any) => {
        let index = options.indexOf(newValue);
        props.dispatchChange(index === -1 ? undefined : enums[index]);
    }, [props.dispatchChange]);

    const blurHandler = useCallback((event: any) => {
        props.dispatchBlur(event.target.value);
    }, [props.dispatchBlur]);

    const focusHandler = useCallback((event: any) => {
        props.dispatchFocus(event.target.value);
    }, [props.dispatchFocus]);

    return (
        <FormControl
            variant={props.layout?.variant}
            fullWidth
            sx={{ mt: 2 }}
        >
            <Autocomplete
                fullWidth
                autoComplete
                disabled={!enabled}
                value={value ? value : null}
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
                />}
            />
            <FormHelperText error={isError} component="span">
                {isError ? errorMessage : description}
            </FormHelperText>
        </FormControl>
    );

};

export default withRuleEngine(AutoCompleteComponent);