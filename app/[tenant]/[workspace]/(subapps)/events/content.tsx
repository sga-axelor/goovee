'use client';

// ---- LOCAL IMPORTS ---- //
import {Category, Events} from '@/subapps/events/common/ui/components';

type ContentProps = {
  categories: Category[];
  events: any;
  pageInfo: any;
  category: any;
  date: any;
  workspace: any;
  eventType: string;
};

const Content = ({
  categories,
  events,
  pageInfo,
  category,
  date,
  workspace,
  eventType,
}: ContentProps) => {
  return (
    <main className="h-full w-full">
      <Events
        categories={categories}
        events={events}
        pageInfo={pageInfo}
        category={category}
        dateOfEvent={date}
        workspace={workspace}
        eventType={eventType}
      />
    </main>
  );
};

export default Content;
