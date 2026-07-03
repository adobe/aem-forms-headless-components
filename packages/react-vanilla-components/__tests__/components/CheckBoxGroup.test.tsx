/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import { render } from '@testing-library/react';
import CheckBoxGroup from '../../src/components/CheckBoxGroup';
import { createForm, Provider, renderComponent } from '../utils';
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect"

const field = {
  name: 'checkbox',
  visible: true,
  label: {
    value: 'Checkbox group'
  },
  fieldType: 'checkbox-group',
  enum: [1, 2, 3],
  enumNames: ['checkbox 1', 'checkbox 2', 'checkbox 3']
};

const helper = renderComponent(CheckBoxGroup);

describe('Checkbox Group', () => {

  test('option selected by user is set in the model', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    expect(element?.getState().value).toBeUndefined();

    userEvent.click(renderResponse.getByText(f.enumNames[0]));
    expect(element?.value).toEqual([1]);

    userEvent.click(renderResponse.getByText(f.enumNames[2]));
    expect(element?.value).toEqual([1, 3]);
  });

  test('selection made by the user sets the value', async () => {
    const f = {
      ...field,
    };
    const { renderResponse, element } = await helper(f);

    userEvent.click(renderResponse.getByText(f.enumNames[0]));
    expect(element.value).toEqual([1]);

    userEvent.click(renderResponse.getByText(f.enumNames[1]));
    expect(element.value).toEqual([1, 2]);

    userEvent.click(renderResponse.getByText(f.enumNames[2]));
    expect(element.value).toEqual([1, 2, 3]);


    userEvent.click(renderResponse.getByText(f.enumNames[1]));
    expect(element.value).toEqual([1, 3]);
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

  test('In case of both tooltip and description, tooltip should be visible and onclick of toggle button, description should be visible', async () => {
    const f = {
      ...field,
      tooltip: 'Short Description',
      description: 'Mandatory',
      properties: {
        "afs:layout": {
            tooltipVisible: true
        },
      }
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText('Short Description')).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName('cmp-adaptiveform-checkboxgroup__questionmark');
    userEvent.click(button[0]);
    expect(renderResponse.getByText('Mandatory')).not.toBeNull();
  });

  test('html in the label should be handled for non rich text', async () => {
    const f = {
      ...field,
      label: {
        value: '<p>title inside p tags</p>',
        richText: true,
        visible: true
      }
    }
    let { renderResponse } = await helper(f);
    expect(renderResponse.container.innerHTML).toContain('<p>title inside p tags</p>');
  });

  test('enum names containing html should be rendered as rich text', async () => {
    const f = {
      ...field,
      enumNames: ['<b>checkbox 1</b>', 'checkbox 2', 'checkbox 3'],
    }
    let { renderResponse } = await helper(f);
    expect(renderResponse.container.innerHTML).toContain('<b>checkbox 1</b>');
  });

  test('Aria-describedby should contain long des short desc if present otherwise it should be empty', async () => {
    const f= {
      ...field,
      id: 'checkboxgroup-123',
      tooltip: "short description",
      description: "long description",
      properties: {
        "afs:layout": {
            tooltipVisible: true
        },
      }
    };
    const { renderResponse } = await helper(f);
    const input = renderResponse.container.getElementsByClassName("cmp-adaptiveform-checkboxgroup__widget");
    expect(input).toHaveLength(1);
    expect(input[0]).toHaveAttribute('aria-describedby', `${f.id}__longdescription ${f.id}__shortdescription`)
  });

  test('enum names should render correctly under a non-default locale', async () => {
    const f = {
      ...field,
      enumNames: ['case à cocher 1', 'case à cocher 2', 'case à cocher 3'],
    };
    const form = createForm(f);
    const component = <CheckBoxGroup {...form.items[0].getState()} />;
    const wrapper = Provider(form, {}, 'fr-FR');
    const { getByText } = render(component, { wrapper });

    expect(getByText('case à cocher 1')).not.toBeNull();
    expect(getByText('case à cocher 2')).not.toBeNull();
    expect(getByText('case à cocher 3')).not.toBeNull();
  });
});
