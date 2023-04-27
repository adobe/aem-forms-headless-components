import React, {useState, useContext} from 'react';
import {ContainerJson, State} from '@aemforms/af-core';
import {getRenderer} from '@aemforms/af-react-renderer';
import {FormContext} from '@aemforms/af-react-renderer';

const Accordion = (props: State<ContainerJson>) => {
   console.log('acc-props', props);
   const {mappings} = useContext(FormContext);
   const {items,id, label, visible, enabled} = props;
   const [activePanel, setActivePanel] = useState(0);
   const [selected, setSelected] = useState(null);
   const {v: visibleItems} =
   items.reduce(({v} : any, item) => {
       const isVisible = item.visible === true;
       return {
           v: isVisible ? v.concat([item]) : v
       };
   }, {v: []}); 
   console.log('visible-acc', visibleItems);

   const newItem = visibleItems.map((item: State<ContainerJson>) => item.items.map((el:any) => getRenderer(el,mappings)));
   console.log('new-item', newItem);

   const handleToggle = (i:any) => {
      if(selected === i) {
        return setSelected(null);
      }
      setSelected(i);
      setActivePanel(i);
   };

   return visible ? (
      <div id={id} className="cmp-accordion" data-cmp-single-expansion="true" data-placeholder-text="false" data-cmp-visible={visible?'true':'false'} data-cmp-enabled={enabled?'true':'false'}>
         {label?.visible && <label id={`${id}-label`} htmlFor={id} className="cmp-accordion__label">{label?.value}</label>}
          {visibleItems?.map((item: State<ContainerJson>, index: number) => (
           <div className="cmp-accordion__item" data-cmp-hook-accordion="item" id={item.id}>
              <h3 className="cmp-accordion__header">
                 <button id={`${item.id}-button`} data-cmp-hook-accordion="button" aria-controls={`${item.id}-panel`} type="button" onClick={()=>handleToggle(index)} className={selected===index?'cmp-accordion__button cmp-accordion__button--expanded':'cmp-accordion__button'} aria-expanded={selected===index?'true':'false'}>
                 <span className="cmp-accordion__title">{item?.label?.value}</span>
                 <span className="cmp-accordion__icon"></span> 
                 </button>
              </h3>
                <div className={selected===index?'cmp-accordion__panel cmp-accordion__panel--expanded': 'cmp-accordion__panel cmp-accordion__panel--hidden'} data-cmp-hook-accordion="panel" id={`${item.id}-panel`} role="region" aria-labelledby={`${item.id}-button`} aria-hidden={selected===index?'false':'true'}>
                    {selected === index && <div className="panelcontainer responsivegrid">
                         <div id={item.id} className="cmp-container" data-cmp-is="adaptiveFormPanel" aria-labelledby={`${item.id}-label`} data-cmp-visible={selected === index?'true':'false'} data-cmp-enabled={selected === index?'true':'false'}>
                             <label id={`${item.id}-label`} htmlFor={id} className="cmp-container__label">{item?.label?.value}</label>
                                <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                                     <div className="cmp-adaptiveform-checkboxgroup aem-GridColumn aem-GridColumn--default--12">
                                           {item.index === activePanel ? newItem[activePanel].map((Comp: any, ind: number)=>{
                                           return <Comp {...visibleItems[activePanel].items[ind]}/>;}) : ''}
                                     </div>
                                </div>
                         </div>
                    </div>}
                </div>
           </div>
           ))}
      </div>
   ):null; 
};

export default Accordion;