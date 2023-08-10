# React HTML5 Components For Headless Adaptive Forms

The document provides detailed information on React Spectrum Components that you can use to render [Headless Adaptive Form](https://experienceleague.adobe.com/docs/experience-manager-headless-adaptive-forms/using/overview.html?lang=en). To learn about the capabilties of Headless Adaptive Forms, see [Overview of Headless Adaptive Forms](https://experienceleague.adobe.com/docs/experience-manager-headless-adaptive-forms/using/overview.html?lang=en)

## Demo Link

[Demo](coming soon)

## Table of Contents

- List of Components
  - Button
  - Checkbox
  - Checkbox Group
  - Drop Down
  - Date Picker
  - File Upload
  - Number Field
  - Panel
  - Email
  - Wizard
  - Radio Group
  - Accordion
  - Text Area Field
  - Text Field
  - Vertical Tab
  - Horizontal Tab
  - Plain Text
- Mappings

## Before you start {#pre-requisites}

To create and run a React app, you should have Node.js and npm (Node Package Manager) installed on your computer:

- Install the [latest release of Git](https://git-scm.com/downloads). If you are new to Git, see [Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
- Install [Node.js 18.12.1](https://nodejs.org/en/download/). If you are new to Node.js, see [How to install Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs).

## Setup Project

Create a React Application using following command or you can setup a application using webpack and any build tool.

```
npx create-react-app my-app
```

## Installation

Run the following command to add Adaptive Forms Components to your React Application:

```
npm install --save @aemforms/af-react-vanilla-components

```

These form components are depend on `@aemforms/af-core` and `@aemforms/af-react-renderer` libraries. Run the following command to add these dependecies to your React Application:

```
npm install --save @aemforms/af-core @aemforms/af-react-renderer

```

## Usage

```jsx
import React from "react";
import { AdaptiveForm } from "@aemforms/af-react-renderer";
import { mappings } from "@aemforms/af-react-vanilla-components";

//For using custom components like Accordion, Wizard, Tabs-on-top, Tabs-on-left, Panel, one has to include following property in their json -:
//  ":type": "core/fd/components/form/accordion/v1/accordion" --> For Accordion
//  ":type": "core/fd/components/form/wizard/v1/wizard" --> For Wizard
//  ":type": "core/fd/components/form/tabsontop/v1/tabsontop" --> For Tabs-on-top
//  ":type": "core/fd/components/form/verticaltabs/v1/verticaltabs" --> For Tabs-on-left
//  ":type": "core/fd/components/form/panelcontainer/v1/panelcontainer" --> For Panel
// For example, including the json for Tabs-on-top

const json = {
  adaptiveform: "0.10.0",
  items: [
    {
      name: "name",
      type: "string",
      fieldType: "text-input",
      required: true,
      label: {
        value: "Name",
      },
    },
    {
      name: "mobile",
      type: "number",
      fieldType: "number-input",
      required: true,
      label: {
        value: "Mobile Number",
      },
    },
    {
      id: "tabsontop-86aea6d533",
      fieldType: "panel",
      name: "tabsontop",
      visible: true,
      ":type": "core/fd/components/form/tabsontop/v1/tabsontop",
      items: [
        {
          fieldType: "drop-down",
          name: "item_1",
          visible: true,
          type: "string",
          enumNames: ["Swift", "Alto"],
          label: {
            value: "Cars",
          },
          enum: ["0", "1"],
        },
        {
          fieldType: "checkbox-group",
          name: "item_2",
          visible: true,
          enumNames: ["Item 1", " Item 2"],
          label: {
            value: "Check Box Group",
          },
          enum: [0, 1],
        },
      ],
      label: {
        value: "Tabs on top",
      },
    },
    {
      name: "submit",
      fieldType: "button",
      label: {
        value: "submit",
      },
    },
  ],
  metadata: {
    version: "1.0.0",
  },
};

const App = () => {
  return <AdaptiveForm formJson={json} mappings={mappings} />;
};
export default App;
```

## License

Copyright 2023 Adobe, Inc.

Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
