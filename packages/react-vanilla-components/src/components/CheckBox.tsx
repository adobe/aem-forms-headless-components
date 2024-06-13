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
//  ******************************************************************************

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const CheckBox = (props: PROPS) => {
  const { id, label, enum: enums, required, value, name, readOnly, enabled, visible, appliedCssClassNames, valid } = props;
  const selectedValue = enums?.[0];
  const unSelectedValue = (enums?.length || 0) < 2 ? null : enums?.[1];

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked ? selectedValue : unSelectedValue;
    props.dispatchChange(val);
  }, [props.dispatchChange]);

  return (
    <div
      className={`cmp-adaptiveform-checkbox cmp-adaptiveform-checkbox--${selectedValue === value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormCheckBox"
      id={id}
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-checkbox'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
        onlyQuestionMark
      >
        <div className="cmp-adaptiveform-checkbox__widget-container">
          <input
            id={`${id}-widget`}
            type='checkbox'
            className={'cmp-adaptiveform-checkbox__widget'}
            onChange={handleChange}
            value={value}
            checked={selectedValue === value ? true : false}
            name={name}
            required={required}
            readOnly={readOnly}
            disabled={!enabled}
            aria-checked={selectedValue === value ? 'true' : 'false'} aria-invalid={!valid}
            aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
          />
          {label?.visible && <label className="cmp-adaptiveform-checkbox__label" htmlFor={`${id}-widget`}>{label?.value}</label>}
        </div>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(CheckBox);