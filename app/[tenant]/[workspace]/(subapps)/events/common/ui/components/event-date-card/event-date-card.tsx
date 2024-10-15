'use client';

import {MdOutlineCalendarMonth} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Badge, Card} from '@/ui/components';
import {i18n} from '@/i18n';

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
    <Card className="border-none shadow-none">
      {!registered && (
        <Badge
          variant="outline"
          className="mb-[0.688rem] text-[0.625rem] font-medium px-2 py-1">
          {i18n.get('#Registered')}
        </Badge>
      )}
      <div className="flex items-center gap-x-2">
        <MdOutlineCalendarMonth className="w-6 h-6 text-success" />
        <div className="flex">
          <p className="text-base">
            <span className="font-semibold">{startDay}</span> {startTime} to{' '}
            <span className="font-semibold">{endDay}</span> {endTime}
          </p>
        </div>
      </div>
    </Card>
  );
};
