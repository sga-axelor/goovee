import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const navbar1Meta = {
  title: 'Navbar 1',
  name: 'navbar1',
  type: Template.block,
  fields: [],
} as const satisfies Meta;

export type Footer1Data = Data<typeof navbar1Meta>;
