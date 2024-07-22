'use client';

// ---- CORE IMPORTS ---- //
import {Button, Card} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import type {
  EventSelectorProps,
  Category,
} from '@/subapps/events/common/ui/components';
import {Calendar} from '@/subapps/events/common/ui/components';

export const EventSelector = ({
  date,
  setDate,
  updateCateg,
  categories,
  workspace,
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
    <Card className="p-4 border-none shadow-none  space-y-4  lg:min-w-96 h-fit rounded-2xl">
      <Calendar
        workspace={workspace}
        date={date}
        mode="single"
        selected={date}
        onSelect={handleSelect}
        className="flex items-center justify-center mx-auto max-w-[12.5rem] xs:max-w-none"
      />
      <div className="flex flex-col space-y-2">
        {categories?.map(category => (
          <Button
            onClick={() => selectCategory(category)}
            className={`p-2 rounded-lg font-normal lg:font-medium`}
            key={category.id}>
            {category.name}
          </Button>
        ))}
      </div>
    </Card>
  );
};
