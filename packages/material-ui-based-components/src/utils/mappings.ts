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
import Panel from '../components/Panel';
import TextField from '../components/TextField';
import Date from '../components/Date';
import PlainText from '../components/PlainText';
import Title from '../components/Title';
import Image from '../components/Image';
import Rating from '../components/Rating';
import Slider from '../components/Slider';
import TabsVerticalComp from '../components/TabsVerticalComp';
import TabsHorizontalComp from '../components/TabsHorizontalComp';
import Wizard from '../components/Wizard';
import Button from '../components/Button';
import Number from '../components/Number';
import DropDown from '../components/DropDown';
import AutoComplete from '../components/AutoComplete';
import Radiobutton from '../components/Radiobutton';
import CheckboxGroup from '../components/CheckboxGroup';
import Checkbox from '../components/Checkbox';
import Switch from '../components/Switch';
import Accordion from '../components/Accordion';

export default {
  form: Form,
  panel: Panel,
  'text-input': TextField,
  'date-input': Date,
  'plain-text': PlainText,
  'core/fd/components/form/title/v1/title': Title,
  image: Image,
  'core/fd/components/form/rating/v1/rating':Rating,
  'core/fd/components/form/slider/v1/slider':Slider,
  'core/fd/components/form/verticaltabs/v1/verticaltabs': TabsVerticalComp,
  'core/fd/components/form/tabsontop/v1/tabsontop': TabsHorizontalComp,
  'core/fd/components/form/wizard/v1/wizard': Wizard,
  button: Button,
  'number-input': Number,
  'drop-down': DropDown,
  'core/fd/components/form/autocomplete/v1/autocomplete':AutoComplete,
  'radio-group': Radiobutton,
  'checkbox-group': CheckboxGroup,
   checkbox: Checkbox,
  'core/fd/components/form/switch/v1/switch': Switch,
  'password-input': TextField,
  'multiline-input': TextField,
  email:TextField,
  'core/fd/components/form/accordion/v1/accordion': Accordion
};