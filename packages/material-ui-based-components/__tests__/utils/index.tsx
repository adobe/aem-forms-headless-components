/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { JSXElementConstructor } from "react";
import { render } from "@testing-library/react";
import { createFormInstance, FieldModel, FormModel } from "@aemforms/af-core";
import { IntlProvider } from "react-intl";
import { FormContext } from "@aemforms/af-react-renderer";
export const DEFAULT_ERROR_MESSAGE = 'There is an error in the field';

export type FieldExpectType = (l: HTMLLabelElement | null, i: HTMLInputElement | null, c: HTMLElement) => any

export const createForm = (field: any) => {
  const formJson = {
    items: [field]
  };
  return createFormInstance(formJson);
};

export const Provider =
  (
    form: FormModel,
    mappings: any = {},
    locale: string = "en-US",
    dictionaries: any = ""
  ) =>
    (props: any) => {
      const c = {
        form,
        mappings,
        modelId: "$form",
        refMap: {},
      };
      const { children } = props;
      return (
        /* @ts-ignore */
        <IntlProvider locale={locale} messages={dictionaries}>
          <FormContext.Provider value={c}>{children}</FormContext.Provider>
        </IntlProvider>
      );
    };

export const renderComponent = function <T>(Component: JSXElementConstructor<any>) {
  const test = (field: any, operation?: any) => {
    const form = createForm(field);
    if (operation) {
      operation(form, form.items[0]);
    }
    const e = form.items[0].getState();
    //@ts-ignore
    let component = <Component {...e} />;
    const wrapper = Provider(form);
    const renderResponse = render(component, { wrapper });
    return {
      renderResponse,
      form,
      element: form?.items[0] as FieldModel,
      component
    };
  };
  return test;
};
