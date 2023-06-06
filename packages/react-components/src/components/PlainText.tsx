// *******************************************************************************
//  * Copyright 2022 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the “License”);
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an “AS IS” BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.

//  * The BEM markup is as per the AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/text/v1/text/text.html
//  ******************************************************************************

import React from 'react';
import {withRuleEngine, richTextString} from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';

const PlainText = (props: PROPS) => {
   const { value, id, visible } = props; 
   return (
      <div className='text base'>
        <div data-cmp-is='adaptiveFormText' id={id} className='cmp-adaptiveform-text' data-cmp-visible={visible}>
            {props?.richText ? richTextString(value) : value}
        </div>
      </div>
   );
};

export default withRuleEngine(PlainText);