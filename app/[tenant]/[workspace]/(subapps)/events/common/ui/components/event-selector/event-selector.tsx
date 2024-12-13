'use client';

import React, {useState} from 'react';
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Checkbox,
  Card,
} from '@/ui/components';
import {i18n} from '@/locale';
import {cn} from '@/utils/css';

// ---- LOCAL IMPORTS ---- //
import type {
  EventSelectorProps,
  Category,
} from '@/subapps/events/common/ui/components';
import {Calendar} from '@/subapps/events/common/ui/components';
import {CATEGORIES} from '@/subapps/events/common/constants';

export const EventSelector = ({
  date,
  setDate,
  updateCateg,
  categories,
  workspace,
  selectedCategories = [],
  onlyRegisteredEvent = false,
}: EventSelectorProps) => {
  const selectCategory = (category: Category) => {
    updateCateg(category);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    } else {
      setDate(undefined);
    }
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Card className="p-4 border-none shadow-none flex flex-col gap-2 md:flex-row lg:flex-col h-fit rounded-2xl">
      <Calendar
        workspace={workspace}
        date={date}
        mode="single"
        selected={date}
        onSelect={handleSelect}
        className="flex justify-center mx-auto w-full md:flex-1"
        onlyRegisteredEvent={onlyRegisteredEvent}
      />
      <div className="flex flex-col space-y-2 md:flex-1">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-4">
          <div className="w-full flex items-center justify-between space-x-4 px-4 cursor-pointer">
            <CollapsibleTrigger asChild>
              <div className="w-full flex justify-between items-center">
                <h2 className="text-[18px] font-semibold">
                  {i18n.t(CATEGORIES)}
                </h2>
                {isOpen ? (
                  <MdOutlineKeyboardArrowUp className="h-4 w-4" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="h-4 w-4" />
                )}
              </div>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-4 mx-4">
            {categories.map((category: any) => {
              const isActive = selectedCategories.includes(category.id);

              return (
                <div className="flex items-center space-x-4" key={category.id}>
                  <Checkbox
                    id={category.id}
                    checked={isActive}
                    className={cn(
                      isActive
                        ? `border-none ${category?.color ? `!bg-palette-${category.color}-dark` : 'bg-black'}`
                        : '',
                    )}
                    onCheckedChange={() => selectCategory(category)}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {category.name}
                  </label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
};
