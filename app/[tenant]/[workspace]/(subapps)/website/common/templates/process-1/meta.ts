import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const process1Meta = {
  title: 'Process 1',
  name: 'process1',
  type: Template.block,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
    {
      name: 'description1',
      title: 'Description 1',
      type: 'string',
    },
    {
      name: 'description2',
      title: 'Description 2',
      type: 'string',
    },
    {
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
    },
    {
      name: 'link',
      title: 'Link',
      type: 'string',
    },
    {
      name: 'processList',
      title: 'Process List',
      type: 'json-one-to-many',
      target: 'Process1ProcessList',
    },
  ],
  models: [
    {
      name: 'Process1ProcessList',
      title: 'Process 1 Process List',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
        },
        {
          name: 'className',
          title: 'Class Name',
          type: 'string',
        },
      ],
    },
  ],
} as const satisfies Meta;

export type Process1Data = Data<typeof process1Meta>;
