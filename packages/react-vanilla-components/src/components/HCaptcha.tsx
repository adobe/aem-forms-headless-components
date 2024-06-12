// *******************************************************************************
//  * Copyright 2024 Adobe
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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/hcaptcha/v1/hcaptcha/recaptcha.html
//  ******************************************************************************

import React from 'react';
import { getOrElse } from '@aemforms/af-core';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import HCaptcha from '@hcaptcha/react-hcaptcha';


const HCaptchaComponent = (props: PROPS) => {
  const {
    label, enabled, visible, required, valid, value,
    appliedCssClassNames, isError, errorMessage, dispatchChange
  } = props;
  const config = getOrElse(props, ['properties', 'fd:captcha', 'config'], {});
  const bemClass = 'cmp-adaptiveform-hcaptcha';

  if (!config.siteKey) {return null;}
  return (
    <div
      className={`${bemClass} ${bemClass}--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormHCaptcha"
      id={props.id}
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
      data-testid={props.id}
    >
      {label?.visible ? <div className={`${bemClass}__label`}>{label.value}</div> : null}
      <div className={`${bemClass}__widget`}>
        <HCaptcha
          sitekey={config.siteKey}
          size={config.size}
          theme={config.theme}
          onVerify={dispatchChange}
          onExpire={dispatchChange}
        />
      </div>
      {isError ? <div className={`${bemClass}__errormessage`}>{errorMessage}</div> : null}
    </div>
  );
};

export default withRuleEngine(HCaptchaComponent);