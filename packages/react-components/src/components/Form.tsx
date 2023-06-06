// *******************************************************************************
//  * Copyright 2022 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the “License”);
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an “AS IS” BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  ******************************************************************************

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