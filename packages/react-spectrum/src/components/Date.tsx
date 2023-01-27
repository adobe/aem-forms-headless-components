/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
  const noFormats = (props.editFormat == null || props.editFormat === 'short') &&
      (props.displayFormat == null || props.displayFormat === 'short');
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