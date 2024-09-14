'use client';

import React, {useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {Button} from '@/ui/components/button';
import {Avatar, AvatarImage} from '@/ui/components/avatar';
import {Separator} from '@/ui/components/separator';
import {Input} from '@/ui/components/input';
import {i18n} from '@/i18n';
import {useToast} from '@/ui/hooks/use-toast';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getImageURL} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import {createComment} from '@/subapps/news/common/actions/action';
import {
  COMMENTS,
  POSTED_ON,
  SEND,
  WRITE_YOUR_COMMENT,
} from '@/subapps/news/common/constants';
import {parseDate} from '@/subapps/news/common/utils';

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

  const {data: session} = useSession();
  const isDisabled = !session ? true : false;

  const {toast} = useToast();
  const {workspaceURL, tenant} = useWorkspace();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!comment) {
      toast({
        variant: 'destructive',
        title: i18n.get('Comment is required.'),
      });
      return;
    }

    try {
      const result = await createComment({
        id: newsId,
        contentComment: comment,
        workspaceURL,
      });

      if (result.success) {
        toast({
          variant: 'success',
          title: i18n.get('Comment added successfully.'),
        });
        router.refresh();
        router.push(`${pathname}`);
        setComment('');
      } else {
        toast({
          variant: 'destructive',
          title: i18n.get('Error while adding comment'),
        });
      }
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
            <AvatarImage
              src={getImageURL(comment?.author?.picture?.id, tenant, {
                noimage: true,
              })}
            />
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
          disabled={isDisabled}
          className="py-4 px-4 h-14 w-full placeholder:text-palette-mediumGray text-base font-medium"
          placeholder={i18n.get(WRITE_YOUR_COMMENT)}
          value={comment}
          onChange={handleChange}
        />
        <Button
          disabled={isDisabled}
          className="w-40 absolute right-4 top-2 bg-success hover:bg-success-dark rounded-lg px-3 py-2 text-base font-medium"
          onClick={handleSubmit}>
          {i18n.get(SEND)}
        </Button>
      </div>
    </div>
  );
};

export default Comments;
