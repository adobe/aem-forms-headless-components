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
const react_native_1 = require("react-native");
const native_base_1 = require("native-base");
const react_native_render_html_1 = __importDefault(require("react-native-render-html"));
const withRuleEngine_1 = __importDefault(require("../shared/withRuleEngine"));
const PlainTextComponent = function (props) {
    const { width } = (0, react_native_1.useWindowDimensions)();
    if (props.richText) {
        return (react_1.default.createElement(react_native_render_html_1.default, { contentWidth: width, source: { html: props === null || props === void 0 ? void 0 : props.value } }));
    }
    else {
        return (react_1.default.createElement(native_base_1.Text, null, props.value || ''));
    }
};
exports.default = (0, withRuleEngine_1.default)(PlainTextComponent);
