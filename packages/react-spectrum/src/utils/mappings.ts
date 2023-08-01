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

import TextField from '../components/TextField';
import Button from '../components/Button';
import Panel from '../components/Panel';
import Checkbox from '../components/Checkbox';
import RadioGroup from '../components/RadioButtonGroup';
import ComboBox from '../components/DropDownList';
import PlainText from '../components/PlainText';
import FileUploadComponent from '../components/FileUpload';
import Repeater from '../components/Repeater';
import NumberField from '../components/NumberField';
import DateField from '../components/Date';
import CheckboxGroup from '../components/CheckboxGroup';
import HorizontalFlex from '../components/flex/HorizontalFlex';
import VerticalFlex from '../components/flex/VerticalFlex';
import HorizontalTab from '../components/tabs/HorizontalTabs';
import VerticalTab from '../components/tabs/VerticalTabs';
import PasswordField from '../components/Password';
import Form from '../components/Form';
import EmailField from '../components/EmailField';

const mappings = {
    'text-input' : TextField,
    'multiline-input' : TextField,
    checkbox : Checkbox,
    button : Button,
    panel : Panel,
    'radio-group' : RadioGroup,
    'number-input' : NumberField,
    email : EmailField,
    'date-input' : DateField,
    'drop-down' : ComboBox,
    'plain-text' : PlainText,
    'file-input' : FileUploadComponent,
    repeater : Repeater,
    'checkbox-group': CheckboxGroup,
    'custom:vertical-flex': VerticalFlex,
    'custom:horizontal-flex': HorizontalFlex,
    'custom:vertical-tab': VerticalTab,
    'custom:horizontal-tab': HorizontalTab,
    'password-input' : PasswordField,
    form: Form
};

export default mappings;
