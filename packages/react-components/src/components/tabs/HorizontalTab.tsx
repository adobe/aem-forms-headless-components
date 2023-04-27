import React,  {useContext, useCallback, useState} from 'react';
import {FormContext} from '@aemforms/af-react-renderer';
import {getRenderer, useFormIntl} from '@aemforms/af-react-renderer';
import {ContainerJson, State, CUSTOM_PROPS_KEY, TRANSLATION_ID, getOrElse} from '@aemforms/af-core';

const Tabs = (props: State<ContainerJson>) => {
   console.log('tab-props',props);
   const {mappings} = useContext(FormContext);
   const [activetabIndex, setActiveTabIndex] = useState(0);
   const { items, label, id, visible, enabled } = props;
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

const handleClick = (index: number) => {
   setActiveTabIndex(index);
}

const Comp = getRenderer(visibleItems[activetabIndex], mappings);

return visible ? (
   <div id={id} className="cmp-tabs" aria-labelledby={`${id}-label`} data-placeholder-text="false" data-cmp-visible={visible?'true':'false'} data-cmp-enabled={enabled?'true':'false'}>
        {label?.visible && <label className="cmp-tabs__label" htmlFor={id} id={`${id}-label`}>{label?.value}</label>}
               <ol role="tablist" className="cmp-tabs__tablist" aria-multiselectable="false" >
                  {visibleItems.map((item: State<ContainerJson>, index: number) =>( 
                  <li id={`${id}-item-${item?.id}-tab`} role="tab" key={item?.id} onClick={() => handleClick(index)} className={index===activetabIndex?'cmp-tabs__tab cmp-tabs__tab--active': 'cmp-tabs__tab'} data-cmp-hook-adaptiveformtabs="tab" aria-selected={index===activetabIndex?'true':'false'} tabIndex={index===activetabIndex?0:-1}>{localizeTabLabel(item)}</li>
                   ))}
              </ol>
               <div id={`${id}-item-${visibleItems[activetabIndex].id}-tabpanel`} data-cmp-hook-adaptiveformtabs="tabpanel" className={activetabIndex === visibleItems[activetabIndex].index?'cmp-tabs__tabpanel cmp-tabs__tabpanel--active':'cmp-tabs__tabpanel'} role="tabpanel" tabIndex={0} aria-hidden={activetabIndex===visibleItems[activetabIndex].index?'false':'true'}>
                  <Comp key={`${visibleItems[activetabIndex].id}_${activetabIndex}`} {...visibleItems[activetabIndex]} />
               </div>
   </div>):null;
};

export default Tabs;