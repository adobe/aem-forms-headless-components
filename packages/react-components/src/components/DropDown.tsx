import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import { IHandler } from '../utils/type';
import withRuleEngine from '../utils/HOC';

const DropDown = (props: State<FieldJson> & IHandler) => {
   const { id, enum: enums, enumNames, label, value, placeholder, errorMessage, description, valid, name, enabled } = props;
   const placeHolder = !placeholder ? '' : placeholder;
   const dropValue = enumNames && enumNames.length ? enumNames : enums || [];
   const validateState = valid === false ? 'invalid' : 'valid';
   const error = validateState === 'invalid';
   const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
       const val = event.target.value;
       props.dispatchChange(val);
   };
   return (
       <div className="cmp cmp-adaptiveform-dropdown">
        <div className="cmp-adaptiveform-dropdown">
          {label?.visible && <label id={`${id}-label`} className="cmp-adaptiveform-dropdown__label" htmlFor={id}>{label?.value}</label>}
          <select name={name} className="cmp-adaptiveform-dropdown__widget" aria-label="Dropdown" onChange={changeHandler} value={value} id={id} disabled={!enabled}>
            <option id="emptyValue" role="none" value="">{placeHolder}</option>
            {
                dropValue?.map((item: string, index: number) => {
                    return <option className="cmp-adaptiveform-dropdown__option" key={index} value={enums![index]}>{item}</option>;
                })
            };
          </select>
           {error && <div id={`${id}-errorMessage`} className="cmp-adaptiveform-dropdown__errormessage">{errorMessage}</div>}
           {description && !error && <div id={`${id}-longDescription`} className="cmp-adaptiveform-dropdown__longdescription">{description}</div>}
        </div>
       </div>
   ); 
};

export default withRuleEngine(DropDown);