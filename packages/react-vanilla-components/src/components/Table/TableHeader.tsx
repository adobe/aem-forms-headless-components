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

type TableHeaderProps = {
  id: string;
  visible?: boolean;
  enabled?: boolean;
  items?: any[];
  enableSorting?: boolean;
};

const TableHeader = (props: TableHeaderProps) => {
  const { id, visible, enabled, items = [], enableSorting } = props;
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
      {items.map((cell: any) => {
        const Comp = getRenderer(cell, mappings);
        const content = Comp ? <Comp key={`${cell.id}-content`} {...cell} /> : null;
        return (
          <th
            key={cell.id}
            className="cmp-adaptiveform-tablehead"
            scope="col"
            data-cmp-hook-tablehead="header"
          >
            {enableSorting ? (
              <div className="cmp-adaptiveform-table__sort-header-inner">
                <div className="cell-wrapper">{content}</div>
                <button
                  type="button"
                  className="cmp-adaptiveform-table__sort-button"
                  aria-label="Sort column"
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
