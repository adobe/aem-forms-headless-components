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

import Form from '../components/Form';
import TextField from '../components/TextField';
import NumberField from '../components/NumberField';
import Panel from '../components/Panel';
import Button from '../components/Button';
import Repeater from '../components/Repeater';
import Checkbox from '../components/Checkbox';
import CheckboxGroup from '../components/CheckboxGroup';
import RadioGroup from '../components/RadioGroup';
import DropDown from '../components/DropDown';
import PlainText from '../components/PlainText';
import FileUpload from '../components/FileUpload';
import DatePicker from '../components/DatePicker';

export default {
  form: Form,
  'text-input': TextField,
  'multiline-input': TextField,
  'number-input': NumberField,
  panel: Panel,
  button: Button,
  repeater: Repeater,
  checkbox: Checkbox,
  'checkbox-group': CheckboxGroup,
  'radio-group': RadioGroup,
  'drop-down': DropDown,
  'password-input': TextField,
  'plain-text': PlainText,
  'file-input': FileUpload,
  'date-input': DatePicker
};