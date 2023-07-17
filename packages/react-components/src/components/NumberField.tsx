// *******************************************************************************
//  * Copyright 2022 Adobe
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
//  * LINK-https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/numberinput/v1/numberinput/numberinput.html
//  ******************************************************************************

import React, { useState } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';

const NumberField = (props: PROPS) => {
  const { id, label, value, required, placeholder, name, maximum, minimum, description, errorMessage, isError, readOnly, visible, enabled } = props;

  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchChange(event.target.value);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchBlur(event.target.value);
  };

  const handleFocus = () => {
    props.dispatchFocus();
  };

  return (
    <div className="cmp-adaptiveform-numberinput" data-cmp-is="adaptiveFormNumberInput" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      <div>{label?.visible && <label htmlFor={`${id}-widget`}>{label?.value}</label>}</div>
      <div>{description && <button className="cmp-adaptiveform-numberinput__questionmark" aria-label='Toggle Button' onClick={handleClick}></button>}</div>
      <input id={`${id}-widget`} type='number' className={value ? 'cmp-adaptiveform-numberinput__widget cmp-adaptiveform-numberinput__widget--filled' : 'cmp-adaptiveform-numberinput__widget cmp-adaptiveform-numberinput__widget--empty'} value={value} onChange={changeHandler} required={required} placeholder={placeholder} name={name} min={minimum} max={maximum} readOnly={readOnly} onFocus={handleFocus} onBlur={handleBlur} />
      {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-adaptiveform-numberinput__shortdescription'>{props?.tooltip}</div>}
      <div aria-live="polite">
        {longDescription && description && !errorMessage ? <div title='Help Text' data-cmp-visible={longDescription} className="cmp-adaptiveform-numberinput__longdescription">{description}</div> : null}
      </div>
      {isError ? <div className="cmp-adaptiveform-numberinput__errormessage">{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(NumberField);