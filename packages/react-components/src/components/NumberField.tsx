import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import { IHandler } from '../utils/type';
import withRuleEngine from '../utils/HOC';

const NumberField = (props: State<FieldJson> & IHandler) => {
   const { id, label, value, required, placeholder, name, maximum, minimum, description, errorMessage, valid, readOnly } = props;
   const validateState = valid === false ? 'invalid' : 'valid';
   const error = validateState === 'invalid';
   const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      props.dispatchChange(event.target.value);
   };

   const handleFocus = () => {
      props.dispatchFocus();
   };

   return (
      <div className="cmp-adaptiveform-numberinput">
        <div>{label?.visible && <label id={`${id}-label`} htmlFor={id}>{label?.value}</label>}</div>
        <input type='number' className="cmp-adaptiveform-numberinput__widget" value={value} onChange={changeHandler} required={required} placeholder={placeholder} name={name} min={minimum} max={maximum} readOnly={readOnly} onFocus={handleFocus} />
        {error && <div  id={`${id}-errorMessage`} className="cmp-adaptiveform-numberinput__errormessage">{errorMessage}</div>}
           {description && !error && <div className="cmp-adaptiveform-numberinput__longdescription" id={`${id}-longDescription`}>{description}</div>}
      </div>
   ); 
};

export default withRuleEngine(NumberField);