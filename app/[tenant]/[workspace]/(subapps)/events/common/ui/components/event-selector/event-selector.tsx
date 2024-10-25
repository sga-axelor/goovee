'use client';

// ---- CORE IMPORTS ---- //
import {Card} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import type {
  EventSelectorProps,
  Category,
} from '@/subapps/events/common/ui/components';
import {Calendar} from '@/subapps/events/common/ui/components';
import {getColorStyles} from '@/subapps/events/common/utils';

export const EventSelector = ({
  date,
  setDate,
  updateCateg,
  categories,
  workspace,
  selectedCategories = [],
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

  return (
    <Card className="p-4 border-none shadow-none space-y-4 lg:min-w-96 h-fit rounded-2xl">
      <Calendar
        workspace={workspace}
        date={date}
        mode="single"
        selected={date}
        onSelect={handleSelect}
        className="flex items-center justify-center mx-auto max-w-[12.5rem] xs:max-w-none"
      />
      <div className="flex flex-col space-y-2">
        {categories.map((category: any) => {
          const isActive = selectedCategories.includes(category.id);
          const {
            backgroundColor,
            textColor,
            hoverBackgroundColor,
            hoverTextColor,
          } = getColorStyles(category.color, isActive);

          return (
            <div
              onClick={() => selectCategory(category)}
              className="p-2 rounded-lg text-sm font-normal text-start ease-out cursor-pointer"
              style={{backgroundColor, color: textColor}}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = hoverBackgroundColor;
                e.currentTarget.style.color = hoverTextColor;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = backgroundColor;
                e.currentTarget.style.color = textColor;
              }}
              key={category.id}>
              {category.name}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
