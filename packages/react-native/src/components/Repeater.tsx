import React, { useCallback } from 'react';
import { Button, AddIcon, MinusIcon } from 'native-base';
import {REPEATER} from '../utils/types';

const Repeater = (props: REPEATER) => {
  
  const { add, remove, index, handlers } = props;
  
  const addHandler = useCallback(() => {
    handlers.dispatchAddItem(index + 1);
  }, [index, handlers.dispatchAddItem]);

  const removeHandler = useCallback(() => {
    handlers.dispatchRemoveItem(index);
  }, [index, handlers.dispatchRemoveItem]);

  return (
    <Button.Group>
      {add ? <Button onPress={addHandler} variant='primary'><AddIcon /></Button> : <></>}
      {remove ? <Button onPress={removeHandler} variant='primary'><MinusIcon /></Button> : <></>}
    </Button.Group>
  );
};

export default Repeater;