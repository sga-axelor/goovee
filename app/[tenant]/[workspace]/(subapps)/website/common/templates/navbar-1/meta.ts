import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const navbar1Meta = {
  title: 'Navbar 1',
  code: 'navbar1',
  type: Template.block,
  fields: [],
} as const satisfies Meta;

export type Navbar11Data = Data<typeof navbar1Meta>;

export const navbar1Demo: Navbar11Data = {};
