'use client';

import CyntlerDocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';

// ---- CORE IMPORTS ---- //
import {getDownloadURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

import styles from './doc-viewer.module.scss';

export default function DocViewer({record}: any) {
  const {tenant} = useWorkspace();
  const docs = [{uri: getDownloadURL(record?.id, tenant)}];

  return (
    <div className="overflow-auto">
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
