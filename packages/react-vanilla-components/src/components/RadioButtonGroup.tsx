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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/radiobutton/v1/radiobutton/radiobutton.html
//  ******************************************************************************

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const RadioButtonGroup = (props: PROPS) => {
  const { id, label, required, enumNames, enum: enums, name, visible, enabled, value, readOnly, appliedCssClassNames, valid } = props;
  const options = enumNames && enumNames.length ? enumNames : enums || [];
  const orientation = props.layout?.orientation.toUpperCase();

  const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    props.dispatchChange(val);
  }, [props.dispatchChange]);

  return (
    <div
      className={`cmp-adaptiveform-radiobutton cmp-adaptiveform-radiobutton--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormRadioButton"
      id={id}
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-radiobutton'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <div
          className={`cmp-adaptiveform-radiobutton__widget ${orientation}`}
          id={`${id}-widget`}
          role="radiogroup"
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
        >
          {options?.map((item, index: number) => (
            <div className="cmp-adaptiveform-radiobutton__option" key={enums![index]}>
              <label className="cmp-adaptiveform-radiobutton__option-label">
                <input
                  className={'cmp-adaptiveform-radiobutton__option__widget'}
                  type='radio'
                  required={required}
                  name={name}
                  value={enums![index]}
                  onChange={changeHandler}
                  readOnly={readOnly}
                  aria-checked={value === enums![index] ? 'true' : 'false'}
                  checked={value?.length ? value?.includes(enums?.[index]) : null}
                  aria-invalid={!valid}
                />
                {item}
              </label>
            </div>
          ))}
        </div>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(RadioButtonGroup);