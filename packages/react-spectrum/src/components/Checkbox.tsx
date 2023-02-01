/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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

const Comp = withErrorMessage(SpectrumCheckboxWrapper);
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