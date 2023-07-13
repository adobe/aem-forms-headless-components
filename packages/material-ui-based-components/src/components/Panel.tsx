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