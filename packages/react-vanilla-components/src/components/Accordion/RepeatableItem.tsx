// *******************************************************************************
//  * Copyright 2023 Adobe
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

import React, { useContext } from 'react';
import { AddItem, RemoveItem } from '@aemforms/af-core';
import { FormContext } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel } from '../../utils/withRuleEngine';
import Item from './Item';
import { PROPS_PANEL } from '../../utils/type';

const RepeatableItem = (props: PROPS_PANEL) => {
  // @ts-ignore
  const { form } = useContext(FormContext);
  const element = form.getElement(props.id);
  const repeatableItem = element.getState().items;

  const addPanel = () => {
    element.dispatch(new AddItem());
  };

  const removePanel = () => {
    element.dispatch(new RemoveItem());
  };

  const showAddButton = (repeatableItem.length !== props.maxItems);

  const showDeleteButton = (repeatableItem.length !== props.minItems);

  return (
    repeatableItem.map((item: any) => (
      <Item key={`${item.id}-repeatable`} {...item} onAdd={addPanel} onRemove={removePanel} isRepeatable showAddButton={showAddButton} showDeleteButton=
        {showDeleteButton} />
    ))
  );
};

export default withRuleEnginePanel(RepeatableItem);