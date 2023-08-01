import React from 'react';
import { FormContext } from '@aemforms/af-react-renderer';
import { createFormInstance } from '@aemforms/af-core';
import { ChakraProvider } from '@chakra-ui/react'
import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';

export const DEFAULT_ERROR_MESSAGE = 'There is an error in the field';

export const createForm = (field) => {
  const formJson = {
    items: [field]
  };
  return createFormInstance(formJson);
};

export const Provider = (form, mappings, locale, dictionaries) => props => {
  const c = {
    form,
    mappings,
    modelId: '$form',
    refMap: {}
  };
  const { children } = props;
  return (
    <ChakraProvider>
      <IntlProvider locale={locale} messages={dictionaries}>
        <FormContext.Provider value={c}>{children}</FormContext.Provider>
      </IntlProvider>
    </ChakraProvider>
  );
};

export const renderComponent = function (Component) {
  const test = (field, operation) => {
    const form = createForm(field);
    if (operation) {
      operation(form, form.items[0]);
    }
    const e = form.items[0].getState();
    let component = <Component {...e} />;
    const wrapper = Provider(form);
    const renderResponse = render(component, { wrapper });
    return {
      renderResponse,
      form,
      element: form?.items[0],
      component
    };
  };
  return test;
};
