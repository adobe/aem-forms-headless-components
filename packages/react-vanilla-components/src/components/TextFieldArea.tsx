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

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const TextFieldArea = (props: PROPS) => {
  const { id, label, name, value, required, readOnly, minLength, maxLength, visible, enabled, placeholder, appliedCssClassNames, valid } = props;

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const enteredValue = event?.target?.value;
    props.dispatchChange(enteredValue);
  }, [props.dispatchChange]);

  const handleFocus = useCallback(() => {
    props.dispatchFocus();
  }, [props.dispatchFocus]);

  const handleBlur = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.dispatchBlur(event.target.value);
  }, [props.dispatchBlur]);

  return (
    <div
      className={`cmp-adaptiveform-textinput cmp-adaptiveform-textinput--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      id={id}
      data-cmp-is="adaptiveFormTextInput"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-textinput'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <textarea
          id={`${id}-widget`}
          className={'cmp-adaptiveform-textinput__widget'}
          name={name}
          onChange={handleChange}
          value={value}
          required={required}
          readOnly={readOnly}
          minLength={minLength}
          maxLength={maxLength}
          onFocus={handleFocus}
          placeholder={placeholder}
          onBlur={handleBlur}
          aria-invalid={!valid}
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
        />
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(TextFieldArea);