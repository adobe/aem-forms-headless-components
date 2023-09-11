// *******************************************************************************
//  * Copyright 2023 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the “License”);
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an “AS IS” BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  ******************************************************************************

import Button from '../components/Button';
import CheckBox from '../components/CheckBox';
import CheckBoxGroup from '../components/CheckBoxGroup';
import DropDown from '../components/DropDown';
import Number from '../components/Number';
import RadioGroup from '../components/RadioButton';
import TextField from '../components/TextField';
import Panel from '../components/Panel';
import Wizard from '../components/Wizard';
import Accordion from '../components/Accordion';
import HorizontalTab from '../components/HorizontalTabs';
import VerticalTab from '../components/VerticalTabs';
import Form from '../components/Form';
import Image from '../components/Image';
import PlainText from '../components/PlainText';

const mappings = {
  'text-input': TextField,
  'password-input': TextField,
  'multiline-input': TextField,
  panel: Panel,
  'checkbox-group': CheckBoxGroup,
  'radio-group': RadioGroup,
  'drop-down': DropDown,
  'number-input': Number,
  button: Button,
  checkbox: CheckBox,
  image: Image,
  'core/fd/components/form/wizard/v1/wizard': Wizard,
  'core/fd/components/form/accordion/v1/accordion': Accordion,
  'core/fd/components/form/tabsontop/v1/tabsontop': HorizontalTab,
  'core/fd/components/form/verticaltabs/v1/verticaltabs': VerticalTab,
  'plain-text': PlainText,
  'core/fd/components/form/panelcontainer/v1/panelcontainer': Panel,
  form: Form
};

export default mappings;