'use client';

import React, {useState} from 'react';
import moment from 'moment';
import {usePathname, useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components/button';
import {Avatar, AvatarImage} from '@/ui/components/avatar';
import {Separator} from '@/ui/components/separator';
import {Input} from '@/ui/components/input';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {createComment} from '@/subapps/news/common/actions/action';
import {
  COMMENTS,
  POSTED_ON,
  SEND,
  WRITE_YOUR_COMMENT,
} from '@/subapps/news/common/constants';
import {getImageURL, parseDate} from '@/subapps/news/common/utils';

export const Comments = ({
  newsId,
  comments,
}: {
  newsId: string | number;
  comments: any;
}) => {
  const [comment, setComment] = useState('');

  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!comment) {
      return;
    }

    const publicationDateTime = moment().format('YYYY-MM-DD HH:mm:ss:SSS');

    try {
      await createComment({
        id: newsId,
        contentComment: comment,
        publicationDateTime,
      });
      router.push(`${pathname}`);
      setComment('');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-4 bg-white flex flex-col gap-4 rounded-lg">
      <div>
        <div className="text-xl font-semibold pb-2">{i18n.get(COMMENTS)}</div>
        <Separator className="bg-zinc-300" />
      </div>
      {comments?.map((comment: any) => (
        <div className="p-4 flex gap-4" key={comment.id}>
          <Avatar className="rounded-full h-8 w-8">
            <AvatarImage src={getImageURL(comment?.author?.picture?.id)} />
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="">
              <div className="text-sm font-semibold pb-1">
                {comment?.author?.simpleFullName ?? 'Name Surname'}
              </div>
              <div className="text-xs font-normal text-palette-mediumGray">
                {i18n.get(POSTED_ON)} {parseDate(comment?.publicationDateTime)}
              </div>
            </div>
            <div className="font-normal text-sm">{comment?.contentComment}</div>
          </div>
        </div>
      ))}
      <div className="flex ietms-center relative w-full">
        <Input
          className="py-4 px-4 h-14 w-full placeholder:text-palette-mediumGray text-base font-medium"
          placeholder={i18n.get(WRITE_YOUR_COMMENT)}
          value={comment}
          onChange={handleChange}
        />
        <Button
          className="w-40 absolute right-4 top-2 bg-success hover:bg-success-dark rounded-lg px-3 py-2 text-base font-medium"
          onClick={handleSubmit}>
          {i18n.get(SEND)}
        </Button>
      </div>
    </div>
  );
};

export default Comments;
