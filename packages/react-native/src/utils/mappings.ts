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
  'file-input': FileUpload
};