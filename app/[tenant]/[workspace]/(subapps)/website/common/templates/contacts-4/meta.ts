import {Data, Meta} from '@/subapps/website/common/types/templates';

export const contact4Meta = {
  title: 'Contact 4',
  name: 'contact4',
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
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
    },
    {
      name: 'linkUrl',
      title: 'Link Url',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
  ],
} as const satisfies Meta;

export type Contact4Data = Data<typeof contact4Meta>;
