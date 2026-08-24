// *******************************************************************************
//  * Copyright 2026 Adobe
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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/termsandconditions/v1/termsandconditions/termsandconditions.html
//  ******************************************************************************

import React, { useCallback, useContext, useState, useEffect } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS_PANEL } from '../utils/type';
import { getChild } from '../utils/utils';
import { FormContext, useFormIntl } from '@aemforms/af-react-renderer';
import LabelWithDescription from './common/LabelWithDescription';

const TermsAndConditions = (props: PROPS_PANEL) => {

  const { mappings, form } = useContext(FormContext);
  const i18n = useFormIntl();
  const { id, label, enabled, visible, required, appliedCssClassNames, properties, items, readOnly } = props;
  const hasModal = properties?.['fd:showAsPopup'] ?? false;
  const [open, setOpen] = useState(false);
  const textIntersectId = `${props.id}-text-intersect`;
  const closeIconLabel = i18n.formatMessage({ id: 'termsAndConditions.closeButton.ariaLabel', defaultMessage: 'Close terms and conditions document' });

  const getElementByFieldType = (fieldType: string) => items.find(item => item.fieldType === fieldType);
  const getElementsByFieldType = (fieldType: string) => items.filter(item => item.fieldType === fieldType);

  useEffect(() => {
    const textItem = getElementByFieldType('plain-text');
    if (!textItem) { return; }

    const node = document.getElementById(textIntersectId);
    if (!node) { return; }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && enabled && !readOnly) {
        // keeping same behavior as core components, although we have only 1 approval checkbox to enable
        const checkboxList: Array<any> = getElementsByFieldType('checkbox');
        checkboxList.forEach((checkbox: any)=> {
          if(checkbox) {
            const itemInForm = form.getElement(checkbox.id);
            if(itemInForm) {
              form.getElement(checkbox.id).enabled = true;
            }          
          }
        });
        observer.unobserve(node);
      }
    }, { threshold: 1 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [items, textIntersectId, enabled, readOnly]);

  const approvalCheckboxItem = getElementByFieldType('checkbox');
  
  const toggleModal = useCallback((show: boolean) => {
    if (hasModal) {
      const item: any = getElementByFieldType('checkbox');
      if(item) {
          setOpen(show);
      }
      
    }
  }, [hasModal, items]);

  const handleApprovalCheckboxClick = useCallback((event: React.MouseEvent<HTMLDivElement>)=> {
    // below check is to keep behavior same as core components
    // label click toggles popup, input won't
    if((event.target as HTMLElement).tagName !== 'INPUT') {
      toggleModal(true);
    }
  },[toggleModal]);

  return (<div
    id={id}
    data-cmp-is="adaptiveFormTermsAndConditions"
    className={`cmp-adaptiveform-termsandcondition ${appliedCssClassNames || ''}`}
    data-cmp-visible={visible}
    data-cmp-enabled={enabled}
    data-cmp-required={required}>

    <LabelWithDescription
        bemBlock='cmp-adaptiveform-termsandcondition'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
      />  
    <div
      className={`cmp-adaptiveform-termsandcondition__content-container${hasModal ? ' cmp-adaptiveform-termsandcondition__content-container--modal' : ''}`}
      style={hasModal ? { display: open ? 'block' : 'none' } : {}}>
      <div
        className='cmp-adaptiveform-termsandcondition__body'>
        {hasModal && (<div
          className='cmp-adaptiveform-termsandcondition__header'>

          <button type="button" className='cmp-adaptiveform-termsandcondition__close-button'
            aria-label={closeIconLabel}
            onClick={()=>toggleModal(false)}>X</button>

          <h3>{i18n.formatMessage({ id: 'termsAndConditions.header.label', defaultMessage: 'Please review the terms and conditions' })}</h3>
        </div>)
        }
        <div
          className='cmp-adaptiveform-termsandcondition__content'>
          {
            items.map((item: any, index) => {
              // text or link render below 
              const classSuffix = item.fieldType === 'plain-text' ? 'text' : item.fieldType === 'checkbox-group' ? 'link' : null;
                return (classSuffix && (<div key={item.id}
                  className={`cmp-adaptiveform-termsandcondition__${classSuffix}`}>
                  {getChild(item, index, mappings)}
                  {classSuffix === 'text' && (<div id={`${props.id}-text-intersect`} className="cmp-adaptiveform-termsandcondition__text-intersect"></div>)}
                </div>));
            })
          }
        </div>
      </div>
    </div>

    <div
      className='cmp-adaptiveform-termsandcondition__approvalcheckbox'
      onClick={handleApprovalCheckboxClick}>
      {approvalCheckboxItem && getChild(approvalCheckboxItem, 1, mappings)}
    </div>
  </div>);
};

export default withRuleEngine(TermsAndConditions);
