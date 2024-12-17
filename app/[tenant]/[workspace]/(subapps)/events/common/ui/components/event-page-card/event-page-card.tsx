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
  Badge,
} from '@/ui/components';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/i18n';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  EventCardBadges,
  EventDateCard,
} from '@/subapps/events/common/ui/components';
import {
  EDIT_MY_REGISTRATION,
  REGISTER_TAG,
  REGISTER_TO_EVENT,
} from '@/subapps/events/common/constants';

export const EventPageCard = ({eventDetails, workspace, isRegistered}: any) => {
  const {workspaceURI, tenant} = useWorkspace();

  const allowGuestEventRegistration =
    workspace.config?.allowGuestEventRegistration;

  return (
    <Card className="w-full rounded-2xl border-none shadow-none">
      <CardHeader className="p-4 flex flex-col gap-4 space-y-0">
        <CardTitle className="w-full flex items-center justify-between">
          <p className="text-xl font-semibold">{eventDetails?.eventTitle}</p>
          {isRegistered && (
            <Badge
              variant="outline"
              className="text-[0.625rem] mb-[0.688rem] font-medium py-1 px-2 text-success border-success h-6">
              {i18n.get(REGISTER_TAG)}
            </Badge>
          )}
        </CardTitle>
        <EventDateCard
          id={eventDetails?.id}
          startDate={eventDetails?.eventStartDateTime}
          endDate={eventDetails?.eventEndDateTime}
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
        allowGuestEventRegistration) && (
        <CardFooter className="px-4 pb-4">
          {
            <Link
              href={`${workspaceURI}/${SUBAPP_CODES.events}/${eventDetails?.id}/register`}
              className="w-full">
              <Button
                size="sm"
                className="w-full text-base font-medium bg-success hover:bg-success-dark">
                {!isRegistered
                  ? i18n.get(REGISTER_TO_EVENT)
                  : i18n.get(EDIT_MY_REGISTRATION)}
              </Button>
            </Link>
          }
        </CardFooter>
      )}
    </Card>
  );
};
