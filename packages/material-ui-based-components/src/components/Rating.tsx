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
        <Box>
            <InputLabel error={isError} htmlFor={id} required={required}>
                {label?.visible ? label.value : ''}
            </InputLabel>
            <Rating
                id={id}
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