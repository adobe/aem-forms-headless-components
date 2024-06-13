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

//  * The BEM markup is as per the AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/button/v1/button/button.html
//  ******************************************************************************

import React, { useCallback } from 'react';
import { withRuleEngine } from '../utils/withRuleEngine';
import { PROPS } from '../utils/type';
import FieldWrapper from './common/FieldWrapper';

const Button = (props: PROPS) => {
  const { label, enabled, appliedCssClassNames, id } = props;

  const clickHandler = useCallback(() => {
    props.dispatchClick();
  }, [props.dispatchClick]);

  return (
    <div className={`cmp-adaptiveform-button ${appliedCssClassNames || ''}`} id={id}>
      <FieldWrapper
        bemBlock='cmp-adaptiveform-checkbox'
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
        isError={props.isError}
        errorMessage={props.errorMessage}
        onlyQuestionMark
      >
        <button
          className="cmp-adaptiveform-button__widget"
          aria-label={label?.visible === false ? label?.value : ''}
          disabled={!enabled}
          onClick={clickHandler}
          type='button'
        >
          {label?.visible && <span className="cmp-adaptiveform-button__text">{label.value}</span>}
        </button>
      </FieldWrapper>
    </div>
  );
};

export default withRuleEngine(Button);