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
//  * LINK- //  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/textinput/v1/textinput/textinput.html

//  ******************************************************************************

import React, { useState } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';


const TextFieldArea = (props: PROPS) => {
  const { id, label, name, value, required, readOnly, isError, errorMessage, description, minLength, maxLength, visible, enabled, placeholder,appliedCssClassNames } = props;

  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShortDescription(!shortDescription);
    setLongtDescription(!longDescription);
  };


  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const enteredValue = event?.target?.value;
    props.dispatchChange(enteredValue);
  };

  const handleFocus = () => {
    props.dispatchFocus();
  };

  const handleBlur = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.dispatchBlur(event.target.value);
  };

  return (
    <div className={`cmp-adaptiveform-textinput ${appliedCssClassNames||''}`} data-cmp-is="adaptiveFormTextInput" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      {label?.visible && <label className="cmp-adaptiveform-textinput__label" htmlFor={`${id}-widget`}>{label?.value}</label>}
      <textarea id={`${id}-widget`} className={value ? 'cmp-adaptiveform-textinput__widget cmp-adaptiveform-textinput__widget--filled' : 'cmp-adaptiveform-textinput__widget cmp-adaptiveform-textinput__widget--empty'} name={name} onChange={handleChange} value={value} required={required} readOnly={readOnly} minLength={minLength} maxLength={maxLength} onFocus={handleFocus} placeholder={placeholder} onBlur={handleBlur} />
      {description && <button aria-label='Toggle Button' className="cmp-adaptiveform-textinput__questionmark" onClick={handleClick}></button>}
      {shortDescription && props?.tooltip && <div title='Help Text' data-cmp-visible={shortDescription} className='cmp-adaptiveform-textinput__shortdescription'>{props?.tooltip}</div>}
      <div aria-live="polite">
        {longDescription && description && !errorMessage ? <div title='Help Text' data-cmp-visible={longDescription} className="cmp-adaptiveform-textinput__longdescription">{description}</div> : null}
      </div>
      {isError ? <div className="cmp-adaptiveform-textinput__errormessage">{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(TextFieldArea);