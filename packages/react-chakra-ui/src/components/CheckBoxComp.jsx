import { Checkbox, FormControl } from "@chakra-ui/react";
import { useRenderer } from "@aemforms/af-react-renderer";
import React from "react";

const CheckboxComponent = (props) => {
  const { onChange, label, validationState, visible, properties, required, disabled } = props;

  const changeHandler = (e = {}) => {
    e.target.value = e.target.checked;
    onChange(e.target.value);

    return [e.target.value];
  };

  const isInvalid = validationState === "invalid";

  return visible ? (
    <FormControl isInvalid={isInvalid} isRequired={required}>
      <Checkbox
        mb={10}
        size="lg"
        colorScheme={properties.color}
        isDisabled={disabled}
        onChange={changeHandler}
        defaultChecked={props.default}
      >
        {label.visible && label.value}
      </Checkbox>
    </FormControl>

  ) : null;
};

export const fieldConvertor = (a, b, f) => {
  const value = a.value;
  const index = value === false ? 0 : 1;
  const selectedValue = a.enum?.[index];
  return {
    onChange: b.dispatchChange,
    isSelected: value !== undefined && value === selectedValue,
    ...a,
  };
};

const CheckBoxComp = (props) => {
  const renderedComponent = useRenderer(
    props,
    CheckboxComponent,
    fieldConvertor
  );
  return renderedComponent;
};

export default CheckBoxComp;
