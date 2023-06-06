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

//  *  The BEM markup is as per the AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/datepicker/v1/datepicker/datepicker.html
//  ******************************************************************************

import React, { useState } from 'react';
import {withRuleEngine} from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';

const DateInput = (props: PROPS) => {
    const { id, label, value, errorMessage, isError, description, required, name, readOnly, placeholder, visible, enabled } = props;

    const [shortDescription, setShortDescription] = useState(true);
    const [longDescription, setLongDescription] = useState(false);

    const finalValue = value === undefined ? '' : value;
    
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        props.dispatchChange(val);
    };

    const handleFocus = () => {
        props.dispatchFocus();
      };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setShortDescription(!shortDescription);
        setLongDescription(!longDescription);
     };

     const handleBlur = () => {
        //throw 'Blur';
        props.dispatchBlur();
      }; 
     
    return (
        <div className="cmp-adaptiveform-datepicker" data-cmp-is="adaptiveFormDatePicker" data-cmp-visible={visible} data-cmp-enabled={enabled}>
           <div>
            {label?.visible && <label id={`${id}-label`} htmlFor={id} className="cmp-adaptiveform-datepicker__label">{label?.value}</label>}
            </div>
            <div>
            {description && <button className="cmp-adaptiveform-datepicker__questionmark" aria-label='Toggle Button'  onClick={handleClick}></button>}
            </div>
           <input type='date' id={`${id}-datePicker`} value={finalValue} name={name} required={required} onChange={changeHandler} className={value?'cmp-adaptiveform-datepicker__widget cmp-adaptiveform-datepicker__widget--filled' : 'cmp-adaptiveform-datepicker__widget cmp-adaptiveform-datepicker__widget--empty'} aria-label={label?.value} readOnly={readOnly} placeholder={placeholder} onFocus={handleFocus} onBlur={handleBlur}/>
           {shortDescription && props?.tooltip && <div title='Help Text' className="cmp-adaptiveform-datepicker__shortdescription" data-cmp-visible={shortDescription}>{props?.tooltip}</div>}
           <div aria-live="polite">
                 {description && longDescription  && !errorMessage ? <div title='Help Text' data-cmp-visible={longDescription} className="cmp-adaptiveform-datePicker__longdescription">{description}</div> : null}
              </div>
               {isError ? <div className="cmp-adaptiveform-datePicker__errormessage">{errorMessage}</div> : null}
        </div>
    );
};

export default withRuleEngine(DateInput);