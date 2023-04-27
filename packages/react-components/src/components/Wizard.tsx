import React, { useState, useContext, useCallback } from 'react';
import {FormContext} from '@aemforms/af-react-renderer';
import {ContainerJson, State, CUSTOM_PROPS_KEY, TRANSLATION_ID, getOrElse} from '@aemforms/af-core';
import {getRenderer, useFormIntl} from '@aemforms/af-react-renderer';

const Wizard = (props: State<ContainerJson>) => {
   const {mappings} = useContext(FormContext);
   const { items, label, id, visible, enabled } = props;
   const [activeButtonIndex, setActiveButtonIndex] = useState(0);
   const {v: visibleItems} =
   items.reduce(({v} : any, item) => {
       const isVisible = item.visible === true;
       return {
           v: isVisible ? v.concat([item]) : v
       };
   }, {v: []});

 const localizeTabLabel = useCallback((item: State<ContainerJson>) => {
    let defaultMessage = item?.label?.value;
    const id = getOrElse(item, [CUSTOM_PROPS_KEY, TRANSLATION_ID, 'label.value']);
    if (id) {
        const i18n = useFormIntl();
        defaultMessage = i18n.formatMessage({id, defaultMessage});
    }
    return defaultMessage;
 }, [useFormIntl]);

 const handlePrevious = () => {
    const newIndex = activeButtonIndex - 1;
    newIndex >= 0 && setActiveButtonIndex(newIndex < 0 ? visibleItems.length - 1 : newIndex);
 };

 const handleNext = () => {
    const newIndex = activeButtonIndex + 1;
    newIndex <= visibleItems.length - 1 && setActiveButtonIndex(newIndex >= visibleItems.length ? 0 : newIndex);
 };

 const Comp = getRenderer(visibleItems[activeButtonIndex], mappings);

 return visible ? (
    <div id={id} className="cmp-adaptiveform-wizard" data-panelcontainer="wizard" data-placeholder-text="Please drag Wizard components here" data-cmp-visible={visible?'true':'false'} data-cmp-enabled={enabled?'true':'false'}>
         {label?.visible && <label className="cmp-adaptiveform-wizard__label" htmlFor={id} id={`${id}-label`}>{label?.value}</label>}
           <div className="cmp-adaptiveform-wizard__widget">
            <div className="cmp-adaptiveform-wizard__tabs-container">
                <ol id={`${id}_guide-item-nav-container`} className="cmp-adaptiveform-wizard__tabList" role="tablist">
                   {visibleItems.map((item: State<ContainerJson>, index: number) =>( 
                   <li title={item?.label?.value} id={`${item.id}_wizard-item-nav`} className={index===activeButtonIndex?'cmp-adaptiveform-wizard__tab cmp-adaptiveform-wizard__tab--active': 'cmp-adaptiveform-wizard__tab' } role="tab" tabIndex={index===activeButtonIndex?0:-1} aria-selected={index===activeButtonIndex?'true':'false'} data-cmp-hook-adaptiveformwizard="tab">{localizeTabLabel(item)}</li>
                    ))}
               </ol>
           </div>
           <div className="cmp-adaptiveform-wizard__previousNav" role="navigation" aria-label="Previous Button" onClick={handlePrevious} tabIndex={0}></div>
           <div data-cmp-hook-adaptiveformtabs="tabpanel" className={activeButtonIndex === visibleItems[activeButtonIndex].index?'cmp-adaptiveform-wizard__wizardpanel cmp-adaptiveform-wizard__wizardpanel--active':'cmp-adaptiveform-wizard__wizardpanel'} role="tabpanel" tabIndex={0} aria-hidden={activeButtonIndex===visibleItems[activeButtonIndex].index?'false':'true'} aria-labelledby={`${visibleItems[activeButtonIndex].id}_wizard-item-nav`} data-cmp-hook-adaptiveformwizard="wizardpanel">
              <Comp key={`${visibleItems[activeButtonIndex].id}_${activeButtonIndex}`} {...visibleItems[activeButtonIndex]} />
           </div>
           <div className="cmp-adaptiveform-wizard__nextNav" role="navigation" aria-label="Next Button" onClick={handleNext} tabIndex={0}> </div>
          </div>    
    </div>
  ): null;
};

export default Wizard;