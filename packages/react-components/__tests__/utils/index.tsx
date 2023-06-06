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
