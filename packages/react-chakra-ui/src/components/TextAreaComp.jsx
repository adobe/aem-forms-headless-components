import { Textarea } from "@chakra-ui/react";
import React from "react";
import { useRenderer } from "@aemforms/af-react-renderer";

const TextAreaComponent = ({
  id,
  name,
  size,
  label,
  value,
  format,
  onBlur,
  onFocus,
  visible,
  description,
  required,
  readOnly,
  onChange,
  isInvalid,
  isDisabled,
  placeholder,
}) => {
  const inputProps = {
    id,
    size,
    name,
    value,
    onBlur,
    readOnly,
    label,
    required,
    onFocus,
    onChange,
    isInvalid,
    description,
    isDisabled,
    placeholder,
    type: format || "text",
  };

  const handleBlur = event => onBlur(event.target.value);
  const handleChange = event => onChange(event.target.value);
  const handleFocus = event => onFocus(event.target.value);

  return visible ? (
    <>
      {label.visible && label.value ? <div>{required ? `${label.value} *` : label.value}</div> : ""}
      <Textarea {...inputProps} onBlur={handleBlur} onChange={handleChange} onFocus={handleFocus} />
    </>
  ) : null;
};

const TextAreaComp = props => useRenderer(props, TextAreaComponent, (a, b) => ({
    onBlur: b.dispatchBlur,
    onChange: b.dispatchChange,
    onFocus: b.dispatchFocus,
    ...a,
  }));

export default TextAreaComp;
