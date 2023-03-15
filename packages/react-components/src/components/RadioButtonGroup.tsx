import React from 'react';
import { useRuleEngine } from '@aemforms/af-react-renderer';

const RadioButtonGroup = (fieldjson: any) => {
    const [props, handlers] = useRuleEngine(fieldjson);
    const { id, label, required, enumNames, enum: enums, name, valid, errorMessage, description } = props;
    const options = enumNames && enumNames.length ? enumNames : enums || [];
    const validateState = valid === false ? 'invalid' : 'valid';
    const error = validateState === 'invalid';
   
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
       const val = event.target.value;
       console.log('rad-val',val);
       handlers.dispatchChange(val);
     };
    return (
       <div>
         <div className="cmp-adaptiveform-radiobutton">
             <label htmlFor={id} className="cmp-adaptiveform-radiobutton__label">{label?.value}</label>
         <div className="cmp-adaptiveform-radiobutton__widget HORIZONTAL">
             {options?.map((item: string, index: number) => {
                 return (
                     <div className="cmp-adaptiveform-radiobutton-item [${id}]">
                       <input className="cmp-adaptiveform-radiobutton__widget" type='radio' required={required} name={name} value={enumNames[index]} onChange={changeHandler} />
                       <label className="cmp-adaptiveform-radiobutton__label"><span>{item}</span></label>
                     </div>
                 );
             })};
         </div>
          </div>
          {error && <div className="cmp-adaptiveform-radiobutton__errormessage">{errorMessage}</div>}
          {description && !error && <div className="cmp-adaptiveform-radiobutton__shortdescription">{description}</div>}
       </div>
    );
 };

export default RadioButtonGroup;