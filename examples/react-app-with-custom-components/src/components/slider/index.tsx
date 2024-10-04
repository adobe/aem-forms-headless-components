// *******************************************************************************
//  * Copyright 2024 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the “License”);
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an “AS IS” BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  ******************************************************************************

import React, {useCallback} from "react";
import { PROPS, withRuleEngine } from "@aemforms/af-react-vanilla-components";
import './slider.css';

const Slider = (props: PROPS) => {
  const {
    id, label, value, readOnly, required, placeholder, minLength, maxLength,
    enabled, name, isError, errorMessage, description, step
  } = props;

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const thisVal = event.target.value;
    props.dispatchChange(Number(thisVal));
  }, [props.dispatchChange]);

  return (
    <div className='slider-container'>
        {label?.visible && <label className="slider-container__label" htmlFor={id}>{label.value}</label>}
        <input
          type="range"
          id={id}
          className='slider-container__widget'
          value={value || 0}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          readOnly={readOnly}
          min={minLength}
          max={maxLength}
          step={step || 1}
          disabled={!enabled}
          name={name}
        />
        {value || ''}
        {description && !isError && <div className="slider-container__description">{description}</div>}
        {isError ? <div className="slider-container__errormessage">{errorMessage}</div>: null}
    </div>
  )
};

export default withRuleEngine(Slider);