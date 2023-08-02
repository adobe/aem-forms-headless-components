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


import { TextField, TextArea } from '@adobe/react-spectrum';
import {FieldJson, State} from '@aemforms/af-core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import {
    baseConvertor,
    combineConvertors,
    constraintConvertor,
    fieldConvertor,
    stringConstraintConvertor
} from '../utils/SpectrumMappers';
import {useRenderer} from '@aemforms/af-react-renderer';
import DateField from './Date';

const mapper = combineConvertors(baseConvertor,
    fieldConvertor,
    constraintConvertor,
    stringConstraintConvertor, (a) => {
        return {
            value : ((a.editFormat || a.displayFormat) ?  a.isInFocus ? a.editValue : a.displayValue : a.value) || '',
            width: '100%'
        };
    });

const TextFieldComponent = function (props: State<FieldJson>) {
    if (props.format === 'date') {
        return DateField(props);
    } else {
        const component = props[':type'] === 'multiline-input' ? TextArea : TextField;
        const renderedComponent = useRenderer(props, component, mapper, true);
        return renderedComponent;
    }
};

export default TextFieldComponent;
