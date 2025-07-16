import {
  Template,
  Data,
  Demo,
  Meta,
} from '@/subapps/website/common/types/templates';

export const sidebarMenu1Meta = {
  title: 'Sidebar Menu 1',
  code: 'sidebarMenu1',
  type: Template.leftRightMenu,
  fields: [],
} as const satisfies Meta;

export type SidebarMenu1Data = Data<typeof sidebarMenu1Meta>;

export const sidebarMenu1Demos: Demo<typeof sidebarMenu1Meta>[] = [
  {
    language: 'en_US',
    data: {},
  },
];
