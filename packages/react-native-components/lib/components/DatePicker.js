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
const react_native_1 = require("react-native");
const react_native_date_picker_1 = __importDefault(require("react-native-date-picker"));
const withRuleEngine_1 = __importDefault(require("../shared/withRuleEngine"));
//@ts-ignore
const af_formatters_1 = require("@aemforms/af-formatters");
//@ts-ignore
const calendar_icon_png_1 = __importDefault(require("../image/calendar-icon.png"));
const DatePickerComponent = function (props) {
    const { isError, required, label, errorMessage, description, value, displayFormat, dispatchChange, dispatchBlur, dispatchFocus } = props;
    const [open, setOpen] = (0, react_1.useState)(false);
    const [typedValue, setTypedValue] = (0, react_1.useState)(value ? value : '');
    const formatDate = (0, react_1.useCallback)((date) => {
        var d = new Date(date);
        const month = d.getMonth() + 1;
        const day = d.getDate();
        return `${d.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    }, []);
    const confirmHandler = (0, react_1.useCallback)((date) => {
        setOpen(false);
        // @ts-ignore
        dispatchChange(formatDate(date));
        setTypedValue((0, af_formatters_1.format)(date, 'en-US', displayFormat));
    }, [dispatchChange]);
    const cancelHandler = (0, react_1.useCallback)(() => {
        setOpen(false);
    }, []);
    const inputProps = {
        placeholder: props.placeholder || '',
        value: typedValue,
        onChangeText: (value) => { setTypedValue(value); },
        onBlur: () => {
            const parsedDate = formatDate((0, af_formatters_1.parse)(typedValue, 'en-US', displayFormat));
            dispatchChange(parsedDate);
            dispatchBlur(parsedDate);
        },
        isReadOnly: props.readOnly === true,
        isRequired: props.required === true,
        isDisabled: props.enabled === false,
        KeyboardTypeOptions: 'default',
        type: 'text'
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(native_base_1.FormControl, { isInvalid: isError, isRequired: required },
            (label === null || label === void 0 ? void 0 : label.visible) && react_1.default.createElement(native_base_1.FormControl.Label, null, label === null || label === void 0 ? void 0 : label.value),
            react_1.default.createElement(native_base_1.Input, Object.assign({}, inputProps, { InputRightElement: (react_1.default.createElement(native_base_1.Button, { onPress: () => setOpen(true), style: styles.button },
                    react_1.default.createElement(native_base_1.Image, { source: calendar_icon_png_1.default, alt: 'calendar', style: styles.calendar }))) })),
            errorMessage ? react_1.default.createElement(native_base_1.FormControl.ErrorMessage, { testID: `${props.id}-error` }, errorMessage) : null,
            description && !errorMessage ? react_1.default.createElement(native_base_1.FormControl.HelperText, { testID: `${props.id}-description` }, description) : null),
        react_1.default.createElement(react_native_date_picker_1.default, { modal: true, open: open, mode: "date", date: value ? new Date(value) : new Date(), onConfirm: confirmHandler, onCancel: cancelHandler })));
};
const styles = react_native_1.StyleSheet.create({
    calendar: {
        width: 31,
        height: 31
    },
    button: {
        backgroundColor: 'transparent',
        height: 31
    }
});
exports.default = (0, withRuleEngine_1.default)(DatePickerComponent);
