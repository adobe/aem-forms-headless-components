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

import React, { useContext } from 'react';
import { FormContext, getRenderer } from '@aemforms/af-react-renderer';

type SortDirection = 'asc' | 'desc' | null;

type TableHeaderProps = {
  id: string;
  visible?: boolean;
  enabled?: boolean;
  items?: any[];
  enableSorting?: boolean;
  sortColIndex?: number;
  sortDirection?: SortDirection;
  onSort?: (colIndex: number) => void;
};

const TableHeader = (props: TableHeaderProps) => {
  const { id, visible, enabled, items = [], enableSorting, sortColIndex = -1, sortDirection = null, onSort } = props;
  // @ts-ignore
  const { mappings } = useContext(FormContext);

  return (
    <tr
      id={id}
      className="cmp-adaptiveform-tableheader"
      data-cmp-is="adaptiveFormTableHeader"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
    >
      {items.map((cell: any, index: number) => {
        const Comp = getRenderer(cell, mappings);
        const content = Comp ? <Comp key={`${cell.id}-content`} {...cell} /> : null;
        const colspan = cell.properties?.colspan || cell.colspan;
        const disableSorting = cell.properties?.disableSorting;
        const showSort = enableSorting && !disableSorting;
        const isActive = sortColIndex === index;
        const sortDir: SortDirection = isActive ? sortDirection : null;

        return (
          <th
            key={cell.id}
            className="cmp-adaptiveform-tablehead"
            scope="col"
            colSpan={colspan ? Number(colspan) : undefined}
            data-cmp-hook-tablehead="header"
          >
            {showSort ? (
              <div className="cmp-adaptiveform-table__sort-header-inner">
                {content}
                <button
                  type="button"
                  className={[
                    'cmp-adaptiveform-table__sort-button',
                    sortDir === 'asc' ? 'cmp-adaptiveform-table__sort-button--asc' : '',
                    sortDir === 'desc' ? 'cmp-adaptiveform-table__sort-button--desc' : '',
                  ].filter(Boolean).join(' ')}
                  data-cmp-hook-table-sort={index}
                  aria-label="Sort column"
                  onClick={() => onSort?.(index)}
                />
              </div>
            ) : (
              content
            )}
          </th>
        );
      })}
    </tr>
  );
};

export default TableHeader;
