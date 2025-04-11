'use client';

import {useState} from 'react';
import {
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

export function ExpandableCard({
  title,
  children,
  initialState,
}: {
  title: string;
  children: any;
  initialState?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false || initialState);

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
          <Separator />
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default ExpandableCard;
