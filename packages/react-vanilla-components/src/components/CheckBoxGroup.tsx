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
//  *  LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/checkboxgroup/v1/          checkboxgroup/checkboxgroup.html  
//  ******************************************************************************

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const CheckBoxGroup = (props: PROPS) => {
  const { id, label, required, enumNames, enum: enums, value, name, readOnly, visible, enabled, appliedCssClassNames, valid } = props;
  const options = enumNames && enumNames.length ? enumNames : enums || [];
  const orientation = props.layout?.orientation.toUpperCase();

  const getValue = useCallback((value: any) => {
    if (value) {
      if (value instanceof Array) {
        return value;
      }
      return [value];
    }
    return [];
  }, []);

  const newVal = getValue(value);

  const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const checked = event.target.checked;
    let valAdded = [...newVal];
    if (checked) {
      valAdded.push(val);
    }
    if (!checked) {
      valAdded = valAdded.filter((item) => item != val);
    }
    props.dispatchChange(valAdded);
  }, [props.dispatchChange, newVal]);

  return (
    <div
      className={`cmp-adaptiveform-checkboxgroup cmp-adaptiveform-checkboxgroup--${newVal.length ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormCheckBoxGroup"
      id={id}
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-checkboxgroup'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <div
          className={`cmp-adaptiveform-checkboxgroup__widget ${orientation}`}
          id={`${id}-widget`}
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
        >
          {options?.map((item, index: number) => (
            <div className={`cmp-adaptiveform-checkboxgroup-item ${name}`} key={enums![index]}>
              <label className="cmp-adaptiveform-checkboxgroup__option-label">
                <input
                  className={'cmp-adaptiveform-checkboxgroup__option__widget'}
                  type='checkbox'
                  required={required}
                  name={name}
                  value={enums![index]}
                  onChange={changeHandler}
                  readOnly={readOnly}
                  checked={value?.includes(enums?.[index])}
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

export default withRuleEngine(CheckBoxGroup);