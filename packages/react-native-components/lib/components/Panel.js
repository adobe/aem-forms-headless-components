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
Object.defineProperty(exports, "__esModule", { value: true });
const af_core_1 = require("@aemforms/af-core");
const react_1 = __importStar(require("react"));
const af_react_renderer_1 = require("@aemforms/af-react-renderer");
const native_base_1 = require("native-base");
const Panel = function (fieldset) {
    var _a, _b, _c;
    const context = (0, react_1.useContext)(af_react_renderer_1.FormContext);
    const [props, handlers] = (0, af_react_renderer_1.useRuleEngine)(fieldset);
    const translationId = (0, af_core_1.getOrElse)(props, ['properties', 'afs:translationIds', 'label.value']);
    const i18n = (0, af_react_renderer_1.useFormIntl)();
    let localizedLabel = (_a = props === null || props === void 0 ? void 0 : props.label) === null || _a === void 0 ? void 0 : _a.value;
    if (translationId) {
        localizedLabel = i18n.formatMessage({ id: translationId, defaultMessage: (_b = props === null || props === void 0 ? void 0 : props.label) === null || _b === void 0 ? void 0 : _b.value });
    }
    if (props.visible) {
        return (react_1.default.createElement(native_base_1.Box, null,
            ((_c = props.label) === null || _c === void 0 ? void 0 : _c.visible) !== false ? react_1.default.createElement(native_base_1.Text, null, localizedLabel) : null,
            (0, af_react_renderer_1.renderChildren)(props, context.mappings, context.modelId, handlers)));
    }
    else {
        return null;
    }
};
exports.default = Panel;
