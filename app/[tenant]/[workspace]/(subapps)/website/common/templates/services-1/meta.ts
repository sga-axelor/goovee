import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const services1Meta = {
  title: 'Services 1',
  name: 'services1',
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
      name: 'services',
      title: 'Services',
      type: 'json-one-to-many',
      target: 'Services1Services',
    },
  ],
  models: [
    {
      name: 'Services1Services',
      title: 'Services 1 Services',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'string',
        },
        {
          name: 'icon',
          title: 'Icon',
          type: 'string',
        },
        {
          name: 'link',
          title: 'Link',
          type: 'string',
        },
        {
          name: 'linkType',
          title: 'Link Type',
          type: 'string',
        },
      ],
    },
  ],
} as const satisfies Meta;

export type Services1Data = Data<typeof services1Meta>;
