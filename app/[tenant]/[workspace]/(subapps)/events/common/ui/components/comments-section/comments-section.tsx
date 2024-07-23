'use client';
import {useState} from 'react';

// ---- CORE IMPORTS ---- //
import {Button, Card, Textarea} from '@/ui/components';
import {parseDate} from '@/utils/date';
import {cn} from '@/utils/css';
import {DATE_FORMATS} from '@/constants';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {CommentCard} from '@/subapps/events/common/ui/components';
import type {CommentSectionProps} from '@/subapps/events/common/ui/components';
import {
  addComment,
  getCommentsByEvent,
} from '@/subapps/events/common/actions/actions';
import styles from '@/subapps/events/common/ui/components/comments-section/comments-section.module.css';

export const CommentsSection = ({
  eventId,
  comments,
  userId,
}: CommentSectionProps) => {
  const [allComments, setAllComments] = useState(comments);
  const [comment, setComment] = useState('');

  const handleInputChange = (e: any) => {
    setComment(e.target.value);
  };
  const handleSubmit = async (e: any) => {
    if (comment.length > 0) {
      try {
        e.preventDefault();
        const pubDate = new Date();
        const commentObject = {
          contentComment: comment,
          publicationDateTime: pubDate,
        };
        await addComment(eventId, userId, commentObject);
        const updatedComments = await getCommentsByEvent(eventId);
        setAllComments(updatedComments);
        setComment('');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Card className="rounded-2xl border-none shadow-none p-4 w-full max-w-screen-lg space-y-4 ">
      <h2 className="text-xl font-semibold">{i18n.get('Comments')}</h2>
      {allComments?.map(comment => (
        <CommentCard
          key={comment.id}
          id={comment.id}
          author={comment?.author}
          image={comment.image}
          publicationDateTime={parseDate(
            comment.publicationDateTime,
            DATE_FORMATS.custom,
          )}
          contentComment={comment.contentComment}
        />
      ))}
      <form onSubmit={handleSubmit} className="w-full relative">
        <Textarea
          value={comment}
          onChange={handleInputChange}
          placeholder="Write your comment"
          className={cn(
            'lg:placeholder:text-base lg:placeholder:font-medium placeholder:text-palette-mediumGray border-[0.03rem] lg:pr-[9.375rem] pl-[0.625rem] py-4 pr-[5rem] min-h-14 lg:pl-4 lg:text-base lg:font-medium text-sm font-normal placeholder:text-sm resize-none placeholder:font-normal rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 h-14',
            styles['no-scrollbar'],
          )}
        />
        <Button
          type="submit"
          className="p-3 lg:w-[7.75rem] w-14 absolute top-[0.625rem] h-9 right-3 bg-success hover:bg-success-dark">
          {i18n.get('Send')}
        </Button>
      </form>
    </Card>
  );
};
