'use client';

// ---- CORE IMPORTS ----//
import {Badge} from '@/ui/components';
import {cn, generateColorStyles} from '@/utils/css';

export const BadgeList = ({
  items,
  rootClassName,
  labelClassName,
}: {
  items: any[];
  rootClassName?: string;
  labelClassName?: string;
}) => {
  return (
    <div
      className={cn(
        'flex items-center flex-wrap gap-y-2 gap-x-4 h-fit',
        rootClassName,
      )}>
      {items?.map((item: any) => {
        const {backgroundColor, textColor} = generateColorStyles(item.color);

        return (
          <Badge
            key={item?.id}
            className={cn(
              `rounded-2xl shrink-0 px-2 py-1 text-[0.625rem] font-normal w-fit border-none`,
              labelClassName,
            )}
            style={{backgroundColor, color: textColor}}>
            {item?.name}
          </Badge>
        );
      })}
    </div>
  );
};

export default BadgeList;
