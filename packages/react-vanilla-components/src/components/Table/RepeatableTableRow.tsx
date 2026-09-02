// *******************************************************************************
//  * Copyright 2026 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  *
//  * BEM markup follows AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components
//  ******************************************************************************

import React, { useContext } from 'react';
import { AddItem, RemoveItem } from '@aemforms/af-core';
import { FormContext } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel } from '../../utils/withRuleEngine';
import { PROPS_PANEL } from '../../utils/type';
import TableRow from './TableRow';

const RepeatableTableRow = (props: PROPS_PANEL & { headerLabels?: string[] }) => {
  // @ts-ignore
  const { form } = useContext(FormContext);
  const element = form.getElement(props.id);
  const instances = element.getState().items;

  const showAdd = instances.length !== props.maxItems;
  const showRemove = instances.length !== props.minItems;

  return instances.map((instance: any, index: number) => {
    const handleAdd = () => element.dispatch(new AddItem(index + 1));
    const handleRemove = () => element.dispatch(new RemoveItem(index));

    return (
      <TableRow
        key={instance.id}
        {...instance}
        onAdd={handleAdd}
        onRemove={handleRemove}
        showAdd={showAdd}
        showRemove={showRemove}
        headerLabels={props.headerLabels}
      />
    );
  });
};

export default withRuleEnginePanel(RepeatableTableRow);
