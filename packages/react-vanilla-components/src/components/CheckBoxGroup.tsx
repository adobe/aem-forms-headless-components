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

const CheckBoxGroup = (props: PROPS) => {
  const { id, label, required, enumNames, enum: enums, value, name, readOnly, visible, enabled, appliedCssClassNames } = props;
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
      className={`cmp-adaptiveform-checkboxgroup ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormCheckBoxGroup"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
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
        >
          {options?.map((item: string, index: number) => (
            <div className={`cmp-adaptiveform-checkboxgroup-item ${name}`} key={item}>
              <label className="cmp-adaptiveform-checkboxgroup__option-label">
                <input
                  className={`cmp-adaptiveform-checkboxgroup__option__widget cmp-adaptiveform-checkboxgroup__option__widget--${newVal[index] === enums![index] ? 'filled' : 'empty'}`}
                  type='checkbox'
                  required={required}
                  name={name}
                  value={enums![index]}
                  onChange={changeHandler}
                  readOnly={readOnly}
                />
                <span>{item}</span>
              </label>
            </div>
          ))}
        </div>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(CheckBoxGroup);