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
import { useFormIntl } from '@aemforms/af-react-renderer';

type SortDirection = 'asc' | 'desc' | null;

type SortState = {
  colIndex: number;
  direction: SortDirection;
};

type TableMobileBarProps = {
  columnLabels: string[];
  enableSorting?: boolean;
  sortState: SortState;
  onSort: (colIndex: number, forceDir?: SortDirection) => void;
};

type OpenSheet = 'sort' | 'filter' | null;

const TableMobileBar = (props: TableMobileBarProps) => {
  const { columnLabels, enableSorting, sortState, onSort } = props;
  const i18n = useFormIntl();

  const [openSheet, setOpenSheet] = React.useState<OpenSheet>(null);
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const sortButtonRef = React.useRef<HTMLButtonElement>(null);
  const filterButtonRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const t = React.useCallback((key: string, defaultMessage: string) => (
    i18n.formatMessage({ id: `table.mobile.${key}`, defaultMessage })
  ), [i18n]);

  const closeSheet = React.useCallback(() => {
    setOpenSheet(null);
    document.body.style.overflow = '';
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const openSort = () => {
    triggerRef.current = sortButtonRef.current;
    setOpenSheet('sort');
    document.body.style.overflow = 'hidden';
  };

  const openFilter = () => {
    triggerRef.current = filterButtonRef.current;
    setOpenSheet('filter');
    document.body.style.overflow = 'hidden';
  };

  React.useEffect(() => {
    if (!openSheet) return;
    const firstOption = sheetRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
    firstOption?.focus();
  }, [openSheet]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>('[tabindex="0"]');
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleSortOptionActivate = (colIndex: number) => {
    onSort(colIndex);
    closeSheet();
  };

  const handleFilterOptionActivate = (dir: SortDirection) => {
    const colIndex = sortState.colIndex >= 0 ? sortState.colIndex : 0;
    onSort(colIndex, dir);
    closeSheet();
  };

  const activateOnKey = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <>
      <div className="cmp-adaptiveform-table__mobile-bar">
        <button
          ref={sortButtonRef}
          type="button"
          className="cmp-adaptiveform-table__mobile-bar-btn cmp-adaptiveform-table__mobile-bar-btn--sort"
          aria-haspopup="listbox"
          aria-label={t('sortTable', 'Sort table')}
          disabled={!enableSorting}
          onClick={openSort}
        >
          <span aria-hidden="true">⇅</span>
          <span>{t('sort', 'Sort')}</span>
        </button>
        <div className="cmp-adaptiveform-table__mobile-bar-divider" role="separator" aria-orientation="vertical" />
        <button
          ref={filterButtonRef}
          type="button"
          className="cmp-adaptiveform-table__mobile-bar-btn cmp-adaptiveform-table__mobile-bar-btn--filter"
          aria-haspopup="dialog"
          aria-label={t('filterTable', 'Filter table')}
          onClick={openFilter}
        >
          <span aria-hidden="true">▼</span>
          <span>{t('filter', 'Filter')}</span>
        </button>
      </div>

      {openSheet === 'sort' && (
        <div
          className="cmp-adaptiveform-table__sort-scrim is-open"
          role="dialog"
          aria-modal="true"
          aria-label={t('sortOptions', 'Sort options')}
          onClick={(e) => { if (e.target === e.currentTarget) closeSheet(); }}
          onKeyDown={handleKeyDown}
        >
          <div className="cmp-adaptiveform-table__sort-sheet" ref={sheetRef}>
            <div className="cmp-adaptiveform-table__sort-sheet-handle" aria-hidden="true" />
            <p className="cmp-adaptiveform-table__sort-sheet-title">{t('sortBy', 'Sort by')}</p>
            <ul className="cmp-adaptiveform-table__sort-options" role="listbox" aria-label={t('sortColumns', 'Sort columns')}>
              {columnLabels.map((label, colIndex) => {
                const isActive = sortState.colIndex === colIndex;
                return (
                  <li
                    key={colIndex}
                    className="cmp-adaptiveform-table__sort-option"
                    role="option"
                    tabIndex={0}
                    data-col-index={colIndex}
                    aria-selected={isActive}
                    onClick={() => handleSortOptionActivate(colIndex)}
                    onKeyDown={(e) => activateOnKey(e, () => handleSortOptionActivate(colIndex))}
                  >
                    <span className="cmp-adaptiveform-table__sort-option-label">{label}</span>
                    <span
                      className={[
                        'cmp-adaptiveform-table__sort-option-indicator',
                        isActive && sortState.direction === 'asc' ? 'cmp-adaptiveform-table__sort-button--asc' : '',
                        isActive && sortState.direction === 'desc' ? 'cmp-adaptiveform-table__sort-button--desc' : '',
                      ].filter(Boolean).join(' ')}
                      aria-hidden="true"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {openSheet === 'filter' && (
        <div
          className="cmp-adaptiveform-table__sort-scrim is-open"
          role="dialog"
          aria-modal="true"
          aria-label={t('filterTable', 'Filter table')}
          onClick={(e) => { if (e.target === e.currentTarget) closeSheet(); }}
          onKeyDown={handleKeyDown}
        >
          <div className="cmp-adaptiveform-table__sort-sheet" ref={sheetRef}>
            <div className="cmp-adaptiveform-table__sort-sheet-handle" aria-hidden="true" />
            <p className="cmp-adaptiveform-table__sort-sheet-title">{t('sortDirection', 'Sort direction')}</p>
            <ul className="cmp-adaptiveform-table__sort-options" role="listbox" aria-label={t('sortOrder', 'Sort order')}>
              {(['asc', 'desc'] as const).map((dir) => {
                const isActive = sortState.direction === dir;
                return (
                  <li
                    key={dir}
                    className="cmp-adaptiveform-table__sort-option"
                    role="option"
                    tabIndex={0}
                    data-dir={dir}
                    aria-selected={isActive}
                    onClick={() => handleFilterOptionActivate(dir)}
                    onKeyDown={(e) => activateOnKey(e, () => handleFilterOptionActivate(dir))}
                  >
                    <span className="cmp-adaptiveform-table__sort-option-label">
                      {dir === 'asc' ? t('ascending', 'Ascending') : t('descending', 'Descending')}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default TableMobileBar;
