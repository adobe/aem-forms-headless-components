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

import Button from '../../src/components/Button';
import { renderComponent } from '../utils';

const field = {
  name: 'button',
  label: {
    value: 'button',
  },
  fieldType: 'button',
  visible: true
};
const helper = renderComponent(Button);

describe('Button', () => {

  test('should render with label', () => {
    const f = {
      ...field,
    };
    const { renderResponse} = helper(f);
    const button = renderResponse.getByText(field.label.value);
    expect(button).toBeTruthy();
  });

  test('it should handle visible property', () => {
    const f = {
      ...field,
      visible: false,
    };
    const { renderResponse} = helper(f);
    const button = renderResponse.queryByText(field.label.value);
    expect(button).toBeNull();
  });

})