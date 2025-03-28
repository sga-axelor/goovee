'use client';

// ---- CORE IMPORTS ---- //
import {PortalWorkspace} from '@/types';
import {isCommentEnabled} from '@/comments';
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
}: {
  eventDetails: Event;
  workspace: PortalWorkspace;
}) {
  const eventId = eventDetails.id;

  const enableComment = isCommentEnabled({
    subapp: SUBAPP_CODES.events,
    workspace,
  });
  return (
    <div className="container mx-auto flex flex-col gap-6 pt-6 pb-24 lg:pb-6">
      <EventPageCard eventDetails={eventDetails} workspace={workspace} />
      {enableComment && (
        <CommentsSection eventId={eventId} slug={eventDetails.slug} />
      )}
    </div>
  );
}
