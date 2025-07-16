import {Data, Meta} from '@/subapps/website/common/types/templates';

export const cta1Meta = {
  title: 'CTA 1',
  name: 'cta1',
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
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
  ],
} as const satisfies Meta;

export type CTA1Data = Data<typeof cta1Meta>;
