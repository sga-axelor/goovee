'use client';

import {MdChevronRight} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  BadgeList,
  InnerHTML,
} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/locale';
import {formatDateTime} from '@/locale/formatters';
import {NO_IMAGE_URL, SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {EventCardProps} from '@/subapps/events/common/ui/components/events/types';
import styles from './event-card.module.scss';
import mainStyles from '@/subapps/events/styles.module.scss';

export const EventCard = ({event}: EventCardProps) => {
  const {workspaceURI} = useWorkspace();

  const stripImages = (htmlContent: any = '') =>
    htmlContent?.replace(/<img[^>]*>/g, '');

  return (
    <Card className="p-2 overflow-hidden cursor-pointer rounded-2xl flex gap-6 h-fit border-none shadow-none ">
      <div
        className="w-[150px] h-[150px] rounded-lg bg-center bg-cover flex-shrink-0"
        style={{
          backgroundImage: event.eventImage?.id
            ? `url(${workspaceURI}/${SUBAPP_CODES.events}/api/event/${event.slug}/image)`
            : `url(${NO_IMAGE_URL})`,
        }}></div>

      <div className="flex w-full gap-10 py-2">
        <div
          className={`flex flex-col flex-1 ${styles['event-details-container']}`}>
          <CardHeader className="w-full p-0">
            <CardTitle className="flex flex-col xs:flex-row items-start justify-between w-full ">
              <p className="text-base font-semibold w-full flex justify-between">
                {event.eventTitle}
                {event?.isRegistered && (
                  <Badge
                    variant="outline"
                    className="text-[0.625rem] font-medium py-1 px-2 text-success border-success h-6 flex flex-none">
                    {i18n.t('#Registered')}
                  </Badge>
                )}
              </p>
            </CardTitle>
            <CardDescription className="text-sm font-medium text-secondary">
              {`${formatDateTime(event.eventStartDateTime, {
                dateFormat: 'MMMM D YYYY - ',
                timeFormat: 'h:mmA',
              })}
            ${event.eventEndDateTime && !event.eventAllDay ? i18n.t('to') : ''} 
             ${
               event.eventEndDateTime && !event.eventAllDay
                 ? formatDateTime(event.eventEndDateTime, {
                     dateFormat: 'MMMM D YYYY - ',
                     timeFormat: 'h:mmA',
                   })
                 : ''
             }
              `}
            </CardDescription>
            <BadgeList items={event.eventCategorySet} />
          </CardHeader>
          <CardContent className="p-0 mt-1">
            <InnerHTML
              className={`text-sm max-h-[6.375rem] w-full font-normal line-clamp-2 text-gray-dark overflow-hidden ${mainStyles['constrained-content']} prose`}
              content={
                event?.eventDescription
                  ? stripImages(event.eventDescription)
                  : ''
              }
            />
          </CardContent>
        </div>
        <div className="flex-col hidden lg:flex items-center justify-center pr-2">
          <Button className="bg-success-light border-none hover:bg-success-light text-success hover:text-success h-10 w-10 p-0 rounded-lg">
            <MdChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
