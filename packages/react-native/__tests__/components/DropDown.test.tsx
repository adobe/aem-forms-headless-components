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
import DropDown from '../../src/components/DropDown';
import { renderComponent } from '../utils';

const field = {
  name: 'dropdown',
  id: 'dropdown',
  visible: true,
  label: {
    value: 'Drop Down'
  },
  fieldType: 'drop-down',
  placeholder: "select",
  enum: [1, 2, 3],
  enumNames: ['option 1', 'option 2', 'option 3']
};
const helper = renderComponent(DropDown);

describe('Drop Down', () => {

  // test('option selected by user is set in the model', async () => {
  //   const f = {
  //     ...field,
  //   };
  //   const { renderResponse, element } = await helper(f);

  //   expect(element?.getState().value).toBeUndefined();

  //   fireEvent.press(renderResponse.getByPlaceholderText('select'));
  //   fireEvent.press(renderResponse.getByText(f.enumNames[0]));
  //   expect(element?.value).toEqual(1);
  // });

  // test('selection made by the user sets the value', async () => {
  //   const f = {
  //     ...field,
  //   };
  //   const { renderResponse, element } = await helper(f);

  //   fireEvent.press(renderResponse.getByPlaceholderText('select'));
  //   fireEvent.press(renderResponse.getByText(f.enumNames[0]));
  //   expect(element?.value).toEqual(1);

  //   fireEvent.press(renderResponse.getByPlaceholderText('select'));
  //   fireEvent.press(renderResponse.getByText(f.enumNames[1]));
  //   expect(element?.value).toEqual(2);

  //   fireEvent.press(renderResponse.getByPlaceholderText('select'));
  //   fireEvent.press(renderResponse.getByText(f.enumNames[2]));
  //   expect(element?.value).toEqual(3);
  // });

  test('it should handle visible property', async () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByPlaceholderText('select')).toBeNull();
  });

  // test('help text content should be render', async () => {
  //   const f = {
  //     ...field,
  //     description: 'some description',
  //     required: true
  //   };

  //   const { renderResponse } = await helper(f);
  //   let description = renderResponse.queryByTestId(`${f.id}-description`);
  //   expect(description).not.toBeNull();
  // });

});