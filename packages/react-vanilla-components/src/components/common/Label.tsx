// *******************************************************************************
//  * Copyright 2023 Adobe
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

import React from "react";
import { LABEL } from '../../utils/type';

const Label = (props: LABEL) => {
  const { bemBlock, label, id, description, onlyQuestionMark, onClick } = props;
  const isFile = bemBlock === 'cmp-adaptiveform-fileinput';
  return (
    <div className={`${bemBlock}__${onlyQuestionMark ? 'help-container' : 'label-container'}`}>
      {
        label?.visible && !onlyQuestionMark && (
          <label className={`${bemBlock}__label`} htmlFor={`${id}${isFile ? '' : '-widget'}`}>
            {label?.value}
          </label>
        )
      }
      {
        description && (
          <button
            className={`${bemBlock}__questionmark`}
            onClick={onClick}
            title="Help text"
          ></button>
        )
      }
    </div>
  )
};

export default Label;