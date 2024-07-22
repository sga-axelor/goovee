// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils/date';
import {DATE_FORMATS} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  EventDateCard,
  RegistrationForm,
} from '@/subapps/events/common/ui/components';

const Content = ({
  eventDetails,
  metaFields,
}: {
  eventDetails: any;
  metaFields: any;
}) => {
  return (
    <>
      <main className="w-screen lg:w-full py-4 flex flex-col lg:flex-row lg:gap-x-6 gap-y-6 lg:space-y-0 justify-center px-4 lg:px-0">
        <div className="order-2 lg:order-1 space-y-6">
          <RegistrationForm
            eventDetails={eventDetails}
            metaFields={metaFields}
          />
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
      </main>
    </>
  );
};

export default Content;
