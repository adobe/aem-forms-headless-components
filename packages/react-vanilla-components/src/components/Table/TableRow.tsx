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

type TableRowProps = {
  id: string;
  visible?: boolean;
  enabled?: boolean;
  readOnly?: boolean;
  items?: any[];
  onAdd?: () => void;
  onRemove?: () => void;
  showAdd?: boolean;
  showRemove?: boolean;
};

const TableRow = (props: TableRowProps) => {
  const { id, visible, enabled, readOnly, items = [], onAdd, onRemove, showAdd, showRemove } = props;
  // @ts-ignore
  const { mappings } = useContext(FormContext);

  const isRepeatable = !!(onAdd || onRemove);

  return (
    <tr
      id={id}
      className="cmp-adaptiveform-tablerow cmp-adaptiveform-tablerow__root"
      data-cmp-is="adaptiveFormTableRow"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-readonly={readOnly ? 'true' : 'false'}
    >
      {items.map((cell: any, i: number) => {
        const Comp = getRenderer(cell, mappings);
        const isLast = i === items.length - 1;
        const colspan = cell.properties?.colspan || cell.colspan;
        const tdClass = `cmp-adaptiveform-tablecell${isRepeatable && isLast ? ' cmp-adaptiveform-tablecell--with-row-controls' : ''}`;

        return (
          <td
            key={cell.id}
            className={tdClass}
            colSpan={colspan ? Number(colspan) : undefined}
          >
            {Comp ? <Comp {...cell} /> : null}
            {isRepeatable && isLast && (
              <div className="cmp-adaptiveform-tablerow__runtime-controls" role="group">
                {showAdd && (
                  <button
                    type="button"
                    className="cmp-adaptiveform-tablerow__add-button"
                    data-cmp-hook-add-instance={id}
                    title="Add row"
                    aria-label="Add row"
                    onClick={onAdd}
                  />
                )}
                {showRemove && (
                  <button
                    type="button"
                    className="cmp-adaptiveform-tablerow__remove-button"
                    data-cmp-hook-remove-instance={id}
                    title="Remove row"
                    aria-label="Remove row"
                    onClick={onRemove}
                  />
                )}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
