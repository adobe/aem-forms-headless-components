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


import { FieldsetJson } from '@aemforms/af-core';
import React, { useCallback } from 'react';
import { useRuleEngine } from '@aemforms/af-react-renderer';
import { State } from '@aemforms/af-core';
import FlexWrapper from './Flex';

const HorizontalFlex = function (fieldset: State<FieldsetJson>) {
  const [props] = useRuleEngine(fieldset);
  const { items } = props;

  const getColumnsSize = useCallback(() => {
    const len = items.length;
    const colSize = (100 / len).toFixed(2);
    return Array(len).fill(`${colSize}%`);
  }, [items]);

  return <FlexWrapper {...props} columns={getColumnsSize()} />;
};

export default HorizontalFlex;