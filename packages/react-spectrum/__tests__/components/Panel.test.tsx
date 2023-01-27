/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Panel from '../../src/components/Panel';
import React from 'react';
import {render} from '@testing-library/react';
import {createForm, Provider} from '../utils';
import {jsonString} from '@aemforms/af-core';

const emptyPanel = {
    'id' : 'emptypanel',
    'visible' : true,
    'items' : [],
    index: 0,
    ':type' : 'panel'
};

const panelWithField = {
    'id' : 'panelWithField',
    'visible' : true,
      'label': {
        'value': 'panel title'
      },
    index: 0,
    ':type' : 'panel',
    'items' : [
        {
            'id' : 'field',
            'name' : 'f1',
            'fieldType' : 'text-field',
            ':type' : 'text-field',
            'title' : 'name',
            'visible' : true,
            index: 0
        }
    ]
};


test('panel should get rendered if it is visible', () => {
    const panel = <Panel {...emptyPanel} />;
    const {container} = render(panel);
    expect(container.innerHTML.length).toBeGreaterThan(0);
});

test('panel should not get rendered if it is invisible', () => {
    const p = {
        ...emptyPanel,
        'visible' : false
    };
    const panel = <Panel {...p} />;
    const {container} = render(panel);
    expect(container.innerHTML.length).toEqual(0);
});

test('panel should get rendered if it has no children', () => {
    const panel = <Panel {...emptyPanel} />;
    const {container} = render(panel);
    expect(container.innerHTML.length).toBeGreaterThan(0);
});

test('panel should get rendered if no mapping is defined', async () => {
    const panel = <Panel {...panelWithField} />;
    const form = await createForm(emptyPanel);
    const wrapper = Provider(form, {});
    const {container} = render(panel, {wrapper});
    expect(container.innerHTML.length).toBeGreaterThan(0);
});

test('children without mapping should get rendered as undefined', async () => {
    const panel = <Panel {...panelWithField} />;
    const form = await createForm(emptyPanel);
    const wrapper = Provider(form, {});
    const {container} = render(panel, {wrapper});
    var expected = '<div class="undefined-element"><h4>Undefined Element</h4><pre>' + jsonString(panelWithField.items[0]) + '</pre></div>';
    expect(container.innerHTML).not.toContain(expected);
});

test('children with mapping should render the mapped component', async () => {
    const MyComponent = () => {
        return <div>My Field</div>;
    };

    const panel = <Panel {...panelWithField} />;
    const form = await createForm(emptyPanel);
    const wrapper = Provider(form, {'text-field' : MyComponent});
    const {container} = render(panel, {wrapper});
    var expected = '<div><h4>Undefined Element</h4><pre>' + jsonString(panelWithField.items[0]) + '</pre></div>';
    expect(container.innerHTML).not.toContain(expected);
    expect(container.innerHTML).toContain('<div>My Field</div>');
});

test('panel should get rendered with label', async () => {
  const panel = <Panel {...panelWithField} />;
  const form = await createForm(emptyPanel);
  const wrapper = Provider(form, {});
  const { container } = render(panel, { wrapper });
  var expected = '<span>panel title</span>';
  expect(container.innerHTML.length).toBeGreaterThan(0);
  expect(container.innerHTML).toContain(expected);
});
