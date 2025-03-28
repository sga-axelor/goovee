'use client';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES} from '@/constants';
import {DocViewer} from '@/ui/components';

export default function PDFViewer({record}: any) {
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
