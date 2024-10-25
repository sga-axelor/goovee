// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components/badge';

// ---- LOCAL IMPORTS ---- //
import {EventCardBadgesProps} from '@/subapps/events/common/ui/components';
import {getColorStyles} from '@/subapps/events/common/utils';

export const EventCardBadges = ({categories}: EventCardBadgesProps) => {
  return (
    <div className="flex items-center flex-wrap gap-y-2 gap-x-4 ">
      {categories?.map((category: any) => {
        const {
          backgroundColor,
          textColor,
          hoverBackgroundColor,
          hoverTextColor,
        } = getColorStyles(category.color, true);

        return (
          <Badge
            key={category?.id}
            className={`rounded-2xl shrink-0 px-2 py-1 text-[0.625rem] font-normal w-fit]`}
            style={{backgroundColor, color: textColor}}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = hoverBackgroundColor;
              e.currentTarget.style.color = hoverTextColor;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = backgroundColor;
              e.currentTarget.style.color = textColor;
            }}>
            {category?.name}
          </Badge>
        );
      })}
    </div>
  );
};
