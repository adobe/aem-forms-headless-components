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


import {ComboBox, Item} from '@adobe/react-spectrum';
import {FieldJson, State} from '@aemforms/af-core';
import {useRenderer} from '@aemforms/af-react-renderer';
import {
    baseConvertor,
    combineConvertors,
    constraintConvertor,
    fieldConvertor, enumToChildConvertor
} from '../utils/SpectrumMappers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';


const mapper = combineConvertors(baseConvertor,
    fieldConvertor,
    constraintConvertor,
    enumToChildConvertor(Item),
    // enumConvertor('items', (text, value) => {
    //     return {'id' : value, 'value' : text};
    // }),
    (a, b) => {
        return {
            onSelectionChange: b.dispatchChange,
            selectedKey: a.value != null ? a.value + '': a.value
        };
    });


/**
 * @param originalProps
 * @constructor
 */
const ComboBoxComponent = function (originalProps: State<FieldJson>) {
    return useRenderer(originalProps, ComboBox, mapper, true);
};


export default ComboBoxComponent;