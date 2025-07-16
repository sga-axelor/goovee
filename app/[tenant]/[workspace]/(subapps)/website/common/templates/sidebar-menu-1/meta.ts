import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const sidebarMenu1Meta = {
  title: 'Sidebar Menu 1',
  name: 'sidebarMenu1',
  type: Template.leftRightMenu,
  fields: [],
} as const satisfies Meta;

export type Footer1Data = Data<typeof sidebarMenu1Meta>;
