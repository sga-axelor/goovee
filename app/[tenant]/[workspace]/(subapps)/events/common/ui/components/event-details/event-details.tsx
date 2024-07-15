'use client';

import {MdCheckCircleOutline, MdClose} from 'react-icons/md';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {convertDate} from '@/utils/functions';

// ---- LOCAL IMPORTS ---- //
import {
  EventPageCard,
  CommentsSection,
  EventDateCard,
} from '@/app/events/common/ui/components';
import type {Event, Comment} from '@/app/events/common/ui/components';

export function EventDetails({
  eventDetails,
  eventId,
  successMessage,
  comments,
  userId,
}: {
  eventDetails: Event;
  eventId: string;
  successMessage: boolean;
  comments: Comment[];
  userId: string;
}) {
  const router = useRouter();

  const handleClose = () => {
    router.push(`/events/${eventId}?success=false`);
  };

  return (
    <>
      {successMessage && (
        <div className="w-screen lg:w-full py-6 flex flex-col lg:flex-row lg:gap-x-6 gap-y-6 lg:space-y-0 justify-center px-4 lg:px-0">
          <div className="min-w-full lg:min-w-[67.5rem] xl:max-w-[75rem] xl:min-w-[50rem] flex items-center justify-between text-green-600 bg-green-200 rounded-[0.313rem] py-4 px-8 border border-green-500 text-base font-normal leading-7 tracking-[0.031rem] w-full max-w-screen-lg shadow-lg">
            <p className="gap-x-4 flex items-center">
              <MdCheckCircleOutline className="shrink-0 w-6 h-6" />
              You have been successfully registered to this event.
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
      <div className="w-screen lg:w-full py-4 flex flex-col lg:flex-row lg:gap-x-6 gap-y-6 lg:space-y-0 justify-center px-4 lg:px-0">
        <div className="order-2 lg:order-1 space-y-6">
          <EventPageCard eventDetails={eventDetails} />
          <CommentsSection
            eventId={eventId}
            comments={comments}
            userId={userId}
          />
        </div>
        <EventDateCard
          startDate={convertDate(eventDetails?.eventStartDateTime)}
          endDate={convertDate(eventDetails?.eventEndDateTime)}
          registered={eventDetails?.eventAllowRegistration}
        />
      </div>
    </>
  );
}
