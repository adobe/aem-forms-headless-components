/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Date from '../../src/components/Date';
import {
  elementFetcher,
  filterTestTable,
  jest26CompatibleTable,
  renderComponent,
  DEFAULT_ERROR_MESSAGE,
  InputFieldTestCase
} from '../utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';


const field = {
  'id': 'field',
  'name': 'birthDate',
  'default': '2021-01-01',
  'label': { 'value': 'date' },
  'visible': true,
  'type': 'string',
  'fieldType' : 'date-input',
  'properties': {
    'afs:layout':{
      'data-testid':'testid'
    }
  }
};

const labelInputTests: InputFieldTestCase<any>[] = [
  {
    name: 'field gets rendered with label',
    field: field,
    expects: (renderResponse:any) => {
      const label = renderResponse.getByText('date');
      expect(label).toBeInTheDocument();
    }
  },
  {
    name: 'field gets rendered with 3 button',
    field: field,
    expects: (renderResponse:any) => {
      let spinbutton = renderResponse.getAllByRole('spinbutton');
      expect(spinbutton.length).toBe(3);
    }
  },
  {
    name: 'labels and date field are linked with for and id/aria-labelledBy attribute',
    field: field,
    expects: (renderResponse:any) => {
      const testid = renderResponse.getByTestId('testid');
      const label = renderResponse.getByText('date');
      expect(testid.getAttribute('aria-labelledby')).not.toBeNull();
      expect(label.getAttribute('id')).not.toBeNull();
    }
  },
  {
    name: 'accessibility attributes are properly set for required field',
    field: field,
    expects: (renderResponse:any) => {
      const testid = renderResponse.getByTestId('testid');
      const label = renderResponse.getByText('date');
      expect(label.getAttribute('id')).toEqual(testid.getAttribute('aria-labelledby'));
    }
  },
  {
    name: 'label is null if title is marked as hidden in the field',
    field: {
      ...field,
      label: {
        ...field.label,
        visible: false
      }
    },
    expects: (renderResponse:any) => {
      const label = renderResponse.queryByText('date');
      expect(label).toBeNull();
    }
  },

  {
    name: 'description exists when the field is valid',
    field: {
      ...field,
      'description' : 'some description'
    },
    expects: (renderResponse:any) => {
      const description = renderResponse.getByText('some description');
      expect(description).toBeInTheDocument();
    }
  },
  {
    name: 'error message element exists when the field is invalid',
    field: {
      ...field,
      required: true
    },
    operation : (form, field) => {
      field.value = null;
    },
    expects: (renderResponse:any) => {
      const errorMessage = renderResponse.getByText('There is an error in the field');
      expect(errorMessage).toBeInTheDocument();
    }
  },
  {
    name: 'error message doesn\'t exists when there is no error',
    field: {
      ...field
    },
    expects: (renderResponse:any) => {
      const errorMessage = renderResponse.queryByText(DEFAULT_ERROR_MESSAGE);
      expect(errorMessage).toBeNull();
    }
  }
];

const helper = renderComponent(Date, elementFetcher);

test.each(jest26CompatibleTable(filterTestTable(labelInputTests)))('%s', async (name, {field, expects, operation}) => {
  const {renderResponse} = await helper(field, operation);
  expects(renderResponse);
});

test('it should handle visible property', async () => {
  const f = {
    ...field,
    'id': 'x',
    'visible': false
  };
  let {container} = await helper(f);
  expect(container.innerHTML).toContain('display: none');
});

test('value entered by user in date field is set in model', async () => {
  const f = {
    ...field,
    'id': 'x'
  };
  let {element, renderResponse} = await helper(f);
  const inputValue = '2021-01-01';
  expect(element.value).toEqual(inputValue);

  let button = renderResponse.getByRole('button');
  userEvent.click(button);

  let dialog = renderResponse.getByRole('dialog');
  expect(dialog).toBeVisible();
  expect(renderResponse.queryByLabelText('Time')).toBeNull();

  let cells = renderResponse.getAllByRole('gridcell');
  let selected:any = cells.find(cell => cell.getAttribute('aria-selected') === 'true');
  expect(selected?.children[0].getAttribute('aria-label')).toEqual('Friday, January 1, 2021 selected');

  userEvent.click(selected.nextSibling.children[0]);
  let updatedDialog = renderResponse.queryByRole('dialog');
  expect(updatedDialog).toBeNull();
  expect(element.value).toEqual('2021-01-02');

});
