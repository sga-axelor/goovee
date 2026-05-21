'use client';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES} from '@/constants';
import {DocViewer} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import type {DmsFile} from '@/subapps/resources/common/types';

export default function PDFViewer({record}: {record: DmsFile}) {
  const {workspaceURI} = useWorkspace();

  return (
    <DocViewer
      documents={[
        {
          uri: `${workspaceURI}/${SUBAPP_CODES.resources}/api/file/${record?.id}`,
        },
      ]}
    />
  );
}
