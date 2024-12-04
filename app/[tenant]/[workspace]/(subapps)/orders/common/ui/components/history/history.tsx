'use client';

import React from 'react';
import {Separator} from '@/ui/components';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';

export const History = () => {
  return (
    <>
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-6 rounded-lg">
        <h4 className="text-xl font-medium">{i18n.get('History')}</h4>
        <Separator />
        <div>
          <div className="flex justify-between p-4 border-l !border-card-foreground">
            <h6 className="font-semibold">{i18n.get('History action')}</h6>
            <h6 className="text-palette-blue-dark">23/11/2023</h6>
          </div>
        </div>
      </div>
    </>
  );
};
export default History;
