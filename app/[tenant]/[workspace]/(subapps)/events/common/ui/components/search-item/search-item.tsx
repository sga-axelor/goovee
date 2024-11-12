'use client';

// ---- CORE IMPORTS ---- //
import {DATE_FORMATS} from '@/constants';
import {parseDate} from '@/utils/date';

export const SearchItem = ({result, onClick}: {result: any; onClick: any}) => {
  const {id, eventTitle, eventStartDateTime, eventDescription} = result;
  const stripImages = (htmlContent: any = '') =>
    htmlContent?.replace(/<img[^>]*>/g, '');
  return (
    <>
      <div onClick={() => onClick(id)} className="space-y-2">
        <div className="flex items-start justify-between">
          <p className="text-sm font-semibold text-main-black pr-2">
            {eventTitle}
          </p>
          <p className="text-sm font-normal text-main-black min-w-fit">
            {parseDate(
              eventStartDateTime,
              DATE_FORMATS.full_month_day_year_12_hour,
            )}
          </p>
        </div>
        <div
          className="overflow-hidden text-xs font-normal text-main-black line-clamp-1"
          dangerouslySetInnerHTML={{
            __html: eventDescription ? stripImages(eventDescription) : '',
          }}
        />
      </div>
    </>
  );
};

export default SearchItem;
