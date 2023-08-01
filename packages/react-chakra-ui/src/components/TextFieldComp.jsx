import React from "react";
import { useRenderer } from "@aemforms/af-react-renderer";
import {
  Text,
  Input,
  Button,
  Tooltip,
  FormLabel,
  InputGroup,
  FormControl,
  InputRightElement,
  VisuallyHidden
} from "@chakra-ui/react";

const InputWrapper = (props) => {
  const {
    id,
    size = "lg",
    showPassword = true,
    autoComplete = "off",
    errorBorderColor = "crimson",
  } = props;
  return (
    <Input
      id={id}
      size={size}
      autoComplete={autoComplete}
      errorBorderColor={errorBorderColor}
      type={showPassword ? "text" : "password"}
      {...props}
    />
  );
};

const InputGroupWrapper = (props) => {
  const {
    showPassword = false,
    inputTypePassword = false,
    handlerShowHidePassword = () => {},
  } = props;
  return inputTypePassword ? (
    <InputGroup>
      <InputWrapper {...props} />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handlerShowHidePassword}>
          {showPassword ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  ) : (
    <InputWrapper {...props} />
  );
};

const TextFieldComponent = (props) => {
  const {
    id,
    error,
    label,
    value,
    format,
    required,
    readOnly,
    maxLength,
    properties,
    placeholder,
    description,
    errorMessage,
  } = props;

  const { inputType } = properties || {};
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const keyChangeFn = (event) => {
    let thisVal = event.target.value;
    const textValLen = thisVal?.length;
    if (format === "date") {
      if (event?.keyCode && event.keyCode !== 8) {
        if (textValLen === 4 || textValLen === 7) {
          thisVal += "-";
          event.target.value = thisVal;
        }
      }
    } else if (properties?.format === "ssn" || properties?.format === "zip") {
      if (event?.keyCode && event.keyCode !== 8) {
        const zipCheck = properties.format === "zip" && textValLen === 5;
        const ssnCheck =
          properties.format === "ssn" && (textValLen === 3 || textValLen === 7);
        if (ssnCheck || zipCheck) {
          thisVal += "-";
        }
        event.target.value = thisVal;
      }
      const newVal = thisVal.replace(/-/g, "");
      props.onChange(newVal);
      return true;
    }
    props.onChange(thisVal);
  };

  const handleChange = (event) => {
    let thisVal = event.target.value;
    if (maxLength && thisVal.length === maxLength + 1) {
      return;
    }

    keyChangeFn(event);
  };

  const handleKeyDown = (event) => {
    keyChangeFn(event);
  };

  const handleBlur = (event) => {
    props.onBlur(event.target.value);
  };

  const handleFocus = (event) => {
    props.onFocus(event.target.value);
  };

  const checkIsValidField =
    errorMessage !== undefined ? errorMessage.length > 0 : false;

  const component = (
    <InputGroupWrapper
      value={value}
      onBlur={handleBlur}
      isReadOnly={readOnly}
      isRequired={required}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      isInvalid={checkIsValidField}
      handlerShowHidePassword={handleClick}
      inputTypePassword={inputType === "password"}
      showPassword={inputType === "password" ? !!show : true}
      maxLength={props.maxLength}
      minLength={props.minLength}
      pattern={props.pattern}
    />
  );

  return props.visible ? (
    <FormControl isInvalid={error} mb={30}>
      <FormLabel htmlFor={id}>
        {label.visible && label.value} {label.visible && label.value && required ? "*" : ""}
      </FormLabel>
      {description?.length ? (
        <>
          <Tooltip label={description}>{component}</Tooltip>
          <VisuallyHidden>{description}</VisuallyHidden>
        </>
      ) : (
        component
      )}
      <Text mb="8px" color={"crimson"}>
        {errorMessage}
      </Text>
    </FormControl>
  ) : null;
};

export const fieldConvertor = (a, b, f) => {
  const localizedLabel = f('label.value');
  const localizedDescription = f('description');
  const localizedPlaceholder = f('placeholder');
  const errorMsg = f('constraintMessages.required');

  return {
    onBlur: b.dispatchBlur,
    onChange: b.dispatchChange,
    onFocus: b.dispatchFocus,
    ...a,
    label: {
      value: localizedLabel
    },
    description: localizedDescription,
    placeholder: localizedPlaceholder
  };
};

const TextFieldComp = (props) => {
  const renderedComponent = useRenderer(
    props,
    TextFieldComponent,
    fieldConvertor
  );
  return renderedComponent;
};

export default TextFieldComp;
