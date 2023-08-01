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


import { CheckboxGroup, Checkbox } from '@adobe/react-spectrum';
import {FieldJson, State} from '@aemforms/af-core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { useRenderer } from '@aemforms/af-react-renderer';
import {
  baseConvertor,
  combineConvertors,
  constraintConvertor,
  fieldConvertor,
  enumToChildConvertor, withErrorMessage
} from '../utils/SpectrumMappers';

const mapper = combineConvertors(baseConvertor, constraintConvertor, fieldConvertor,
    enumToChildConvertor(Checkbox), (a, b) => {
      const isArray = (a.type || '[]').indexOf('[]') >  -1;
      return {
        onChange: (val: any) => {
            let finalVal;
            if (val === null) {finalVal = null;}
            if (isArray) {
                finalVal = val;
            } else if (val.length > 0) {
                finalVal = val.filter((x:any) => a.value !== x)[0]; //val[0]
            } else {
                finalVal = null;
            }
            b.dispatchChange(finalVal);
        },
        value: a.value == null ? [] : a.value instanceof Array ? a.value : [a.value]
      };
});

const Comp = withErrorMessage(CheckboxGroup);

const CheckboxGroupComponent = function (props: State<FieldJson>) {
  return useRenderer(props, Comp, mapper);
};


export default CheckboxGroupComponent;