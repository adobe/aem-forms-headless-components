import { FieldsetJson, State, getOrElse } from '@aemforms/af-core';
import React, { useContext } from 'react';
import { useRuleEngine, useFormIntl, renderChildren, FormContext } from '@aemforms/af-react-renderer';
import { Box, Text } from 'native-base';

const Panel = function (fieldset: State<FieldsetJson>) {
  const context = useContext(FormContext);
  const [props, handlers] = useRuleEngine(fieldset);
  const translationId = getOrElse(props, ['properties', 'afs:translationIds', 'label.value']);
  const i18n = useFormIntl();
  let localizedLabel = props?.label?.value;
  if (translationId) {
    localizedLabel = i18n.formatMessage({ id: translationId, defaultMessage: props?.label?.value });
  }

  if (props.visible) {
    return (
      <Box>
        <Text>{localizedLabel}</Text>
        {renderChildren(props, context.mappings, context.modelId, handlers)}
      </Box>);
  } else {
    return null;
  }
};

export default Panel;