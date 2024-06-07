'use client';
import React from 'react';
import moment from 'moment';
import { Separator } from "@ui/components/separator"
import { Button } from "@ui/components/button"
import { MdEast } from "react-icons/md";
// ---- CORE IMPORTS ---- //
import { parseDate } from '@/utils';
import { i18n } from '@/lib/i18n';
import { TextField } from '@ui/components/TextField';
// ---- LOCAL IMPORTS ---- //
import type { CommentsProps } from '@/subapps/quotations/common/types/quotations';
import { updateDocument } from '@/subapps/quotations/common/utils/quotations';
import styles from './styles.module.scss';
import Image from 'next/image';
type Props = {
  comments: CommentsProps[];
};
export const Comments = ({ comments }: Props) => {
  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-lg">
      <div className="flex flex-col gap-2">
        <h4 className="text-xl font-medium mb-0">
          {i18n.get('Comments')}
        </h4>
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
                  <h6 className="text-base font-semibold mb-0">
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
            className={`${styles['comment-input']} p-6`}
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