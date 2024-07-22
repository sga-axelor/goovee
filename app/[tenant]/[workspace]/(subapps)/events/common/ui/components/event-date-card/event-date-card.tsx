'use client';

import {MdOutlineCalendarMonth} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Badge, Card} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {EventDateCardProps} from '@/subapps/events/common/ui/components';

export const EventDateCard = ({
  startDate,
  endDate,
  registered,
}: EventDateCardProps) => {
  const [startDay, startTime] = startDate
    ? startDate.split(' - ')
    : [i18n.get('Date not available'), ''];
  const [endDay, endTime] = endDate
    ? endDate.split(' - ')
    : [i18n.get('Date not available'), ''];
  return (
    <Card className="min-w-[16.438rem] order-1 lg:order-2 border-none shadow-none h-fit p-4 rounded-lg">
      {registered === false && (
        <Badge
          variant="outline"
          className="mb-[0.688rem] text-[0.625rem] font-medium px-2 py-1">
          {i18n.get('#Registered')}
        </Badge>
      )}
      <div className=" flex gap-x-3">
        <MdOutlineCalendarMonth className="w-8 h-8" />
        <div className=" space-y-[0.688rem]">
          <p className=" font-semibold text-xl">{startDay}</p>
          <p className="text-base font-medium">{startTime}</p>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <p className=" font-semibold text-xl">{endDay}</p>
          <p className="text-base font-medium">{endTime}</p>
        </div>
      </div>
    </Card>
  );
};
