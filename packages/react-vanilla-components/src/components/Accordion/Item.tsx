import React, { useContext, useCallback } from 'react';
import {FormContext, getRenderer} from '@aemforms/af-react-renderer';
import { AppContext } from './Accordion';

const Item = (props: any) => {
    const {onAdd, onRemove, isRepeatable, showAddButton, showDeleteButton} = props;
      // @ts-ignore
    const {mappings} = useContext(FormContext);
    const {onToggle, activePanel} = useContext(AppContext);
    const getChild = useCallback((child: any) => {
      const Comp = getRenderer(child, mappings);
      return Comp ? <Comp key={`${child.id}`} {...child} /> : (null);
    }, []);

   return (
    <div key={props.id} className="cmp-accordion__item" data-cmp-hook-accordion="item" id={`${props.id}-widget`}>
    <h3 className="cmp-accordion__header">
       <button aria-controls={`${props.id}`} role='button' id={`${props.id}-button`} data-cmp-hook-accordion="button" type="button" onClick={() => onToggle(props.id)} className={activePanel===props.id?'cmp-accordion__button cmp-accordion__button--expanded':'cmp-accordion__button'} aria-expanded={activePanel===props.id?'true':'false'}>
       <span className="cmp-accordion__title">{props?.label?.value}</span>
       <span className="cmp-accordion__icon"></span> 
       </button>
       {
        isRepeatable ? (
          <div className="cmp-accordion__repeatable-buttons" data-cmp-hook-adaptiveformaccordion="repeatableButton">
            {showAddButton && <button className="cmp-accordion__add-button" type="button" data-cmp-visible="true" onClick={onAdd}></button>}
            {showDeleteButton &&  <button className="cmp-accordion__remove-button" type="button" data-cmp-visible="true" onClick={onRemove}></button>}
         </div>
        ) : null
       }
    </h3>
      <div className={activePanel===props.id?'cmp-accordion__panel cmp-accordion__panel--expanded': 'cmp-accordion__panel cmp-accordion__panel--hidden'} data-cmp-hook-adaptiveformaccordion="panel" id={`${props.id}-panel`} role="region" aria-labelledby={`${props.id}-button`} aria-hidden={activePanel===props.id?'false':'true'}>
          {activePanel === props.id && <div className="panelcontainer responsivegrid">
               <div className="cmp-container" data-cmp-is="adaptiveFormPanel" data-cmp-visible={activePanel === props.id?'true':'false'} data-cmp-enabled={activePanel === props.id?'true':'false'}>
               <label htmlFor={props.id} className="cmp-container__label">{props?.label?.value}</label>
                      <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                             {activePanel !== null ? getChild(props)  : null}
                      </div>
               </div>
          </div>}
      </div>
 </div>
   );
};

export default Item;