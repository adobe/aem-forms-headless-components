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

const TextFieldComponent = (props: PROPS) => {
  const { isError, placeholder, name, required, label, format, errorMessage,
    description, enabled, readOnly, maxLength, minLength, pattern, id, value
  } = props;

  const [unmaskedVal, setUnmaskedVal] = useState(value ? value : '');
  const [maskedVal, setMaskedVal] = useState('');
  const [showSsn, setShowSsn] = useState(true);
  const isPassword = props.fieldType === 'password-input';
  const isSsn = format === 'ssn';
  const [showPassword, setShowPassword] = useState(true);

  const masking = useCallback((val: string, show: boolean) => {
    let displayVal = val.replace(/[^0-9|\\]/g, '');

    if (displayVal.length >= 4) {
      displayVal = displayVal.slice(0, 3) + '-' + displayVal.slice(3);
    }
    if (displayVal.length >= 7) {
      displayVal = displayVal.slice(0, 6) + '-' + displayVal.slice(6);
    }
    if (!show) {
      displayVal = displayVal.slice(0, 6).replace(/[0-9]/g, 'X') + displayVal.slice(6);
    }

    return displayVal;
  }, []);

  const changeHandler = useCallback((event: any) => {
    if (format === 'ssn') {
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

  const handleClickShowPassword = useCallback(() => {
    if (isSsn) {
      setShowSsn((show) => !show);
    }
    else {
      setShowPassword((show) => !show);
    }
  }, []);

  const getPasswordIcon = useCallback(() => {
    return (
      <InputAdornment position="end">
        <IconButton
          name="passwordButton"
          onClick={handleClickShowPassword}
          edge="end"
          title="passwordButton"
          disabled={!enabled}
        >
          {showPassword && showSsn ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    );
  }, [showPassword, showSsn]);

  const getValue = useCallback(() => {
    if (isSsn) {
      if (showSsn) {
        return maskedVal;
      }
      return unmaskedVal;
    }
    return value ? value : '';
  }, [isSsn, showSsn, maskedVal, unmaskedVal, value]);

  const getType = useCallback(() => {
    if (isPassword) {
      if (showPassword) {
        return 'password';
      }
      return 'text';
    }
    else if (format === 'email') {
      return 'email';
    }
    return 'text';
  }, [isPassword, showPassword, format]);

  const InputVariant = input[props.layout?.variant];

  return (
    <FormControl
      variant={props.layout?.variant}
      disabled={!enabled}
      required={required}
      fullWidth>
      {label?.visible ? <InputLabel error={isError} htmlFor={id}>{label.value}</InputLabel> : null}
      <InputVariant
        id={id}
        label={label?.visible ? label.value : ''}
        value={getValue()}
        name={name}
        multiline={props.fieldType === 'multiline-input'}
        type={getType()}
        onChange={changeHandler} onBlur={blurHandler} onFocus={focusHandler}
        error={isError}
        placeholder={placeholder}
        endAdornment={isPassword || isSsn ? getPasswordIcon() : null}
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

export default withRuleEngine(TextFieldComponent);
