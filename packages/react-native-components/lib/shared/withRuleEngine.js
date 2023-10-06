"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const af_core_1 = require("@aemforms/af-core");
const af_react_renderer_1 = require("@aemforms/af-react-renderer");
const DEFAULT_ERROR_MESSAGE = 'There is an error in the field';
const formateErrorMessage = (state) => {
    const errorMessage = state.errorMessage === '' && state.valid === false ? DEFAULT_ERROR_MESSAGE : state.errorMessage;
    return errorMessage;
};
const getValidationState = (state) => {
    const optionalValidation = !(0, af_core_1.checkIfConstraintsArePresent)(state) && state.type === 'string';
    const validationState = state.valid === false ? 'invalid' : ((state.valid === undefined || (0, af_core_1.isEmpty)(state.value) || optionalValidation) ? undefined : 'valid');
    return validationState;
};
const getLocalizeLabel = (i18n, state) => {
    var _a, _b;
    const labelId = (0, af_core_1.getOrElse)(state, ['properties', 'afs:translationIds', 'label.value']);
    const label = labelId ? i18n.formatMessage({ id: labelId, defaultMessage: (_a = state === null || state === void 0 ? void 0 : state.label) === null || _a === void 0 ? void 0 : _a.value }) : (_b = state === null || state === void 0 ? void 0 : state.label) === null || _b === void 0 ? void 0 : _b.value;
    return label;
};
const getLocalizeDescription = (i18n, state) => {
    const descriptionId = (0, af_core_1.getOrElse)(state, ['properties', 'afs:translationIds', 'description']);
    const description = descriptionId ? i18n.formatMessage({ id: descriptionId, defaultMessage: state === null || state === void 0 ? void 0 : state.description }) : state === null || state === void 0 ? void 0 : state.description;
    return description;
};
const getLocalizePlaceholder = (i18n, state) => {
    const placeholderId = (0, af_core_1.getOrElse)(state, ['properties', 'afs:translationIds', 'placeholder']);
    const placeholder = placeholderId ? i18n.formatMessage({ id: placeholderId, defaultMessage: state === null || state === void 0 ? void 0 : state.placeholder }) : state === null || state === void 0 ? void 0 : state.placeholder;
    return placeholder;
};
function withRuleEngine(Component) {
    return function WrappedComponent(fieldset) {
        var _a;
        const [state, handlers] = (0, af_react_renderer_1.useRuleEngine)(fieldset);
        const i18n = (0, af_react_renderer_1.useFormIntl)();
        const localizeState = Object.assign(Object.assign({}, state), { description: getLocalizeDescription(i18n, state), placeholder: getLocalizePlaceholder(i18n, state), label: Object.assign(Object.assign({}, state === null || state === void 0 ? void 0 : state.label), { value: getLocalizeLabel(i18n, state), visible: ((_a = state.label) === null || _a === void 0 ? void 0 : _a.visible) !== false }), isError: getValidationState(state) === 'invalid', errorMessage: formateErrorMessage(state) });
        const visible = typeof state.visible === 'undefined' || state.visible;
        return visible ? react_1.default.createElement(Component, Object.assign({}, localizeState, handlers)) : null;
    };
}
exports.default = withRuleEngine;
