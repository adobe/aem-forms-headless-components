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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/panelcontainer/v1/panelcontainer/panelcontainer.html
//  ******************************************************************************

import React, { useContext, useState } from 'react';
import {withRuleEnginePanel} from '../utils/withRuleEngine';
import { renderChildren, FormContext } from '@aemforms/af-react-renderer';
import { PROPS_PANEL } from '../utils/type';

const Panel = function (props: PROPS_PANEL) {
  const { id, visible, enabled, label, handlers } = props;
  const context = useContext(FormContext);
  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);

  const handleClick = () => {
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };
    return (
      <div id={id} data-cmp-visible={visible} data-cmp-enabled={enabled} data-cmp-is="adaptiveFormPanel">
        {label?.visible && <label htmlFor={id} className="cmp-container__label">{label?.value}</label>}
        {props?.description && <button className="cmp-container__questionmark" aria-label='Toggle Button' onClick={handleClick}></button>} 
         {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-container__shortdescription'>{props?.tooltip}</div>}
         <div aria-live="polite">
            {longDescription && props?.description  && <div title='Help Text' data-cmp-visible={longDescription} className="cmp-container__longdescription">{props?.description}</div>}
         </div>
        {renderChildren(props, context.mappings, context.modelId, handlers)}
      </div>
    );
};

export default withRuleEnginePanel(Panel);