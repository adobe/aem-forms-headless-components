// *******************************************************************************
//  * Copyright 2025 Adobe
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

import React, { useCallback, useContext, useState, createContext } from 'react';
import { PROPS, PROPS_PANEL } from '../utils/type';
import { withRuleEnginePanel } from '../utils/withRuleEngine';
import { FormContext } from '@aemforms/af-react-renderer';
import { getRenderer } from '@aemforms/af-react-renderer';
import LabelWithDescription from './common/LabelWithDescription';

export const TnCContext = createContext('' as any);

const TermsAndCondition = (props: PROPS_PANEL) => {
  // @ts-ignore
  const { mappings, form } = useContext(FormContext);
  const { items, label, id, visible, enabled } = props;
  const [open, setOpen] = useState<boolean>(false);

  const { v: visibleItems } = items?.reduce(
    ({ v }: any, item) => {
      const isVisible = item.visible === true;
      return {
        v: isVisible ? v.concat([item]) : v
      };
    },
    { v: [] }
  );

    const getChild = useCallback((child: any, index: number) => {
      const Comp = getRenderer(child, mappings);
      return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : null;
    }, []);

  const handleScroll = () => {
    const intersection = document.querySelector(
      '.cmp-adaptiveform-termsandcondition__text-intersect'
    );
    if (intersection) {
      const io = new IntersectionObserver(
        (entries: any) => {
          if (entries[0]?.isIntersecting) {
            visibleItems
              .filter((c: PROPS_PANEL) => c.fieldType === 'checkbox')
              .forEach((cb: PROPS_PANEL) => {
                const element = form.getElement(cb.id);
                element.enabled = true;
              });
            io.unobserve(intersection as any);
          }
        },
        {
          threshold: [1]
        }
      );
      io.observe(intersection);
    }
  };

  const handleModal = useCallback(() => {
    if (props?.properties?.['fd:showAsPopup']) {
      setOpen(!open);
    }
  }, [open]);

  return (
    <div
      className="cmp-adaptiveform-termsandcondition"
      data-cmp-is="adaptiveFormTermsAndConditions"
      data-cmp-enabled={enabled}
      data-cmp-visible={visible}
      id={id}
    >
      <LabelWithDescription
        bemBlock="cmp-adaptiveform-termsandcondition"
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
      />
      <div
        className={
          props?.properties?.['fd:showAsPopup']
            ? 'cmp-adaptiveform-termsandcondition__content-container cmp-adaptiveform-termsandcondition__content-container--modal'
            : 'cmp-adaptiveform-termsandcondition__content-container'
        }
        data-cmp-visible={visible}
        style={
          props?.properties?.['fd:showAsPopup'] ? { display: open ? 'block' : 'none' } : {}
        }
      >
        <div className="cmp-adaptiveform-termsandcondition__body">
          {props?.properties?.['fd:showAsPopup'] && (
            <div className="cmp-adaptiveform-termsandcondition__header">
              <button
                type="button"
                className="cmp-adaptiveform-termsandcondition__close-button"
                onClick={handleModal}
              >
                X
              </button>
              <h3>Please review the terms and conditions</h3>
            </div>
          )}
          <div className="cmp-adaptiveform-termsandcondition__content">
            {visibleItems
              .filter((item: PROPS) => item.fieldType !== 'checkbox')
              .map((item: PROPS, index: number) => (
                <div
                  className={
                    item.fieldType === 'plain-text'
                      ? 'cmp-adaptiveform-termsandcondition__text'
                      : 'cmp-adaptiveform-termsandcondition__link'
                  }
                  key={item.id}
                  onScroll={handleScroll}
                >
                  {props?.properties?.['fd:showAsPopup'] ? getChild(item, index) : <div>{getChild(item, index)}</div>}
                  {!props?.properties?.['fd:showAsPopup'] && <div className="cmp-adaptiveform-termsandcondition__text-intersect"></div>}
                </div>
              ))}
          </div>
        </div>
      </div>
      {visibleItems
        .filter((item: PROPS) => item.fieldType === 'checkbox')
        .map((item: PROPS, index: number) => (
          <div
            className="cmp-adaptiveform-termsandcondition__approvalcheckbox"
            key={item.id}
            onClick={(e: any) => {
               const label = e.target.closest('label');
               if(label) {
                handleModal();
               }
            }}
          >
            {getChild(item, index)}
          </div>
        ))}
    </div>
  );
};

export default withRuleEnginePanel(TermsAndCondition);
