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
//  * LINK-https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/numberinput/v1/numberinput/numberinput.html
//  ******************************************************************************

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const NumberField = (props: PROPS) => {
  const { id, label, value, required, placeholder, name, maximum, minimum, readOnly, visible, enabled, appliedCssClassNames, valid } = props;

  const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchChange(event.target.value);
  }, [props.dispatchChange]);

  const handleBlur = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchBlur(event.target.value);
  }, [props.dispatchBlur]);

  const handleFocus = useCallback(() => {
    props.dispatchFocus();
  }, [props.dispatchFocus]);

  return (
    <div
      className={`cmp-adaptiveform-numberinput cmp-adaptiveform-numberinput--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormNumberInput"
      id={id}
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-numberinput'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <input
          id={`${id}-widget`}
          type='number'
          className={'cmp-adaptiveform-numberinput__widget'}
          value={value}
          onChange={changeHandler}
          required={required}
          placeholder={placeholder}
          name={name}
          min={minimum}
          max={maximum}
          readOnly={readOnly}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={!valid}
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
        />
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(NumberField);