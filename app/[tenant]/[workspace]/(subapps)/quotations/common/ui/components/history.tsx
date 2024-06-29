'use client';

import React from 'react';
import {MdOutlineFileDownload} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Separator} from '@ui/components/separator';
import {Button} from '@ui/components/button';
import {i18n} from '@/lib/i18n';

export const History = () => {
  return (
    <>
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-6 rounded-lg">
        <h4 className="text-xl font-medium">{i18n.get('History')}</h4>
        <Separator />
        <div>
          <div>
            <div className="flex justify-between p-4 border-l border-foreground">
              <h6 className="font-semibold">{i18n.get('History action')}</h6>
              <p>23/11/2023</p>
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
            <div className="flex justify-between p-4 border-l border-foreground">
              <h6 className="font-semibold">{i18n.get('History action')}</h6>
              <p>23/11/2023</p>
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
