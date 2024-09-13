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
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {EventCardBadges} from '@/subapps/events/common/ui/components';

export const EventPageCard = ({eventDetails}: any & any) => {
  const {workspaceURI, tenant} = useWorkspace();

  return (
    <Card className="min-w-full lg:min-w-[50rem] xl:min-w-[57.75rem] xl:max-w-[57.75rem]  w-full rounded-2xl border-none shadow-none">
      <CardHeader className="p-4 space-y-4">
        <CardTitle>
          <p className=" text-xl font-semibold">{eventDetails?.eventTitle}</p>
        </CardTitle>
        <EventCardBadges categories={eventDetails?.eventCategorySet} />

        <div className="relative mx-auto w-full max-w-[55.75rem] min-h-[15.625rem] xs:min-w-[22.875rem] flex items-center justify-center">
          <Image
            src={getImageURL(eventDetails?.eventImage?.id, tenant)}
            alt={`${eventDetails.eventTitle} image`}
            fill
            className="rounded-lg mx-auto object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
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
      {eventDetails?.eventAllowRegistration === true && (
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
