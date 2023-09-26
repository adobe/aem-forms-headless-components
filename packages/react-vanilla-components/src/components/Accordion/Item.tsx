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
//  ******************************************************************************

import React, { useContext, useCallback } from 'react';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';
import { AccordionContext } from './Accordion';

const Item = (props: any) => {
  const { onAdd, onRemove, isRepeatable, showAddButton, showDeleteButton } = props;
  // @ts-ignore
  const { mappings } = useContext(FormContext);
  const { onToggle, activePanel } = useContext(AccordionContext);
  const getChild = useCallback((child: any) => {
    const Comp = getRenderer(child, mappings);
    return Comp ? <Comp key={`${child.id}-child`} {...child} /> : (null);
  }, []);

  return (
    <div
      className="cmp-accordion__item"
      data-cmp-hook-accordion="item"
      id={`${props.id}-widget`}
    >
      <h3 className="cmp-accordion__header">
        <button
          aria-controls={`${props.id}`}
          role='button'
          id={`${props.id}-button`}
          data-cmp-hook-accordion="button"
          type="button"
          onClick={() => onToggle(props.id)}
          className={`cmp-accordion__button ${activePanel === props.id ? 'cmp-accordion__button--expanded' : ''}`}
          aria-expanded={activePanel === props.id ? 'true' : 'false'}
        >
          <span className="cmp-accordion__title">{props?.label?.value}</span>
          <span className="cmp-accordion__icon"></span>
        </button>
        {
          isRepeatable ? (
            <div
              className="cmp-accordion__repeatable-buttons"
              data-cmp-hook-adaptiveformaccordion="repeatableButton"
            >
              {
                showAddButton &&
                <button
                  className="cmp-accordion__add-button"
                  type="button"
                  data-cmp-visible="true"
                  onClick={onAdd}
                ></button>
              }
              {
                showDeleteButton &&
                <button
                  className="cmp-accordion__remove-button"
                  type="button"
                  data-cmp-visible="true"
                  onClick={onRemove}
                ></button>
              }
            </div>
          ) : null
        }
      </h3>
      <div
        className={`cmp-accordion__panel cmp-accordion__panel--${activePanel === props.id ? 'expanded' : 'hidden'}`}
        data-cmp-hook-adaptiveformaccordion="panel"
        id={`${props.id}-panel`}
        role="region"
        aria-labelledby={`${props.id}-button`}
        aria-hidden={activePanel === props.id ? 'false' : 'true'}
      >
        {activePanel !== null ? getChild(props) : null}
      </div>
    </div>
  );
};

export default Item;