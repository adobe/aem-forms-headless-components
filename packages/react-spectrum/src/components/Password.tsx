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


import { TextField } from '@adobe/react-spectrum';
import { FieldJson, State } from '@aemforms/af-core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { useRenderer } from '@aemforms/af-react-renderer';
import {
  baseConvertor,
  combineConvertors,
  constraintConvertor,
  fieldConvertor,
  stringConstraintConvertor,
  inputTypeConvertor
} from '../utils/SpectrumMappers';

const mapper = combineConvertors(baseConvertor,
  fieldConvertor,
  constraintConvertor,
  inputTypeConvertor,
  stringConstraintConvertor, () => {
    return { width: '100%', type: 'password' };
  });

// Password component using TextField with input type password,
const PasswordField = function (props: State<FieldJson>) {
  const renderedComponent = useRenderer(props, TextField, mapper, true);
  return renderedComponent;
};

export default PasswordField;