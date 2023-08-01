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


import React from 'react';
import {
    baseConvertor,
    combineConvertors, richTextString
} from '../utils/SpectrumMappers';
import {useRenderer} from '@aemforms/af-react-renderer';
import {FieldJson, State} from '@aemforms/af-core';

const PlainText = function (props: any) {
    const { value, isHidden, richText } = props;
    return isHidden ? null : richText ? richTextString(value) : (<p>{value}</p>);
};

const mapper = combineConvertors(baseConvertor, (a) => {
    return {
        value : a.value,
        //@ts-ignore
        richText: a.richText
    };
});

const FormPlainTextComponent = (field: State<FieldJson>) => useRenderer(field, PlainText, mapper);

export default FormPlainTextComponent;