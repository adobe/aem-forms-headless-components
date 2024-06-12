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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/datepicker/v1/datepicker/datepicker.html
//  ******************************************************************************

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const DateInput = (props: PROPS) => {
  const { id, label, value, required, name, readOnly, placeholder, visible, enabled, appliedCssClassNames, valid } = props;
  const finalValue = value === undefined ? '' : value;

  const changeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    props.dispatchChange(val);
  }, [props.dispatchChange]);

  const handleFocus = useCallback(() => {
    props.dispatchFocus();
  }, [props.dispatchFocus]);

  const handleBlur = useCallback(() => {
    props.dispatchBlur();
  }, [props.dispatchBlur]);

  return (
    <div
      className={`cmp-adaptiveform-datepicker cmp-adaptiveform-datepicker--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormDatePicker"
      id={id}
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-datepicker'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <input
          type='date'
          id={`${id}-datePicker`}
          value={finalValue}
          name={name}
          required={required}
          onChange={changeHandler}
          className={'cmp-adaptiveform-datepicker__widget'}
          aria-label={label?.value}
          readOnly={readOnly}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={!valid}
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
        />
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(DateInput);