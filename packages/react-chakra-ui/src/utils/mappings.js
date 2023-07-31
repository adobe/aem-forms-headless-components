import TextField from "../generic_components/TextFieldComp";
import DateField from "../components/DateFieldComp";
import ButtonComp from "../generic_components/ButtonComp";
import CheckBoxComp from "../generic_components/CheckBoxComp";
import TextAreaComp from "../generic_components/TextAreaComp";
import Panel from "../generic_components/Panel";
import CustomPanel from "../components/CustomPanel";
import CustomText from "../components/CustomText";
import CustomTextButton from "../components/CustomTextButton";
import CustomHeading from "../components/CustomHeading";
import SelectComp from "../generic_components/SelectComp";
import VerticalContainer from "../components/VerticalContainer";
import HorizontalWrap from "../components/HorizontalWrap";
import CheckBoxGroup from "../components/CheckBoxGroup";
import TabsComp from "../components/TabsComp";
import RadioComp from "../generic_components/RadioComp";
import AccordionComp from "../generic_components/AccordionComp";
import LoanButtonComp from "../components/LoanButtonComp"; 
import CustomTextAreaComp from "../components/CustomTextArea";
import Form from "../components/Form";

const myMapping = {
  "text-input": TextField,
  "date-input": DateField,
  "number-input": TextField,
  "multiline-input": TextAreaComp,
  checkbox: CheckBoxComp,
  "checkbox-group": CheckBoxGroup,
  button: ButtonComp,
  panel: Panel,
  "custom:panel": CustomPanel,
  "custom:loanButton": LoanButtonComp,
  "drop-down": SelectComp,
  "radio-group": RadioComp,
  "custom:static/text": CustomText,
  "custom:static/textButton": CustomTextButton,
  "custom:static/heading": CustomHeading,
  "custom:vertical-flex": VerticalContainer,
  "custom:horizontal-flex": HorizontalWrap,
  "custom:vertical-tab": TabsComp,
  "custom:accordion": AccordionComp,
  "custom:accordionItem": CustomTextAreaComp,
  form: Form
};
export default myMapping;
