import React, { useState } from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import withRuleEngine from '../utils/HOC';
import { IHandler } from '../utils/type';

const Email = (props: State<FieldJson> & IHandler) => {
  const {id, value, label, description, valid, errorMessage, enabled, visible, name} = props;
  const validateState = valid === false ? 'invalid' : 'valid';
  const error = validateState === 'invalid';

  const [shortDescription, setShortDescription] = useState(true);
  const [longDescription, setLongtDescription] = useState(false);
  
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const thisVal = event.target.value;
    props.dispatchChange(thisVal);
  };

  const handleBlur = (event:React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchBlur(event.target.value);
  };

  const handleFocus = () => {
    props.dispatchFocus();
  };

  const handleClick = () => {
     setShortDescription(!shortDescription);
     setLongtDescription(!longDescription);
  };
  
    return (
          <div className="cmp-adaptiveform-emailinput" data-cmp-enabled={enabled} data-cmp-visible={visible} id={id} data-cmp-is="adaptiveFormEmailInput" data-cmp-valid={valid}>
            {label?.visible && <label className="cmp-adaptiveform-emailinput__label" htmlFor={id}>{label?.value}</label>}
            <input 
                type="email" 
                className= {value ? 'cmp-adaptiveform-emailinput__widget cmp-adaptiveform-emailinput__widget--filled' : 'cmp-adaptiveform-emailinput__widget cmp-adaptiveform-emailinput__widget--empty'}
                value={value} 
                aria-label="Email Input"
                onChange={handleChange} 
                onBlur={handleBlur} 
                onFocus={handleFocus}
                autoComplete='on'
                name={name}
               />
               <button className="cmp-adaptiveform-emailinput__questionmark" onClick={handleClick}></button>
               {shortDescription && props?.tooltip && <div className="cmp-adaptiveform-emailinput__shortdescription" data-cmp-visible={shortDescription}>{props?.tooltip}</div>}
               <div aria-live="polite">
                  {longDescription && description && !error  && <div className="cmp-adaptiveform-emailinput__longdescription" data-cmp-visible={longDescription}>{description}</div>}
               </div>
               {error && <div className="cmp-adaptiveform-emailinput__errormessage">{errorMessage || 'There is an error in the field'}</div>}
            </div>
    ); 
};

export default withRuleEngine(Email);