import React, { useCallback, useState } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Input, FilledInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const input: any = {
    outlined: OutlinedInput,
    standard: Input,
    filled: FilledInput
};

const MaskedInputComponent = (props: PROPS) => {
    const { isError, placeholder, name, required, label, format, errorMessage,
        description, enabled, readOnly, maxLength, minLength, pattern, id, value
    } = props;

    const [showFormat, setShowFormat] = useState(true);
    const isFormatted = format !== undefined;
    const formatGiven = format ? format : '';

    const masking = useCallback((val: string, show: boolean) => {
        let displayVal = val.replace(/[^0-9|\\]/g, '');

        let lengths: [number] = [0];
        let element: string = '';

        for (let i = 0; i < formatGiven?.length; i++) {
            if (formatGiven[i] !== 'X') {
                lengths.push(i + 1);
                element = formatGiven[i];
            }
        }

        for (let i = 1; i < lengths.length; i++) {
            if (displayVal.length >= lengths[i]) {
                displayVal = displayVal.slice(0, lengths[i] - 1) + element + displayVal.slice(lengths[i] - 1);
            }
        }

        if (!show) {
            displayVal = displayVal.slice(0, lengths[lengths.length - 1] - 1).replace(/[0-9]/g, 'X') + displayVal.slice(lengths[lengths.length - 1] - 1);
        }

        return displayVal;
    }, [format]);

    const [unmaskedVal, setUnmaskedVal] = useState(value ? masking(value, true) : '');
    const [maskedVal, setMaskedVal] = useState(value ? masking(value, false) : '');

    const changeHandler = useCallback((event: any) => {
        if (isFormatted) {
            if (event.nativeEvent.data) {
                setUnmaskedVal(masking(unmaskedVal + event?.nativeEvent.data, true));
                props.dispatchChange(masking(unmaskedVal + event?.nativeEvent.data, true));
                setMaskedVal(masking(unmaskedVal + event?.nativeEvent.data, false));
            }
            else {
                setUnmaskedVal(masking(unmaskedVal.slice(0, -1), true));
                props.dispatchChange(masking(unmaskedVal.slice(0, -1), true));
                setMaskedVal(masking(unmaskedVal.slice(0, -1), false));
            }
        }
        else {
            props.dispatchChange(event?.target.value);
        }
    }, [props.dispatchChange, unmaskedVal]);

    const blurHandler = useCallback((event: any) => {
        props.dispatchBlur(event?.target.value);
    }, [props.dispatchBlur]);

    const focusHandler = useCallback((event: any) => {
        props.dispatchFocus(event?.target.value);
    }, [props.dispatchFocus]);

    const handleClickShowFormat = useCallback(() => {
        setShowFormat((show) => !show);

    }, []);

    const getPasswordIcon = useCallback(() => {
        return (
            <InputAdornment position="end">
                <IconButton
                    name="passwordButton"
                    onClick={handleClickShowFormat}
                    edge="end"
                    title="passwordButton"
                    disabled={!enabled}
                >
                    {showFormat ? <Visibility /> : <VisibilityOff />}
                </IconButton>
            </InputAdornment>
        );
    }, [showFormat]);

    const getValue = useCallback(() => {
        if (isFormatted) {
            if (showFormat) {
                return maskedVal;
            }
            return unmaskedVal;
        }
        return value ? value : '';
    }, [isFormatted, showFormat, maskedVal, unmaskedVal, value]);

    const InputVariant = input[props.layout?.variant];

    return (
        <FormControl
            variant={props.layout?.variant}
            disabled={!enabled}
            required={required}
            fullWidth
            sx={{ mt: 2 }}>
            {label?.visible ? <InputLabel error={isError} htmlFor={id}>{label.value}</InputLabel> : null}
            <InputVariant
                id={id}
                label={label?.visible ? label.value : ''}
                value={getValue()}
                name={name}
                multiline={props.fieldType === 'multiline-input'}
                type='text'
                onChange={changeHandler} onBlur={blurHandler} onFocus={focusHandler}
                error={isError}
                placeholder={placeholder}
                endAdornment={isFormatted ? getPasswordIcon() : null}
                inputProps={{
                    readOnly: readOnly,
                    maxLength: maxLength,
                    minLength: minLength,
                    pattern: pattern
                }}
            />
            <FormHelperText error={isError} component="span">
                {isError ? errorMessage : description}
            </FormHelperText>
        </FormControl>
    );
};

export default withRuleEngine(MaskedInputComponent);