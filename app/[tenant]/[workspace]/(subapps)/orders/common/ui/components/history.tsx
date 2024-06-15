'use client';
import React from 'react';
import {Separator} from '@ui/components/separator';
// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
export const History = () => {
  return (
    <>
      <div className="flex flex-col gap-4 bg-background p-6 rounded-lg">
        <h4 className="text-xl font-medium mb-0">{i18n.get('History')}</h4>
        <Separator />
        <div>
          <div className="flex justify-between p-4 border-l !border-primary">
            <h6 className="text-base font-semibold mb-0">
              {i18n.get('History action')}
            </h6>
            <h6 className="text-base text-detail-blue mb-0">23/11/2023</h6>
          </div>
        </div>
      </div>
    </>
  );
};
export default History;
