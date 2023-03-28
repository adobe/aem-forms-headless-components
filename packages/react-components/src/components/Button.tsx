import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import withRuleEngine from '../utils/HOC';
import { IHandler } from '../utils/type';

const Button = (props: State<FieldJson & IHandler>) => {
   const { label, enabled } = props;
   return (
    <div className="cmp-adaptiveform-button" >
       <button className="cmp-adaptiveform-button__widget" aria-label="Button" disabled={!enabled} onClick={props.dispatchClick()}>
          {label?.visible && <span className="cmp-adaptiveform-button__text">{label.value}</span>}
       </button>
    </div>
   );
};

export default withRuleEngine(Button);

