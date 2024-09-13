/* eslint-disable @next/next/no-img-element */
'use client';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getDownloadURL} from '@/utils/files';

export default function ImageViewer({record}: any) {
  const {tenant} = useWorkspace();

  return (
    <div className="container">
      <img
        className="object-cover max-w-100"
        src={getDownloadURL(record?.id, tenant)}
        alt="Viewer"></img>
    </div>
  );
}
