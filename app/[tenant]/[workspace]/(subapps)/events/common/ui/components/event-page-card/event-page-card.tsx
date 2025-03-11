'use client';
import {useSession} from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/locale';
import {
  Badge,
  BadgeList,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  InnerHTML,
} from '@/ui/components';
import {getImageURL} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import {
  REGISTER_TAG,
  REGISTER_TO_EVENT,
} from '@/subapps/events/common/constants';
import {EventDateCard} from '@/subapps/events/common/ui/components';
import {
  hasRegistrationEnded,
  isLoginNeededForRegistration,
} from '@/subapps/events/common/utils';

export const EventPageCard = ({eventDetails, workspace}: any) => {
  const {formattedDefaultPriceAti, formattedDefaultPrice, defaultPrice} =
    eventDetails || {};
  const {workspaceURI, tenant} = useWorkspace();
  const {data: session} = useSession();
  const user = session?.user;

  const allowGuestEventRegistration =
    workspace.config?.allowGuestEventRegistration;
  const eventAllowRegistration = eventDetails?.eventAllowRegistration;

  const allowGuests =
    allowGuestEventRegistration && !isLoginNeededForRegistration(eventDetails);

  const isRegistrationAllow =
    eventAllowRegistration &&
    (user || allowGuests) &&
    !hasRegistrationEnded(eventDetails);

  return (
    <Card className="w-full rounded-2xl border-none shadow-none">
      <CardHeader className="p-4 flex flex-col gap-4 space-y-0">
        <CardTitle className="w-full flex items-center justify-between">
          <p className="text-xl font-semibold">{eventDetails?.eventTitle}</p>
          {eventDetails?.isRegistered && (
            <Badge
              variant="outline"
              className="text-[0.625rem] mb-[0.688rem] font-medium py-1 px-2 text-success border-success h-6">
              {i18n.t(REGISTER_TAG)}
            </Badge>
          )}
        </CardTitle>
        <EventDateCard
          startDate={eventDetails?.eventStartDateTime}
          endDate={eventDetails?.eventEndDateTime}
          eventAllDay={eventDetails?.eventAllDay}
        />
        <BadgeList items={eventDetails?.eventCategorySet} />
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        <div className="relative h-[15.625rem]">
          <Image
            src={getImageURL(eventDetails?.eventImage?.id, tenant, {
              noimage: true,
            })}
            alt={`${eventDetails.eventTitle} image`}
            fill
            className="rounded-lg mx-auto object-cover"
          />
        </div>
        <CardDescription className="herllo">
          <InnerHTML
            className={`text-sm font-normal tracking-wide leading-6 w-full overflow-x-auto`}
            content={eventDetails?.eventDescription}
          />
        </CardDescription>
        <div className="border-l border-success space-y-4 text-base font-semibold px-4">
          {eventDetails?.eventPlace && (
            <p>
              {i18n.t('Place')}:{' '}
              <span className="font-normal break-words">
                {eventDetails?.eventPlace}
              </span>
            </p>
          )}
          {defaultPrice ? (
            <div className="flex flex-col gap-2 font-semibold">
              <p className="text-xl text-black">
                {i18n.t('Price (incl. tax)')}:
                <span className="text-success">{formattedDefaultPriceAti}</span>
              </p>
              <p className="text-sm text-black">
                {i18n.t('Price (excl. tax)')}:{' '}
                <span className="text-success">{formattedDefaultPrice}</span>
              </p>
            </div>
          ) : null}
        </div>
      </CardContent>
      {isRegistrationAllow && !eventDetails.isRegistered && (
        <CardFooter className="px-4 pb-4">
          {
            <Link
              href={`${workspaceURI}/${SUBAPP_CODES.events}/${eventDetails?.slug}/register`}
              className="w-full">
              <Button
                size="sm"
                className="w-full text-base font-medium bg-success hover:bg-success-dark">
                {i18n.t(REGISTER_TO_EVENT)}
              </Button>
            </Link>
          }
        </CardFooter>
      )}
    </Card>
  );
};
