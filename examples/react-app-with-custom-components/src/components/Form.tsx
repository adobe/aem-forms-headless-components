import React, { useEffect } from "react";
import { AdaptiveForm } from "@aemforms/af-react-renderer";
import { Action, FunctionRuntime } from "@aemforms/af-core";
import "@aemforms/af-canvas-theme/dist/theme.css";
import * as defauleCustomFunction from '@aemforms/af-custom-functions';

import { conactWithSpace } from "../utils/customFunction";
import useFetch from "../custom-hooks/useFetch";
import customMappings from "../utils/mappings";

const Form = () => {
  const demoJson  = useFetch();
  
  FunctionRuntime.registerFunctions({ ...defauleCustomFunction, conactWithSpace });
  
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

  if(!demoJson) return null;
  
  return (
    <AdaptiveForm
      formJson={demoJson as any}
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
