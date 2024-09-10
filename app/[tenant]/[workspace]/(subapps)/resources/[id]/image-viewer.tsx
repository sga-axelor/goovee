'use client';

import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getDownloadURL} from '@/subapps/resources/common/utils';

export default function ImageViewer({record}: any) {
  const {tenant} = useWorkspace();

  return (
    <div className="container">
      <img
        className="object-cover max-w-100"
        src={getDownloadURL(record, tenant)}></img>
    </div>
  );
}
