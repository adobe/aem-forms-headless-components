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

import Panel from '../../src/components/Panel';
import { renderComponent } from '../utils';

const field = {
  name: 'panel',
  label: {
    value: 'Panel Title',
  },
  fieldType: 'panel',
  visible: true,
  items: []
};
const helper = renderComponent(Panel);

describe('Panel', () => {

  test('should render with label', () => {
    const f = {
      ...field,
    };
    const { renderResponse} = helper(f);
    const panel = renderResponse.getByText(field.label.value);
    expect(panel).toBeTruthy();
  });

  test('should not render', () => {
    const f = {
      ...field,
      visible: false
    };
    const { renderResponse} = helper(f);
    const panel = renderResponse.queryByText(field.label.value);
    expect(panel).toBeNull();
  });

  test('render with localize label', () => {
    const f = {
      ...field,
      properties: {
        'afs:translationIds': {
          'label.value':'1234'
        }
      }
    };
    const { renderResponse} = helper(f);
    const panel = renderResponse.queryByText(field.label.value);
    expect(panel).toBeTruthy();
  });

})