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
import { DESCRIPTION } from '../../utils/type';

const Description = (props: DESCRIPTION) => {
  const { bemBlock, tooltip, errorMessage, description, showShortDescription, showLongDescription } = props;
  return (<>
    {
      showShortDescription && tooltip && (
        <div
          title='Help Text'
          data-cmp-visible={showShortDescription}
          className={`${bemBlock}__shortdescription`}
        >
          {tooltip}
        </div>
      )
    }
    <div aria-live="polite">
      {showLongDescription && description && !errorMessage && (
        <div
          title='Help Text'
          data-cmp-visible={showLongDescription}
          className={`${bemBlock}__longdescription`}
        >
          {description}
        </div>
      )
      }
    </div>
  </>)
};

export default Description;