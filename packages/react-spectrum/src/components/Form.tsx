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

import { FieldsetJson } from '@aemforms/af-core';
import React, {useContext} from 'react';
import { State } from '@aemforms/af-core';
import { useRuleEngine, renderChildren, FormContext } from '@aemforms/af-react-renderer';

const Form = function (fieldset: State<FieldsetJson>) {
  // @ts-ignore
  const context = useContext(FormContext);
  const [props, handlers] = useRuleEngine(fieldset);

  return (
    <form>
      {props?.label?.value ?<h2>{props.label.value}</h2> : null}
      {renderChildren(props, context.mappings, context.modelId, handlers)}
    </form>
  );
};

export default Form;