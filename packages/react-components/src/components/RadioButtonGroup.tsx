import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import withRuleEngine from '../utils/HOC';
import { IHandler } from '../utils/type';

const RadioButtonGroup = (props: State<FieldJson> & IHandler) => {
    const { id, label, required, enumNames, enum: enums, name, valid, errorMessage, description, readOnly } = props;
    const options = enumNames && enumNames.length ? enumNames : enums || [];
    const validateState = valid === false ? 'invalid' : 'valid';
    const error = validateState === 'invalid';
    const orientation = (props.properties?.['afs:layout']?.orientation)?.toUpperCase() || 'horizontal'.toUpperCase();
   
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
       const val = event.target.value;
       props.dispatchChange(val);
     };
    return (
       <div className="cmp-adaptiveform-radiobutton">
             {label?.visible && <label id={`${id}-label`} htmlFor={id} className="cmp-adaptiveform-radiobutton__label">{label?.value}</label>}
         <div className={`cmp-adaptiveform-radiobutton__widget ${orientation}`}>
             {options?.map((item: string, index: number) => {
                 return (
                     <div className="cmp-adaptiveform-radiobutton__option">
                       <label className="cmp-adaptiveform-radiobutton__option__label" aria-label={enumNames![index]} htmlFor={`${id}_${enums![index]}__widget`}>
                          <input id={`${id}_${enums![index]}__widget`} className="cmp-adaptiveform-radiobutton__widget" type='radio' required={required} name={name} value={enumNames![index]} onChange={changeHandler} readOnly={readOnly}/>
                          <span>{item}</span>
                      </label> 
                     </div>
                 );
             })}
               {error && <div className="cmp-adaptiveform-radiobutton__errormessage">{errorMessage}</div>}
               {description && !error && <div id={`${id}-longDescription`} className="cmp-adaptiveform-radiobutton__longdescription">{description}</div>}
         </div>
      </div>
    );
 };

export default withRuleEngine(RadioButtonGroup);