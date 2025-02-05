'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';

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
  BadgeList,
} from '@/ui/components';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/locale';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {EventDateCard} from '@/subapps/events/common/ui/components';
import {
  EDIT_MY_REGISTRATION,
  REGISTER_TAG,
  REGISTER_TO_EVENT,
} from '@/subapps/events/common/constants';

export const EventPageCard = ({eventDetails, workspace}: any) => {
  const {formattedDefaultPriceAti, formattedDefaultPrice, defaultPrice} =
    eventDetails || {};
  const {workspaceURI, tenant} = useWorkspace();
  const {data: session} = useSession();
  const user = session?.user;

  const allowGuestEventRegistration =
    workspace.config?.allowGuestEventRegistration;
  const eventAllowRegistration = eventDetails?.eventAllowRegistration;

  const isRegistrationAllow =
    eventAllowRegistration && (user || allowGuestEventRegistration);

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
        <CardDescription
          className="text-sm font-normal tracking-wide leading-6"
          dangerouslySetInnerHTML={{
            __html: eventDetails?.eventDescription,
          }}></CardDescription>
        <div className="border-l border-success space-y-4 text-base font-semibold px-4">
          {eventDetails?.eventPlace && (
            <p>
              {i18n.t('Place')}:{' '}
              <span className="font-normal break-words">
                {eventDetails?.eventPlace}
              </span>
            </p>
          )}
          {eventDetails?.eventLink && (
            <p>
              {i18n.t('Link')}:
              <span className="font-normal break-words">
                {eventDetails?.eventLink}
              </span>
            </p>
          )}
          {defaultPrice ? (
            <div>
              <p className="text-xl font-semibold text-black">
                {i18n.t('Price')}:{' '}
                <span className="text-success">{formattedDefaultPrice}</span>
              </p>
              <p className="text-xs font-medium text-black">
                {i18n.t('Price with tax')}:{' '}
                <span className="text-success font-medium">
                  {formattedDefaultPriceAti}
                </span>
              </p>
            </div>
          ) : null}
        </div>
      </CardContent>
      {isRegistrationAllow && (
        <CardFooter className="px-4 pb-4">
          {
            <Link
              href={`${workspaceURI}/${SUBAPP_CODES.events}/${eventDetails?.slug}/register`}
              className="w-full">
              <Button
                size="sm"
                className="w-full text-base font-medium bg-success hover:bg-success-dark">
                {!eventDetails.isRegistered
                  ? i18n.t(REGISTER_TO_EVENT)
                  : i18n.t(EDIT_MY_REGISTRATION)}
              </Button>
            </Link>
          }
        </CardFooter>
      )}
    </Card>
  );
};
