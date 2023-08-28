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


import {checkIfConstraintsArePresent, FieldJson} from '@aemforms/af-core';
import React, {JSXElementConstructor} from 'react';
import sanitizeHTML from 'sanitize-html';
import {Convertor, useFormIntl, WithViewState} from '@aemforms/af-react-renderer';
import '../styles.css';
import clsx from 'clsx';
import {isEmpty} from '@aemforms/af-core';
import { parseDate } from '@internationalized/date';

const DEFAULT_ERROR_MESSAGE = 'There is an error in the field';

export type FieldViewState = WithViewState<FieldJson>

export const combineConvertors = function <T>(...convertors: Convertor<T>[]) {
    const newConvertor : Convertor<T> = (a,b, f) => {
        return convertors.reduce<any>(function (newVal, curr) {
            return {
                ...newVal,
                ...curr(a, b, f)
            };
        }, {});
    };
    return newConvertor;
};


export const richTextString = (stringMsg = '') => {
    const htmlProp = {__html : sanitizeHTML(stringMsg)};
    return (<div dangerouslySetInnerHTML={htmlProp} /> );
};

export const baseConvertor: Convertor<FieldViewState> = (a, b, f) => {
    let localizedDescription = f('description');
    const layout = a?.properties?.['afs:layout'] || {};
    let localizedLabel = f('label.value');
    return {
        ...layout,
        isHidden : a.visible === false,
        name: a.name,
        isDisabled : a.enabled === false,
        label: a.label?.visible === false ? '' : (a.label?.richText === true ? richTextString(localizedLabel) : localizedLabel),
        description: (localizedDescription && localizedDescription.length > 0) ? richTextString(localizedDescription) : null,
        'aria-label' : a.label?.visible === false ? a.label?.value : undefined
    };
};

export const constraintConvertor: Convertor<FieldViewState> = (a) => {
    // if there are no constraints and type is string, valid would anyways always be true, hence validationState would be optional
    const optionalValidation = !checkIfConstraintsArePresent(a) && a.type === 'string';
    return {
        ...(a.required && {
            isRequired: true,
            necessityIndicator: 'icon'
        }),
        validationState: a.valid === false ? 'invalid' : ((a.valid === undefined  || isEmpty(a.value) || optionalValidation) ? undefined : 'valid')
    };
};
export const formatedErrorMessage = (a: FieldViewState) => {
  const i18n = useFormIntl();
  const formatedMessage = i18n.formatMessage({ id: 'defaultErrorMessage', defaultMessage: DEFAULT_ERROR_MESSAGE });
  const errorMessage = a.errorMessage === '' && a.valid === false ? formatedMessage : a.errorMessage;
  return errorMessage;
};

const commonFieldConvertor: Convertor<FieldViewState> = (a, b, f) => {
    // if there are no constraints and type is string, valid would anyways always be true, hence validationState would be optional
  const optionalValidation = !checkIfConstraintsArePresent(a) && a.type === 'string';
  const errorMessage = formatedErrorMessage(a);
  return {
        placeholder: f('placeholder'),
        validationState: a.valid === false ? 'invalid' : ((a.valid === undefined  || isEmpty(a.value) || optionalValidation) ? undefined : 'valid'),
        onChange: b.dispatchChange, // Handler that is called when the value changes.
        onBlur : b.dispatchBlur, //Handler that is called when the element loses focus.
        onFocus : b.dispatchFocus,
        isReadOnly : a.readOnly === true,
        editValue : a.editValue,
        displayValue: a.displayValue,
        errorMessage
  };
};
export const fieldConvertor: Convertor<FieldViewState> = (a, b, f) => ({
  ...commonFieldConvertor(a, b, f),
  value: a.value == null ? '' : a.value
});

export const stringConstraintConvertor: Convertor<FieldViewState> = (a) => {
    return {
        minLength: a.minLength,
        maxLength: a.maxLength,
        pattern: a.pattern
    };
};

export const enumToChildConvertor = (Component: JSXElementConstructor<any>) =>  {
    return enumConvertor('children', (text, value) => {
        // @ts-ignore 
        return <Component key={value} value={value}>{text}</Component>;
    });
};

type EnumConvertor = (x: string, y: (a: JSX.Element | string, b: string) => any) => Convertor<FieldJson>
export const enumConvertor : EnumConvertor = (propertyName: string, callback: (text: JSX.Element | string, value: string) => any) => (a, b, f) => {
    const options = a.enum || [];
    const localizedOptions = f('enum');
    const localizedOptionsName = f('enumNames');
    const nonLocalizedOptionsName = a?.enumNames;
    const radio = (option : any, i : number) => {
        const value = option;
        const text = (localizedOptionsName && i < localizedOptionsName.length) ? localizedOptionsName[i] : localizedOptions[i];
        const nonLocalizedEnumName = (nonLocalizedOptionsName && i < nonLocalizedOptionsName.length) ? nonLocalizedOptionsName[i] : localizedOptions[i];
        const finalText = (typeof nonLocalizedEnumName !== 'string' && nonLocalizedEnumName?.richText) ? richTextString(text) : text;
        return callback( finalText, value);
    };

    return {
        [propertyName] : options.map(radio)
    };
};

export const inputTypeConvertor: Convertor<FieldViewState> = (a) => {
  return {
    ...(a.type && {
      type: a.type
    })
  };
};

export const withErrorMessage = (Component: JSXElementConstructor<any>) => (props: any) => {
    const invalid = props.validationState === 'invalid';
    const helpText = invalid ? props.errorMessage || '' : props.description;
    const hasHelpText = (typeof helpText === 'string' && helpText.length > 0) || helpText != null;
    return (<div className={clsx('formField', invalid && 'formField--invalid')}>
        {/* @ts-ignore  */}
        <Component {...props} />
        { hasHelpText ? <div className={'formField__helpText'}>{helpText}</div> : null}
    </div>);
};

export const dateConvertor: Convertor<FieldViewState> = (a, b, f) => {
  const fieldProps: any = commonFieldConvertor(a, b, f);
  if (a.default && a.default !== '') {
    fieldProps.defaultValue = parseDate(a.default);
  }
  if (a.value && a.value !== '') {
    fieldProps.value = parseDate(a.value);
  }
  return fieldProps;
};
