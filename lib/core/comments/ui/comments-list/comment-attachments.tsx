// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {download} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

import type {MailMessageFile} from '../../types';

type CommentAttachmentsProps = {
  attachments: MailMessageFile[];
  attachmentDownloadUrl: string;
};

export function CommentAttachments({
  attachments,
  attachmentDownloadUrl,
}: CommentAttachmentsProps) {
  const handleDownload = async (attachment: MailMessageFile) => {
    const {attachmentFile} = attachment;
    if (!attachmentFile?.id) return;

    download(attachmentFile, `${attachmentDownloadUrl}/${attachmentFile.id}`);
  };

  return (
    <div className="px-4 text-xs mb-1">
      <div className="font-semibold"> {i18n.t('Files')}:</div>
      <ul className="list-disc">
        {attachments?.map(attachment => (
          <li
            key={attachment.id}
            className="text-blue-600 underline cursor-pointer marker:text-black"
            onClick={() => handleDownload(attachment)}>
            {attachment.attachmentFile?.fileName}
          </li>
        ))}
      </ul>
    </div>
  );
}
