// *******************************************************************************
//  * Copyright 2026 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  *
//  * BEM markup follows AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components
//  ******************************************************************************

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

// datetime-local requires "YYYY-MM-DDTHH:MM". af-core may surface the default
// or user-entered value with a space separator ("YYYY-MM-DD HH:MM:SS"), so we
// normalise to the T-separated format and strip seconds.
const toDateTimeLocalValue = (val: string | undefined): string => {
  if (!val) { return ''; }
  const normalised = val.replace(' ', 'T');
  return normalised.length > 16 ? normalised.slice(0, 16) : normalised;
};

const datetime = (props: PROPS) => {
  const {
    id, label, value, required, name, readOnly,
    placeholder, visible, enabled, appliedCssClassNames, valid, minimum, maximum
  } = props;

  const finalValue = toDateTimeLocalValue(value as string | undefined);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchChange(e.target.value);
  }, [props.dispatchChange]);

  const handleFocus = useCallback(() => {
    props.dispatchFocus();
  }, [props.dispatchFocus]);

  const handleBlur = useCallback(() => {
    props.dispatchBlur();
  }, [props.dispatchBlur]);

  return (
    <div
      className={`cmp-adaptiveform-datetime cmp-adaptiveform-datetime--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormDatetime"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-datetime'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <div className='cmp-adaptiveform-datetime__input-wrapper'>
          <input
            type='datetime-local'
            id={`${id}-widget`}
            className='cmp-adaptiveform-datetime__widget'
            title={props.tooltipText || ''}
            value={finalValue}
            name={name}
            required={required}
            min={minimum}
            max={maximum}
            readOnly={readOnly}
            placeholder={placeholder}
            disabled={!enabled}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label={label?.value}
            aria-invalid={!valid}
            aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
          />
        </div>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(datetime);
