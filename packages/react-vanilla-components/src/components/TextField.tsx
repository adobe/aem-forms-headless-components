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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/textinput/v1/textinput/textinput.html
//  ******************************************************************************


import React, { useState } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';

const TextField = (props: PROPS) => {
  const { id, value, label, required, readOnly = false, placeholder, description, errorMessage, minLength, maxLength, enabled, visible, name, isError, appliedCssClassNames } = props;

  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const thisVal = event.target.value;
    props.dispatchChange(thisVal);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchBlur(event.target.value);
  };

  const handleFocus = () => {
    props.dispatchFocus();
  };

  return (
    <div className={`cmp-adaptiveform-textinput ${appliedCssClassNames||''}`}  data-cmp-is="adaptiveFormTextInput" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      {label?.visible && <label className="cmp-adaptiveform-textinput__label" htmlFor={`${id}-widget`}>{label?.value}</label>}
      <input
        type="text"
        id={`${id}-widget`}
        className={value ? 'cmp-adaptiveform-textinput__widget cmp-adaptiveform-textinput__widget--filled' : 'cmp-adaptiveform-textinput__widget cmp-adaptiveform-textinput__widget--empty'}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
        minLength={minLength}
        maxLength={maxLength}
        disabled={!enabled}
        name={name}
      />
      {description && <button className="cmp-adaptiveform-textinput__questionmark" onClick={handleClick} aria-label='Toggle Button'></button>}
      {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-adaptiveform-textinput__shortdescription'>{props?.tooltip}</div>}
      <div aria-live="polite">
        {description && longDescription && !errorMessage ? <div title='Help Text' data-cmp-visible={longDescription} className="cmp-adaptiveform-textinput__longdescription">{description}</div> : null}
      </div>
      {isError ? <div className="cmp-adaptiveform-textinput__errormessage">{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(TextField);