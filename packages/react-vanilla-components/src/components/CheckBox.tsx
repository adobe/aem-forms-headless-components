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

import React, { useState } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';

const CheckBox = (props: PROPS) => {
  const { id, label, enum: enums, value, isError, errorMessage, description, name, readOnly, enabled, visible } = props;
  const selectedValue = enums?.[0];
  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);
  const unSelectedValue = (enums?.length || 0) < 2 ? null : enums?.[1];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked ? selectedValue : unSelectedValue;
    props.dispatchChange(val);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };

  return (
    <div className="cmp-adaptiveform-checkbox" data-cmp-is="adaptiveFormCheckBox" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      {label?.visible && <label className="cmp-adaptiveform-checkbox__label" htmlFor={`${id}-widget`}>{label?.value}</label>}
      {description && <button aria-label='Toggle Button' className="cmp-adaptiveform-checkbox__questionmark" onClick={handleClick}></button>}
      <input id={`${id}-widget`} type='checkbox' className={selectedValue === value ? 'cmp-adaptiveform-checkbox__widget cmp-adaptiveform-checkbox__widget--filled' : 'cmp-adaptiveform-checkbox__widget cmp-adaptiveform-checkbox__widget--empty'} onChange={handleChange} value={value} name={name} readOnly={readOnly} disabled={!enabled} aria-checked={selectedValue === value ? 'true' : 'false'} />
      {shortDescription && props?.tooltip && <div title='Help Text' className='cmp-adaptiveform-checkbox__shortdescription' data-cmp-visible={shortDescription}>{props?.tooltip}</div>}
      <div aria-live="polite">
        {longDescription && description && !errorMessage ? <div title='Help Text' data-cmp-visible={longDescription} className="cmp-adaptiveform-checkbox__longdescription">{description}</div> : null}
      </div>
      {isError ? <div id={`${id}-errorMessage`} className="cmp-adaptiveform-checkbox__errormessage">{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(CheckBox);