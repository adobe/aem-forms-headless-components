import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { Box, FormHelperText, InputLabel, Slider } from '@mui/material';

const SliderComponent = (props: PROPS) => {
    const { isError, name, label, required, description, enabled,
        maximum, minimum, errorMessage, id, value, step }
        = props;

    const getValue = useCallback((value: number, label: any) => {
        return `${value}-${label.value}`;
    }, []);

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
            <Slider
                aria-labelledby={id}
                name={name}
                disabled={!enabled}
                value={value ? value : null}
                getAriaValueText={getValue}
                valueLabelDisplay="on"
                step={step ? step : undefined}
                marks={step ? true : false}
                min={minimum ? minimum : 0}
                max={maximum ? maximum : 100}
                color={props.layout?.color}
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

export default withRuleEngine(SliderComponent);