# Getting Started with AEM Headless Adaptive Form App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This is a sample react app which will help to create JSON based forms using Adaptive Form libraries. This application is built to consume the form model definition of an AEM Adaptive Form.

## System Requirements

* Latest release of GIT

* Node.js 16.13.0 or later

* React 16.14.0 or later

## Libraries required
[af-core](https://www.npmjs.com/package/@aemforms/af-core) - To manage the state and create form model using json.

[af-react-renderer](https://www.npmjs.com/package/@aemforms/af-react-renderer) - To communicate between model and view layer

[af-react-vanilla-components](https://www.npmjs.com/package/@aemforms/af-react-vanilla-components) - View layer components that is optional you can create your own components.


## Available Scripts

In the project directory, you can run:

### `npm install`

Install dependencies.

### `npm start`

After running npm start, your app will be automatically opened in your browser (at path http://localhost:3000). If you make edits, the page will reload.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder. It bundles React in production mode and optimizes the build for the best performance. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Custom Component
For creating custom components, follow these guidelines:
- State management will be handled by Adaptive Form component itself.
- All the properties that are required to create a component comes in props so you can consume them eg. value, errorMessage, description, label, required, dispatchChange and other.
- Create new `mappings.js` file in the following manner and add your components accordingly.
```
<!-- default components mappings -->
import { mappings } from "@aemforms/af-react-vanilla-components";
<!-- custom component -->
import Slider from "../components/slider";
export default {
  ...mappings,
  'custom:slider': Slider // You can keep the name of key as per your requirement.
}
```
- In the [json](src/form-definitions/demo.form.json), add `:type` property with value `custom:slider`.
```
{
  "fieldType": "number-input",
  ":type": "custom:slider",
  "name": "slider",
  "maximum": 100,
  "minimum": 0,
  "step": 2,
  "label": {
    "value": "Slider"
  }
}
```

- For creating a new component always use this `withRuleEngine` hook for creating custom component as this will help to communicate between model and view layer. If you are not using `af-react-vanilla-components` components then you can copy paste the withRuleEngine code from [here](https://github.com/adobe/aem-forms-headless-components/blob/main/packages/react-vanilla-components/src/utils/withRuleEngine.tsx)

Slider.ts
```
import {withRuleEngine} from "@aemforms/af-react-vanilla-components";

const Slider = (props) => {
  return (
    <div>
    <!-- add code here -->
    </div>
  )
};

export default withRuleEngine(Slider);
```

Form.ts
```
import {mappings} from './mappings'
const json = {...}
<AdaptiveForm mappings={mappings} formJson={json} />
```

## Custom Function
You can add default custom function from [here](https://www.npmjs.com/package/@aemforms/af-custom-functions). Also you can define your own custom function and use them. For creating custom functions, follow these guidelines:
- Create a new file `customFunction.ts` and define custom function in following way.

```
/**
 * concat two string
 * @param {string} a.
 * @param {string} b.
 * @returns {string} - return concatinated string of a and b.
 */
function myCustomFunction(a: string, b: string): string {
  if(!a && !b) {
    return '';
  }
  return `${a || ''} ${b ||  ''}`;
}
export {
  myCustomFunction
}
```
- Once custom function have been created you have to register this custom function in following manner.
```
import {FunctionRuntime } from "@aemforms/af-core";
<!-- default custom function(optional) -->
import * as defauleCustomFunction from '@aemforms/af-custom-functions';
<!-- custom function -->
import { conactWithSpace } from "./customFunction";

const Form = () => {

  FunctionRuntime.registerFunctions({ ...defauleCustomFunction, conactWithSpace });

  return (
      <AdaptiveForm
        formJson={demoJson}
        mappings={customMappings}
    />
  )
}
```
- Now you can use this custom function in the [JSON](src/form-definitions/demo.form.json).
```
{
    "fieldType": "text-input",
    "name": "name",
    "label": {
      "value": "Full Name"
    },
    "rules": {
      "value": "conactWithSpace(firstName.$value,lastName.$value)"
    }
}
```

## Mappings Object

A Mappings Object is a JavaScript map that maps the field types defined in the Specification to its respective React Component. The Adaptive Form Super Component uses this map to render the different components defined in the Form JSON.

To use that in your project use the following import, assuming you have added the project as a dependency in your project

```
import {mappings} from '@aemforms/af-react-vanilla-components'
```

Once you have fetched the JSON for the form or you can create json locally, the code would look like

```
import {mappings} from '@aemforms/af-react-vanilla-components'
const json = {...}
<AdaptiveForm mappings={mappings} formJson={json} />
```

# Links
1. [Story book](https://opensource.adobe.com/aem-forms-af-runtime/storybook)
2. [HTTP API Docs](https://opensource.adobe.com/aem-forms-af-runtime/api)
3. [Adaptive Form Runtime packages](https://www.npmjs.com/org/aemforms)