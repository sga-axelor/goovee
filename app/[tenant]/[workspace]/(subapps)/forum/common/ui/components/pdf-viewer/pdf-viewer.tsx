'use client';
import CyntlerDocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';

// ---- CORE IMPORTS ---- //
import {getImageURL} from '@/utils/product';

// ---- LOCAL IMPORTS ---- //
import styles from './pdf-viewer.module.scss';

export function PdfViewer({
  file,
}: {
  file:
    | File
    | {
        id: string | number;
        name: string;
        type: string;
      };
}) {
  const docs =
    file instanceof File
      ? [{uri: URL.createObjectURL(file)}]
      : [{uri: getImageURL(file?.id) || ''}];

  return (
    <div className="overflow-x-hidden">
      {docs && (
        <CyntlerDocViewer
          key={file.name}
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
