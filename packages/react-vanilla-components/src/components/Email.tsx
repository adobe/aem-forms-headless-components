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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/emailinput/v1/emailinput/emailinput.html
//  ******************************************************************************

import React, { useState } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';

const Email = (props: PROPS) => {
  const { id, value, label, description, valid, errorMessage, enabled, visible, name, placeholder, isError, appliedCssClassNames } = props;

  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const thisVal = event.target.value;
    props.dispatchChange(thisVal);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchBlur(event.target.value);
  };

  const handleFocus = () => {
    props.dispatchFocus();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };

  return (
    <div className={`cmp-adaptiveform-emailinput ${appliedCssClassNames||''}`} data-cmp-enabled={enabled} data-cmp-visible={visible} id={id} data-cmp-is="adaptiveFormEmailInput" data-cmp-valid={valid}>
      {label?.visible && <label className="cmp-adaptiveform-emailinput__label" htmlFor={`${id}-widget`}>{label?.value}</label>}
      <input
        type="email"
        id={`${id}-widget`}
        className={value ? 'cmp-adaptiveform-emailinput__widget cmp-adaptiveform-emailinput__widget--filled' : 'cmp-adaptiveform-emailinput__widget cmp-adaptiveform-emailinput__widget--empty'}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        autoComplete='on'
        name={name}
        placeholder={placeholder}
      />
      {description && <button aria-label='Toggle Button' className="cmp-adaptiveform-emailinput__questionmark" onClick={handleClick}></button>}
      {shortDescription && props?.tooltip && <div title='Help Text' className="cmp-adaptiveform-emailinput__shortdescription" data-cmp-visible={shortDescription}>{props?.tooltip}</div>}
      <div aria-live="polite">
        {longDescription && description && !errorMessage ? <div title='Help Text' className="cmp-adaptiveform-emailinput__longdescription" data-cmp-visible={longDescription}>{description}</div> : null}
      </div>
      {isError ? <div className="cmp-adaptiveform-emailinput__errormessage">{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(Email);