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


import {Checkbox} from '@adobe/react-spectrum';
import {FieldJson, State} from '@aemforms/af-core';
import {useRenderer} from '@aemforms/af-react-renderer';
import React from 'react';
import {
    baseConvertor,
    combineConvertors,
    constraintConvertor,
    fieldConvertor, withErrorMessage
} from '../utils/SpectrumMappers';


const mapper = combineConvertors(baseConvertor, fieldConvertor, constraintConvertor, (a) => {
    const value = a.value;
    const selectedValue = a.enum?.[0];
    const unselectedValue = (a.enum?.length || 0) < 2 ? null : a.enum?.[1];
    return {
        selectedValue,
        unselectedValue,
        isSelected: value !== undefined && value === selectedValue
    };
});

const SpectrumCheckboxWrapper = (props: any) => {
    const handleChange = (isSelected: boolean) => {
        const value = isSelected ? props.selectedValue : props.unselectedValue;
        props.onChange(value);
    };
    return <Checkbox {...props} onChange={handleChange}>{props.label}</Checkbox>;
};

const Comp = withErrorMessage(SpectrumCheckboxWrapper as any);
/**
 * The checkbox component follows the convention that the first value of option is used as selected value
 * while the second option is used as deselected value. Any other option value is ignored.
 * @param originalProps
 * @constructor
 */
const CheckboxComponent = function (originalProps: State<FieldJson>) {
    return useRenderer(originalProps, Comp, mapper);
};


export default CheckboxComponent;