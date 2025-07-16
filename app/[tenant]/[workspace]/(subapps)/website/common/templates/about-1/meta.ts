import {Data, Meta} from '../../types/templates';

export const about1Meta = {
  title: 'About 1',
  name: 'about1',
  type: 1,
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
      name: 'image',
      title: 'Image',
      type: 'string',
    },
    {
      name: 'accordions',
      title: 'Accordions',
      target: 'About1Accordion',
      type: 'json-one-to-many',
    },
  ],
  models: [
    {
      name: 'About1Accordion',
      title: 'About 1 Accordions',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
        },
        {
          name: 'body',
          title: 'Body',
          type: 'string',
        },
        {
          name: 'expand',
          title: 'Expand',
          type: 'boolean',
        },
      ],
    },
  ],
} as const satisfies Meta;

export type About1Data = Data<typeof about1Meta>;
