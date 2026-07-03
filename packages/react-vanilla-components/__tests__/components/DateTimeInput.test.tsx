/* ************************************************************************
 * Copyright 2026 Adobe, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *************************************************************************/

import DateTimeInput from '../../src/components/DateTimeInput';
import userEvent from '@testing-library/user-event';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderComponent, DEFAULT_ERROR_MESSAGE } from '../utils';
import '@testing-library/jest-dom/extend-expect';

const field = {
  name: 'datetime1',
  label: { value: 'Date and Time', visible: true },
  fieldType: 'datetime-input',
  type: 'string',
  format: 'date-time',
  visible: true,
  required: true,
  enabled: true,
  readOnly: false,
};

const fullField = {
  id: 'datetime-6a4986a577',
  fieldType: 'datetime-input',
  name: 'datetime1780381446201',
  visible: true,
  description: '<p>long</p>',
  tooltip: '<p>short</p>',
  type: 'string',
  required: true,
  enabled: true,
  constraintMessages: { required: 'wrong date', minimum: 'minimum date', maximum: 'max date' },
  readOnly: false,
  default: '2026-05-06 12:30:25',
  format: 'date-time',
  label: { visible: true, value: 'Date and Time' },
  minimum: '2025-11-04T12:55',
  maximum: '2026-06-27T12:55',
  properties: {
    'afs:layout': { tooltipVisible: false },
    'fd:path': '/content/forms/af/table-component/jcr:content/guideContainer/datetime',
  },
};

const helper = renderComponent(DateTimeInput);

describe('DateTimeInput', () => {

  test('value changed by user is set in model', async () => {
    const { renderResponse, element } = await helper(field);
    const input = renderResponse.container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2024-06-15T10:30' } });
    expect(element.getState().value).toEqual('2024-06-15T10:30');
  });

  test('it should handle visible property', async () => {
    const f = { ...field, visible: false };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(field.label.value)).toBeNull();
  });

  test('error message element exists when the field is invalid', async () => {
    const f = { ...field, valid: false, errorMessage: DEFAULT_ERROR_MESSAGE };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText(DEFAULT_ERROR_MESSAGE)).not.toBeNull();
  });

  test('labels and inputs are linked with for and id attribute', async () => {
    const { renderResponse } = await helper(field);
    const input = renderResponse.container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    const label = renderResponse.queryByText(field.label.value);
    expect(input?.getAttribute('id')).toEqual(label?.getAttribute('for'));
  });

  test('input renders with datetime-local type', async () => {
    const { renderResponse } = await helper(field);
    const input = renderResponse.container.querySelector('input[type="datetime-local"]');
    expect(input).not.toBeNull();
  });

  test('disabled attribute is set when enabled is false', async () => {
    const f = { ...field, enabled: false };
    const { renderResponse } = await helper(f);
    const input = renderResponse.container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  test('default value with space separator is normalised to datetime-local format', async () => {
    // af-core surfaces default as "YYYY-MM-DD HH:MM:SS"; datetime-local requires "YYYY-MM-DDTHH:MM"
    const { renderResponse } = await helper(fullField);
    const input = renderResponse.container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    expect(input.value).toEqual('2026-05-06T12:30');
  });

  test('min and max HTML attributes are set from JSON minimum/maximum', async () => {
    const { renderResponse } = await helper(fullField);
    const input = renderResponse.container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    expect(input).toHaveAttribute('min', '2025-11-04T12:55');
    expect(input).toHaveAttribute('max', '2026-06-27T12:55');
  });

  test('minimum constraint message is shown when value is below minimum', async () => {
    const f = {
      ...field,
      minimum: '2025-11-04T12:55',
      maximum: '2026-06-27T12:55',
      constraintMessages: { minimum: 'minimum date', maximum: 'max date' },
    };
    const { renderResponse } = await helper(f);
    const input = renderResponse.container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2020-01-01T10:00' } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(renderResponse.queryByText('minimum date')).not.toBeNull();
    });
  });

  test('maximum constraint message is shown when value is above maximum', async () => {
    const f = {
      ...field,
      minimum: '2025-11-04T12:55',
      maximum: '2026-06-27T12:55',
      constraintMessages: { minimum: 'minimum date', maximum: 'max date' },
    };
    const { renderResponse } = await helper(f);
    const input = renderResponse.container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2027-01-01T10:00' } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(renderResponse.queryByText('max date')).not.toBeNull();
    });
  });

  test('tooltip and description toggle correctly', async () => {
    const f = {
      ...field,
      tooltip: 'Short Description',
      description: 'Long Description',
      properties: { 'afs:layout': { tooltipVisible: true } },
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText('Short Description')).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName('cmp-adaptiveform-datetime__questionmark');
    userEvent.click(button[0]);
    expect(renderResponse.getByText('Long Description')).not.toBeNull();
  });

  test('aria-describedby contains long and short description ids when both are present', async () => {
    const f = {
      ...field,
      id: 'datetime-123',
      tooltip: 'short desc',
      description: 'long desc',
      properties: { 'afs:layout': { tooltipVisible: true } },
    };
    const { renderResponse } = await helper(f);
    const input = renderResponse.container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    expect(input).toHaveAttribute(
      'aria-describedby',
      `${f.id}__longdescription ${f.id}__shortdescription`
    );
  });

  test('html in the label should be rendered for rich text', async () => {
    const f = {
      ...field,
      label: { value: '<strong>Date and Time</strong>', richText: true, visible: true },
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.container.innerHTML).toContain('<strong>Date and Time</strong>');
  });

  test('required constraint message is shown on validation failure', async () => {
    const f = { ...fullField, valid: false, errorMessage: 'wrong date' };
    const { renderResponse } = await helper(f);
    expect(renderResponse.queryByText('wrong date')).not.toBeNull();
  });

  test('full CRISP JSON field renders without errors', async () => {
    const { renderResponse } = await helper(fullField);
    expect(renderResponse.container.querySelector('input[type="datetime-local"]')).not.toBeNull();
    expect(renderResponse.queryByText('Date and Time')).not.toBeNull();
  });
});
