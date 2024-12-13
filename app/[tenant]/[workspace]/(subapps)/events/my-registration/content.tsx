'use client';

// ---- LOCAL IMPORTS ---- //
import {
  Category,
  MyRegisteredEvents,
} from '@/subapps/events/common/ui/components';

type ContentProps = {
  categories: Category[];
  events: any;
  pageInfo: any;
  category: any;
  date: any;
  workspace: any;
};

const Content = ({
  categories,
  events,
  pageInfo,
  category,
  date,
  workspace,
}: ContentProps) => {
  return (
    <main className="h-full w-full">
      <MyRegisteredEvents
        categories={categories}
        events={events}
        pageInfo={pageInfo}
        category={category}
        dateOfEvent={date}
        workspace={workspace}
        onlyRegisteredEvent={true}
      />
    </main>
  );
};

export default Content;
