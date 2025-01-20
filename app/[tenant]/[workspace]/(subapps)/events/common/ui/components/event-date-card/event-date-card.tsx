'use client';

import {MdOutlineCalendarMonth} from 'react-icons/md';
import {useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {Card} from '@/ui/components';
import {DATE_FORMATS} from '@/constants';
import {i18n} from '@/locale';
import {formatDate, formatTime} from '@/locale/formatters';

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
      const formattedStartDate = formatDate(startDate, {
        dateFormat: DATE_FORMATS.full_date,
      });
      const formattedStartTime = formatTime(startDate, {
        timeFormat: DATE_FORMATS.hours_12_hour,
        seconds: false,
      });

      setStartDateTime({
        startDay: formattedStartDate,
        startTime: formattedStartTime,
      });
    }

    if (endDate && !eventAllDay) {
      const formattedEndDate = formatDate(endDate, {
        dateFormat: DATE_FORMATS.full_date,
      });
      const formattedEndTime = formatTime(endDate, {
        timeFormat: DATE_FORMATS.hours_12_hour,
        seconds: false,
      });

      setEndDateTime({
        endDay: formattedEndDate,
        endTime: formattedEndTime,
      });
    }
  }, [startDate, endDate, eventAllDay]);

  return (
    <Card className="border-none shadow-none">
      <div className="flex items-center gap-x-2">
        <MdOutlineCalendarMonth className="w-6 h-6 text-success" />
        <div className="flex">
          <p className=" flex text-base gap-2">
            <span className="font-semibold">{startDateTime.startDay}</span>{' '}
            {i18n.t(startDateTime.startTime)}
            {eventAllDay || !endDateTime.endDay ? (
              ' '
            ) : (
              <span className="mx-2">{i18n.t('to')}</span>
            )}
            <span className="font-semibold">{endDateTime.endDay}</span>{' '}
            {i18n.t(endDateTime.endTime)}
          </p>
        </div>
      </div>
    </Card>
  );
};
