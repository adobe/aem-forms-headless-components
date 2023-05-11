import React, { useState, useCallback } from 'react';
import { Input, FormControl, Button, Image } from 'native-base';
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { PROPS, INPUT } from '../utils/types';
import withRuleEngine from '../shared/withRuleEngine';
//@ts-ignore
import { format, parse } from '@aemforms/af-formatters';
//@ts-ignore
import calendar from '../image/calendar-icon.png';

const DatePickerComponent = function (props: PROPS) {
  const {
    isError, required, label, errorMessage, description, value, displayFormat,
    dispatchChange, dispatchBlur, dispatchFocus
  } = props;
  const [open, setOpen] = useState(false);
  const [typedValue, setTypedValue] = useState(value ? value : '');

  const formatDate = useCallback((date: any) => {
    var d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${d.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  }, []);

  const confirmHandler = useCallback((date: any) => {
    setOpen(false);
    // @ts-ignore
    dispatchChange(formatDate(date));
    setTypedValue(format(date, 'en-US', displayFormat));
  }, [dispatchChange]);

  const cancelHandler = useCallback(() => {
    setOpen(false);
  }, []);

  const inputProps: INPUT = {
    placeholder: props.placeholder || '',
    value: typedValue,
    onChangeText: (value: string) => { setTypedValue(value); },
    onBlur: () => {
      const parsedDate: any = formatDate(parse(typedValue, 'en-US', displayFormat));
      dispatchChange(parsedDate);
      dispatchBlur(parsedDate);
    },
    isReadOnly: props.readOnly === true,
    isRequired: props.required === true,
    isDisabled: props.enabled === false,
    KeyboardTypeOptions: 'default',
    type: 'text'
  };

  return (
    <>
      <FormControl isInvalid={isError} isRequired={required}>
        {label?.visible && <FormControl.Label>{label?.value}</FormControl.Label>}
        <Input
          {...inputProps as any}
          InputRightElement={(
            <Button onPress={() => setOpen(true)} style={styles.button}>
              <Image
                source={calendar}
                alt='calendar'
                style={styles.calendar}
              />
            </Button>
          )}
        />
        {errorMessage ? <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage> : null}
        {description && !errorMessage ? <FormControl.HelperText>{description}</FormControl.HelperText> : null}
      </FormControl>
      <DatePicker
        modal
        open={open}
        mode="date"
        date={value ? new Date(value) : new Date()}
        onConfirm={confirmHandler}
        onCancel={cancelHandler}
      />
    </>
  );
};

const styles = StyleSheet.create({
  calendar: {
    width: 31,
    height: 31
  },
  button: {
    backgroundColor: 'transparent',
    height: 31
  }
});

export default withRuleEngine(DatePickerComponent);