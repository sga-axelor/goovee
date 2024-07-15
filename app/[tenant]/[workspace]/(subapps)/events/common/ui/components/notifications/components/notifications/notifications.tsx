import {MdOutlineSettings} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {NotificationCard} from '@/subapps/events/common/ui/components/notifications/components';

const notifications = [
  {
    read: false,
    time: '2h ago',
    text: 'You have subscribed to @category: “Business Intelligence”',
  },
  {
    read: false,
    time: '2h ago',
    text: '@username has posted an answer on @topic: “This is a very long answer to help you resolve this very difficult error. You can start by checking if this is working”',
  },
  {
    read: false,
    time: '3h ago',
    text: 'A new resource has been posted on @category: This year’s roadmap',
  },
  {
    read: false,
    time: '3h ago',
    text: 'A new event has been posted on @category: Tech fair - Come meet us',
  },

  {
    read: true,
    time: '2d ago',
    text: '@username has posted an answer on @topic: “This is a very long answer to help you resolve this very difficult error. You can start by checking if this is working”',
  },
  {
    read: true,
    time: '2d ago',
    text: 'A new event has been posted on @category: Meeting with the partners',
  },
  {
    read: true,
    time: '3d ago',
    text: 'A new topic has been posted on @category: “This is a long title name to show that we can go 2 lines before truncating the notification”',
  },
  {
    read: true,
    time: '6d ago',
    text: '@username has posted an answer on @topic: “This is a very long answer to help you resolve this very difficult error. You can start by checking if this is working”',
  },
];

export const Notifications = () => {
  const unreadNotifications = notifications.filter(
    notification => !notification.read,
  );
  const readNotifications = notifications.filter(
    notification => notification.read,
  );
  return (
    <Card className="border-none shadow-none rounded-none lg:rounded-lg ">
      <CardHeader className="p-4 border-b border-grey-1">
        <CardTitle className="flex items-center justify-between">
          <p className="text-base font-semibold">Notifications</p>
          <div className="flex items-center gap-x-2">
            <Button
              className="text-[0.688rem] font-normal leading-6 tracking-normal"
              variant="outline">
              Mark as all read
            </Button>
            <MdOutlineSettings />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y-[0.031rem] divide-grey-1 dark:bg-grey-6 dark:bg-opacity-10  bg-success dark:border-l-4 dark:border-success-dark dark:shadow-unreadNotifications">
          {unreadNotifications.map((notification, index) => (
            <NotificationCard
              key={index}
              read={notification.read}
              text={notification.text}
              time={notification.time}
            />
          ))}
        </div>
        {readNotifications.length > 0 && (
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t dark:border-white border-grey-4"></div>
            <span className="flex-shrink mx-4 text-[0.688rem] font-medium ">
              Already read
            </span>
            <div className="flex-grow border-t dark:border-white border-grey-4"></div>
          </div>
        )}
        <div className="divide-y-[0.031rem] divide-grey-1  ">
          {readNotifications.map((notification, index) => (
            <NotificationCard
              key={unreadNotifications.length + index}
              read={notification.read}
              text={notification.text}
              time={notification.time}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
