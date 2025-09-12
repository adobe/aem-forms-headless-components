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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/accordion/v1/accordion/accordion.html
//  ******************************************************************************

import React, { useState, createContext } from 'react';
import { withRuleEnginePanel } from '../../utils/withRuleEngine';
import { PROPS_PANEL } from '../../utils/type';
import Item from './Item';
import RepeatableItem from './RepeatableItem';
import LabelWithDescription from '../common/LabelWithDescription';

export const AccordionContext = createContext('' as any);

const Accordion = (props: PROPS_PANEL) => {
  const { items, id, label, visible, enabled, appliedCssClassNames } = props;

  const { v: visibleItems } =
    items.reduce(({ v }: any, item) => {
      const isVisible = item.visible === true;
      return {
        v: isVisible ? v.concat([item]) : v
      };
    }, { v: [] });

  const firstItem = visibleItems[0] || {};

  // for active first item
  let panelId = firstItem?.type === 'array' ? firstItem?.items[0]?.id : firstItem?.id;
  const [activePanel, setActivePanel] = useState(panelId);

  const handleToggle = (id: string) => {
    setActivePanel(id === activePanel ? null : id);
  };

  return (
    <div
      className={`cmp-accordion ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormAccordion"
      id={id}
      data-cmp-single-expansion="true"
      data-placeholder-text="false"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
    >
      <LabelWithDescription
        bemBlock='cmp-accordion'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
      />
      <AccordionContext.Provider value={{ onToggle: handleToggle, activePanel: activePanel }}>
        {
          visibleItems?.map((item: PROPS_PANEL) => {
            return item?.type === 'array' ? <RepeatableItem {...item} key={`${item.id}-item`} /> : <Item {...item} key={`${item.id}-item`} />
          })
        }
      </AccordionContext.Provider>
    </div>
  );
};

export default withRuleEnginePanel(Accordion);