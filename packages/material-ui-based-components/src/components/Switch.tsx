import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import {
    FormControl, FormControlLabel, FormGroup, FormHelperText, Switch
} from '@mui/material';

const SwitchComponent = (props: PROPS) => {
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
                    value={label}
                    name={name}
                    control={<Switch color={props.layout?.color} />}
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

export default withRuleEngine(SwitchComponent);