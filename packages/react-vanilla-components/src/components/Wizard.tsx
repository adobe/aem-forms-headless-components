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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/wizard/v1/wizard/wizard.html
//  ******************************************************************************

import React, { useState, useContext, useCallback } from 'react';
import { FormContext } from '@aemforms/af-react-renderer';
import { getRenderer } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel } from '../utils/withRuleEngine';
import { PROPS_PANEL } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';

const Wizard = (props: PROPS_PANEL) => {
  // @ts-ignore
  const { mappings } = useContext(FormContext);
  const { items, label, id, visible, enabled, appliedCssClassNames } = props;
  const [activeTab, setActiveTab] = useState(0);

  const { v: visibleItems } =
    items.reduce(({ v }: any, item) => {
      const isVisible = item.visible === true;
      return {
        v: isVisible ? v.concat([item]) : v
      };
    }, { v: [] });


  const previousHandler = useCallback(() => {
    setActiveTab(activeTab - 1);
  }, [activeTab]);

  const nextHandler = useCallback(() => {
    setActiveTab(activeTab + 1);
  }, [activeTab]);

  const getChild = useCallback((child: any, index: number) => {
    const Comp = getRenderer(child, mappings);
    return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
  }, []);

  return visible ? (
    <div
      id={id}
      className={`cmp-adaptiveform-wizard ${appliedCssClassNames || ''}`}
      data-panelcontainer="wizard"
      data-placeholder-text="Please drag Wizard components here"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-wizard'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
      />
      <div
        className="cmp-adaptiveform-wizard__widget cmp-adaptiveform-wizard__widget--empty"
        id={`${id}-widget`}
      >
        <div className="cmp-adaptiveform-wizard__tabs-container">
          <ol id={`${id}_guide-item-nav-container`} className="cmp-adaptiveform-wizard__tabList" role="tablist">
            {visibleItems.map((item: PROPS_PANEL, index: number) => (
              <li
                key={item.id}
                title={item?.label?.value}
                id={`${item.id}_wizard-item-nav`}
                className={`cmp-adaptiveform-wizard__tab ${index === activeTab ? 'cmp-adaptiveform-wizard__tab--active' : ''}`}
                role="tab"
                tabIndex={index === activeTab ? 0 : -1}
                aria-selected={index === activeTab ? 'true' : 'false'}
                data-cmp-hook-adaptiveformwizard="tab"
              >
                {item.label?.value}
              </li>
            ))}
          </ol>
        </div>
        <div className="cmp-adaptiveform-wizard__containerNav">
          {
            visibleItems.length > 0 && activeTab > 0 ?
              <div
                className="cmp-adaptiveform-wizard__nav cmp-adaptiveform-wizard__nav--previous"
                role="navigation"
                aria-label="Previous Button"
                onClick={previousHandler}
                tabIndex={0}
              />
              : null
          }
          {
            visibleItems.length > 0 && activeTab < visibleItems.length - 1 ?
              <div
                className="cmp-adaptiveform-wizard__nav cmp-adaptiveform-wizard__nav--next"
                role="navigation"
                aria-label="Next Button"
                onClick={nextHandler}
                tabIndex={0}
              />
              : null
          }
        </div>
        {
          visibleItems.length > 0 ?
            <div
              data-cmp-hook-adaptiveformtabs="tabpanel"
              className={`cmp-adaptiveform-wizard__wizardpanel ${activeTab === visibleItems[activeTab].index ? 'cmp-adaptiveform-wizard__wizardpanel--active' : ''}`}
              role="tabpanel"
              tabIndex={0}
              aria-hidden={activeTab === visibleItems[activeTab].index ? 'false' : 'true'}
              aria-labelledby={`${visibleItems[activeTab].id}_wizard-item-nav`}
              data-cmp-hook-adaptiveformwizard="wizardpanel"
            >
              {getChild(visibleItems[activeTab], activeTab)}
            </div>
            : null
        }
      </div>
    </div>
  ) : null;
};

export default withRuleEnginePanel(Wizard);