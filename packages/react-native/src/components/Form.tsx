import { FieldsetJson } from '@aemforms/af-core';
import React, {useContext} from 'react';
import { State } from '@aemforms/af-core';
import { useRuleEngine, renderChildren, FormContext } from '@aemforms/af-react-renderer';
import { Text } from 'react-native';

const Form = function (fieldset: State<FieldsetJson>) {
  const context = useContext(FormContext);
  const [props, handlers] = useRuleEngine(fieldset);
  return (
    <>
      {props?.label?.value ?<Text>{props.label.value}</Text> : null}
      {renderChildren(props, context.mappings, context.modelId, handlers)}
    </>
  );
};

export default Form;