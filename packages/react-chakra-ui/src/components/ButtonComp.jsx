import { Button } from "@chakra-ui/react";
import { useRenderer } from "@aemforms/af-react-renderer";
import React from "react";
const ButtonComponent = ({
  label,
  onClick,
  enabled,
  properties,
  visible
}) => {

  const handleClick = (event) => {
    onClick(event);
  };
  if (!visible) {
    return null;
  }
  return (
    <Button
      size="md"
      height="48px"
      width={properties?.marginTnB === false ? "25%" : "100%"}
      border="2px"
      colorScheme="blue"
      onClick={handleClick}
      className={properties?.className}
      isDisabled={!enabled}
      mt={properties?.marginTnB === false ? "0" : "30"}
      mb={properties?.marginTnB === false ? "0" : "30"}
    >
      {label.visible && label.value}
    </Button>
  );
};

export const fieldConvertor = (a, b, f) => {
  return {
    onClick: (e) => {
      b.dispatchClick();
    },
    ...a,
  };
};

const LoanButtonComp = (props) => {
  const renderedComponent = useRenderer(props, ButtonComponent, fieldConvertor);
  return renderedComponent;
};

export default LoanButtonComp;
