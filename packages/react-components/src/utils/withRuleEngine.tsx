// *******************************************************************************
//  * Copyright 2022 Adobe
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

import React, { JSXElementConstructor } from 'react';
import { State, FieldJson, FieldsetJson, getOrElse, isEmpty, checkIfConstraintsArePresent } from '@aemforms/af-core';
import { useRuleEngine, useFormIntl } from '@aemforms/af-react-renderer';
import sanitizeHTML from 'sanitize-html';
import { FieldViewState } from './type';
const DEFAULT_ERROR_MESSAGE = 'There is an error in the field';

export const richTextString = (stringMsg = '') => {
  const htmlProp = { __html: sanitizeHTML(stringMsg) };
  return (<div dangerouslySetInnerHTML={htmlProp} />);
};
const formateErrorMessage = (state: FieldViewState) => {
  const errorMessage = state.errorMessage === '' && state.valid === false ? DEFAULT_ERROR_MESSAGE : state.errorMessage;
  return errorMessage;
};
const getValidationState = (state: FieldViewState) => {
  const optionalValidation = !checkIfConstraintsArePresent(state) && state.type === 'string';
  const validationState = state.valid === false ? 'invalid' : ((state.valid === undefined || isEmpty(state.value) || optionalValidation) ? undefined : 'valid');
  return validationState;
};
const getLocalizeLabel = (i18n: any, state: FieldViewState, richText: boolean | undefined) => {
  const labelId = getOrElse(state, ['properties', 'afs:translationIds', 'label.value']);
  const label = labelId ? i18n.formatMessage({ id: labelId, defaultMessage: state?.label?.value }) : state?.label?.value;
  return richText ? richTextString(label) : label;
};
const getLocalizeDescription = (i18n: any, state: FieldViewState) => {
  const descriptionId = getOrElse(state, ['properties', 'afs:translationIds', 'description']);
  const description = descriptionId ? i18n.formatMessage({ id: descriptionId, defaultMessage: state?.description }) : state?.description;
  return description ? richTextString(description) : null;
};
const getLocalizePlaceholder = (i18n: any, state: FieldViewState) => {
  const placeholderId = getOrElse(state, ['properties', 'afs:translationIds', 'placeholder']);
  const placeholder = placeholderId ? i18n.formatMessage({ id: placeholderId, defaultMessage: state?.placeholder }) : state?.placeholder;
  return placeholder;
};

const getToolTip = (state: FieldViewState) => {
   return state.tooltip ? richTextString(state.tooltip) : null;  
};
export function withRuleEngine(Component: JSXElementConstructor<any>) {
  return function WrappedComponent(fieldset: State<FieldJson>) {
    const [state, handlers] = useRuleEngine(fieldset);
    const i18n = useFormIntl();
    const localizeState = {
      ...state,
      description: getLocalizeDescription(i18n, state),
      placeholder: getLocalizePlaceholder(i18n, state),
      tooltip: getToolTip(state),
      label: {
        ...state?.label,
        value: getLocalizeLabel(i18n, state, state?.label?.richText),
        visible: state.label?.visible !== false
      },
      isError: getValidationState(state) === 'invalid',
      errorMessage: formateErrorMessage(state),
      layout: {
        orientation: 'horizontal',
        ...(getOrElse(state, ['properties',  'afs:layout'], {}))
      }
    };
    const visible = typeof state.visible === 'undefined' || state.visible;
    // @ts-ignore
    return visible ? <div className='field'><Component {...localizeState} {...handlers} /></div> : null;
  };
}

export function withRuleEnginePanel(Component: JSXElementConstructor<any>) {
    return function WrappedComponent(fieldset: State<FieldsetJson>) {
      const [state, handlers] = useRuleEngine(fieldset);
      const i18n = useFormIntl();
      const localizeState = {
        ...state,
        label: {
          ...state?.label,
          value: getLocalizeLabel(i18n, state, state?.label?.richText),
          visible: state.label?.visible !== false
        },
        description: getLocalizeDescription(i18n, state),
        tooltip: getToolTip(state)
      };
      const visible = typeof state.visible === 'undefined' || state.visible;
      // @ts-ignore
      return visible ? <Component {...localizeState} handlers={handlers} /> : null;
    };
  }
