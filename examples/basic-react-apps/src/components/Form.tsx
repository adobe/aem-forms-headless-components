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

import { AdaptiveForm } from "@aemforms/af-react-renderer";
import customMappings from "../utils/mappings";
import { Action } from "@aemforms/af-core";
import '@aemforms/af-wknd-theme/dist/theme.css';
import useFetch from "../custom-hooks/useFetch";

const Form = () => {
  const json  = useFetch();

  const onSubmitSuccess = (action: Action) => {
    console.log("Submitting " + action);
    const thankyouPage = action?.payload?.body?.redirectUrl;
    const thankYouMessage = action?.payload?.body?.thankYouMessage;
    if (thankyouPage) {
      window.location.replace(thankyouPage);
    } else if (thankYouMessage) {
      alert(thankYouMessage);
    }
  };

  const onSubmitError = (action: Action) => {
    alert("Encountered an internal error while submitting the form.");
  };

  const onInitialize = (action: Action) => {
    console.log("Initializing Form");
  };

  const onFieldChanged = (action: Action) => {
    console.log(
      "On Field Changed (Executes everytime a form field is updated)"
    );
  };

  if(!json) return null;

  return (
    <AdaptiveForm
      formJson={json as any}
      mappings={customMappings}
      onInitialize={onInitialize}
      onFieldChanged={onFieldChanged}
      onSubmitSuccess={onSubmitSuccess}
      onSubmitError={onSubmitError}
      onSubmitFailure={onSubmitError}
    />
  );
};

export default Form;
