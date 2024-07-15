'use client';

// ---- LOCAL IMPORTS ---- //
import {Category, Events} from '@/subapps/events/common/ui/components';
import {LIMIT} from '@/subapps/events/common/constants';

type ContentProps = {
  categories: Category[];
  events: any;
  page: any;
  category: any;
  date: any;
};

const Content = ({categories, events, page, category, date}: ContentProps) => {
  return (
    <main className="h-full w-full">
      <Events
        categories={categories}
        limit={LIMIT}
        page={parseInt(page)}
        events={events}
        category={category}
        dateOfEvent={date}
      />
    </main>
  );
};

export default Content;
