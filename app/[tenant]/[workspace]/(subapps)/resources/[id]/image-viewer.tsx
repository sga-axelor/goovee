/* eslint-disable @next/next/no-img-element */
'use client';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES} from '@/constants';

export default function ImageViewer({record}: any) {
  const {workspaceURI} = useWorkspace();

  return (
    <div className="container">
      <img
        className="object-cover max-w-100"
        src={`${workspaceURI}/${SUBAPP_CODES.resources}/api/file/${record?.id}`}
        alt="Viewer"></img>
    </div>
  );
}
