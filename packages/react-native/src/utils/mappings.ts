import Form from '../components/Form';
import TextField from '../components/TextField';
import TextAreaField from '../components/TextAreaField';
import NumberField from '../components/NumberField';
import Panel from '../components/Panel';
import Button from '../components/Button';
import Repeater from '../components/Repeater';
import Checkbox from '../components/Checkbox';
import CheckboxGroup from '../components/CheckboxGroup';
import RadioGroup from '../components/RadioGroup';
import DropDown from '../components/DropDown';
import PlainText from '../components/PlainText';
import DataPicker from '../components/DataPicker';
import FileUpload from '../components/FileUpload';

export default {
  form: Form,
  'text-input': TextField,
  'multiline-input': TextAreaField,
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
  'date-input': DataPicker,
  'file-input': FileUpload
};