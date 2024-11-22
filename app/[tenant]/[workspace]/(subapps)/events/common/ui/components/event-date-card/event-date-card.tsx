'use client';

import {MdOutlineCalendarMonth} from 'react-icons/md';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {Badge, Card} from '@/ui/components';
import {i18n} from '@/i18n';
import {DATE_FORMATS} from '@/constants';
import {parseDate} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {EventDateCardProps} from '@/subapps/events/common/ui/components';
import {fetchEventParticipants} from '@/subapps/events/common/actions/actions';

export const EventDateCard = ({
  id,
  startDate,
  endDate,
  eventAllDay = false,
  workspace,
  canRegister,
}: EventDateCardProps) => {
  const [startDateTime, setStartDateTime] = useState({
    startDay: '',
    startTime: '',
  });
  const [endDateTime, setEndDateTime] = useState({
    endDay: '',
    endTime: '',
  });
  const [isRegistered, setIsRegistered] = useState(false);

  const {data: session} = useSession();
  const {user} = session || {};

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!user || !id) return;

      try {
        const response = await fetchEventParticipants({
          id,
          workspace,
        });

        if (response.success && response.data) {
          const {emailAddress} = response.data;
          setIsRegistered(emailAddress === user.email);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    if (canRegister) {
      checkRegistrationStatus();
    }
  }, [workspace, id, user, canRegister]);

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
      {isRegistered && (
        <Badge
          variant="outline"
          className="text-[0.625rem] mb-[0.688rem] font-medium py-1 px-2 text-success border-success h-6">
          {i18n.get('#Registered')}
        </Badge>
      )}
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
