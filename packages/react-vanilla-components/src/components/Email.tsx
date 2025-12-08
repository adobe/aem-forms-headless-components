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

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const Email = (props: PROPS) => {
  const { id, value, label, valid, enabled, visible, name, placeholder, required, appliedCssClassNames } = props;

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const thisVal = event.target.value;
    props.dispatchChange(thisVal);
  }, [props.dispatchChange]);

  const handleBlur = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchBlur(event.target.value);
  }, [props.dispatchBlur]);

  const handleFocus = useCallback(() => {
    props.dispatchFocus();
  }, [props.dispatchFocus]);

  return (
    <div
      className={`cmp-adaptiveform-emailinput cmp-adaptiveform-emailinput--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-enabled={enabled}
      data-cmp-visible={visible}
      id={id}
      data-cmp-is="adaptiveFormEmailInput"
      data-cmp-valid={valid}
      data-cmp-required={required}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-emailinput'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <input
          type="email"
          id={`${id}-widget`}
          className={'cmp-adaptiveform-emailinput__widget'}
          title={props.tooltip || ''}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          autoComplete='on'
          name={name}
          placeholder={placeholder}
          aria-invalid={!valid}
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
        />
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(Email);