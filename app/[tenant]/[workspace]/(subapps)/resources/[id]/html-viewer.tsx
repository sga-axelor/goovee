import {InnerHTML} from '@/ui/components/inner-html';

export default function HTMLViewer({record}: any) {
  return <InnerHTML content={record.content} />;
}
