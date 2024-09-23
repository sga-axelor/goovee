'use client';

import CyntlerDocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';

// ---- CORE IMPORTS ---- //
import {getDownloadURL} from '@/utils/image';

import styles from './doc-viewer.module.scss';

export default function DocViewer({record}: any) {
  const docs = [{uri: getDownloadURL({id: record.id})}];

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
