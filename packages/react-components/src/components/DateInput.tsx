import React from 'react';
import {State, FieldJson} from '@aemforms/af-core';
import { IHandler } from '../utils/type';
import withRuleEngine from '../utils/HOC';

const DateInput = (props: State<FieldJson> & IHandler) => {
    const { id, label, value, errorMessage, valid, description, required, name, readOnly, placeholder } = props;
    const finalValue = value === undefined ? '' : value;
    const validateState = valid === false ? 'invalid' : 'valid';
    const error = validateState === 'invalid';

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        props.dispatchChange(val);
    };

    return (
        <div className="cmp-adaptiveform-datepicker">
           <div>
            {label?.visible && <label id={`${id}-label`} htmlFor={id} className="cmp-adaptiveform-datepicker__label">{label?.value}</label>}
            </div>
           <input type='date' id={`${id}-datePicker`} value={finalValue} name={name} required={required} onChange={changeHandler} className="cmp-adaptiveform-datepicker__widget" aria-label="Date Input" readOnly={readOnly} placeholder={placeholder} />
           {error && <div  id={`${id}-errorMessage`} className="cmp-adaptiveform-datepicker__errormessage">{errorMessage}</div>}
           {description && !error && <div className="cmp-adaptiveform-datepicker__longdescription" id={`${id}-longDescription`}>{description}</div>}
        </div>
    );
};

export default withRuleEngine(DateInput);