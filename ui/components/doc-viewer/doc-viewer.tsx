'use client';

import CyntlerDocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';

// ---- CORE IMPORTS ---- //
import {getDownloadURL} from '@/utils/files';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {cn} from '@/utils/css';

import styles from './doc-viewer.module.scss';

export type URL = string;
export type Record = {id: string | number; name: string; type: string};
export type Document = File | Blob | URL | Record;

export function DocViewer({
  record: document,
  className,
  useImageURL = false,
}: {
  record: Document;
  className?: string;
  useImageURL?: boolean;
}) {
  const {tenant} = useWorkspace();

  const docs = (() => {
    if (document instanceof Blob || document instanceof File) {
      return [{uri: URL.createObjectURL(document)}];
    }

    if ((document as Record)?.id !== undefined) {
      const download = useImageURL ? getImageURL : getDownloadURL;
      return [{uri: download(document?.id, tenant)}];
    }

    return [];
  })();

  if (!docs?.length) {
    return <></>;
  }

  return (
    <div className={cn('overflow-auto', className)}>
      <CyntlerDocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        config={{
          header: {
            disableHeader: true,
          },
        }}
        className={styles['doc-viewer']}
      />
    </div>
  );
}

export default DocViewer;
