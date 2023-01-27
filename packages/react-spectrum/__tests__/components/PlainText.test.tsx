/*
 *
 *  * Copyright 2022 Adobe, Inc.
 *  *
 *  * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *  *
 *  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import {
    renderComponent
} from '../utils';
import {FieldModel, FormModel} from '@aemforms/af-core';
import PlainText from '../../src/components/PlainText';
import {JSXElementConstructor} from 'react';

const field = {
    'id': 'field',
    'name': 'plainText',
    'value' : 'this is a plain text',
    'visible': true,
    'fieldType' : 'plain-text'
};

type TestCase<T> = {
    name: string,
    f ?: boolean,
    x ?: boolean,
    field: any,
    expects : (t:Expectation<T>) => void
}

type Expectation<E> = E & {
    container: HTMLElement,
    form: FormModel,
    element: FieldModel
}

type PlainTextExpect = {
    p: HTMLElement | null
}

const tests: TestCase<PlainTextExpect>[] = [
    {
        name: 'field gets rendered without a provider',
        field: field,
        expects: (e) => {
            expect(e.p?.innerHTML).toEqual('this is a plain text');
        }
    },
    {
        name: "field's value should be reflected in html",
        field: field,
        expects: (e) => {
            e.element.value = 'some new value';
            expect(e.p?.innerHTML).toEqual('some new value');
        }
    },
    {
        name: "field's value should be reflected in html",
        field: {
            ...field,
            visible: false
        },
        expects: (e) => {
            expect(e.p).toBeNull();
        }
    }
];

function filterTestTable<T>(tests: TestCase<T>[]) : TestCase<T>[] {
    let testsToRun = tests.filter(t => t.f);
    if (testsToRun.length == 0) {
        testsToRun = tests.filter(t => !t.x);
    }
    return testsToRun;
}

function jest26CompatibleTable<T>(tests: TestCase<T>[]) : [string, TestCase<T>][] {
    return tests.map(t => {
        return [t.name, t];
    });
}

const executeTests = function <E>(Component: JSXElementConstructor<any>,
                                  fetcher: (e:HTMLElement) => E,
                                  tests: TestCase<E>[]) {
    const helper = renderComponent(Component, fetcher);

    test.each(jest26CompatibleTable(filterTestTable(tests)))('%s', async (name, {field, expects}) => {
        //let x = await helper(field, false);
        //expects(x.label, x.input);
        let x = await helper(field);
        expects(x);
    });
};

executeTests(PlainText, (c) => ({
    p: c.querySelector('p')
}), tests);
