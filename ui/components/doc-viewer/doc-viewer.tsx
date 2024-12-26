'use client';

import CyntlerDocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';

// ---- CORE IMPORTS ---- //
import {getDownloadURL} from '@/utils/files';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {cn} from '@/utils/css';

import styles from './doc-viewer.module.scss';

type FileInput =
  | Blob
  | File
  | {
      id: string | number;
      name: string;
      type: string;
    };

export function DocViewer({
  file,
  record,
  rootClassName,
}: {
  file?: FileInput;
  record?: {id: string | number};
  rootClassName?: string;
}) {
  const {tenant} = useWorkspace();

  const docs = (() => {
    if (file instanceof Blob || file instanceof File) {
      return [{uri: URL.createObjectURL(file)}];
    }
    if (file && 'id' in file) {
      return [{uri: getImageURL(file.id, tenant)}];
    }
    if (record && record.id) {
      return [{uri: getDownloadURL(record.id, tenant)}];
    }
    return [];
  })();

  if (!docs?.length) {
    return <></>;
  }

  return (
    <div className={cn('overflow-auto', rootClassName)}>
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
