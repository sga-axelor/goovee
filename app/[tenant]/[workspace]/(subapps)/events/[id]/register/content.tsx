'use client';

// ---- LOCAL IMPORTS ---- //
import {RegistrationForm} from '@/subapps/events/common/ui/components';
import {PortalWorkspace} from '@/types';

const Content = ({
  eventDetails,
  metaFields,
  workspace,
}: {
  eventDetails: any;
  metaFields: any;
  workspace: PortalWorkspace;
}) => {
  return (
    <>
      <main className="flex-1 py-6 px-4 lg:px-[100px] flex flex-col lg:flex-row gap-6 pb-20">
        <div className="order-2 lg:order-1 space-y-6 w-full">
          <RegistrationForm
            eventDetails={eventDetails}
            metaFields={metaFields}
            workspace={workspace}
          />
        </div>
      </main>
    </>
  );
};

export default Content;
