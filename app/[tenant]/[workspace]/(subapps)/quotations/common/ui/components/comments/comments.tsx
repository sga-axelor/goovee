'use client';
import React, {useState} from 'react';
import Image from 'next/image';
import moment from 'moment';
import {MdEast} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils/date';
import {i18n} from '@/i18n';
import {TextField, Separator, Button} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import type {CommentsProps} from '@/subapps/quotations/common/types/quotations';
import {updateDocument} from '@/subapps/quotations/common/utils/quotations';
import styles from '@/subapps/quotations/common/ui/components/styles.module.scss';

type Props = {
  comments: CommentsProps[];
};

export const Comments = ({comments}: Props) => {
  const [comment, setComment] = useState('');
  return (
    <div className="flex flex-col gap-4 bg-card text-card-foreground p-6 rounded-lg">
      <div className="flex flex-col gap-2">
        <h4 className="text-xl font-medium mb-0">{i18n.get('Comments')}</h4>
        <p className="text-xs mb-0">
          {comments?.length} {i18n.get('comments')}
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        {comments?.map((comment: CommentsProps) => {
          let currentDate = moment();
          let updateDate = comment?.updatedOn
            ? moment(comment?.updatedOn)
            : moment(comment?.createdOn);
          const docUpdate = updateDocument(currentDate, updateDate);
          return (
            <div className="flex gap-4 p-6 border rounded" key={comment.id}>
              <Image
                src=""
                alt="user"
                className={`${styles['comment-user-image']} rounded-full`}
              />
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between">
                  <h6 className="font-semibold">
                    {comment.subject ? comment.subject : comment.body}
                  </h6>
                  <span className={`${styles['comment-date']} mb-0`}>
                    {comment?.updatedOn
                      ? parseDate(comment.updatedOn)
                      : parseDate(comment.createdOn)}
                  </span>
                </div>
                <p className={`${styles['comment-paragraph']} mb-0`}>
                  {`${comment?.author?.name} updated document ${docUpdate} ago`}
                </p>
              </div>
            </div>
          );
        })}
        <div>
          <TextField
            placeholder={i18n.get('Write your comment here...')}
            className={'p-6 font-[0.875rem]'}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <div className="flex justify-end p-1">
            <Button className="flex items-center justify-center gap-3 rounded-full">
              {i18n.get('Send comment')} <MdEast className="text-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Comments;
