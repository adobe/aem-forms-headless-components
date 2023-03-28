import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import withRuleEngine from '../utils/HOC';
import { IHandler } from '../utils/type';


const TextFieldArea = (props: State<FieldJson> & IHandler) => {
   const { id, label, name, value, required, readOnly,  valid, errorMessage, description, minLength, maxLength } = props;
   const validateState = valid === false ? 'invalid' : 'valid';
   const error = validateState === 'invalid';
   
   const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const enteredValue = event.target.value;
      props.dispatchChange(enteredValue);
   };

   const handleFocus = () => {
      props.dispatchFocus();
   };

   return (
      <div className="cmp-adaptiveform-textinput">
        {label?.visible && <label className="cmp-adaptiveform-textinput__label" htmlFor={id} id={`${id}-label`}>{label?.value}</label>}
        <textarea aria-label="Text Input" className="cmp-adaptiveform-textinput__widget" name={name} onChange={handleChange} value={value} required={required} readOnly={readOnly} minLength={minLength} maxLength={maxLength} onFocus={handleFocus} />
        {error && <div id={`${id}-errorMessage`} className="cmp-adaptiveform-textinput__errormessage">{errorMessage}</div>}
        {description && !error && <div className="cmp-adaptiveform-textinput__longdescription" id={`${id}-longDescription`}>{description}</div>}
      </div>
   );
};

export default withRuleEngine(TextFieldArea);