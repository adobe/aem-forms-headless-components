import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import withRuleEngine from '../utils/HOC';
import { IHandler } from '../utils/type';

const CheckBoxGroup = (props: State<FieldJson & IHandler>) => {
   const { id, label, required, enumNames, enum: enums, value, name, valid, errorMessage, description, readOnly } = props;
   const newVal = !value ? [] : value instanceof Array ? value : [value];
   const options = enumNames && enumNames.length ? enumNames : enums || [];
   const validateState = valid === false ? 'invalid' : 'valid';
   const error = validateState === 'invalid';
   const orientation = (props.properties?.['afs:layout']?.orientation)?.toUpperCase() || 'horizontal'.toUpperCase();
  
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
       props.dispatchChange(valAdded);
    };
   return (
        <div className="cmp-adaptiveform-checkboxgroup">
            {label?.visible && <label id={`${id}-label`} htmlFor={id} className="cmp-adaptiveform-checkboxgroup__label">{label?.value}</label>}
           <div className={`cmp-adaptiveform-checkboxgroup__widget ${orientation}`}>
              {options?.map((item: string, index: number) => {
                return (
                    <div className={`cmp-adaptiveform-checkboxgroup-item ${name}`}>
                      <label className="cmp-adaptiveform-checkbox__label" aria-label={enumNames![index]} htmlFor={`${id}_${enums![index]}__widget`}>
                         <input id={`${id}_${enums![index]}__widget`} className="cmp-adaptiveform-checkbox__widget" type='checkbox' required={required} name={name} value={enumNames![index]} onChange={changeHandler} readOnly={readOnly}/>
                           <span>{item}</span>
                      </label>
                    </div>
                );
            })}
              {error && <div id={`${id}-errorMessage`} className="cmp-adaptiveform-checkboxgroup__errormessage">{errorMessage}</div>}
              {description && !error && <div id={`${id}-longDescription`} className="cmp-adaptiveform-checkboxgroup__longdescription">{description}</div>}
          </div>
        </div>
   );
};

export default withRuleEngine(CheckBoxGroup);