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

import PlainText from '../../src/components/PlainText';
import { renderComponent } from '../utils';

const field = {
  name: "text",
  fieldType: "plain-text",
  value: "Plain Text",
  visible: true
};
const helper = renderComponent(PlainText);

describe('Plain Text', () => {

  test('should render with value', () => {
    const f = {
      ...field,
    };
    const { renderResponse} = helper(f);
    const form = renderResponse.getByText(field.value);
    expect(form).toBeTruthy();
  });

  test('should not render without value', () => {
    const f = {
      ...field,
      value: null
    };
    const { renderResponse} = helper(f);
    const form = renderResponse.queryByText(field.value);
    expect(form).toBeNull();
  });

})