'use client';

import CyntlerDocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';

import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {getDownloadURL} from '@/subapps/resources/common/utils';

import styles from './doc-viewer.module.scss';
import '@cyntler/react-doc-viewer/dist/index.css';

export default function DocViewer({record}: any) {
  const {tenant} = useWorkspace();
  const docs = [{uri: getDownloadURL(record, tenant)}];

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
