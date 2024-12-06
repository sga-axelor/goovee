'use client';
import CyntlerDocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';

// ---- LOCAL IMPORTS ---- //
import styles from './pdf-viewer.module.scss';

export function PdfViewer({file, id}: {file: Blob; id: string}) {
  const docs = [{uri: URL.createObjectURL(file) || ''}];
  return (
    <div className="overflow-x-hidden">
      {docs && (
        <CyntlerDocViewer
          key={id}
          documents={docs}
          pluginRenderers={DocViewerRenderers}
          config={{
            header: {
              disableHeader: true,
            },
          }}
          className={styles['doc-viewer']}
        />
      )}
    </div>
  );
}
