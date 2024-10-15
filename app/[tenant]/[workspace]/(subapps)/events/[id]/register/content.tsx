'use client';

// ---- LOCAL IMPORTS ---- //
import {RegistrationForm} from '@/subapps/events/common/ui/components';

const Content = ({
  eventDetails,
  metaFields,
}: {
  eventDetails: any;
  metaFields: any;
}) => {
  return (
    <>
      <main className="flex-1 py-6 px-4 lg:px-[100px] flex flex-col lg:flex-row gap-6 pb-20">
        <div className="order-2 lg:order-1 space-y-6 w-full">
          <RegistrationForm
            eventDetails={eventDetails}
            metaFields={metaFields}
          />
        </div>
      </main>
    </>
  );
};

export default Content;
