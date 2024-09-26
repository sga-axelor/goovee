'use client';

import CyntlerDocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';

// ---- LOCAL IMPORTS ---- //
import {getDownloadURL} from '@/subapps/resources/common/utils';

import styles from './doc-viewer.module.scss';

export default function DocViewer({record}: any) {
  const docs = [{uri: getDownloadURL(record)}];

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
