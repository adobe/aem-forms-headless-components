/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2023 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/

import React, { JSXElementConstructor } from 'react';
import { State, FieldJson, FieldsetJson, getOrElse, isEmpty, checkIfConstraintsArePresent } from '@aemforms/af-core';
import { useRuleEngine, useFormIntl } from '@aemforms/af-react-renderer';
import sanitizeHTML from 'sanitize-html';
import { FieldViewState } from '../utils/types';

const DEFAULT_ERROR_MESSAGE = 'There is an error in the field';

export const richTextString = (stringMsg = '') => {
  const htmlProp = { __html: sanitizeHTML(stringMsg) };
  return (<span dangerouslySetInnerHTML={htmlProp} />);
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
  return richTextString(description);
};
const getLocalizePlaceholder = (i18n: any, state: FieldViewState) => {
  const placeholderId = getOrElse(state, ['properties', 'afs:translationIds', 'placeholder']);
  const placeholder = placeholderId ? i18n.formatMessage({ id: placeholderId, defaultMessage: state?.placeholder }) : state?.placeholder;
  return placeholder;
};

export function withRuleEngine(Component: JSXElementConstructor<any>) {

  return function WrappedComponent(fieldset: State<FieldJson>) {
    const [state, handlers] = useRuleEngine(fieldset);
    const i18n = useFormIntl();
    const localizeState = {
      ...state,
      description: getLocalizeDescription(i18n, state),
      placeholder: getLocalizePlaceholder(i18n, state),
      label: {
        ...state?.label,
        value: getLocalizeLabel(i18n, state, state?.label?.richText),
        visible: state.label?.visible !== false
      },
      isError: getValidationState(state) === 'invalid',
      errorMessage: formateErrorMessage(state),
      layout: {
        variant: 'outlined',
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
      }
    };
    const visible = typeof state.visible === 'undefined' || state.visible;
    // @ts-ignore
    return visible ? <Component {...localizeState} handlers={handlers} /> : null;
  };

}