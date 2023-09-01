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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/recaptcha/v1/recaptcha/recaptcha.html
//  ******************************************************************************

import React from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import ReCAPTCHA from 'react-google-recaptcha';


const ReCAPTCHAComponent = (props: PROPS) => {
  const { label, enabled, visible, properties, isError, errorMessage, dispatchChange } = props;
  const config = properties ? properties['fd:captcha']?.config : {};
  return (
    <div className="cmp-adaptiveform-recaptcha" data-cmp-is="adaptiveFormRecaptcha" data-cmp-visible={visible} data-cmp-enabled={enabled}>
      {label?.visible ? <div className="cmp-adaptiveform-recaptcha__label">{label.value}</div> : null}
      <div className="cmp-adaptiveform-recaptcha__widget">
        <ReCAPTCHA
          {...(config || {})}
          onChange={dispatchChange}
        />
      </div>
      {isError ? <div className="cmp-adaptiveform-recaptcha__errormessage">{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(ReCAPTCHAComponent);