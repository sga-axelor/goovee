'use client';

import {
  Fragment,
  MouseEvent,
  ReactNode,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {
  Collapsible,
  CollapsibleContent,
  TableCell,
  TableRow,
} from '@/ui/components';
import {useResponsive} from '@/ui/hooks';
import {RESPONSIVE_SIZES} from '@/constants';

type TableRowsProps<T extends Record<string, any>> = {
  rows: T[];
  columns: any[];
  onRowClick?: (record: T, e: MouseEvent<HTMLTableRowElement>) => void;
  deleteCellRenderer?: (record: T) => ReactNode;
};

export function ExpandableTableRows<T extends Record<string, any>>({
  rows,
  columns,
  deleteCellRenderer,
  onRowClick,
}: TableRowsProps<T>) {
  const [openId, setOpenId] = useState<string | null>(null);

  const res = useResponsive();

  const isSmallScreen = useMemo(
    () => RESPONSIVE_SIZES.some(size => res[size]),
    [res],
  );

  const [mainColumns, subColumns] = useMemo(
    () => [
      columns.filter(c => (isSmallScreen ? c.mobile : true)),
      isSmallScreen ? columns.filter(c => !c.mobile) : [],
    ],
    [isSmallScreen, columns],
  );

  const handleClick = useCallback(
    (record: T, e: MouseEvent<HTMLTableRowElement>) => onRowClick?.(record, e),
    [onRowClick],
  );

  const handleToggle = useCallback(
    (recordId: string) => (e: MouseEvent<HTMLTableCellElement>) => {
      e.stopPropagation();
      setOpenId(prevOpenId => (prevOpenId === recordId ? null : recordId));
    },
    [],
  );

  const renderedRows = useMemo(() => {
    if (!rows.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length + 1} align="center">
            {i18n.get('No records found')}
          </TableCell>
        </TableRow>
      );
    }

    return rows.map(row => {
      const open = openId === row.id;
      const Arrow = open ? MdArrowDropUp : MdArrowDropDown;

      return (
        <Fragment key={row.id}>
          <TableRow
            onClick={e => handleClick(row, e)}
            className="cursor-pointer [&:not(:has(.action:hover)):hover]:bg-slate-100 text-xs">
            {mainColumns.map((column: any) => (
              <TableCell key={column.key} className="p-3">
                {column.content(row)}
              </TableCell>
            ))}

            {isSmallScreen && (
              <TableCell
                className="p-3 action text-center"
                onClick={handleToggle(row.id)}>
                <Arrow className="cursor-pointer inline" />
              </TableCell>
            )}

            {deleteCellRenderer && (
              <TableCell className="text-center action pointer-events-none p-3">
                {deleteCellRenderer(row)}
              </TableCell>
            )}
          </TableRow>

          {isSmallScreen && (
            <Collapsible open={open} asChild>
              <TableRow className="text-xs">
                <CollapsibleContent asChild>
                  <TableCell colSpan={mainColumns.length + 2}>
                    <div className="grid grid-cols-2 gap-y-2 auto-rows-fr items-center">
                      {subColumns.map((column: any) => (
                        <Item key={column.key} label={column.label}>
                          {column.content(row)}
                        </Item>
                      ))}
                    </div>
                  </TableCell>
                </CollapsibleContent>
              </TableRow>
            </Collapsible>
          )}
        </Fragment>
      );
    });
  }, [
    rows,
    columns.length,
    openId,
    mainColumns,
    isSmallScreen,
    handleToggle,
    deleteCellRenderer,
    subColumns,
    handleClick,
  ]);

  return <>{renderedRows}</>;
}

export default ExpandableTableRows;

type ItemProps = {
  label: ReactNode;
  children: ReactNode;
};

function Item({label, children}: ItemProps) {
  return (
    <>
      <p className="text-xs font-semibold mb-0">{label}</p>
      <p className="flex justify-self-end items-center">{children}</p>
    </>
  );
}
