/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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

const mappings = {
  'text-input': TextField,
  'multiline-input': TextField,
  checkbox: Checkbox,
  button: Button,
  panel: Panel,
  'radio-group': RadioGroup,
  'number-input': NumberField,
  'date-input': DateField,
  'drop-down': ComboBox,
  'plain-text': PlainText,
  'file-input': FileUploadComponent,
  repeater: Repeater,
  'checkbox-group': CheckboxGroup,
  'custom:vertical-flex': VerticalFlex,
  'custom:horizontal-flex': HorizontalFlex,
  'custom:vertical-tab': VerticalTab,
  'custom:horizontal-tab': HorizontalTab,
  'password-input': PasswordField,
  form: Form
};

export default mappings;
