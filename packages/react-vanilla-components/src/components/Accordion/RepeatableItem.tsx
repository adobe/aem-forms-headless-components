import React, { useContext } from 'react';
import {AddItem, RemoveItem} from '@aemforms/af-core';
import {FormContext} from '@aemforms/af-react-renderer';
import { withRuleEnginePanel }  from '../../utils/withRuleEngine';
import Item from './Item';
import { PROPS_PANEL } from '../../utils/type';

const RepeatableItem = (props:PROPS_PANEL) => {
      // @ts-ignore
    const {form} = useContext(FormContext);
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
            <Item {...item} onAdd={addPanel} onRemove={removePanel} isRepeatable showAddButton={showAddButton} showDeleteButton=
            {showDeleteButton}/>
         ))
      );
};

export default withRuleEnginePanel(RepeatableItem);