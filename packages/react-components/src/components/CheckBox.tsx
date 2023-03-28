import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import { IHandler } from '../utils/type';
import withRuleEngine from '../utils/HOC';

const CheckBox = (props: State<FieldJson> & IHandler) => {
   const { id, label, enum: enums,  value, valid, errorMessage, description, name, readOnly, enabled } = props;  
   const selectedValue = enums?.[0];
   const unSelectedValue = (enums?.length || 0) < 2 ? null : enums?.[1];
   const validateState = valid === false ? 'invalid' : 'valid';
   const error = validateState === 'invalid';
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked ? selectedValue : unSelectedValue;
      props.dispatchChange(val);
   };
   return (
     <div className="cmp-adaptiveform-checkbox">
       <input type='checkbox' className="cmp-adaptiveform-checkbox__widget" onChange={handleChange} value={value} name={name} readOnly={readOnly} disabled={!enabled} />
       {label?.visible && <label className="cmp-adaptiveform-checkbox__label">{label?.value}</label>}
       {error && <div id={`${id}-errorMessage`} className="cmp-adaptiveform-checkbox__errormessage">{errorMessage}</div>}
       {description && !error && <div id={`${id}-longDescription`} className="cmp-adaptiveform-checkbox__longdescription">{description}</div>}
     </div>
   );   
};

export default withRuleEngine(CheckBox);