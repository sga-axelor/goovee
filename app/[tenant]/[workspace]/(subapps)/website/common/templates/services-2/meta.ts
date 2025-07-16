import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const services2Meta = {
  title: 'Services 2',
  name: 'services2',
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
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
    {
      name: 'services',
      title: 'Services',
      type: 'json-one-to-many',
      target: 'Services2Services',
    },
  ],
  models: [
    {
      name: 'Services2Services',
      title: 'Services 2 Services',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
      ],
    },
  ],
} as const satisfies Meta;

export type Services2Data = Data<typeof services2Meta>;
