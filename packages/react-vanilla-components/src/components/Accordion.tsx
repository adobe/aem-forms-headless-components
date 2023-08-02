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

//  *  The BEM markup is as per the AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/accordion/v1/accordion/accordion.html
//  ******************************************************************************

import React, { useState, useCallback, useContext } from 'react';
import { getRenderer, FormContext } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel } from '../utils/withRuleEngine';
import { PROPS_PANEL } from '../utils/type';

const Accordion = (props: PROPS_PANEL) => {
  // @ts-ignore
  const { mappings } = useContext(FormContext);
  const { items, id, label, visible, enabled } = props;
  const [activePanel, setActivePanel] = useState(0);
  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);
  const { v: visibleItems } =
    items.reduce(({ v }: any, item) => {
      const isVisible = item.visible === true;
      return {
        v: isVisible ? v.concat([item]) : v
      };
    }, { v: [] });

  const handleToggle = (i: any) => {
    setActivePanel(i === activePanel ? null : i);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };

  const getChild = useCallback((child: any, index: number) => {
    const Comp = getRenderer(child, mappings);
    return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
  }, []);

  return (
    <div className="cmp-accordion" data-cmp-is="adaptiveFormAccordion" data-cmp-single-expansion="true" data-placeholder-text="false" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      {label?.visible && <label htmlFor={id} className="cmp-accordion__label">{label?.value}</label>}
      {props?.description && <button aria-label='Toggle Button' className="cmp-accordion__questionmark" onClick={handleClick}></button>}
      {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-accordion__shortdescription'>{props?.tooltip}</div>}
      <div aria-live="polite">
        {longDescription && props?.description && <div title='Help Text' data-cmp-visible={longDescription} className="cmp-accordion__longdescription">{props?.description}</div>}
      </div>
      {visibleItems?.map((item: PROPS_PANEL, index: number) => (
        <div key={item.id} className="cmp-accordion__item" data-cmp-hook-accordion="item" id={`${item.id}-widget`}>
          <h3 className="cmp-accordion__header">
            <button aria-controls={`${item.id}`} role='button' id={`${item.id}-button`} data-cmp-hook-accordion="button" type="button" onClick={() => handleToggle(index)} className={activePanel === index ? 'cmp-accordion__button cmp-accordion__button--expanded' : 'cmp-accordion__button'} aria-expanded={activePanel === index ? 'true' : 'false'}>
              <span className="cmp-accordion__title">{item?.label?.value}</span>
              <span className="cmp-accordion__icon"></span>
            </button>
          </h3>
          <div className={activePanel === index ? 'cmp-accordion__panel cmp-accordion__panel--expanded' : 'cmp-accordion__panel cmp-accordion__panel--hidden'} data-cmp-hook-adaptiveformaccordion="panel" id={`${item.id}-panel`} role="region" aria-labelledby={`${item.id}-button`} aria-hidden={activePanel === index ? 'false' : 'true'}>
            {activePanel === index && <div className="panelcontainer responsivegrid">
              <div className="cmp-container" data-cmp-is="adaptiveFormPanel" data-cmp-visible={activePanel === index ? 'true' : 'false'} data-cmp-enabled={activePanel === index ? 'true' : 'false'}>
                <label htmlFor={item.id} className="cmp-container__label">{item?.label?.value}</label>
                <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                  <div className="cmp-adaptiveform-checkboxgroup aem-GridColumn aem-GridColumn--default--12">
                    {activePanel !== null ? getChild(item, index) : null}
                  </div>
                </div>
              </div>
            </div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default withRuleEnginePanel(Accordion);