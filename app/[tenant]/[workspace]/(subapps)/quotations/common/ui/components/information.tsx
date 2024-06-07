'use client';
import React from 'react';
import { Separator } from "@ui/components/separator"
import { Button } from "@ui/components/button"
import { MdOutlineFileDownload } from "react-icons/md";
// ---- CORE IMPORTS ---- //
import { Tag } from '@/ui/components';
import { parseDate } from '@/utils';
import { i18n } from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import { getStatus } from '@/subapps/quotations/common/utils/quotations';
import { QUOTATION_STATUS } from '@/subapps/quotations/common/constants/quotations';
import type { InfoProps } from '@/subapps/quotations/common/types/quotations';
import styles from './styles.module.scss';
export const Informations = ({ statusSelect, endOfValidityDate }: InfoProps) => {
  const { variant, status } = getStatus(statusSelect);
  return (
    <>
      <div className='bg-white flex md:block flex-col rounded-lg p-4 md:p-6'>
        <h4 className="text-xl font-medium mb-0">{i18n.get('Informations')}</h4>
        <Separator className="my-2" />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h5 className={`${styles.text} text-lg font-semibold mb-0`}>{i18n.get('Status')}:</h5>
            <Tag variant={variant}>{status}</Tag>
          </div>
          <div className="flex items-center gap-[0.1rem]">
            <h5 className="text-lg font-semibold pr-1 mb-0">
              {i18n.get('End of validity')}:
            </h5>
            <p className="text-base mb-0">{endOfValidityDate ? parseDate(endOfValidityDate) : ''}</p>
          </div>
          {statusSelect === QUOTATION_STATUS.CANCELED_QUOTATION && (
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center mx-4 gap-3 rounded-full font-normal">
                <MdOutlineFileDownload className="text-2xl" />
                {i18n.get('Dowload order signed confirmation')}
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center mx-4 gap-3 rounded-full font-normal">
                <MdOutlineFileDownload className="text-2xl" /> {i18n.get('Download invoice')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Informations;