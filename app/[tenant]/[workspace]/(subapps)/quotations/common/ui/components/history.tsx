'use client';
import React from 'react';
import {Separator} from '@ui/components/separator';
import {Button} from '@ui/components/button';
import {MdOutlineFileDownload} from 'react-icons/md';
// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import styles from './styles.module.scss';
export const History = () => {
  return (
    <>
      <div className="flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h4 className="text-xl font-medium mb-0">{i18n.get('History')}</h4>
        <Separator />
        <div>
          <div>
            <div className="flex justify-between p-4 border-l border-black">
              <h6 className="text-base font-semibold mb-0">
                {i18n.get('History action')}
              </h6>
              <p className={`${styles['history-date']} text-base mb-0`}>
                23/11/2023
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                className="flex items-center justify-center mx-6 gap-3 rounded-full font-normal">
                <MdOutlineFileDownload className="text-2xl" />
                {i18n.get('Open/download file')}
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <div>
            <div className="flex justify-between p-4 border-l border-black">
              <h6 className="text-base font-semibold mb-0">
                {i18n.get('History action')}
              </h6>
              <p className={`${styles['history-date']} text-base mb-0`}>
                23/11/2023
              </p>
            </div>
            <div>
              <Button className="flex items-center justify-center mx-6 gap-3 rounded-full font-normal">
                {i18n.get('Give a response')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default History;
