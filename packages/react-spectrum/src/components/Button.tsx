/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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