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

## Using external api to fetch form model json
By default, this project is configured to pick the form model json from the internal AEM server. For scenarios where the model needs to be served from an external API, we will need to update the below environment variables in [.env](./.env) file.
* `REACT_APP_AEM_HOST` : Set the value to the HTTP endpoint
* `REACT_APP_AEM_FORM_PATH` : Set the name of the form.

If you have a publish instance of AEM, use the following environment configuration and whitelist the `csb.app` hostname in your server
```
REACT_APP_AEM_HOST=https://publish-p1-e1.adobeaemcloud.com
REACT_APP_AEM_FORM_PATH=content/forms/af/demo-form
```

Below are some variables for the author instance to enable proxy, but CodeSandbox does not support proxy. These variables will work when you download this sandbox and start on your machine.
* `REACT_APP_USE_PROXY` : Dev modes, use proxy during development (helps avoids potential CORS issues).
* `REACT_APP_AEM_AUTH_TOKEN` : For Bearer auth, use DEV token (dev-token) from Cloud console.
* `REACT_APP_AEM_AUTH_USER` :  For Basic auth, use AEM ['user','password'] pair (eg for Local AEM Author instance).
* `REACT_APP_AEM_AUTH_PASS` : For Basic auth, use AEM ['user','password'] pair (eg for Local AEM Author instance).

To enable the proxy, add the following variables to the `.env` file. You can use either `REACT_APP_AEM_AUTH_TOKEN` or `REACT_APP_AEM_AUTH_USER` and `REACT_APP_AEM_AUTH_PASS` for authentication.
```
REACT_APP_USE_PROXY=true
REACT_APP_AEM_AUTH_USER=admin
REACT_APP_AEM_AUTH_PASS=admin
```

## Mappings Object

A Mappings Object is a JavaScript map that maps the field types defined in the Specification to its respective React Component. The Adaptive Form Super Component uses this map to render the different components defined in the Form JSON.

To use that in your project use the following import, assuming you have added the project as a dependency in your project
```
import {mappings} from '@aemforms/af-react-vanilla-components'
```

When you fetch JSON from AEM, the `:type` property in the JSON can change. We need to update the mapping object using the `:type` value. Every object in the JSON contains the `:type` property, and based on that, we will render the component. Therefore, we must update the mapping object according to the `:type` value.
```
import { mappings } from "@aemforms/af-react-vanilla-components";

export default {
  ...mappings,
  'forms-components-examples/components/form/verticaltabs': mappings["core/fd/components/form/verticaltabs/v1/verticaltabs"],
  'forms-components-examples/components/form/panelcontainer': mappings.panel
}
```

Once you have fetched the JSON for the form or you can create json locally, the code would look like
```
import {mappings} from '@aemforms/af-react-vanilla-components'
const json = {...}
<AdaptiveForm mappings={mappings} formJson={json} />
```


## Custom Component
In this example, we are creating a custom component for number input and rendering number input as a slider.
For creating custom components, follow these guidelines:
- State management will be handled by Adaptive Form component itself.
- All the properties that are required to create a component comes in props so you can consume them eg. value, errorMessage, description, label, required, dispatchChange and other.
- Update `mappings.js` file in the following manner and add your components accordingly.
```
<!-- default components mappings -->
import { mappings } from "@aemforms/af-react-vanilla-components";
<!-- custom component -->
import Slider from "../components/slider";
export default {
  ...mappings,
  'forms-components-examples/components/form/panelcontainer': mappings.panel,
  'forms-components-examples/components/form/numberinput': Slider 
  <!-- You can name the key as per your requirement or based on the value of the `:type` property.-->
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

# Links
1. [Story book](https://opensource.adobe.com/aem-forms-af-runtime/storybook)
2. [HTTP API Docs](https://opensource.adobe.com/aem-forms-af-runtime/api)
3. [Adaptive Form Runtime packages](https://www.npmjs.com/org/aemforms)