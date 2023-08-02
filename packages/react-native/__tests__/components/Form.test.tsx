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

import Form from '../../src/components/Form';
import { renderComponent } from '../utils';

const field = {
  name: 'form',
  label: {
    value: 'Form Title',
  },
  fieldType: 'form',
  visible: true,
};
const helper = renderComponent(Form);

describe('Form', () => {

  test('should render with label', () => {
    const f = {
      ...field,
    };
    const { renderResponse} = helper(f);
    const form = renderResponse.getByText(field.label.value);
    expect(form).toBeTruthy();
  });

  test('should render without label', () => {
    const f = {
      ...field,
      label: {}
    };
    const { renderResponse} = helper(f);
    const form = renderResponse.queryByText(field.label.value);
    expect(form).toBeNull();
  });

})