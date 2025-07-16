import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const pageProgress1Meta = {
  title: 'Page Progress 1',
  code: 'pageProgress1',
  type: Template.block,
  fields: [],
} as const satisfies Meta;

export type PageProgress1Data = Data<typeof pageProgress1Meta>;

export const pageProgress1Demo: PageProgress1Data = {};
