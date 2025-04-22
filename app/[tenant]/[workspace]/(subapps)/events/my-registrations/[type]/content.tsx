'use client';

// ---- LOCAL IMPORTS ---- //
import {
  Category,
  ListEvent,
  MyRegisteredEvents,
} from '@/subapps/events/common/ui/components';

type ContentProps = {
  categories: Category[];
  category: any;
  date: any;
  query?: string;
  workspace: any;
  events: ListEvent[];
  pageInfo: any;
  eventType: string;
};

const Content = ({
  categories,
  category,
  date,
  query,
  workspace,
  events,
  pageInfo,
  eventType,
}: ContentProps) => {
  return (
    <main className="h-full w-full">
      <MyRegisteredEvents
        categories={categories}
        category={category}
        dateOfEvent={date}
        query={query}
        workspace={workspace}
        onlyRegisteredEvent={true}
        events={events}
        pageInfo={pageInfo}
        eventType={eventType}
      />
    </main>
  );
};

export default Content;
