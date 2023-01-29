import { checkIfConstraintsArePresent, FieldJson } from '@aemforms/af-core';
import React, { JSXElementConstructor } from 'react';
import { Convertor, useFormIntl, WithViewState } from '@aemforms/af-react-renderer';
import { isEmpty } from '@aemforms/af-core';
import { Checkbox, Radio, Select } from 'native-base';
import { getFileSizeInBytes } from '@aemforms/af-core';

const DEFAULT_ERROR_MESSAGE = 'There is an error in the field';
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000000;
export type FieldViewState = WithViewState<FieldJson>

export const combineConvertors = function <T>(...convertors: Convertor<T>[]) {
  const newConvertor: Convertor<T> = (a, b, f) => {
    return convertors.reduce<any>(function (newVal, curr) {
      return {
        ...newVal,
        ...curr(a, b, f)
      };
    }, {});
  };
  return newConvertor;
};

export const baseConvertor: Convertor<FieldViewState> = (a, b, f) => {
  return {
    isHidden: a.visible === false,
    name: a.name,
    label: a.label?.visible === false ? '' : f('label.value'),
    description: a.description ? f('description') : null,
    isDisabled: a.enabled === false
  };
};

const formatedErrorMessage = (a: FieldViewState) => {
  const i18n = useFormIntl();
  const formatedMessage = i18n.formatMessage({ id: 'defaultErrorMessage', defaultMessage: DEFAULT_ERROR_MESSAGE });
  const errorMessage = a.errorMessage === '' && a.valid === false ? formatedMessage : a.errorMessage;
  return errorMessage;
};

const fieldConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const optionalValidation = !checkIfConstraintsArePresent(a) && a.type === 'string';
  const errorMessage = formatedErrorMessage(a);
  const validationState = a.valid === false ? 'invalid' : ((a.valid === undefined || isEmpty(a.value) || optionalValidation) ? undefined : 'valid');
  return {
    validationState,
    isInvalid: validationState === 'invalid',
    errorMessage,
    inputProps: {
      placeholder: f('placeholder'),
      value: a.value == null ? '' : a.value,
      onChangeText: b.dispatchChange,
      onBlur: b.dispatchBlur,
      onFocus: b.dispatchFocus,
      isReadOnly: a.readOnly === true,
      isRequired: a.required === true,
      isDisabled: a.enabled === false,
      size: 'lg',
      ...(a.type && {
        type: a.type
      })
    }
  };
};
const enumConvertor = (Component: JSXElementConstructor<any>, a: any, b: any, f: any) => {
  const options = a.enum || [];
  const localizedOptions = f('enum');
  const localizedOptionsName = f('enumNames');
  const option = (option: any, i: number) => {
    const value = option;
    const text = (localizedOptionsName && i < localizedOptionsName.length) ? localizedOptionsName[i] : localizedOptions[i];
    return <Component style={{ marginTop: 5 }} key={value} value={value} label={text}>{text + ''}</Component>;
  };
  return options.map(option);
};

export const numberFieldConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const field = fieldConvertor(a, b, f);
  return {
    ...field,
    inputProps: {
      ...field.inputProps,
      keyboardType: 'numeric'
    },
    //below properties not implemented
    maximum: a.maximum,
    minimum: a.minimum
  };
};
export const textFieldConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const field = fieldConvertor(a, b, f);
  return {
    ...field,
    inputProps: {
      ...field.inputProps,
      keyboardType: 'default',
      type: a[':type'] === 'password-input' ? 'password' : a.type
    },
    //below properties not implemented
    maxLength: a.maxLength,
    minLength: a.minLength,
    pattern: a.pattern
  };
};
export const checkboxConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const field = fieldConvertor(a, b, f);
  const value = a.value;
  const selectedValue = a.enum?.[0];
  const unselectedValue = (a.enum?.length || 0) < 2 ? null : a.enum?.[1];
  return {
    ...field,
    label: null,
    inputProps: {
      ...field.inputProps,
      selectedValue,
      unselectedValue,
      onChange: (value: any) => {
        const val = value ? selectedValue : unselectedValue;
        b.dispatchChange(val);
      },
      isChecked: value !== undefined && value === selectedValue,
      children: a.label?.visible === false ? '' : f('label.value'),
      size: 'md'
    }
  };
};
export const buttonConvertor: Convertor<FieldViewState> = (a, b, f) => ({
  children: a.label?.visible === false ? '' : f('label.value'),
  onPress: b.dispatchClick,
  marginTop: 5
});
export const checkboxGroupConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const field = fieldConvertor(a, b, f);
  const isArray = (a.type || '[]').indexOf('[]') > -1;
  return {
    ...field,
    inputProps: {
      ...field.inputProps,
      value: a.value == null ? [] : a.value instanceof Array ? a.value : [a.value],
      onChange: (val: any) => {
        let finalVal;
        if (val === null) { finalVal = null; }
        if (isArray) {
          finalVal = val;
        } else if (val.length > 0) {
          finalVal = val.filter((x: any) => a.value !== x)[0]; //val[0]
        } else {
          finalVal = null;
        }
        b.dispatchChange(finalVal);
      },
      children: enumConvertor(Checkbox, a, b, f),
      size: 'md'
    }
  };
};
export const radioGroupConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const field = fieldConvertor(a, b, f);
  return {
    ...field,
    inputProps: {
      ...field.inputProps,
      onChange: b.dispatchChange,
      children: enumConvertor(Radio, a, b, f),
      size: 'md'
    }
  };
};
export const dropDownConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const field = fieldConvertor(a, b, f);
  return {
    ...field,
    inputProps: {
      ...field.inputProps,
      onValueChange: b.dispatchChange,
      children: enumConvertor(Select.Item, a, b, f)
    }
  };
};
export const plainTextConvertor: Convertor<FieldViewState> = (a) => {
  return {
    children: a.value == null ? '' : a.value
  };
};
export const dateFieldConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const field = fieldConvertor(a, b, f);
  return {
    ...field,
    inputProps: {
      ...field.inputProps,
      mode: a.format || 'date',
      confirmBtnText: 'Confirm',
      cancelBtnText: 'Cancel',
      onChange: b.dispatchChange
    }
  };
};
export const fileUploadConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const field = fieldConvertor(a, b, f);
  let val = a.value && ((a.value instanceof Array) ? a.value : [a.value]);
  return {
    ...field,
    inputProps: {
      ...field.inputProps,
      ...(a.type &&
        (a.type === 'file[]' || a.type === 'string[]') && {
        multiple: true
      }),
      value: val,
      onChange: b.dispatchChange,
      maxFileSize: a.maxFileSize,
      accept: a.accept,
      maxFileSizeInBytes: getFileSizeInBytes(a.maxFileSize) || DEFAULT_MAX_FILE_SIZE_IN_BYTES
    }
  };
};