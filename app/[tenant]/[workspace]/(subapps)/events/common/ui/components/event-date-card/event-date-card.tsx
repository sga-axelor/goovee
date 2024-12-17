'use client';

import {MdOutlineCalendarMonth} from 'react-icons/md';
import {useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {Card} from '@/ui/components';
import {DATE_FORMATS} from '@/constants';
import {parseDate} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {EventDateCardProps} from '@/subapps/events/common/ui/components';

export const EventDateCard = ({
  startDate,
  endDate,
  eventAllDay = false,
}: EventDateCardProps) => {
  const [startDateTime, setStartDateTime] = useState({
    startDay: '',
    startTime: '',
  });
  const [endDateTime, setEndDateTime] = useState({
    endDay: '',
    endTime: '',
  });

  useEffect(() => {
    if (startDate) {
      const dateTime = parseDate(
        startDate,
        DATE_FORMATS.full_month_day_year_12_hour,
      ).split('-');
      setStartDateTime({startDay: dateTime[0], startTime: dateTime[1]});
    }

    if (endDate && !eventAllDay) {
      const dateTime = parseDate(
        endDate,
        DATE_FORMATS.full_month_day_year_12_hour,
      ).split('-');
      setEndDateTime({endDay: dateTime[0], endTime: dateTime[1]});
    }
  }, [startDate, endDate, eventAllDay]);

  return (
    <Card className="border-none shadow-none">
      <div className="flex items-center gap-x-2">
        <MdOutlineCalendarMonth className="w-6 h-6 text-success" />
        <div className="flex">
          <p className="text-base">
            <span className="font-semibold">{startDateTime.startDay}</span>{' '}
            {startDateTime.startTime}
            {eventAllDay || !endDateTime.endDay ? ' ' : ' to '}
            <span className="font-semibold">{endDateTime.endDay}</span>{' '}
            {endDateTime.endTime}
          </p>
        </div>
      </div>
    </Card>
  );
};
