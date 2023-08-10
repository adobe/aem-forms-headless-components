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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/radiobutton/v1/radiobutton/radiobutton.html
//  ******************************************************************************

import React, { useState } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';

const RadioButtonGroup = (props: PROPS) => {
  const { id, label, required, enumNames, enum: enums, name, isError, errorMessage, description, visible, enabled, value, readOnly } = props;
  const options = enumNames && enumNames.length ? enumNames : enums || [];
  const orientation = props.layout?.orientation.toUpperCase();
  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    props.dispatchChange(val);
  };
  return (
    <div className="cmp-adaptiveform-radiobutton" data-cmp-is="adaptiveFormRadioButton" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      {label?.visible && <label htmlFor={`${id}-widget`} className="cmp-adaptiveform-radiobutton__label">{label?.value}</label>}
      {description && <button aria-label='Toggle Button' className="cmp-adaptiveform-radiobutton__questionmark" onClick={handleClick}></button>}
      <div className={`cmp-adaptiveform-radiobutton__widget ${orientation}`} id={`${id}-widget`}>
        {options?.map((item: string, index: number) => {
          return (
            <div className="cmp-adaptiveform-radiobutton__option" key={item}>
              <label className="cmp-adaptiveform-radiobutton__option__label">
                <input className={value === enums![index] ? 'cmp-adaptiveform-radiobutton__option__widget cmp-adaptiveform-radiobutton__option__widget--filled' : 'cmp-adaptiveform-radiobutton__option__widget cmp-adaptiveform-radiobutton__option__widget--empty'} type='radio' required={required} name={name} value={enums![index]} onChange={changeHandler} readOnly={readOnly} aria-checked={value === enums![index] ? 'true' : 'false'} />
                <span>{item}</span>
              </label>
            </div>
          );
        })}
      </div>
      {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-adaptiveform-radiobutton__shortdescription'>{props?.tooltip}</div>}
      <div aria-live="polite">
        {longDescription && description && !errorMessage ? <div title='Help Text' data-cmp-visible={longDescription} className="cmp-adaptiveform-radiobutton__longdescription">{description}</div> : null}
      </div>
      {isError ? <div className="cmp-adaptiveform-radiobutton__errormessage">{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(RadioButtonGroup);