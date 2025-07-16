import {
  Template,
  Data,
  Demo,
  Meta,
} from '@/subapps/website/common/types/templates';

export const wiki1Meta = {
  title: 'Wiki 1',
  code: 'wiki1',
  type: Template.block,
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'string',
    },
  ],
} as const satisfies Meta;

export type Wiki1Data = Data<typeof wiki1Meta>;

export const wiki1Demos: Demo<typeof wiki1Meta>[] = [
  {
    language: 'en_US',
    data: {
      wiki1Content: undefined,
    },
  },
  {
    language: 'fr_FR',
    data: {
      wiki1Content: undefined,
    },
  },
];
