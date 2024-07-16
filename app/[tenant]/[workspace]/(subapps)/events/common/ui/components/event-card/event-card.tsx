'use client';

import Image from 'next/image';
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
} from '@/ui/components';
import {convertDate} from '@/utils/functions';
import {getImageURL} from '@/utils/image';

// ---- LOCAL IMPORTS ---- //
import {EventCardBadges} from '@/subapps/events/common/ui/components';
import {EventCardProps} from '@/subapps/events/common/ui/components/events/types';

export const EventCard = ({event}: EventCardProps) => {
  return (
    <Card className="px-4  overflow-hidden cursor-pointer  rounded-2xl flex h-fit border-none shadow-none ">
      <div className=" relative my-auto lg:min-h-[10.625rem] lg:min-w-[9.375rem] min-h-[8.75rem] max-h-[9.375rem] min-w-[7.5rem] flex items-center justify-center">
        <Image
          src={getImageURL(event?.eventImage?.id)}
          alt={`${event.eventTitle} image`}
          width={150}
          height={150}
          className="rounded-lg h-[7.5rem] "
          style={{objectFit: 'cover'}}
        />
      </div>

      <div className="flex flex-col w-full">
        <CardHeader className="pt-4 pb-2 pr-0 lg:pr-10 space-y-2 w-full ">
          <CardTitle className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 items-start justify-between w-full ">
            <p className="text-base font-semibold w-full pr-3 ">
              {event.eventTitle}
            </p>
            {event.eventAllowRegistration === false && (
              <Badge
                variant="outline"
                className="text-[0.625rem] xs:ml-auto font-medium py-1 px-2">
                #Registered
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-sm font-medium">
            {convertDate(event.eventStartDateTime)} to{' '}
            {convertDate(event.eventEndDateTime)}
          </CardDescription>
          <EventCardBadges categories={event.eventCategorySet} />
        </CardHeader>
        <CardContent className="pb-4 pr-0 w-full lg:pr-10">
          <div
            className="text-sm w-full font-normal line-clamp-2"
            dangerouslySetInnerHTML={{__html: event?.eventDescription}}
          />
        </CardContent>
      </div>
      <div className="flex-col hidden ml-auto lg:flex items-center justify-center">
        <Button
          size="icon"
          variant="ghost"
          className="bg-success/10 text-success"
          asChild>
          <MdChevronRight className="w-10 h-10" />
        </Button>
      </div>
    </Card>
  );
};
