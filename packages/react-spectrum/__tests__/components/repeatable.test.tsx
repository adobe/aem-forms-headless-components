import {createFormInstance, FieldsetJson, State} from '@aemforms/af-core';
import Panel from '../../src/components/Panel';
import React from 'react';
import {render} from '@testing-library/react';
import {Provider} from '../utils';
import Repeater from '../../src/components/Repeater';

const repeatableField = {
    name: 'repeat',
    label: {
        value: 'panel title'
    },
    type: 'array',
    minItems: 0,
    maxItems: 10,
    ':type': 'panel',
    items: [
        {
            fieldType: 'text-field',
            ':type': 'text-field',
            title: 'name',
            visible: true
        }
    ]
};

const MyComponent = () => {
    return <div>My Field</div>;
};

const searchAndCount = (text:string, str:string) => {
    let count = 0, pos = text.indexOf(str);
    while (pos > -1) {
        ++count;
        pos = text.indexOf(str, ++pos);
    }
    return count;
};

test('add/remove button should be visible for repeatable elements', () => {
    const form = createFormInstance({
        items : [repeatableField]
    });
    const panelState = form.items[0].getState() as State<FieldsetJson>;
    const wrapper = Provider(form, {'text-field' : MyComponent, repeater: Repeater});
    const panel = <Panel {...panelState} />;
    const {container} = render(panel, {wrapper});
    expect(searchAndCount(container.innerHTML, '<button')).toEqual(2);
});

test('repeater should be invoked with correct params', () => {
    const form = createFormInstance({
        items : [repeatableField]
    });
    const repeater = jest.fn().mockReturnValue(null);
    const panelState = form.items[0].getState() as State<FieldsetJson>;
    const wrapper = Provider(form, {'text-field' : MyComponent, repeater});
    const panel = <Panel {...panelState} />;
    render(panel, {wrapper});
    expect(repeater.mock.calls[0][0]).toMatchObject({add: true, remove: true, index: 0});
});

test('repeater should not have add option if maxItems is equal to currentItems', () => {
    const form = createFormInstance({
        items : [{
            ...repeatableField,
            minItems: 0,
            maxItems: 2,
            initialItems: 2
        }]
    });

    const repeater = jest.fn().mockReturnValue(null);
    const panelState = form.items[0].getState() as State<FieldsetJson>;
    const wrapper = Provider(form, {'text-field' : MyComponent, repeater});
    const panel = <Panel {...panelState} />;
    render(panel, {wrapper});
    expect(repeater.mock.calls[0][0]).toMatchObject({add: false, remove: true, index: 0});
});

test('repeater should not have remove option if minItems is equal to currentItems', () => {
    const form = createFormInstance({
        items : [{
            ...repeatableField,
            minItems: 1,
            maxItems: 5,
            initialItems: 1
        }]
    });

    const repeater = jest.fn().mockReturnValue(null);
    const panelState = form.items[0].getState() as State<FieldsetJson>;
    const wrapper = Provider(form, {'text-field' : MyComponent, repeater});
    const panel = <Panel {...panelState} />;
    render(panel, {wrapper});
    expect(repeater.mock.calls[0][0]).toMatchObject({add: true, remove: false, index: 0});
});

