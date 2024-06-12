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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/dropdown/v1/dropdown/dropdown.html
//  ******************************************************************************

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const DropDown = (props: PROPS) => {
  const { id, enum: enums, enumNames, label, value, placeholder, name, required, enabled, visible, appliedCssClassNames, valid } = props;
  const dropValue = enumNames && enumNames.length ? enumNames : enums || [];

  const changeHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    props.dispatchChange(val);
  }, [props.dispatchChange]);

  return (
    <div
      className={`cmp-adaptiveform-dropdown cmp-adaptiveform-dropdown--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormDropDown"
      id={id}
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-dropdown'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <select
          id={`${id}-widget`}
          data-testid='select'
          name={name}
          title={label?.value}
          className={'cmp-adaptiveform-dropdown__widget'}
          onChange={changeHandler}
          value={value}
          required={required}
          disabled={!enabled}
          defaultValue={'DEFAULT'}
          aria-invalid={!valid}
          aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
        >
          <option value="DEFAULT" disabled>{placeholder}</option>
          {
            dropValue?.map((item, index: number) => {
              return <option className="cmp-adaptiveform-dropdown__option" key={enums![index]} value={enums![index]}>{item}</option>;
            })
          };
        </select>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(DropDown);