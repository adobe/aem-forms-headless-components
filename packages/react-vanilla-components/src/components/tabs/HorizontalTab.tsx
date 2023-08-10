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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/tabsontop/v1/tabsontop/tabsontop.html
//  ******************************************************************************

import React, { useContext, useState, useCallback } from 'react';
import { FormContext } from '@aemforms/af-react-renderer';
import { getRenderer } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel } from '../../utils/withRuleEngine';
import { PROPS_PANEL } from '../../utils/type';

const HorizontalTab = (props: PROPS_PANEL) => {
  console.log('tab-props', props);
  // @ts-ignore
  const { mappings } = useContext(FormContext);
  const [activetabIndex, setActiveTabIndex] = useState(0);
  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);
  const { items, label, id, visible, enabled } = props;
  const { v: visibleItems } =
    items.reduce(({ v }: any, item) => {
      const isVisible = item.visible === true;
      return {
        v: isVisible ? v.concat([item]) : v
      };
    }, { v: [] });

  const handleClick = (index: number) => {
    setActiveTabIndex(index);
  }

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };

  const getChild = useCallback((child: any, index: number) => {
    const Comp = getRenderer(child, mappings);
    return Comp ? <Comp key={`${child.id}_${index}`} {...child} /> : (null);
  }, []);

  return (
    <div data-cmp-is="adaptiveFormTabs" id={id} className="cmp-tabs" data-placeholder-text="false" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      {label?.visible && <label className="cmp-tabs__label" htmlFor={`${id}-widget`}>{label?.value}</label>}
      {props?.description && <button aria-label='Toggle Button' className="cmp-tabs__questionmark" onClick={handleButtonClick}></button>}
      {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-tabs__shortdescription'>{props?.tooltip}</div>}
      <div aria-live="polite">
        {longDescription && props?.description && <div title='Help Text' data-cmp-visible={longDescription} className="cmp-tabs__longdescription">{props?.description}</div>}
      </div>
      {visibleItems.length > 0 && <ol role="tablist" className="cmp-tabs__tablist" aria-multiselectable="false" id={`${id}-widget`} >
        {visibleItems.map((item: PROPS_PANEL, index: number) => (
          <li id={`${item?.id}__tab`} aria-controls={`${item?.id}__tabpanel`} role="tab" key={item?.id} onClick={() => handleClick(index)} className={index === activetabIndex ? 'cmp-tabs__tab cmp-tabs__tab--active' : 'cmp-tabs__tab'} data-cmp-hook-adaptiveformtabs="tab" aria-selected={index === activetabIndex ? 'true' : 'false'} tabIndex={index === activetabIndex ? 0 : -1}>{item.label?.value}</li>
        ))}
      </ol>}
      {visibleItems.length > 0 ? <div id={`${visibleItems[activetabIndex].id}__tabpanel`} data-cmp-hook-adaptiveformtabs="tabpanel" className={activetabIndex === visibleItems[activetabIndex].index ? 'cmp-tabs__tabpanel cmp-tabs__tabpanel--active' : 'cmp-tabs__tabpanel'} role="tabpanel" tabIndex={0} aria-hidden={activetabIndex === visibleItems[activetabIndex].index ? 'false' : 'true'} aria-labelledby={`${visibleItems[activetabIndex].id}__tab`}>
        {getChild(visibleItems[activetabIndex], activetabIndex)}
      </div> : null}
    </div>);
};

export default withRuleEnginePanel(HorizontalTab);