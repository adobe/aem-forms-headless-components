/*
 * Copyright 2023 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Flex from '../../src/components/flex/Flex';
import HorizontalFlex from '../../src/components/flex/HorizontalFlex';
import VerticalFlex from '../../src/components/flex/VerticalFlex';
import React from 'react';
import { render } from '@testing-library/react';
import { createForm, Provider } from '../utils';
import { jsonString } from '@aemforms/af-core';

const emptyFLex = {
  'id': 'emptyFlex',
  'visible': true,
  'label': { value: 'empty label' },
  'items': []
};

const flexWithData = {
  'id': 'flexWithData',
  ':type' : 'custom:flex',
  'visible': true,
  'label': { value: 'flex label' },
  index : 0,
  'items': [
    {
      'id': 'field',
      'name': 'f1',
      'fieldType': 'text-field',
      ':type' : 'text-field',
      'title': 'name',
      'visible': true,
      index: 1,
      'label': { value: 'text field label' }
    },
    {
      'id': 'field',
      'name': 'f2',
      'fieldType': 'text-field',
      ':type' : 'text-field',
      'title': 'name',
      'visible': true,
      index: 2,
      'label': { value: 'text field label 2' }
    }
  ]
};

test('Flex should not rendered if item length is zero', () => {
  const { container } = render(<Flex {...emptyFLex} />);
  expect(container.innerHTML.length).toEqual(0);
});

test('Flex should not rendered if visible false', () => {
  const { container } = render(<Flex {...emptyFLex} visible={false} />);
  expect(container.innerHTML.length).toEqual(0);
});


test('Flex should get rendered if no mapping is defined', async () => {
  const form = await createForm(emptyFLex);
  const wrapper = Provider(form, {});
  const { container } = render(<Flex {...flexWithData} />, { wrapper });
  expect(container.innerHTML.length).toBeGreaterThan(0);
});

test('Flex children with mapping should render the mapped component', async () => {
  const MyComponent = () => {
    return <div>My Field</div>;
  };
  const form = await createForm(emptyFLex);
  const wrapper = Provider(form, { 'text-field': MyComponent });
  const { container } = render(<Flex {...flexWithData} />, { wrapper });
  var expected = '<div><h4>Undefined Element</h4><pre>' + jsonString(flexWithData.items[0]) + '</pre></div>';
  expect(container.innerHTML).not.toContain(expected);
  expect(container.innerHTML).toContain('<div>My Field</div>');
});

test('Horizontal Flex children with mapping should render the mapped component', async () => {
  const MyComponent = () => {
    return <div>My Field</div>;
  };

  const form = await createForm(emptyFLex);
  const wrapper = Provider(form, { 'text-field': MyComponent });
  const { container } = render(<HorizontalFlex {...flexWithData} />, { wrapper });
  var expected = '<div><h4>Undefined Element</h4><pre>' + jsonString(flexWithData.items[0]) + '</pre></div>';
  expect(container.innerHTML).not.toContain(expected);
  expect(container.innerHTML).toContain('<div>My Field</div>');
  expect(container.innerHTML).toContain('grid-template-columns: 50.00% 50.00%;');
});

test('Vertical Flex children with mapping should render the mapped component', async () => {
  const MyComponent = () => {
    return <div>My Field</div>;
  };

  const form = await createForm(emptyFLex);
  const wrapper = Provider(form, { 'text-field': MyComponent });
  const { container } = render(<VerticalFlex {...flexWithData} />, { wrapper });
  var expected = '<div><h4>Undefined Element</h4><pre>' + jsonString(flexWithData.items[0]) + '</pre></div>';
  expect(container.innerHTML).not.toContain(expected);
  expect(container.innerHTML).toContain('<div>My Field</div>');
  expect(container.innerHTML).toContain('grid-template-columns: 100%;');
});
