import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import { useRuleEngine,  useFormIntl } from '@aemforms/af-react-renderer';

const withRuleEngine = (WrappedComponent: any) => {
   function withHOC(jsonfield: State<FieldJson>) {
    let [props, handlers] = useRuleEngine(jsonfield);
    const i18n = useFormIntl();
    const descId = props?.properties?.['afs:translationIds']?.description;
    const localizedDescription = descId ? i18n.formatMessage({ id: `${descId}`, defaultMessage: props.description }) : props.description;
    const labelId = props?.properties?.['afs:translationIds']?.label?.value;
    const localizedLabel = i18n.formatMessage({ id: `${labelId}`, defaultMessage: props?.label?.value });
    props.label!.value = localizedLabel;
    props.description = localizedDescription;
    return (
        <div>
          {props.visible ? <WrappedComponent {...props } {...handlers} /> : null}
        </div>
    );
  }
   return withHOC;
};

export default withRuleEngine;