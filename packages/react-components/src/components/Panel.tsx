import { State, FieldsetJson } from '@aemforms/af-core';
import React, { useContext, useState } from 'react';
import withRuleEngine from '../utils/HOC';
import { IHandler } from '../utils/type';
import { renderChildren, FormContext } from '@aemforms/af-react-renderer';
import '../../dist/theme.css';

const Panel = function (props: State<FieldsetJson & IHandler>) {
  const {id,visible,enabled,label,description} = props;
  const context = useContext(FormContext);
  const {dispatchAddItem, dispatchBlur, dispatchChange, dispatchClick, dispatchFocus, dispatchRemoveItem} = props;
  const handlers: IHandler = {dispatchAddItem, dispatchBlur, dispatchChange, dispatchClick, dispatchFocus, dispatchRemoveItem};
  const [show, setShow] = useState(true);
  const handleClick = () => {
    setShow(!show);
  };
  console.log('panel-props', props);
    return (
      <div id={id} data-cmp-visible={visible} data-cmp-enabled={enabled} data-cmp-is="adaptiveFormPanel">
        {label?.visible && <label htmlFor={id} className="cmp-container__label">{label?.value}</label>}
        <button className="cmp-container__questionmark" onClick={handleClick}></button>
        <div aria-live="polite">
            {show && description && <div className='cmp-container__longdescription' data-cmp-visible={show}>{description}</div>}
        </div>
        {renderChildren(props, context.mappings, context.modelId, handlers)}
      </div>
    );
};

export default withRuleEngine(Panel);