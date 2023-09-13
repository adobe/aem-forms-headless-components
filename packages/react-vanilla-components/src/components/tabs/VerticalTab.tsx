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

//  *  The BEM markup is as per the AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/verticaltabs/v1/verticaltabs/verticaltabs.html
//  ******************************************************************************

import React, { useContext, useState, useCallback } from 'react';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel } from '../../utils/withRuleEngine';
import { PROPS_PANEL } from '../../utils/type';
import FieldWrapper from '../common/FieldWrapper';

const VerticalTab = (props: PROPS_PANEL) => {
  // @ts-ignore
  const { mappings } = useContext(FormContext);
  const [activeTab, setActiveTab] = useState(0);
  const { items, label, id, visible, enabled, appliedCssClassNames } = props;
  const { v: visibleItems } =
    items.reduce(({ v }: any, item) => {
      const isVisible = item.visible === true;
      return {
        v: isVisible ? v.concat([item]) : v
      };
    }, { v: [] });

  const handleClick = (index: number) => {
    setActiveTab(index);
  }

  const getChild = useCallback((child: any, index: number) => {
    const Comp = getRenderer(child, mappings);
    return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
  }, []);

  return (
    <div
      id={id}
      className={`cmp-verticaltabs ${appliedCssClassNames || ''}`}
      data-panelcontainer="verticaltabs"
      data-placeholder-text="false"
      data-cmp-visible={visible ? 'true' : 'false'}
      data-cmp-enabled={enabled ? 'true' : 'false'}
    >
      <FieldWrapper
        bemBlock='cmp-verticaltabs'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
      />
      <div className="cmp-verticaltabs__tabs-container">
        <ol role="tablist" className="cmp-verticaltabs__tablist" aria-multiselectable="false" id={`${id}-widget`} >
          {visibleItems.map((item: PROPS_PANEL, index: number) => (
            <li
              id={`${item?.id}__tab`}
              aria-controls={`${item?.id}__tabpanel`}
              role="tab" key={item?.id}
              onClick={() => handleClick(index)}
              className={index === activeTab ? 'cmp-verticaltabs__tab cmp-verticaltabs__tab--active' : 'cmp-verticaltabs__tab'}
              data-cmp-hook-adaptiveformtabs="tab"
              aria-selected={index === activeTab ? 'true' : 'false'}
              tabIndex={index === activeTab ? 0 : -1}
            >
              {item.label?.value}
            </li>
          ))}
        </ol>
        {visibleItems.length > 0 ?
          <div
            id={`${visibleItems[activeTab].id}__tabpanel`}
            data-cmp-hook-adaptiveformtabs="tabpanel"
            className={activeTab === visibleItems[activeTab].index ? 'cmp-verticaltabs__tabpanel cmp-verticaltabs__tabpanel--active' : 'cmp-verticaltabs__tabpanel'}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`${visibleItems[activeTab].id}__tab`}
          >
            {getChild(visibleItems[activeTab], activeTab)}
          </div> : null}
      </div>
    </div>);
};

export default withRuleEnginePanel(VerticalTab);