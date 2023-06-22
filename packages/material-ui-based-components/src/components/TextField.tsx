import React, { useCallback } from 'react';
import { withRuleEngine } from '../shared/withRuleEngine';
import { PROPS } from '../utils/types';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const TextFieldComponent = (props: PROPS) => {
  const { isError, placeholder, name, required, label, format, errorMessage,
    description, enabled, readOnly, maxLength, minLength, pattern, id, value
  } = props;

  const changeHandler = useCallback((event: any) => {
    props.dispatchChange(event.target.value);
  }, [props.dispatchChange]);

  const blurHandler = useCallback((event: any) => {
    props.dispatchBlur(event.target.value);
  }, [props.dispatchBlur]);

  const focusHandler = useCallback((event: any) => {
    props.dispatchFocus(event.target.value);
  }, [props.dispatchFocus]);

  const isPassword = props.fieldType === 'password-input';
  const [showPassword, setShowPassword] = React.useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const getPasswordIcon = () => {
    return (
      <InputAdornment position="end">
        <IconButton
          name="passwordButton"
          onClick={handleClickShowPassword}
          edge="end"
          title="passwordButton"
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    );
  };

  return (
    <FormControl
      variant="outlined"
      required={required}
      disabled={!enabled}
      fullWidth>
      <InputLabel error={isError ? true : false} htmlFor={id}>
        {label?.visible ? label.value : ''}
      </InputLabel>
      <OutlinedInput
        id={id}
        label={label?.visible ? label.value : ''}
        value={value ? value : ''}
        name={name}
        multiline={props.fieldType === 'multiline-input' ? true : false}
        type={isPassword ? showPassword ? 'password' : 'text' : format === 'email' ? 'email' : 'text'}
        onChange={changeHandler} onBlur={blurHandler} onFocus={focusHandler}
        error={isError}
        placeholder={placeholder}
        endAdornment={isPassword ? getPasswordIcon() : null}
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
