// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components/badge';

// ---- LOCAL IMPORTS ---- //
import {EventCardBadgesProps} from '@/subapps/events/common/ui/components';

export const EventCardBadges = ({categories}: EventCardBadgesProps) => {
  return (
    <div className="flex items-center flex-wrap gap-y-2 gap-x-4 ">
      {categories?.map(category => {
        return (
          <Badge
            key={category?.id}
            className={`rounded-2xl shrink-0 px-2 py-1 text-[0.625rem] font-normal w-fit]`}>
            {category?.name}
          </Badge>
        );
      })}
    </div>
  );
};
