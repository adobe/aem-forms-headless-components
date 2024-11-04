# Getting Started with AEM Headless Adaptive Form App

By default Expo web is automatically running but you can use the QR code in the application log to open Expo on your iOS or Android device. 

This is a sample react native app which will help to create JSON based forms using Adaptive Form libraries. This application is built to consume the form model definition of an AEM Adaptive Form.

## System Requirements

* Latest release of GIT

* Node.js 16.13.0 or later

* React 16.14.0 or later

## Libraries required
[af-core](https://www.npmjs.com/package/@aemforms/af-core) - To manage the state and create form model using json.

[af-react-renderer](https://www.npmjs.com/package/@aemforms/af-react-renderer) - To communicate between model and view layer

[@aemforms/af-react-native](https://www.npmjs.com/package/@aemforms/af-react-native) - View layer components that is optional you can create your own components.


## Available Scripts

In the project directory, you can run:

### `npm install`

Install dependencies.

### For Android

```bash
npm run android
```

### For iOS

```bash
npm run ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Using external api to fetch form model json
By default, this project is configured to pick the form model json from the internal AEM server. For scenarios where the model needs to be served from an external API, we will need to update the below environment variables in [.env](./.env) file.
* `REACT_APP_AEM_HOST` : Set the value to the HTTP endpoint
* `REACT_APP_AEM_FORM_PATH` : Set the name of the form.

If you have a publish instance of AEM, use the following environment configuration and whitelist the `csb.app` hostname in your server
```
REACT_APP_AEM_HOST=https://publish-p1-e1.adobeaemcloud.com
REACT_APP_AEM_FORM_PATH=content/forms/af/demo-form
```


## Mappings Object

A Mappings Object is a JavaScript map that maps the field types defined in the Specification to its respective React Native Component. The Adaptive Form Super Component uses this map to render the different components defined in the Form JSON.

To use that in your project use the following import, assuming you have added the project as a dependency in your project
```
import {mappings} from '@aemforms/af-react-native'
```

When you fetch JSON from AEM, the `:type` property in the JSON can change. We need to update the mapping object using the `:type` value. Every object in the JSON contains the `:type` property, and based on that, we will render the component. Therefore, we must update the mapping object according to the `:type` value.
```
import { mappings } from "@aemforms/af-react-native";

export default {
  ...mappings,
  'forms-components-examples/components/form/panelcontainer': mappings.panel
}
```

Once you have fetched the JSON for the form or you can create json locally, the code would look like
```
import {mappings} from '@aemforms/af-react-native'
const json = {...}
<AdaptiveForm mappings={mappings} formJson={json} />
```

# Links
1. [Story book](https://opensource.adobe.com/aem-forms-af-runtime/storybook)
2. [HTTP API Docs](https://opensource.adobe.com/aem-forms-af-runtime/api)
3. [Adaptive Form Runtime packages](https://www.npmjs.com/org/aemforms)

