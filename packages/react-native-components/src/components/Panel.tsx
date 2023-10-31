/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2023 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/

import { FieldsetJson, State, getOrElse } from '@aemforms/af-core';
import React, { useContext } from 'react';
import { useRuleEngine, useFormIntl, renderChildren, FormContext } from '@aemforms/af-react-renderer';
import { Box, Text } from 'native-base';

const Panel = function (fieldset: State<FieldsetJson>) {
  // @ts-ignore
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
      // @ts-ignore
      <Box>
        {
        props.label?.visible !== false ?
        // @ts-ignore
        <Text>{localizedLabel}</Text> : null
        }
        {renderChildren(props, context.mappings, context.modelId, handlers)}
      </Box>);
  } else {
    return null;
  }
};

export default Panel;