'use client';
import React from 'react';
import {LiaLongArrowAltRightSolid} from 'react-icons/lia';

// ---- CORE IMPORTS ---- //
import {Button, TableCell, TableRow, StyledTable, Tag} from '@/ui/components';
import {parseDate} from '@/utils/date';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import type {
  Quotations,
  QuotationsTableProps,
} from '@/subapps/quotations/common/types/quotations';
import {getStatus} from '@/subapps/quotations/common/utils/quotations';
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';
import styles from './styles.module.scss';
export const QuotationsTable = ({
  columns,
  quotations,
  onClick,
}: QuotationsTableProps) => {
  return (
    <>
      <div>
        <StyledTable columns={columns}>
          {quotations?.map((quotation: Quotations) => {
            const {status, variant} = getStatus(quotation.statusSelect);
            return (
              <TableRow
                key={quotation.id}
                className={styles['table-row']}
                onClick={() => onClick(quotation.id)}>
                <TableCell
                  className={`${styles['table-cell']} border-b font-semibold px-6 py-4`}>
                  {i18n.get('Sale quotation')} {quotation.saleOrderSeq}
                  {quotation.externalReference &&
                    ` ( ${quotation.externalReference} )`}
                </TableCell>
                <TableCell
                  className={`${styles['table-cell']} border-b px-6 py-4`}>
                  <Tag variant={variant}>{status}</Tag>
                </TableCell>
                <TableCell
                  className={`${styles['table-cell']} border-b px-6 py-4`}>
                  {parseDate(quotation.createdOn)}
                </TableCell>
                <TableCell
                  className={`${styles['table-cell']} border-b px-6 py-4`}>
                  {quotation?.statusSelect ===
                    QUOTATION_STATUS.FINALISED_QUOTATION && (
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-3 w-full rounded-full">
                      {i18n.get('Give a reponse')}{' '}
                      <LiaLongArrowAltRightSolid className="text-2xl" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </StyledTable>
      </div>
    </>
  );
};
export default QuotationsTable;
