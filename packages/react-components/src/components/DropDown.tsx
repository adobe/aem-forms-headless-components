import React from 'react';
import { useRuleEngine } from '@aemforms/af-react-renderer';

const DropDown = (fieldjson: any) => {
   const [props, handlers] = useRuleEngine(fieldjson);
   const { id, visible, enum: enums, enumNames, label, value, placeHolder, errorMessage, description, valid } = props;
   const placeholder = !placeHolder ? '' : placeHolder;
   const dropValue = enumNames && enumNames.length ? enumNames : enums || [];
   const validateState = valid === false ? 'invalid' : 'valid';
   const error = validateState === 'invalid';
   const changeHandler = (event: any) => {
       const val = event.target.value;
       handlers.dispatchChange(val);
   };
   return visible ? (
       <div>
       <div>
          {label?.visible && <label htmlFor={id}>{label.value}</label>}
          <select onChange={changeHandler} value={value} id={id}>
            <option value="">{placeholder}</option>
            {
                dropValue?.map((item: string, index: string) => {
                    return <option key={index} value={enums[index]}>{item}</option>;
                })
            };
          </select>
       </div>
       {error && <div className="cmp-adaptiveform-dropdown__errormessage">{errorMessage}</div>}
       {description && !error && <div className="cmp-adaptiveform-dropdown__shortdescription">{description}</div>}
       </div>
   ) : null; 
};

export default DropDown;