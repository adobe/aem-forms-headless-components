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

import React, { useCallback, useState } from "react";
import Label from "./Label";
import Description from "./Description";
import { FIELD_WRAPPER } from '../../utils/type';

const FieldWrapper = (props: FIELD_WRAPPER) => {
  const [showShortDescription, setShowShortDescription] = useState(true);
  const [showLongDescription, setShowLongDescription] = useState(false);

  const questionMarkHandler = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setShowShortDescription(!showShortDescription);
    setShowLongDescription(!showLongDescription);
  }, [showShortDescription, showLongDescription]);

  return (<>
    <Label
      bemBlock={props.bemBlock}
      label={props.label}
      id={props.id}
      description={props.description}
      onlyQuestionMark={props.onlyQuestionMark}
      onClick={questionMarkHandler}
    />
    {props.children ? props.children : null}
    <Description
      id={props.id}
      bemBlock={props.bemBlock}
      tooltip={props.tooltip}
      description={props.description}
      errorMessage={props.errorMessage}
      showShortDescription={showShortDescription}
      showLongDescription={showLongDescription}
    />
    {
      props.isError ?
        <div id={`${props.id}__errormessage`} className={`${props.bemBlock}__errormessage`}>{props.errorMessage}</div>
        : null
    }
  </>)
};

export default FieldWrapper;