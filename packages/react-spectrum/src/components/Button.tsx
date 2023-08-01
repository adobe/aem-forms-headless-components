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

import { Button } from '@adobe/react-spectrum';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import {FieldJson, State} from '@aemforms/af-core';
import {
    baseConvertor,
    combineConvertors,
    richTextString
} from '../utils/SpectrumMappers';
import {useRenderer, WithViewState} from '@aemforms/af-react-renderer';

const mapper = combineConvertors((a: WithViewState<FieldJson>, b, f) => {
        const localizedLabel = f('label.value');
        return {
            variant :'primary',
            children : a.label?.visible === false || !a.label?.value ? '' : (a.label?.richText === true ? richTextString(localizedLabel) : localizedLabel),
            onPress : b.dispatchClick
        };
    }, baseConvertor);


const ButtonFormComponent = (field: State<FieldJson>) => useRenderer(field, Button, mapper);

export default ButtonFormComponent;