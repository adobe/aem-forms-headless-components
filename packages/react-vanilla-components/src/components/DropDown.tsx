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

const DropDown = (props: PROPS) => {
  const { id, enum: enums, enumNames, label, value, placeholder, name, enabled, visible, appliedCssClassNames } = props;
  const dropValue = enumNames && enumNames.length ? enumNames : enums || [];

  const changeHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    props.dispatchChange(val);
  }, [props.dispatchChange]);

  return (
    <div
      className={`cmp-adaptiveform-dropdown cmp-adaptiveform-dropdown--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormDropDown"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
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
          disabled={!enabled}
        >
          <option value="" disabled selected>{placeholder}</option>
          {
            dropValue?.map((item: string, index: number) => {
              return <option className="cmp-adaptiveform-dropdown__option" key={item} value={enums![index]}>{item}</option>;
            })
          };
        </select>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(DropDown);