import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

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

export const wiki1Demo: Wiki1Data = {
  wiki1Content: undefined,
};
