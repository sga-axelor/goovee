'use client';

import {useState} from 'react';
import {
  MdOutlineFileDownload,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Separator,
} from '@/ui/components';
import {parseDate} from '@/utils/date';
import {i18n} from '@/lib/core/locale';

// ---- LOCAL IMPORTS ---- //
import {DOWNLOAD_PDF} from '@/subapps/orders/common/constants/orders';

export function ExpandableCard({
  title,
  records,
  isDisabled,
  onDownload,
}: {
  title: string;
  records: any[];
  isDisabled: boolean | ((record: any) => boolean);
  onDownload: (record: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!records?.length) {
    return;
  }
  return (
    <div>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full bg-white space-y-2.5 !p-6 rounded-md">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-medium">{title}</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <MdOutlineKeyboardArrowUp className="h-6 w-6" />
              ) : (
                <MdOutlineKeyboardArrowDown className="h-6 w-6" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="flex flex-col gap-2.5">
          {records?.map((record: any) => {
            const isButtonDisabled =
              typeof isDisabled === 'function'
                ? isDisabled(record)
                : isDisabled;

            return (
              <div key={record.id} className="flex flex-col gap-4 mb-4">
                <Separator />
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex gap-4 justify-between">
                    <div className="font-medium">{i18n.t('Number')}:</div>
                    <div>{record.number}</div>
                  </div>
                  <div className="flex gap-4 justify-between">
                    <div className="font-medium">{i18n.t('Created on')}:</div>
                    <div>{parseDate(record.createdOn)}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 bg-white hover:bg-white text-success hover:text-success border-success font-medium text-base"
                  disabled={isButtonDisabled}
                  onClick={async () => await onDownload(record)}>
                  <MdOutlineFileDownload className="h-6 w-6" />
                  {i18n.t(DOWNLOAD_PDF)}
                </Button>
              </div>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default ExpandableCard;
