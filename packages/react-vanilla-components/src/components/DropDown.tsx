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

//  * The BEM markup is as per the AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/dropdown/v1/dropdown/dropdown.html
//  ******************************************************************************

import React, { useState } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';

const DropDown = (props: PROPS) => {
  const { id, enum: enums, enumNames, label, value, placeholder, errorMessage, description, isError, name, enabled, visible } = props;
  const dropValue = enumNames && enumNames.length ? enumNames : enums || [];

  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    props.dispatchChange(val);
  };
  return (
    <div className="cmp-adaptiveform-dropdown" data-cmp-is="adaptiveFormDropDown" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      {label?.visible && <label className="cmp-adaptiveform-dropdown__label" htmlFor={id}>{label?.value}</label>}
      {description && <button aria-label='Toggle Button' className="cmp-adaptiveform-dropdown__questionmark" onClick={handleClick}></button>}
      <select id={`${id}-widget`} data-testid='select' name={name} title={label?.value} className={value ? 'cmp-adaptiveform-dropdown__widget cmp-adaptiveform-dropdown__widget--filled' : 'cmp-adaptiveform-dropdown__widget cmp-adaptiveform-dropdown__widget--empty'} onChange={changeHandler} value={value} disabled={!enabled}>
        <option value="" disabled selected>{placeholder}</option>
        {
          dropValue?.map((item: string, index: number) => {
            return <option className="cmp-adaptiveform-dropdown__option" key={item} value={enums![index]}>{item}</option>;
          })
        };
      </select>
      {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-adaptiveform-dropdown__shortdescription'>{props?.tooltip}</div>}
      <div aria-live="polite">
        {longDescription && description && !errorMessage ? <div title='Help Text' data-cmp-visible={longDescription} className="cmp-adaptiveform-dropdown__longdescription">{description}</div> : null}
      </div>
      {isError ? <div className="cmp-adaptiveform-dropdown__errormessage">{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(DropDown);