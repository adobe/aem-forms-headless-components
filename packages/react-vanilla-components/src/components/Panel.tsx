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

//  * The BEM markup is as per the AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/panelcontainer/v1/panelcontainer/panelcontainer.html
//  ******************************************************************************

import React, { useContext } from 'react';
import { withRuleEnginePanel } from '../utils/withRuleEngine';
import { renderChildren, FormContext } from '@aemforms/af-react-renderer';
import { PROPS_PANEL } from '../utils/type';
import LabelWithDescription from './common/LabelWithDescription';

const Panel = function (props: PROPS_PANEL) {
  const { id, visible, enabled, label, handlers, appliedCssClassNames } = props;
  // @ts-ignore
  const context = useContext(FormContext);

  return (
    <div
      className={`cmp-container ${appliedCssClassNames || ''}`}
      id={id}
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-is="adaptiveFormPanel"
    >
      <LabelWithDescription
        bemBlock='cmp-container'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
      />
      {renderChildren(props, context.mappings, context.modelId, handlers)}
    </div>
  );
};

export default withRuleEnginePanel(Panel);