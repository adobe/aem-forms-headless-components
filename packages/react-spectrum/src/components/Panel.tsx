/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Flex } from '@adobe/react-spectrum';
import {FieldsetJson,State,getOrElse} from '@aemforms/af-core';
import React, {useContext} from 'react';
import {Text} from '@adobe/react-spectrum';

import { useRuleEngine, useFormIntl, renderChildren, FormContext } from '@aemforms/af-react-renderer';

const Panel = function (fieldset: State<FieldsetJson>) {
  // @ts-ignore
  const context = useContext(FormContext);
  const [props, handlers] = useRuleEngine(fieldset);
  const layout = getOrElse(props, 'properties.afs:layout', {});
  const labelLayout = getOrElse(props, 'properties.afs:layout.label', {});
  const translationId = getOrElse(props, ['properties', 'afs:translationIds', 'label.value']);
  const i18n = useFormIntl();
  let localizedLabel = props?.label?.value;
  if (translationId) {
    localizedLabel = i18n.formatMessage({ id: translationId, defaultMessage: props?.label?.value });
  }

  if (props.visible) {
    return (<Flex direction="column" gap="10px" {...layout}>
      <Text {...labelLayout}>{localizedLabel}</Text>
      {renderChildren(props, context.mappings, context.modelId, handlers)}
    </Flex>);
  } else {
    return null;
  }
};

export default Panel;