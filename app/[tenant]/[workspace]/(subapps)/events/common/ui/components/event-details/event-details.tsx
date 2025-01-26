'use client';

// ---- CORE IMPORTS ---- //
import {PortalWorkspace} from '@/types';
import {isCommentEnabled} from '@/utils/comment';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  EventPageCard,
  CommentsSection,
} from '@/subapps/events/common/ui/components';
import type {Event} from '@/subapps/events/common/ui/components';

export function EventDetails({
  eventDetails,
  workspace,
  isRegistered,
}: {
  eventDetails: Event;
  workspace: PortalWorkspace;
  isRegistered: boolean;
}) {
  const eventId = eventDetails.id;

  const enableComment = isCommentEnabled({
    subapp: SUBAPP_CODES.events,
    workspace,
  });
  return (
    <div className="flex flex-col gap-6 pt-6 px-4 lg:px-[6.25rem] pb-24 lg:pb-6">
      <EventPageCard
        eventDetails={eventDetails}
        workspace={workspace}
        isRegistered={isRegistered}
      />
      {enableComment && <CommentsSection eventId={eventId} />}
    </div>
  );
}
