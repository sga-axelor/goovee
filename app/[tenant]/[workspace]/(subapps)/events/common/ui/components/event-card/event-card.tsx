'use client';

import {MdChevronRight} from 'react-icons/md';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/ui/components';
import {parseDate} from '@/utils/date';
import {getImageURL} from '@/utils/files';
import {DATE_FORMATS} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/i18n';

// ---- LOCAL IMPORTS ---- //
import {EventCardBadges} from '@/subapps/events/common/ui/components';
import {EventCardProps} from '@/subapps/events/common/ui/components/events/types';
import {fetchEventParticipants} from '@/subapps/events/common/actions/actions';
import styles from './event-card.module.scss';

export const EventCard = ({event, workspace}: EventCardProps) => {
  const [isRegistered, setIsRegistered] = useState(false);

  const {data: session} = useSession();
  const {user} = session || {};

  const {tenant} = useWorkspace();

  const stripImages = (htmlContent: any = '') =>
    htmlContent?.replace(/<img[^>]*>/g, '');

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!user || !event.id) return;

      try {
        const response = await fetchEventParticipants({
          id: event.id,
          workspace,
        });

        if (response.success) {
          const {emailAddress} = response.data;
          setIsRegistered(emailAddress === user.email);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    if (event.eventAllowRegistration) {
      checkRegistrationStatus();
    }
  }, [workspace, event.id, user, event.eventAllowRegistration]);

  return (
    <Card className="p-2 overflow-hidden cursor-pointer rounded-2xl flex gap-6 h-fit border-none shadow-none ">
      <div
        className="w-[150px] h-[150px] rounded-lg bg-center bg-cover flex-shrink-0"
        style={{
          backgroundImage: `url(${getImageURL(event?.eventImage?.id, tenant)})`,
        }}></div>

      <div className="flex w-full gap-10 py-2">
        <div
          className={`flex flex-col flex-1 ${styles['event-details-container']}`}>
          <CardHeader className="w-full p-0">
            <CardTitle className="flex flex-col xs:flex-row items-start justify-between w-full ">
              <p className="text-base font-semibold w-full flex justify-between">
                {event.eventTitle}
                {isRegistered && (
                  <Badge
                    variant="outline"
                    className="text-[0.625rem] font-medium py-1 px-2 text-success border-success h-6">
                    {i18n.get('#Registered')}
                  </Badge>
                )}
              </p>
            </CardTitle>
            <CardDescription className="text-sm font-medium text-secondary">
              {`${parseDate(
                event.eventStartDateTime,
                DATE_FORMATS.full_month_day_year_12_hour,
              )}
            ${event.eventEndDateTime && !event.eventAllDay ? i18n.get('to') : ''} 
             ${
               event.eventEndDateTime && !event.eventAllDay
                 ? parseDate(
                     event.eventEndDateTime,
                     DATE_FORMATS.full_month_day_year_12_hour,
                   )
                 : ''
             }
              `}
            </CardDescription>
            <EventCardBadges categories={event.eventCategorySet} />
          </CardHeader>
          <CardContent className="p-0 mt-1">
            <div
              className="text-sm w-full font-normal line-clamp-2 text-gray-dark overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: event?.eventDescription
                  ? stripImages(event.eventDescription)
                  : '',
              }}
            />
          </CardContent>
        </div>
        <div className="flex-col hidden lg:flex items-center justify-center pr-2">
          <Button className="bg-success-light hover:bg-success-light text-success hover:text-success h-10 w-10 p-0 rounded-lg">
            <MdChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
