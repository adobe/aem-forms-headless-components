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
const Form_1 = __importDefault(require("../components/Form"));
const TextField_1 = __importDefault(require("../components/TextField"));
const NumberField_1 = __importDefault(require("../components/NumberField"));
const Panel_1 = __importDefault(require("../components/Panel"));
const Button_1 = __importDefault(require("../components/Button"));
const Repeater_1 = __importDefault(require("../components/Repeater"));
const Checkbox_1 = __importDefault(require("../components/Checkbox"));
const CheckboxGroup_1 = __importDefault(require("../components/CheckboxGroup"));
const RadioGroup_1 = __importDefault(require("../components/RadioGroup"));
const DropDown_1 = __importDefault(require("../components/DropDown"));
const PlainText_1 = __importDefault(require("../components/PlainText"));
const FileUpload_1 = __importDefault(require("../components/FileUpload"));
const DatePicker_1 = __importDefault(require("../components/DatePicker"));
exports.default = {
    form: Form_1.default,
    'text-input': TextField_1.default,
    'multiline-input': TextField_1.default,
    'number-input': NumberField_1.default,
    panel: Panel_1.default,
    button: Button_1.default,
    repeater: Repeater_1.default,
    checkbox: Checkbox_1.default,
    'checkbox-group': CheckboxGroup_1.default,
    'radio-group': RadioGroup_1.default,
    'drop-down': DropDown_1.default,
    'password-input': TextField_1.default,
    'plain-text': PlainText_1.default,
    'file-input': FileUpload_1.default,
    'date-input': DatePicker_1.default
};
