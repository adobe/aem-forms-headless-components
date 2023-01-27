import React, { JSXElementConstructor } from 'react';
import { FormContext } from '@aemforms/af-react-renderer';
import { createFormInstance, FieldModel, FormModel } from '@aemforms/af-core';
import { NativeBaseProvider } from 'native-base';
import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react-native';

export const DEFAULT_ERROR_MESSAGE = 'There is an error in the field';
export type FieldExpectType = (l: HTMLLabelElement | null, i: HTMLInputElement | null, c: HTMLElement) => any
const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const createForm = (field: any) => {
  const formJson = {
    items: [field]
  };
  return createFormInstance(formJson);
};

export const Provider = (form: FormModel, mappings: any = {}, locale: string = 'en-US', dictionaries: any = '') => (props: any) => {
  const c = {
    form,
    mappings,
    modelId: '$form',
    refMap: {}
  };
  const { children } = props;
  return (
    <NativeBaseProvider initialWindowMetrics={inset}>
      <IntlProvider locale={locale} messages={dictionaries}>
        <FormContext.Provider value={c}>{children}</FormContext.Provider>
      </IntlProvider>
    </NativeBaseProvider>
  );
};

export const renderComponent = function <T>(Component: JSXElementConstructor<any>) {
  const test = (field: any, operation?: any) => {
    const form = createForm(field);
    if (operation) {
      operation(form, form.items[0]);
    }
    const e = form.items[0].getState();
    let component = <Component {...e} />;
    const wrapper = Provider(form);
    const renderResponse = render(component, { wrapper });
    const input = renderResponse.queryByText(field?.label?.value);
    return {
      renderResponse,
      input,
      form,
      element: form?.items[0] as FieldModel,
      component
    };
  };
  return test;
};

