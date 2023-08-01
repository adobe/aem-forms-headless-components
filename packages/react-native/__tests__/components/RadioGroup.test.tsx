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
import { ReactTestInstance } from 'react-test-renderer';
import RadioGroup from '../../src/components/RadioGroup';
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';

const field = {
  name: 'radio',
  id: 'radio',
  visible: true,
  label: {
    value: 'radio group'
  },
  fieldType: 'radio-group',
  enum: [1, 2, 3],
  enumNames: ['radio 1', 'radio 2', 'radio 3']
};
const helper = renderComponent(RadioGroup);

describe('radio Group', () => {

  test('option selected by user is set in the model', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    expect(element?.getState().value).toBeUndefined();

    fireEvent.press(renderResponse.getByText(f.enumNames[0]));
    expect(element?.value).toEqual(1);

    fireEvent.press(renderResponse.getByText(f.enumNames[2]));
    expect(element?.value).toEqual(3);
  });

  test('selection made by the user sets the value', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    fireEvent.press(renderResponse.getByText(f.enumNames[0]));
    expect(element.value).toEqual(1);

    fireEvent.press(renderResponse.getByText(f.enumNames[1]));
    expect(element.value).toEqual(2);

    fireEvent.press(renderResponse.getByText(f.enumNames[0]));
    expect(element.value).toEqual(1);
  });

  test('it should handle visible property', async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(f.enumNames[0])).toBeNull();
    expect(renderResponse.queryByText(f.enumNames[1])).toBeNull();
    expect(renderResponse.queryByText(f.enumNames[2])).toBeNull();
  });

  test('help text content changes when field becomes invalid', async () => {
    const f = {
      ...field,
      description: 'some description',
      required: true,
    };

    const { renderResponse, element } = await helper(f);
    let description = renderResponse.queryByText(f.description);
    expect(description).not.toBeNull();
    element.value = 1;
    description = renderResponse.queryByText(f.description);
    expect(description).not.toBeNull();
    element.value = null;
    let error = renderResponse.queryByTestId(`${f.id}-error`);
    description = renderResponse.queryByText(f.description);
    expect(error).not.toBeNull();
    expect(description).toBeNull();
  });

});