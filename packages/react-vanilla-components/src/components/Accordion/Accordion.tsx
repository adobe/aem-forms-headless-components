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

import React, {useState, createContext} from 'react';
import { withRuleEnginePanel }  from '../../utils/withRuleEngine';
import { PROPS_PANEL } from '../../utils/type';
import Item from './Item';
import RepeatableItem from './RepeatableItem';

export const AppContext = createContext('' as any);

const Accordion = (props: PROPS_PANEL) => {
   const {items,id, label, visible, enabled} = props;
   const [shortDescription, setShortDescription] = useState(true);
   const [longDescription, setLongtDescription] = useState(false);

   const {v: visibleItems} =
   items.reduce(({v} : any, item) => {
      const isVisible = item.visible === true;
      return {
         v: isVisible ? v.concat([item]) : v
      };
   }, {v: []}); 

   const firstItem = visibleItems[0] || {};

   // for active first item
   let panelId = firstItem?.type === 'array' ?  firstItem?.items[0]?.id : firstItem?.id;
   const [activePanel, setActivePanel] = useState(panelId) ;

   const handleToggle = (id: string) => {
      setActivePanel(id === activePanel ? null : id);
   };

   const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();  
      setShortDescription(!shortDescription);
      setLongtDescription(!longDescription);
   };

   return (
      <div className="cmp-accordion" data-cmp-is="adaptiveFormAccordion" data-cmp-single-expansion="true" data-placeholder-text="false" data-cmp-visible={visible} data-cmp-enabled={enabled}>
         {label?.visible && <label htmlFor={id} className="cmp-accordion__label">{label?.value}</label>}
         {props?.description && <button aria-label='Toggle Button' className="cmp-accordion__questionmark" onClick={handleClick}></button>} 
         {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-accordion__shortdescription'>{props?.tooltip}</div>}
          <div aria-live="polite">
             {longDescription && props?.description  && <div title='Help Text' data-cmp-visible={longDescription} className="cmp-accordion__longdescription">{props?.description}</div>}
         </div>
          {visibleItems?.map((item: PROPS_PANEL) => {
            return (item?.type === 'array') ?
            //@ts-ignore
            <AppContext.Provider value={{onToggle:handleToggle, activePanel:activePanel}}>
            <RepeatableItem {...item}/> 
            </AppContext.Provider> :  <AppContext.Provider value={{onToggle:handleToggle, activePanel:activePanel}}><Item {...item} /></AppContext.Provider>;
            })}
      </div>
   ); 
};

export default withRuleEnginePanel(Accordion);