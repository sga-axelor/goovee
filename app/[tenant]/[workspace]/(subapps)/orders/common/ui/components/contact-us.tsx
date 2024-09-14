'use client';

import React from 'react';
import {MdKeyboardReturn, MdHelpOutline} from 'react-icons/md';
import {Separator, Button} from '@/ui/components';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';

export const ContactUs = () => {
  return (
    <>
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-6 rounded-lg">
        <h4 className="text-xl font-medium mb-0">{i18n.get('ContactUs')}</h4>
        <Separator />
        <Button
          variant="outline"
          className="flex items-center justify-center gap-3 rounded-full w-full !font-medium">
          <MdKeyboardReturn className="text-2xl" /> {i18n.get('Return product')}
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-3 rounded-full w-full !font-medium">
          <MdHelpOutline className="text-2xl" /> {i18n.get('Need help')}
        </Button>
      </div>
    </>
  );
};
export default ContactUs;
