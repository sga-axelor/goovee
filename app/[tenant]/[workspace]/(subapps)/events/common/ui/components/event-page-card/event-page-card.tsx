'use client';
import Image from 'next/image';
import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from '@/ui/components';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/i18n';

// ---- LOCAL IMPORTS ---- //
import {
  EventCardBadges,
  EventDateCard,
} from '@/subapps/events/common/ui/components';

export const EventPageCard = ({eventDetails, workspace}: any) => {
  const {workspaceURI, tenant} = useWorkspace();

  const allowGuestEventRegistartion =
    workspace.config?.allowGuestEventRegistartion;
  return (
    <Card className="w-full rounded-2xl border-none shadow-none">
      <CardHeader className="p-4 flex flex-col gap-4 space-y-0">
        <CardTitle>
          <p className="text-xl font-semibold">{eventDetails?.eventTitle}</p>
        </CardTitle>
        <EventDateCard
          startDate={eventDetails?.eventStartDateTime}
          endDate={eventDetails?.eventEndDateTime}
          registered={eventDetails?.eventAllowRegistration}
          eventAllDay={eventDetails?.eventAllDay}
        />
        <EventCardBadges categories={eventDetails?.eventCategorySet} />
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        <div className="relative h-[15.625rem]">
          <Image
            src={getImageURL(eventDetails?.eventImage?.id, tenant)}
            alt={`${eventDetails.eventTitle} image`}
            fill
            className="rounded-lg mx-auto object-cover"
          />
        </div>
        <CardDescription
          className="text-sm font-normal tracking-wide leading-6"
          dangerouslySetInnerHTML={{
            __html: eventDetails?.eventDescription,
          }}></CardDescription>
        <div className="border-l border-success space-y-4 text-base font-semibold px-4">
          {eventDetails?.eventPlace && (
            <p>
              {i18n.get('Place')}:{' '}
              <span className="font-normal break-words">
                {eventDetails?.eventPlace}
              </span>
            </p>
          )}
          {eventDetails?.eventLink && (
            <p>
              {i18n.get('Link')}:
              <span className="font-normal break-words">
                {eventDetails?.eventLink}
              </span>
            </p>
          )}
          {eventDetails?.eventProduct?.salePrice &&
            parseFloat(eventDetails?.eventProduct?.salePrice) > 0 && (
              <p>
                {i18n.get('Price')}:
                <span className="font-semibold">
                  {' '}
                  {parseFloat(eventDetails.eventProduct.salePrice).toFixed(2)}€
                </span>
              </p>
            )}
        </div>
      </CardContent>
      {(eventDetails?.eventAllowRegistration ||
        allowGuestEventRegistartion) && (
        <CardFooter className="px-4 pb-4">
          <Link
            href={`${workspaceURI}/events/${eventDetails?.id}/register`}
            className="w-full">
            <Button
              size="sm"
              className="w-full text-base font-medium bg-success hover:bg-success-dark">
              {i18n.get('Register to the event')}
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};
