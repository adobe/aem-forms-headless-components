// *******************************************************************************
//  * Copyright 2026 Adobe
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  *
//  * BEM markup follows AEM core form components guidelines.
//  * LINK- https://github.com/adobe/aem-core-forms-components
//  ******************************************************************************

import React from 'react';
import { FormContext } from '@aemforms/af-react-renderer';
import { withRuleEnginePanel } from '../../utils/withRuleEngine';
import { PROPS_PANEL } from '../../utils/type';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import RepeatableTableRow from './RepeatableTableRow';
import TableMobileBar from './TableMobileBar';

type SortDirection = 'asc' | 'desc' | null;

type SortState = {
  colIndex: number;
  direction: SortDirection;
};

const Table = (props: PROPS_PANEL) => {
  const { items, id, visible, enabled, label, appliedCssClassNames } = props;
  const enableSorting = (props as any).enableSorting as boolean;
  const columnWidth = ((props as any).columnWidth
    || (props as any).properties?.['fd:dor']?.columnWidth) as string | undefined;

  // @ts-ignore
  const { form } = React.useContext(FormContext);

  const headerItems = items.filter((item: any) => item[':type'] === 'table-header');
  // Static rows have :type 'table-row'; repeatable rows are wrapped by af-core into
  // a generated array-type panel with :type 'panel' and type 'array'.
  const rawRowItems = items.filter((item: any) =>
    item[':type'] === 'table-row' || item.type === 'array'
  );

  const [sortState, setSortState] = React.useState<SortState>({ colIndex: -1, direction: null });

  const handleSort = React.useCallback((colIndex: number, forceDir?: SortDirection) => {
    if (forceDir) {
      setSortState({ colIndex, direction: forceDir });
      return;
    }
    setSortState(prev => {
      if (prev.colIndex !== colIndex) return { colIndex, direction: 'asc' };
      return { colIndex, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
    });
  }, []);

  const columnLabels: string[] = React.useMemo(() => (
    ((headerItems[0] as any)?.items || []).map((cell: any) => cell.label?.value ?? cell.value ?? '')
  ), [headerItems]);

  const getLiveCellValue = React.useCallback((rowId: string, colIndex: number): string => {
    const rowEl = form?.getElement(rowId);
    if (!rowEl) return '';
    const rowState = rowEl.getState();
    const cell = rowState.items?.[colIndex];
    if (!cell) return '';
    const val = cell.value ?? cell.default ?? '';
    return String(val).toLowerCase();
  }, [form]);

  const rowItems = React.useMemo(() => {
    if (!sortState.direction || sortState.colIndex < 0) return rawRowItems;
    return [...rawRowItems].sort((a: any, b: any) => {
      const av = getLiveCellValue(a.id, sortState.colIndex);
      const bv = getLiveCellValue(b.id, sortState.colIndex);
      const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' });
      return sortState.direction === 'asc' ? cmp : -cmp;
    });
  }, [rawRowItems, sortState, getLiveCellValue]);

  // Parse "1,2,1" into percentage widths: total=4, cols=[25%, 50%, 25%]
  const colWidths: string[] = React.useMemo(() => {
    if (!columnWidth) return [];
    const parts = columnWidth.split(',').map((s: string) => Number(s.trim())).filter(Boolean);
    if (!parts.length) return [];
    const total = parts.reduce((a: number, b: number) => a + b, 0);
    return parts.map((w: number) => `${((w / total) * 100).toFixed(2)}%`);
  }, [columnWidth]);

  const tableStyle = columnWidth ? { tableLayout: 'fixed' as const, width: '100%' } : undefined;

  return (
    <div
      className={`cmp-adaptiveform-table cmp-container ${appliedCssClassNames || ''}`}
      id={id}
      data-cmp-is="adaptiveFormTable"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-sorting-enabled={enableSorting ? 'true' : 'false'}
    >
      {label?.visible !== false && (
        <div className="cmp-adaptiveform-table__title cmp-container__label">
          {label?.value}
        </div>
      )}
      <div className="cmp-adaptiveform-table__help-container">
        {props.tooltip && (
          <div
            className="cmp-adaptiveform-table__questionmark"
            id={`${id}__shortdescription`}
          >
            {props.tooltip}
          </div>
        )}
      </div>
      {props.description && (
        <div
          className="cmp-adaptiveform-table__longdescription"
          id={`${id}__longdescription`}
        >
          {props.description}
        </div>
      )}
      <TableMobileBar
        columnLabels={columnLabels}
        enableSorting={enableSorting}
        sortState={sortState}
        onSort={handleSort}
      />
      <table
        className="cmp-adaptiveform-table__widget"
        aria-label={label?.value || ''}
        style={tableStyle}
      >
        {colWidths.length > 0 && (
          <colgroup>
            {colWidths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
        )}
        <thead className="cmp-adaptiveform-table__head">
          {headerItems.map((item: any) => (
            <TableHeader
              key={item.id}
              {...item}
              enableSorting={enableSorting}
              sortColIndex={sortState.colIndex}
              sortDirection={sortState.direction}
              onSort={handleSort}
            />
          ))}
        </thead>
        <tbody className="cmp-adaptiveform-table__body">
          {rowItems.map((item: any) =>
            item.type === 'array'
              ? <RepeatableTableRow key={item.id} {...item} headerLabels={columnLabels} />
              : <TableRow key={item.id} {...item} headerLabels={columnLabels} />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default withRuleEnginePanel(Table);
