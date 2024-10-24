'use client';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';
import {getImageURL} from '@/utils/image';

export const ThreadHeader = ({title, image}: {title: string; image: any}) => {
  return (
    <div className="flex items-center gap-2 px-4 pb-4 border-b">
      <Avatar className="rounded-lg h-6 w-6">
        <AvatarImage src={getImageURL(image?.id)} />
      </Avatar>
      <p className="font-normal text-xs leading-[0.875rem] line-clamp-1">{title}</p>
    </div>
  );
};

export default ThreadHeader;
