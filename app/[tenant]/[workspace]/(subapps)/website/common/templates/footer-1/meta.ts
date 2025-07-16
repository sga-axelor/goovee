import {Data, Meta} from '@/subapps/website/common/types/templates';

export const footer1Meta = {
  title: 'Footer 1',
  name: 'footer1',
  type: 1,
  fields: [],
} as const satisfies Meta;

export type Footer1Data = Data<typeof footer1Meta>;
