import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import withRuleEngine from '../utils/HOC';
import { IHandler } from '../utils/type';

const TextField = (props: State<FieldJson> & IHandler) => {
  const {id, value, label, required, readOnly=false, placeholder, description, valid, errorMessage, minLength, maxLength, enabled} = props;
  const validateState = valid === false ? 'invalid' : 'valid';
  const error = validateState === 'invalid';
  
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
  
    return (
        <div>
          <div className="cmp-adaptiveform-textinput">
            {label?.visible && <label className="cmp-adaptiveform-textinput__label" htmlFor={id}>{label?.value}</label>}
            <input 
                type="text" 
                className="cmp-adaptiveform-textinput__widget"
                value={value} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                onFocus={handleFocus}
                required={required}
                placeholder={placeholder}
                readOnly={readOnly}
                minLength={minLength}
                maxLength={maxLength}
                disabled={!enabled}
               />
            </div>
            {error && <div className="cmp-adaptiveform-textinput__errormessage">{errorMessage}</div>}
            {description && !error && <div className="cmp-adaptiveform-textinput__shortdescription">{description}</div>}
        </div>
    ); 
};

export default withRuleEngine(TextField);