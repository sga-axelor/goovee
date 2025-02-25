'use client';

// ---- LOCAL IMPORTS ---- //
import {RegistrationForm} from '@/subapps/events/common/ui/components';
import {PortalWorkspace} from '@/types';

const Content = ({
  eventDetails,
  metaFields,
  workspace,
  user,
}: {
  eventDetails: any;
  metaFields: any;
  workspace: PortalWorkspace;
  user: any;
}) => {
  return (
    <>
      <main className="container mx-auto  flex-1 py-6 flex flex-col lg:flex-row gap-6 pb-20">
        <div className="order-2 lg:order-1 space-y-6 w-full">
          <RegistrationForm
            eventDetails={eventDetails}
            metaFields={metaFields}
            workspace={workspace}
            user={user}
          />
        </div>
      </main>
    </>
  );
};

export default Content;
