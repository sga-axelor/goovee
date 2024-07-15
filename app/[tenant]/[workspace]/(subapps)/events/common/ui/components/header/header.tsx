import {MdNotificationsNone} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {Logo} from '@/subapps/events/common/ui/components';
import {Notifications} from '@/subapps/events/common/ui/components/notifications/components';

export const Header = () => {
  return (
    <header
      className={`lg:h-12 h-[3.75rem] px-6 py-2  flex items-center justify-between dark:border-b border-primary dark:bg-primary bg-white`}>
      <Logo />
      <div className=" items-center gap-x-8 hidden lg:flex">
        <Popover>
          <PopoverTrigger>
            <MdNotificationsNone className="w-6 h-6" />
          </PopoverTrigger>
          <PopoverContent
            align="center"
            className="p-0 border-none shadow-notifications w-[29rem] mr-4 mt-2">
            <Notifications />
          </PopoverContent>
        </Popover>
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage src="/temp/user.png" />
          <AvatarFallback>GV</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
