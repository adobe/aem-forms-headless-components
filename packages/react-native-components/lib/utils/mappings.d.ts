/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2023 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/
/// <reference types="react" />
declare const _default: {
    form: (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldsetJson>) => import("react").JSX.Element;
    'text-input': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    'multiline-input': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    'number-input': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    panel: (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldsetJson>) => import("react").JSX.Element | null;
    button: (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    repeater: (props: import("./types").REPEATER) => import("react").JSX.Element;
    checkbox: (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    'checkbox-group': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    'radio-group': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    'drop-down': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    'password-input': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    'plain-text': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    'file-input': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
    'date-input': (fieldset: import("@aemforms/af-core").State<import("@aemforms/af-core").FieldJson>) => import("react").JSX.Element | null;
};
export default _default;
