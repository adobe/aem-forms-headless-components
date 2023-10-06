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
const react_1 = __importStar(require("react"));
const native_base_1 = require("native-base");
const Repeater = (props) => {
    const { add, remove, index, handlers } = props;
    const addHandler = (0, react_1.useCallback)(() => {
        handlers.dispatchAddItem(index + 1);
    }, [index, handlers.dispatchAddItem]);
    const removeHandler = (0, react_1.useCallback)(() => {
        handlers.dispatchRemoveItem(index);
    }, [index, handlers.dispatchRemoveItem]);
    return (react_1.default.createElement(native_base_1.Button.Group, null,
        add ? react_1.default.createElement(native_base_1.Button, { testID: 'add-button', onPress: addHandler, variant: 'primary' },
            react_1.default.createElement(native_base_1.AddIcon, null)) : react_1.default.createElement(react_1.default.Fragment, null),
        remove ? react_1.default.createElement(native_base_1.Button, { testID: 'remove-button', onPress: removeHandler, variant: 'primary' },
            react_1.default.createElement(native_base_1.MinusIcon, null)) : react_1.default.createElement(react_1.default.Fragment, null)));
};
exports.default = Repeater;
