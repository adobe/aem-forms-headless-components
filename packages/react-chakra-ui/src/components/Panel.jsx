import React, { useContext } from "react";
import { SimpleGrid, Text } from "@chakra-ui/react";

import {
  FormContext,
  useRuleEngine,
  renderChildren,
  useFormIntl
} from "@aemforms/af-react-renderer";
import { getOrElse } from '@aemforms/af-core';

const Panel = (fieldset) => {
  const context = useContext(FormContext);
  const [props, handlers] = useRuleEngine(fieldset);

  const {
    layout
  } = props?.properties || {};
  const { columns = "", className = "" } = layout || {};

  const translationId = getOrElse(props, ['properties', 'afs:translationIds', 'label.value']);

  const i18n = useFormIntl();
  let localizedLabel = props?.label?.value;
  if (translationId) {
    localizedLabel = i18n.formatMessage({ id: translationId, defaultMessage: props?.label?.value });
  }

  if (props.visible) {
    return (
      <>
      {props.label?.visible !== false ? <Text>{localizedLabel}</Text> : null}
        <SimpleGrid
        columnGap={10}
        columns={columns}
        colorScheme="blue"
        className={className}
      >
        {renderChildren(props, context.mappings, context.modelId, handlers)}
      </SimpleGrid>
      </>

    );
  } else {
    return null;
  }
};

export default Panel;
