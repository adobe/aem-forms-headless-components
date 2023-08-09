import React from "react";
import { Select, Text, FormControl, FormLabel } from "@chakra-ui/react";
import { useRenderer } from "@aemforms/af-react-renderer";

const SelectComponent = (props) => {
  const changeHandler = (event) => {
    props.onChange(parseInt(event.target.value));
  };

  const handleBlur = (event) => {
    props.onBlur(event.target.value);
  };

  const handleFocus = (event) => {
    props.onFocus(event.target.value);
  };

  const { placeholder, required, visible, label, description, errorMessage, enumNames } = props;

  const enums = props.enum || [];
  const options = enumNames?.length ? enumNames : enums;

  if (!visible) {
    return null;
  };

  return (
    <>
      <FormControl isInvalid={errorMessage} isRequired={required}>
      {label?.visible && <FormLabel>{label?.value}</FormLabel>}
        <Select onChange={changeHandler} onBlur={handleBlur} onFocus={handleFocus} placeholder={placeholder} size="lg" mt={2} data-testid="select">
          {options?.length
            ? options.map((optionText, index) => (
                <option value={enums[index]} key={enums[index]} data-testid="select-option">
                  {optionText}
                </option>
              ))
            : null}
        </Select>
        {
          description && !errorMessage && <Text mt="8px" color="gray.500">{description}</Text>
        }
      </FormControl>
    </>
  );
};

export const fieldConvertor = (a, b, f) => {
  return {
    onChange: b.dispatchChange,
    onBlur: b.dispatchBlur,
    onFocus: b.dispatchFocus,
    selectedKey: a.value != null ? a.value + "" : a.value,
    ...a,
  };
};

const SelectComp = (props) => {
  const renderedComponent = useRenderer(
    props,
    SelectComponent,
    fieldConvertor,
    true
  );
  return renderedComponent;
};

export default SelectComp;
