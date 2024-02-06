// *******************************************************************************
//  * Copyright 2023 Adobe
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
//  ******************************************************************************

import React from 'react';
import ResponsiveGrid from './ResponsiveGrid';
import { withRuleEnginePanel } from '../utils/withRuleEngine';
import { PROPS_PANEL } from '../utils/type';

const Form = function (props: PROPS_PANEL) {

  return (
    <div className='cmp cmp-adaptiveform-container'>
      <form
        className={'cmp-adaptiveform-container cmp-container'}
        data-cmp-is="adaptiveFormContainer"
      >
        <div className={`cmp-adaptiveform-container__wrapper ${props.gridClassNames || ''}`}>
          {props?.label?.value ? <h2>{props.label.value}</h2> : null}
          <ResponsiveGrid {...props} />
        </div>
      </form>
    </div>
  );
};

export default withRuleEnginePanel(Form);