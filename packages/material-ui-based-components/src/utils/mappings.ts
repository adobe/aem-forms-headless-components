import Form from '../components/Form';
import Panel from '../components/Panel';
import TextField from '../components/TextField';
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
  button: Button,
  'number-input': Number,
  'drop-down': DropDown,
  'custom:autocomplete':AutoComplete,
  'radio-group': Radiobutton,
  'checkbox-group': CheckboxGroup,
  checkbox: Checkbox,
  'custom:switch': Switch
  'password-input': TextField,
  'multiline-input': TextField,
  email:TextField,
  'custom:accordion': Accordion
};