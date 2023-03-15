import React from 'react';
import { useRuleEngine } from '@aemforms/af-react-renderer';

const CheckBoxGroup = (fieldjson:any) => {
   const [props, handlers] = useRuleEngine(fieldjson);
   const { id, label, required, enumNames, enum: enums, value, name, valid, errorMessage, description } = props;
   const newVal = !value ? [] : value instanceof Array ? value : [value];
   const options = enumNames && enumNames.length ? enumNames : enums || [];
   const validateState = valid === false ? 'invalid' : 'valid';
   const error = validateState === 'invalid';
  
   const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const val = event.target.value;
      const checked = event.target.checked;
      let valAdded = [...newVal];
      if (checked) {
        valAdded.push(val);
      }
      if (!checked) {
        valAdded = valAdded.filter((item) => item !== val);
      }
      handlers.dispatchChange(valAdded);
    };
   return (
      <div>
        <div className="cmp-adaptiveform-checkboxgroup">
            <label htmlFor={id} className="cmp-adaptiveform-checkboxgroup__label">{label?.value}</label>
        <div className="cmp-adaptiveform-checkboxgroup__widget HORIZONTAL">
            {options?.map((item: string, index: number) => {
                return (
                    <div className="cmp-adaptiveform-checkboxgroup-item [${id}]">
                      <input className="cmp-adaptiveform-checkbox__widget" type='checkbox' required={required} name={name} value={enumNames[index]} onChange={changeHandler} />
                      <label className="cmp-adaptiveform-checkbox__label"><span>{item}</span></label>
                    </div>
                );
            })};
        </div>
         </div>
         {error && <div className="cmp-adaptiveform-checkboxgroup__errormessage">{errorMessage}</div>}
         {description && !error && <div className="cmp-adaptiveform-checkboxgroup__shortdescription">{description}</div>}
      </div>
   );
};

export default CheckBoxGroup;