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
//  *  LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/switch/v1/switch/switch.html  
//  ******************************************************************************

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const Switch = (props: PROPS) => {
  const {
    id,
    label,
    enum: enums,
    enumNames,
    required,
    value,
    name,
    enabled,
    visible,
    appliedCssClassNames,
    valid
  } = props;

  const selectedValue = enums?.[0];
  const unSelectedValue = (enums?.length || 0) < 2 ? null : enums?.[1];

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.checked ? selectedValue : unSelectedValue;
      props.dispatchChange(val);
    },
    [props.dispatchChange]
  );
  return (
    <div className={`switch checkbox base ${appliedCssClassNames}`}>
      <div
        className={`cmp-adaptiveform-switch cmp-adaptiveform-switch--${
          selectedValue === value ? 'filled' : 'empty'
        }`}
        data-cmp-is="adaptiveFormSwitch"
        id={id}
        data-cmp-visible={visible}
        data-cmp-enabled={enabled}
        data-cmp-required={required}
        data-cmp-valid={valid}
      >
        <FieldWrapper
          bemBlock="cmp-adaptiveform-switch"
          label={label}
          id={id}
          tooltip={props.tooltip}
          description={props.description}
          isError={props.isError}
          errorMessage={props.errorMessage}
        >
          <div className="cmp-adaptiveform-switch__container">
            <span className="cmp-adaptiveform-switch__option cmp-adaptiveform-switch__option--off" aria-label={enumNames?.[1] as string}>
              {enumNames?.[1] || ''}
            </span>
            <label className="cmp-adaptiveform-switch__widget-label">
              <input
                className="cmp-adaptiveform-switch__widget"
                type="checkbox"
                name={name}
                role="switch"
                disabled={!enabled}
                aria-checked={value === selectedValue ? true : false}
                checked={value === selectedValue ? true : false}
                value={value || ''}
                onChange={handleChange}
                aria-invalid={!valid}
                aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
              />
              <div className="cmp-adaptiveform-switch__widget-slider">
                <div className="cmp-adaptiveform-switch__circle-indicator"></div>
              </div>
            </label>
            <span
              className="cmp-adaptiveform-switch__option cmp-adaptiveform-switch__option--on"
              aria-label={enumNames?.[0] as string}
            >
              {enumNames?.[0]}
            </span>
          </div>
        </FieldWrapper>
      </div>
    </div>
  );
};

export default withRuleEngine(Switch);
