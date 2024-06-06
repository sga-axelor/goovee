'use client';

import React from 'react';
import moment from 'moment';
import {Box, Button, Divider, Image, Input} from '@axelor/ui';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';

// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import type {CommentsProps} from '@/subapps/quotations/common/types/quotations';
import {updateDocument} from '@/subapps/quotations/common/utils/quotations';
import styles from './styles.module.scss';

type Props = {
  comments: CommentsProps[];
};

export const Comments = ({comments}: Props) => {
  return (
    <Box
      d="flex"
      flexDirection="column"
      gap="1rem"
      bg="white"
      p={4}
      rounded={3}>
      <Box d="flex" flexDirection="column" gap="0.5rem">
        <Box as="h2" mb={0}>
          {i18n.get('Comments')}
        </Box>
        <Box>
          {comments?.length} {i18n.get('comments')}
        </Box>
      </Box>
      <Divider />
      <Box d="flex" flexDirection="column" gap="1rem">
        {comments?.map((comment: CommentsProps) => {
          let currentDate = moment();
          let updateDate = comment?.updatedOn
            ? moment(comment?.updatedOn)
            : moment(comment?.createdOn);

          const docUpdate = updateDocument(currentDate, updateDate);
          return (
            <Box d="flex" p={4} border rounded={1} gap="1rem" key={comment.id}>
              <Image
                src=""
                alt="user"
                rounded="circle"
                className={styles['comment-user-image']}
              />
              <Box w={100} d="flex" flexDirection="column" gap="0.25rem">
                <Box d="flex" justifyContent="space-between">
                  <Box fontSize={6} fontWeight="bold">
                    {comment.subject ? comment.subject : comment.body}
                  </Box>
                  <Box className={styles['comment-date']}>
                    {comment?.updatedOn
                      ? parseDate(comment.updatedOn)
                      : parseDate(comment.createdOn)}
                  </Box>
                </Box>
                <Box className={styles['comment-paragraph']}>
                  {`${comment?.author?.name} updated document ${docUpdate} ago`}
                </Box>
              </Box>
            </Box>
          );
        })}
        <Box>
          <Input
            className={styles['comment-input']}
            p={4}
            placeholder={i18n.get('Write your comment here...')}
          />
          <Box p={1} d="flex" justifyContent="flex-end">
            <Button
              variant="dark"
              d="flex"
              alignItems="center"
              justifyContent="center"
              gap="10"
              rounded="pill">
              {i18n.get('Send comment')} <MaterialIcon icon="east" />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Comments;
