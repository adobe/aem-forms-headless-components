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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const native_base_1 = require("native-base");
const withRuleEngine_1 = __importDefault(require("../shared/withRuleEngine"));
const TextFieldComponent = function (props) {
    const { isError, required, label, errorMessage, description } = props;
    const changeHandler = (0, react_1.useCallback)((event) => {
        props.dispatchChange(event);
    }, [props.dispatchChange]);
    const blurHandler = (0, react_1.useCallback)((event) => {
        props.dispatchBlur(event);
    }, [props.dispatchBlur]);
    const focusHandler = (0, react_1.useCallback)((event) => {
        props.dispatchFocus(event);
    }, [props.dispatchFocus]);
    const inputProps = {
        placeholder: props.placeholder || '',
        value: props.value == null ? '' : props.value,
        onChangeText: changeHandler,
        onBlur: blurHandler,
        onFocus: focusHandler,
        isReadOnly: props.readOnly === true,
        isRequired: props.required === true,
        isDisabled: props.enabled === false,
        KeyboardTypeOptions: 'default',
        maxLength: props.maxLength,
        minLength: props.minLength,
        pattern: props.pattern,
        type: props[':type'] === 'password-input' ? 'password' : 'text'
    };
    const Comp = props.fieldType === 'multiline-input' ? native_base_1.TextArea : native_base_1.Input;
    return (react_1.default.createElement(native_base_1.FormControl, { isInvalid: isError, isRequired: required },
        (label === null || label === void 0 ? void 0 : label.visible) && react_1.default.createElement(native_base_1.FormControl.Label, null, label === null || label === void 0 ? void 0 : label.value),
        react_1.default.createElement(Comp, Object.assign({}, inputProps)),
        errorMessage && react_1.default.createElement(native_base_1.FormControl.ErrorMessage, { testID: `${props.id}-error` }, errorMessage),
        description && !errorMessage && react_1.default.createElement(native_base_1.FormControl.HelperText, { testID: `${props.id}-description` }, description)));
};
exports.default = (0, withRuleEngine_1.default)(TextFieldComponent);
