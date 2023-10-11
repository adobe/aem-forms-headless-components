import React from 'react';
import { useLocation } from 'react-router-dom';
import { AdaptiveForm } from "@aemforms/af-react-renderer";
import jsonOne from "../demoOne.form.json";
import jsonTwo from "../demoTwo.form.json";
import jsonThree from "../demoThree.form.json";
import jsonFour from "../demoFour.form.json";
import jsonFive from "../demoFive.form.json";
import {mappings} from "@aemforms/af-react-vanilla-components";

const customMappings = {
  ...mappings,
  "core/fd/components/form/wizard/v1/wizard": mappings['core/fd/components/form/wizard/v2/wizard']
}
const RouterOne = () => {
  const url = useLocation();
  const queryParam = url?.search;
  return (
    <>
    {queryParam === '?form=1' ?<AdaptiveForm mappings={customMappings} formJson={jsonOne}  /> : null}
    {queryParam === '?form=2' ?<AdaptiveForm mappings={customMappings} formJson={jsonTwo}  /> : null}
    {queryParam === '?form=3' ?<AdaptiveForm mappings={customMappings} formJson={jsonThree}  /> : null}
    {queryParam === '?form=4' ?<AdaptiveForm mappings={customMappings} formJson={jsonFour}  /> : null}
    {queryParam === '?form=5' ?<AdaptiveForm mappings={customMappings} formJson={jsonFive}  /> : null}
    </>
  )
}

export default RouterOne;