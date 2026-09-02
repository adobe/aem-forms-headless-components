/*
 * Copyright 2026 Adobe, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Table from '../../src/components/Table/Table';
import { createForm, Provider, renderComponent } from '../utils';
import '@testing-library/jest-dom/extend-expect';

const headerItem = {
  id: 'header-test',
  fieldType: 'panel',
  ':type': 'table-header',
  name: 'header',
  label: { value: 'Header Row', visible: true },
  visible: true,
  enabled: true,
  index: 0,
  items: [
    { id: 'col1', fieldType: 'plain-text', ':type': 'plain-text', name: 'col1', value: 'Column 1', index: 0 },
    { id: 'col2', fieldType: 'plain-text', ':type': 'plain-text', name: 'col2', value: 'Column 2', index: 1 },
  ],
};

const rowItem = {
  id: 'row1-test',
  fieldType: 'panel',
  ':type': 'table-row',
  name: 'row1',
  label: { value: 'Row 1', visible: true },
  visible: true,
  enabled: true,
  index: 1,
  items: [
    { id: 'cell1', fieldType: 'text-input', ':type': 'text-input', name: 'cell1', type: 'string', label: { value: '' }, index: 0 },
    { id: 'cell2', fieldType: 'text-input', ':type': 'text-input', name: 'cell2', type: 'string', label: { value: '' }, index: 1 },
  ],
};

const tableField = {
  id: 'table-test',
  fieldType: 'panel',
  ':type': 'table',
  name: 'table1',
  label: { value: 'Test Table', visible: true },
  visible: true,
  enabled: true,
  index: 0,
  enableSorting: false,
  items: [headerItem, rowItem],
};

const fullField = {
  id: 'table-52dfd36109',
  fieldType: 'panel',
  name: 'table1786517710602',
  ':type': 'table',
  label: { value: 'Table' },
  visible: true,
  enabled: true,
  index: 0,
  enableSorting: true,
  items: [
    {
      id: 'tableheader-5ae4718dd5',
      fieldType: 'panel',
      ':type': 'table-header',
      name: 'header1786517710631',
      label: { value: 'Header Row' },
      visible: true,
      enabled: true,
      index: 0,
      items: [
        { id: 'text-b805a4780f', fieldType: 'plain-text', name: 'column1', value: 'Column 1', index: 0 },
        { id: 'text-9575c7c94f', fieldType: 'plain-text', name: 'column2', value: 'Column 2', index: 1 },
      ],
    },
    {
      id: 'tablerow-6c377ff30e',
      fieldType: 'panel',
      ':type': 'table-row',
      name: 'row11786517710665',
      label: { value: 'Row 1' },
      visible: true,
      enabled: true,
      index: 1,
      items: [
        { id: 'textinput-c849d0b688', fieldType: 'text-input', name: 'cell1', type: 'string', label: { value: '' }, index: 0 },
        { id: 'textinput-4e1d3fc2df', fieldType: 'text-input', name: 'cell2', type: 'string', label: { value: '' }, index: 1 },
      ],
    },
  ],
};

const helper = renderComponent(Table);

describe('Table', () => {
  test('renders <table> element', () => {
    const { renderResponse } = helper(tableField);
    expect(renderResponse.container.querySelector('table')).not.toBeNull();
  });

  test('renders label', () => {
    const { renderResponse } = helper(tableField);
    expect(renderResponse.queryByText(tableField.label.value)).not.toBeNull();
  });

  test('renders <thead> and <tbody>', () => {
    const { renderResponse } = helper(tableField);
    expect(renderResponse.container.querySelector('thead')).not.toBeNull();
    expect(renderResponse.container.querySelector('tbody')).not.toBeNull();
  });

  test('header items render as <th> in <thead>', () => {
    const { renderResponse } = helper(tableField);
    const thead = renderResponse.container.querySelector('thead');
    const headers = thead?.querySelectorAll('th');
    expect(headers?.length).toBe(2);
  });

  test('row items render as <tr> in <tbody>', () => {
    const { renderResponse } = helper(tableField);
    const tbody = renderResponse.container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');
    expect(rows?.length).toBe(1);
  });

  test('row cells render as <td>', () => {
    const { renderResponse } = helper(tableField);
    const tbody = renderResponse.container.querySelector('tbody');
    const cells = tbody?.querySelectorAll('td');
    expect(cells?.length).toBe(2);
  });

  test('table is hidden when visible is false', () => {
    const { renderResponse } = helper({ ...tableField, visible: false });
    expect(renderResponse.queryByText(tableField.label.value)).toBeNull();
  });

  test('sort buttons absent when enableSorting is false', () => {
    const { renderResponse } = helper({ ...tableField, enableSorting: false });
    const sortButtons = renderResponse.container.getElementsByClassName('cmp-adaptiveform-table__sort-button');
    expect(sortButtons.length).toBe(0);
  });

  test('sort buttons appear when enableSorting is true', () => {
    const { renderResponse } = helper({ ...tableField, enableSorting: true });
    const sortButtons = renderResponse.container.getElementsByClassName('cmp-adaptiveform-table__sort-button');
    expect(sortButtons.length).toBe(2);
  });

  test('cmp-adaptiveform-table BEM block on root div', () => {
    const { renderResponse } = helper(tableField);
    const root = renderResponse.container.querySelector('.cmp-adaptiveform-table');
    expect(root).not.toBeNull();
    expect(root?.getAttribute('data-cmp-is')).toBe('adaptiveFormTable');
  });

  test('header <tr> has adaptiveFormTableHeader data-cmp-is', () => {
    const { renderResponse } = helper(tableField);
    const headerRow = renderResponse.container.querySelector('.cmp-adaptiveform-tableheader');
    expect(headerRow?.getAttribute('data-cmp-is')).toBe('adaptiveFormTableHeader');
  });

  test('body <tr> has adaptiveFormTableRow data-cmp-is', () => {
    const { renderResponse } = helper(tableField);
    const dataRow = renderResponse.container.querySelector('.cmp-adaptiveform-tablerow');
    expect(dataRow?.getAttribute('data-cmp-is')).toBe('adaptiveFormTableRow');
  });

  test('tooltip and description toggle correctly', async () => {
    const f = {
      ...tableField,
      tooltip: 'Short Description',
      description: 'Long Description',
      properties: { 'afs:layout': { tooltipVisible: true } },
    };
    const { renderResponse } = await helper(f);
    expect(renderResponse.getByText('Short Description')).not.toBeNull();
    const button = renderResponse.container.getElementsByClassName('cmp-adaptiveform-table__questionmark');
    if (button.length > 0) {
      (button[0] as HTMLButtonElement).click();
      expect(renderResponse.getByText('Long Description')).not.toBeNull();
    }
  });

  test('full model.json field renders without errors', async () => {
    const form = await createForm(fullField);
    const state = form.items[0].getState();
    const tableEl = <Table {...(state as any)} />;
    const wrapper = Provider(form);
    const { container } = render(tableEl, { wrapper });
    expect(container.querySelector('table')).not.toBeNull();
    expect(container.querySelector('thead')).not.toBeNull();
    expect(container.querySelector('tbody')).not.toBeNull();
  });

  test('data-label on <td> matches its column header text', () => {
    const { renderResponse } = helper(tableField);
    const cells = renderResponse.container.querySelectorAll('tbody td');
    expect(cells[0].getAttribute('data-label')).toBe('Column 1');
    expect(cells[1].getAttribute('data-label')).toBe('Column 2');
  });

  test('mobile bar renders with Sort and Filter buttons', () => {
    const { renderResponse } = helper(tableField);
    const sortBtn = renderResponse.container.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--sort');
    const filterBtn = renderResponse.container.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--filter');
    expect(sortBtn).not.toBeNull();
    expect(filterBtn).not.toBeNull();
  });

  test('mobile Sort button disabled when enableSorting is false', () => {
    const { renderResponse } = helper({ ...tableField, enableSorting: false });
    const sortBtn = renderResponse.container.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--sort');
    expect(sortBtn).toBeDisabled();
  });

  test('mobile Sort button enabled when enableSorting is true', () => {
    const { renderResponse } = helper({ ...tableField, enableSorting: true });
    const sortBtn = renderResponse.container.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--sort');
    expect(sortBtn).not.toBeDisabled();
  });

  test('opening sort sheet lists one option per column', () => {
    const { renderResponse } = helper({ ...tableField, enableSorting: true });
    const sortBtn = renderResponse.container.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--sort') as HTMLButtonElement;
    fireEvent.click(sortBtn);
    const options = renderResponse.container.querySelectorAll('.cmp-adaptiveform-table__sort-option');
    expect(options.length).toBe(2);
  });

  test('selecting a sort option closes the sheet and marks it selected', () => {
    const { renderResponse } = helper({ ...tableField, enableSorting: true });
    const sortBtn = renderResponse.container.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--sort') as HTMLButtonElement;
    fireEvent.click(sortBtn);
    const firstOption = renderResponse.container.querySelector('[data-col-index="0"]') as HTMLElement;
    fireEvent.click(firstOption);
    expect(renderResponse.container.querySelector('.cmp-adaptiveform-table__sort-scrim')).toBeNull();
  });

  test('opening filter sheet and selecting Ascending closes the sheet', () => {
    const { renderResponse } = helper({ ...tableField, enableSorting: true });
    const filterBtn = renderResponse.container.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--filter') as HTMLButtonElement;
    fireEvent.click(filterBtn);
    const ascOption = renderResponse.container.querySelector('[data-dir="asc"]') as HTMLElement;
    expect(ascOption).not.toBeNull();
    fireEvent.click(ascOption);
    expect(renderResponse.container.querySelector('.cmp-adaptiveform-table__sort-scrim')).toBeNull();
  });

  test('Escape key closes an open sheet', () => {
    const { renderResponse } = helper({ ...tableField, enableSorting: true });
    const sortBtn = renderResponse.container.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--sort') as HTMLButtonElement;
    fireEvent.click(sortBtn);
    expect(renderResponse.container.querySelector('.cmp-adaptiveform-table__sort-scrim')).not.toBeNull();
    fireEvent.keyDown(renderResponse.container.querySelector('.cmp-adaptiveform-table__sort-scrim') as HTMLElement, { key: 'Escape' });
    expect(renderResponse.container.querySelector('.cmp-adaptiveform-table__sort-scrim')).toBeNull();
  });

  test('clicking scrim background closes the sheet', () => {
    const { renderResponse } = helper({ ...tableField, enableSorting: true });
    const sortBtn = renderResponse.container.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--sort') as HTMLButtonElement;
    fireEvent.click(sortBtn);
    const scrim = renderResponse.container.querySelector('.cmp-adaptiveform-table__sort-scrim') as HTMLElement;
    fireEvent.click(scrim);
    expect(renderResponse.container.querySelector('.cmp-adaptiveform-table__sort-scrim')).toBeNull();
  });
});
