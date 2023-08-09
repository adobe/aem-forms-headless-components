import React from "react";
import { useRenderer } from "@aemforms/af-react-renderer";
import { Radio, RadioGroup, Stack, Text, FormLabel } from "@chakra-ui/react";

const RadioGrpComponent = (props) => {
  let isInvalid = false;
  const { errorMessage, label, required, value, valid, visible, enumNames } = props;
  const onChange = (value) => props.onChange(value);

  const enums = props.enum || [];
  const options = enumNames?.length ? enumNames : enums;

  if (errorMessage) {
    isInvalid = errorMessage?.length > 0 ? true : false;
  }

  if (!visible) {
    return null;
  }
  return (
    <>
      <FormLabel>
        {label.visible && label.value} {label.visible && label.value && required ? "*" : ""}
      </FormLabel>
      <RadioGroup onChange={onChange} value={value}>
        <Stack direction="row">
          {options?.length > 0
            ? options.map((value, index) => {
                const _props = {
                  isInvalid,
                  key: enums[index],
                  value: enums[index],
                };
                return <Radio {..._props}>{value}</Radio>;
              })
            : null} 
        </Stack>
      </RadioGroup>
      <Text mt="8px" color="crimson">
        {errorMessage}
      </Text>
    </>
  );
};

export const fieldConvertor = (a, b, f) => {
  return {
    onChange: b.dispatchChange,
    ...a,
  };
};

const RadioComp = (props) => {
  const renderedComponent = useRenderer(
    props,
    RadioGrpComponent,
    fieldConvertor
  );
  return renderedComponent;
};

export default RadioComp;
