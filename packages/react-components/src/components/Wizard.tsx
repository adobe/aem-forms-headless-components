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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/wizard/v1/wizard/wizard.html
//  ******************************************************************************

import React, { useState, useContext, useCallback } from 'react';
import {FormContext} from '@aemforms/af-react-renderer';
import {getRenderer} from '@aemforms/af-react-renderer';
import { withRuleEnginePanel }  from '../utils/withRuleEngine';
import { PROPS_PANEL } from '../utils/type';

const Wizard = (props: PROPS_PANEL) => {
   const {mappings} = useContext(FormContext);
   const { items, label, id, visible, enabled } = props;
   const [activeButtonIndex, setActiveButtonIndex] = useState(0);
   const [shortDescription, setShortDescription] = useState(true);
   const [longDescription, setLongtDescription] = useState(false);

   const {v: visibleItems} =
   items.reduce(({v} : any, item) => {
       const isVisible = item.visible === true;
       return {
           v: isVisible ? v.concat([item]) : v
       };
   }, {v: []});

 const handlePrevious = () => {
    const newIndex = activeButtonIndex - 1;
    newIndex >= 0 && setActiveButtonIndex(newIndex < 0 ? visibleItems.length - 1 : newIndex);
 };

 const handleNext = () => {
    const newIndex = activeButtonIndex + 1;
    newIndex <= visibleItems.length - 1 && setActiveButtonIndex(newIndex >= visibleItems.length ? 0 : newIndex);
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

//  const Comp = visibleItems.length > 0 ? getRenderer(visibleItems[activeButtonIndex], mappings) : '';

 return visible ? (
    <div id={id} className="cmp-adaptiveform-wizard" data-panelcontainer="wizard" data-placeholder-text="Please drag Wizard components here" data-cmp-visible={visible} data-cmp-enabled={enabled}>
         {label?.visible && <label className="cmp-adaptiveform-wizard__label" htmlFor={`${id}-widget`}>{label?.value}</label>}
         {props?.description && <button className="cmp-adaptiveform-wizard__questionmark" onClick={handleClick} aria-label='Toggle Button'></button>} 
         {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-adaptiveform-wizard__shortdescription'>{props?.tooltip}</div>}
          <div aria-live="polite">
             {longDescription && props?.description && <div title='Help Text' data-cmp-visible={longDescription} className="cmp-adaptiveform-wizard__longdescription">{props?.description}</div>}
         </div>
           <div className="cmp-adaptiveform-wizard__widget cmp-adaptiveform-wizard__widget--empty" id={`${id}-widget`}>
            <div className="cmp-adaptiveform-wizard__tabs-container">
                <ol id={`${id}_guide-item-nav-container`} className="cmp-adaptiveform-wizard__tabList" role="tablist">
                   {visibleItems.map((item: PROPS_PANEL, index: number) =>( 
                   <li key={item.id} title={item?.label?.value} id={`${item.id}_wizard-item-nav`} className={index===activeButtonIndex?'cmp-adaptiveform-wizard__tab cmp-adaptiveform-wizard__tab--active': 'cmp-adaptiveform-wizard__tab' } role="tab" tabIndex={index===activeButtonIndex?0:-1} aria-selected={index===activeButtonIndex?'true':'false'} data-cmp-hook-adaptiveformwizard="tab">{item.label?.value}</li>
                    ))}
               </ol>
           </div>
           {visibleItems.length > 0 ? <div className="cmp-adaptiveform-wizard__previousNav" role="navigation" aria-label="Previous Button" onClick={handlePrevious} tabIndex={0}></div> : null}
           {visibleItems.length > 0 ? <div data-cmp-hook-adaptiveformtabs="tabpanel" className={activeButtonIndex === visibleItems[activeButtonIndex].index?'cmp-adaptiveform-wizard__wizardpanel cmp-adaptiveform-wizard__wizardpanel--active':'cmp-adaptiveform-wizard__wizardpanel'} role="tabpanel" tabIndex={0} aria-hidden={activeButtonIndex===visibleItems[activeButtonIndex].index?'false':'true'} aria-labelledby={`${visibleItems[activeButtonIndex].id}_wizard-item-nav`} data-cmp-hook-adaptiveformwizard="wizardpanel">
              {/* <Comp key={`${visibleItems[activeButtonIndex].id}_${activeButtonIndex}`} {...visibleItems[activeButtonIndex]} /> */}
              {getChild(visibleItems[activeButtonIndex], activeButtonIndex)}
           </div> : null}
           {visibleItems.length > 0 ? <div className="cmp-adaptiveform-wizard__nextNav" role="navigation" aria-label="Next Button" onClick={handleNext} tabIndex={0}> </div> : null}
          </div>    
    </div>
  ): null;
};

export default withRuleEnginePanel(Wizard);