// *******************************************************************************
//  * Copyright 2026 Adobe
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
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/passwordinput/v1/passwordinput/passwordinput.html
//  ******************************************************************************

import React, { useCallback, useState } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';
import { syncAriaDescribedBy } from '../utils/utils';

const Password = (props: PROPS) => {
  const { id, value, label, required, readOnly = false, placeholder, minLength, maxLength, enabled, visible, name, appliedCssClassNames, valid } = props;
  const [revealed, setRevealed] = useState(false);

  // The visibility toggle is rendered unless the author explicitly disables it (fd:showHidePassword === false),
  // mirroring PasswordInput.isShowHidePasswordEnabled() which defaults to true in the core component.
  const showHidePasswordEnabled = props.properties?.['fd:showHidePassword'] !== false;
  // autocomplete is author-controlled (new-password / current-password / off); omitted when unset.
  const autoComplete = (props as any).autocomplete;

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchChange(event.target.value);
  }, [props.dispatchChange]);

  const handleBlur = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchBlur(event.target.value);
  }, [props.dispatchBlur]);

  const handleFocus = useCallback(() => {
    props.dispatchFocus();
  }, [props.dispatchFocus]);

  const toggleVisibility = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setRevealed((prev) => !prev);
  }, []);

  const toggleLabel = revealed ? 'Hide password' : 'Show password';

  return (
    <div
      className={`cmp-adaptiveform-passwordinput cmp-adaptiveform-passwordinput--${value ? 'filled' : 'empty'} ${appliedCssClassNames || ''}`}
      data-cmp-is="adaptiveFormPasswordInput"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-required={required}
      data-cmp-readonly={readOnly}
      id={id}
      data-cmp-valid={valid}
    >
      <FieldWrapper
        bemBlock='cmp-adaptiveform-passwordinput'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
      >
        <div className='cmp-adaptiveform-passwordinput__widget-wrapper'>
          <input
            type={revealed ? 'text' : 'password'}
            id={`${id}-widget`}
            className={'cmp-adaptiveform-passwordinput__widget'}
            title={props.tooltipText || ''}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            required={required}
            placeholder={placeholder}
            readOnly={readOnly}
            minLength={minLength}
            maxLength={maxLength}
            disabled={!enabled}
            autoComplete={autoComplete}
            name={name}
            dir="auto"
            aria-invalid={!valid}
            aria-describedby={syncAriaDescribedBy(id, props.tooltip, props.description, props.errorMessage)}
          />
          {showHidePasswordEnabled ? (
            <button
              type="button"
              className={'cmp-adaptiveform-passwordinput__toggle-visibility'}
              data-cmp-hook-adaptiveformpasswordinput="toggleVisibility"
              aria-controls={`${id}-widget`}
              aria-pressed={revealed}
              aria-label={toggleLabel}
              title={toggleLabel}
              onClick={toggleVisibility}
            ></button>
          ) : null}
        </div>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(Password);
