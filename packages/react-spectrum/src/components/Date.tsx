/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2023 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/


import {DatePicker, TextField} from '@adobe/react-spectrum';
import {FieldJson, State} from '@aemforms/af-core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {useState} from 'react';
import {useFormIntl, useRenderer, useRuleEngine} from '@aemforms/af-react-renderer';
import {
  baseConvertor,
  combineConvertors,
  constraintConvertor,
  dateConvertor,
  inputTypeConvertor
} from '../utils/SpectrumMappers';
import {translateMessage, useFocus} from '@aemforms/af-react-renderer/lib/hooks';

const mapper = combineConvertors(baseConvertor,
  dateConvertor,
  constraintConvertor,
  inputTypeConvertor, (a) => {
    return { width: '100%', key: a.value ? true : false };
  });

const DateField = function (props: State<FieldJson>) {
  const noFormats = (props.editFormat == null || props.editFormat === 'date|short') &&
      (props.displayFormat == null || props.displayFormat === 'date|short');
  if (noFormats) {
    const renderedComponent = useRenderer(props, DatePicker, mapper, true);
    return renderedComponent;
  } else {
    return DateFieldWithFormats(props);
  }
};

const DateFieldWithFormats = (props: State<FieldJson>) => {
  const [state, handlers] = useRuleEngine(props, true);
  const [typedValue, setTypedValue] = useState(state.value);
  const i18n = useFormIntl();
  const [ref] = useFocus(props);
  const res = mapper(state, handlers, translateMessage(state, i18n.formatMessage));
  res.value = state.isInFocus ? (typedValue == null ? res.editValue : typedValue) : res.displayValue;
  res.onChange = (val: any) => {
      setTypedValue(val);
  };
  res.onFocus = () => {
    handlers.dispatchFocus();
    setTypedValue(res.editValue);
  };
  res.onBlur = () => {
    //throw 'Blur';
    handlers.dispatchChange(typedValue);
    handlers.dispatchBlur();
    setTypedValue(null);
  };
  return (<div className={'field'}><TextField {...res} ref={ref} /></div>);
};

export default DateField;
