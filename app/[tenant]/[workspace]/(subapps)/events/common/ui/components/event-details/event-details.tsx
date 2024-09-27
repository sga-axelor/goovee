'use client';

import {MdCheckCircleOutline, MdClose} from 'react-icons/md';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils/date';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {DATE_FORMATS} from '@/constants';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {
  EventPageCard,
  CommentsSection,
  EventDateCard,
} from '@/subapps/events/common/ui/components';
import type {Event} from '@/subapps/events/common/ui/components';
import {SUCCESS_REGISTER_MESSAGE} from '@/subapps/events/common/constants';

export function EventDetails({
  eventDetails,
  successMessage,
}: {
  eventDetails: Event;
  successMessage: boolean;
}) {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const eventId = eventDetails.id;

  const handleClose = () => {
    router.push(`${workspaceURI}/events/${eventId}?success=false`);
  };

  return (
    <>
      {successMessage && (
        <div className="w-screen lg:w-full py-6 flex flex-col lg:flex-row lg:gap-x-6 gap-y-6 lg:space-y-0 justify-center px-4 lg:px-0">
          <div className="min-w-full lg:min-w-[67.5rem] xl:max-w-[75rem] xl:min-w-[50rem] flex items-center justify-between text-green-600 bg-green-200 rounded-[0.313rem] py-4 px-8 border border-green-500 text-base font-normal leading-7 tracking-[0.031rem] w-full max-w-screen-lg shadow-lg">
            <p className="gap-x-4 flex items-center">
              <MdCheckCircleOutline className="shrink-0 w-6 h-6" />
              {i18n.get(SUCCESS_REGISTER_MESSAGE)}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer">
              <MdClose className="shrink-0 w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      <div className="w-full flex flex-col lg:flex-row lg:gap-x-6 gap-y-6 lg:space-y-0 justify-center px-4 pt-4 pb-20 lg:py-4 lg:px-0">
        <div className="order-2 lg:order-1 space-y-6">
          <EventPageCard eventDetails={eventDetails} />
          <CommentsSection eventId={eventId} />
        </div>
        <EventDateCard
          startDate={parseDate(
            eventDetails?.eventStartDateTime,
            DATE_FORMATS.full_month_day_year_12_hour,
          )}
          endDate={parseDate(
            eventDetails?.eventEndDateTime,
            DATE_FORMATS.full_month_day_year_12_hour,
          )}
          registered={eventDetails?.eventAllowRegistration}
        />
      </div>
    </>
  );
}
