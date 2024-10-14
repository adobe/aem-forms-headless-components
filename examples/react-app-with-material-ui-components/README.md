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

[Material UI](https://mui.com/material-ui/getting-started/)


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
* `REACT_APP_USE_PROXY` : Dev modes, use proxy during development (helps avoids potential CORS issues).
* `REACT_APP_AEM_AUTH_TOKEN` : For Bearer auth, use DEV token (dev-token) from Cloud console.
* `REACT_APP_AEM_AUTH_USER` :  For Basic auth, use AEM ['user','password'] pair (eg for Local AEM Author instance).
* `REACT_APP_AEM_AUTH_PASS` : For Basic auth, use AEM ['user','password'] pair (eg for Local AEM Author instance).

If you have a publish instance of AEM, use the following environment configuration and whitelist the `csb.app` hostname in your server
```
REACT_APP_AEM_HOST=https://publish-p1-e1.adobeaemcloud.com
REACT_APP_AEM_FORM_PATH=content/forms/af/demo-form
```

## Create Components using Material UI
For creating custom components, follow these guidelines:
- State management will be handled by Adaptive Form component itself.
- All the properties that are required to create a component comes in props so you can consume them eg. value, errorMessage, description, label, required, dispatchChange and other.

- Create `withRuleEngine` Hook, that will help to communicate between model and view layer. You can copy paste the code from [here](https://github.com/adobe/aem-forms-headless-components/blob/main/packages/react-vanilla-components/src/utils/withRuleEngine.tsx)

- Create a [TextField](src/adaptiveForm/components/TextField.tsx) component using material ui and add `withRuleEngine` hook.

TextField.tsx
```
import {withRuleEngine} from "./adaptiveForm/shared/withRuleEngine.tsx";
import { FormControl} from '@mui/material';

const TextField = (props) => {
  return (
    <FormControl>
    <!-- add code here -->
    </FormControl>
  )
};

export default withRuleEngine(TextField);
```

- Create a `mappings.js` file in the following manner and add your components accordingly.
```
import Form from "./adaptiveForm/components/Form";
import TextField from "./adaptiveForm/components/TextField";
import NumberField from "./adaptiveForm/components/NumberField";
import panel from "./adaptiveForm/components/panel";
export default {
  'form': Form,
  'text-input': TextField,
  'number-input': NumberField,
  'panel': Panel,
}
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