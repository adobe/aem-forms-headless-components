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

import React, { useContext } from 'react';
import { renderChildren, FormContext } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel } from '../shared/withRuleEngine';
import { PROPS_PANEL } from '../utils/types';

const Panel = function (props: PROPS_PANEL) {
  const { handlers, ...restProps } = props;
  // @ts-ignore
  const context = useContext(FormContext);
  return (
    <div>
      {restProps?.label?.visible ? <div>{restProps.label.value}</div> : null}
      {renderChildren(restProps, context.mappings, context.modelId, handlers)}
    </div>
  );
};

export default withRuleEnginePanel(Panel);