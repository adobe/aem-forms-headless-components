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
import { withRuleEnginePanel } from '../../utils/withRuleEngine';
import { PROPS_PANEL } from '../../utils/type';
import LabelWithDescription from '../common/LabelWithDescription';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const Table = (props: PROPS_PANEL) => {
  const { items, id, visible, enabled, label, appliedCssClassNames } = props;
  const enableSorting = (props as any).enableSorting as boolean;

  const headerItems = items.filter((item: any) => item[':type'] === 'table-header');
  const rowItems = items.filter((item: any) => item[':type'] === 'table-row');

  return (
    <div
      className={`cmp-adaptiveform-table cmp-container ${appliedCssClassNames || ''}`}
      id={id}
      data-cmp-is="adaptiveFormTable"
      data-cmp-visible={visible}
      data-cmp-enabled={enabled}
      data-cmp-sorting-enabled={enableSorting ? 'true' : 'false'}
    >
      <LabelWithDescription
        bemBlock="cmp-adaptiveform-table"
        label={label}
        id={id}
        tooltip={props.tooltip}
        description={props.description}
      />
      <table
        className="cmp-adaptiveform-table__widget"
        aria-label={label?.value || ''}
      >
        <thead className="cmp-adaptiveform-table__head">
          {headerItems.map((item: any) => (
            <TableHeader key={item.id} {...item} enableSorting={enableSorting} />
          ))}
        </thead>
        <tbody className="cmp-adaptiveform-table__body">
          {rowItems.map((item: any) => (
            <TableRow key={item.id} {...item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withRuleEnginePanel(Table);
