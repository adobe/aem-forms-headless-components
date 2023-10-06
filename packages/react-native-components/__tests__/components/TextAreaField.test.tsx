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

import { fireEvent } from '@testing-library/react-native';
import TextAreaField from '../../src/components/TextField';
import { ReactTestInstance } from 'react-test-renderer';
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';

const field = {
  name: 'multiline',
  id: 'multiline',
  label: {
    value: 'multi line field',
  },
  fieldType: 'multiline-input',
  placeholder:'multiline field',
  visible: true,
  required: true,
};
const helper = renderComponent(TextAreaField);

describe('Text Area Field', () => {

  test('value entered by user in text field is set in model', async () => {
    const f = {
      ...field,
    };
    const {renderResponse, element} = await helper(f);
    const input: ReactTestInstance = await renderResponse.findByPlaceholderText(f.placeholder);
    const inputVal = 'abc';
    fireEvent.changeText(input, inputVal);
    const state = element.getState();
    expect(state.value).toEqual(inputVal);
  });

  test('help text content changes when field becomes invalid', async () => {
    const f = {
      ...field,
      description: 'some description',
    };
    const {renderResponse, element} = await helper(f);
    let description = renderResponse.queryByText('some description');
    expect(description).not.toBeNull();
  
    element.value = null;
    let error = renderResponse.queryByTestId(`${f.id}-error`);
    description = renderResponse.queryByText('some description');
    expect(error).not.toBeNull();
    expect(description).toBeNull();
  
    element.value = 'abc';
    error = renderResponse.queryByTestId(`${f.id}-error`);
    description = renderResponse.queryByText('some description');
    expect(error).toBeNull();
    expect(description).not.toBeNull();
  });

  test('it should handle visible property', async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.label.value)).toBeNull();
  });
  
});

