'use client';
import React from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {download} from '@/ui/components/comments/helpers';

interface Attachment {
  id: string;
  attachmentFile: {
    id: string | number;
    fileName: string;
  };
}

interface CommentAttachmentsProps {
  attachments: Attachment[];
}

export function CommentAttachments({attachments}: CommentAttachmentsProps) {
  const handleDownload = async (attachment: Attachment) => {
    const {attachmentFile} = attachment;
    download(attachmentFile, true);
  };

  if (!attachments?.length) {
    return;
  }
  return (
    <div className="px-4 text-sm">
      <div className="font-semibold"> {i18n.get('Files')}:</div>
      <ul className="list-disc">
        {attachments?.map(attachment => (
          <li
            key={attachment.id}
            className="text-blue-600 underline cursor-pointer marker:text-black"
            onClick={() => handleDownload(attachment)}>
            {attachment.attachmentFile.fileName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentAttachments;
