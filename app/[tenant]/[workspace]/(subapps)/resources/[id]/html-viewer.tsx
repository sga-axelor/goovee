// ---- CORE IMPORTS ---- //
import {InnerHTML} from '@/ui/components/inner-html';

// ---- LOCAL IMPORTS ---- //
import type {DmsFile} from '@/subapps/resources/common/types';

export default function HTMLViewer({record}: {record: DmsFile}) {
  return <InnerHTML content={record.content ?? undefined} />;
}
