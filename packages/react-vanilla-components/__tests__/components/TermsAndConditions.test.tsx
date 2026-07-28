/*
 * Copyright 2026 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import mappings from '../../src/utils/mappings';
import { renderComponent } from '../utils';

// jsdom does not implement IntersectionObserver; capture the callback so
// tests can simulate the intersetion element entering the viewport.
let intersectionCallback: (entries: Array<{ isIntersecting: boolean }>) => void = () => undefined;
const mockUnobserve = jest.fn();

beforeEach(() => {
  mockUnobserve.mockClear();
  (global as any).IntersectionObserver = jest.fn((cb: any) => {
    intersectionCallback = cb;
    return {
      observe: jest.fn(),
      unobserve: mockUnobserve,
      disconnect: jest.fn()
    };
  });
});

const textItem = {
  id: 'text-def',
  fieldType: 'plain-text',
  name: 'consenttext',
  value: 'Text related to the terms and conditions come here'
};

const checkboxItem = {
  id: 'checkbox-abc',
  fieldType: 'checkbox',
  name: 'approvalcheckbox',
  type: 'string',
  required: true,
  enabled: false,
  label: { value: 'I agree to the terms & conditions' },
  enum: ['true']
};

const textOnlyField = {
  id: 'termsandconditions-abc',
  fieldType: 'panel',
  name: 'termsandconditions1234',
  visible: true,
  enabled: true,
  type: 'object',
  label: { value: 'Terms And Conditions', visible: true },
  properties: {
    'fd:tnc': true
  },
  items: [textItem, checkboxItem]
};

const modalModeField = {
  ...textOnlyField,
  id: 'termsandconditions-modal',
  properties: {
    'fd:tnc': true,
    'fd:showAsPopup': true
  }
};

const linkItem = {
  id: 'toggleablelink-1234',
  fieldType: 'checkbox-group',
  name: 'link1234',
  visible: true,
  enum: ['https://www.adobe.com'],
  enumNames: ['label for the link'],
  ':type': 'core/fd/components/form/toggleablelink/v1/toggleablelink',
  events: {
            'custom:setProperty': [
              '$event.payload'
            ],
            'change': [
              "if(length($field.$value) == length($field.$enum), dispatchEvent($parent.approvalcheckbox, 'custom:setProperty', {enabled : true()}), {})"
            ]
          }
};

const linkModeField = {
  id: 'termsandconditions-abc',
  fieldType: 'panel',
  name: 'termsandconditions1234',
  visible: true,
  enabled: true,
  type: 'object',
  label: { value: 'Terms And Conditions', visible: true },
  properties: {
    'fd:tnc': true
  },
  items: [
    {
      id: 'checkbox-abc',
      fieldType: 'checkbox',
      name: 'approvalcheckbox',
      type: 'string',
      required: true,
      enabled: false,
      enforceEnum: true,
      label: { value: 'I agree to the terms & conditions' },
      enum: ['true']
    },
    linkItem
  ]
};


describe('Terms And Conditions', () => {

    test('should render plain text and approval checkbox with no link', () => {
      const helper = renderComponent(TermsAndConditions);
      const { renderResponse } = helper(textOnlyField, null, mappings);

      expect(renderResponse.getByText(textItem.value)).toBeVisible();
      expect(renderResponse.getByText(checkboxItem.label.value)).toBeVisible();
      
      const checkboxWidget = renderResponse.container.getElementsByClassName('cmp-adaptiveform-checkbox__widget')[0];

      expect(checkboxWidget).toBeVisible();
      expect(checkboxWidget).toHaveAttribute('name', checkboxItem.name);
      expect(renderResponse.container.getElementsByClassName('cmp-adaptiveform-termsandcondition__link').length).toEqual(0);
    });
  

  test('link mode renders the checkbox-group and approval checkbox, with no text ', () => {
    const helper = renderComponent(TermsAndConditions);
    const { renderResponse } = helper(linkModeField, null, mappings);

    expect(renderResponse.container.getElementsByClassName('cmp-adaptiveform-termsandcondition__text').length).toEqual(0);
    expect(renderResponse.container.getElementsByClassName('cmp-adaptiveform-termsandcondition__link').length).toEqual(1);
    const linkTag = renderResponse.container.getElementsByClassName('cmp-adaptiveform-checkboxgroup__links')[0];
    expect(linkTag).toHaveAttribute('href', linkItem.enum[0]);
    expect(linkTag).toHaveAttribute('title', linkItem.enumNames[0]);

    const checkboxWidget = renderResponse.container.getElementsByClassName('cmp-adaptiveform-checkbox__widget')[0];
    expect(checkboxWidget).toHaveAttribute('name', 'approvalcheckbox');
  });

  test('clicking the link enables the approval checkbox', () => {
    const helper = renderComponent(TermsAndConditions);
    const { renderResponse } = helper(linkModeField, null, mappings);
    const checkboxWidget = renderResponse.container.getElementsByClassName('cmp-adaptiveform-checkbox__widget')[0];
    expect(checkboxWidget).toHaveAttribute('name', 'approvalcheckbox');
    expect(checkboxWidget).toBeDisabled();
    const linkTag = renderResponse.getByText(linkItem.enumNames[0]);
    userEvent.click(linkTag);
    expect(checkboxWidget).toBeEnabled();
  });

  test('modal can be toggled using approval checkbox', () => {
    const helper = renderComponent(TermsAndConditions);
    const { renderResponse } = helper(modalModeField, null, mappings);

    const contentContainer = renderResponse.container.getElementsByClassName('cmp-adaptiveform-termsandcondition__content-container--modal')[0];
    expect(contentContainer).toHaveStyle('display: none');

    const checkboxWrapper = renderResponse.container.getElementsByClassName('cmp-adaptiveform-termsandcondition__approvalcheckbox')[0];
    userEvent.click(checkboxWrapper);
    expect(contentContainer).toHaveStyle('display: block');

     act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    const closeButton = renderResponse.getByLabelText('Close terms and conditions document');
    userEvent.click(closeButton);
    expect(contentContainer).toHaveStyle('display: none');
    const checkboxWidget = renderResponse.container.getElementsByClassName('cmp-adaptiveform-checkbox__widget')[0];
    expect(checkboxWidget).toHaveAttribute('name', 'approvalcheckbox');
    expect(checkboxWidget).toBeEnabled();
  });


  test('checkbox becomes enabled once the text-intersect div is scrolled into view', () => {
    const helper = renderComponent(TermsAndConditions);
    const largeTextItem = {...textItem, value: 'Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here.Text related to the terms and conditions come here'}
    const field = {...textOnlyField, items: [checkboxItem, largeTextItem]};
    const { renderResponse } = helper(field, null, mappings);

    const checkboxElement = renderResponse.container.querySelector(`#${checkboxItem.id}-widget`);
    expect(checkboxElement).toBeDisabled();

    act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    expect(checkboxElement).toBeEnabled();
    expect(mockUnobserve).toHaveBeenCalled();
  });

  test('checkbox stays disabled while intersection has not fired', () => {
    const helper = renderComponent(TermsAndConditions);
    const largeTextItem = {...textItem, value: 'Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here. Text related to the terms and conditions come here.Text related to the terms and conditions come here'}
    const field = {...textOnlyField, items: [checkboxItem, largeTextItem]};
    const { renderResponse } = helper(field, null, mappings);

    const checkboxElement = renderResponse.container.querySelector(`#${checkboxItem.id}-widget`);
    expect(checkboxElement).toBeDisabled();

    act(() => {
      intersectionCallback([{ isIntersecting: false }]);
    });

    expect(checkboxElement).toBeDisabled();
    expect(mockUnobserve).not.toHaveBeenCalled();
  });
});
