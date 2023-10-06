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
const native_base_1 = require("native-base");
const af_core_1 = require("@aemforms/af-core");
const withRuleEngine_1 = __importDefault(require("../shared/withRuleEngine"));
const FileUpload_1 = __importDefault(require("../shared/FileUpload"));
const FileUploadComponent = function (props) {
    const { isError, required, label, errorMessage, description, type, accept, value, maxFileSize, dispatchChange } = props;
    const fileUploadProps = {
        value: value && ((value instanceof Array) ? value : [value]),
        onChange: dispatchChange,
        accept: accept || [],
        multiple: type === 'file[]' || type === 'string[]',
        maxFileSizeInBytes: (0, af_core_1.getFileSizeInBytes)(maxFileSize) || 500000000
    };
    return (react_1.default.createElement(native_base_1.FormControl, { isInvalid: isError, isRequired: required },
        (label === null || label === void 0 ? void 0 : label.visible) && react_1.default.createElement(native_base_1.FormControl.Label, null, label === null || label === void 0 ? void 0 : label.value),
        react_1.default.createElement(FileUpload_1.default, Object.assign({}, fileUploadProps)),
        errorMessage ? react_1.default.createElement(native_base_1.FormControl.ErrorMessage, { testID: `${props.id}-error` }, errorMessage) : null,
        description && !errorMessage ? react_1.default.createElement(native_base_1.FormControl.HelperText, { testID: `${props.id}-description` }, description) : null));
};
exports.default = (0, withRuleEngine_1.default)(FileUploadComponent);
