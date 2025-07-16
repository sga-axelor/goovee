import {Data, Meta} from '../../types/templates';
import {metaFileModel} from '../meta-models';

export const about1Meta = {
  title: 'About 1',
  code: 'about1',
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
      type: 'many-to-one',
      target: 'com.axelor.meta.db.MetaFile',
      widget: 'Image',
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
          nameField: true,
          visibleInGrid: true,
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
  metaModels: [metaFileModel],
} as const satisfies Meta;

export type About1Data = Data<typeof about1Meta>;

export const about1Demo: About1Data = {
  about1Image: {
    id: '1',
    version: 1,
    fileName: 'i6.png',
    fileType: 'image/png',
    filePath: '/img/illustrations/i6.png',
  },
  about1Title: 'Why Choose Us?',
  about1Caption: 'We provide solutions that make our clients live easier.',
  about1Accordions: [
    {
      id: '11',
      version: 0,
      attrs: {
        body: 'Customers may choose your company because you offer high-quality products or services that meet their needs and exceed their expectations. This can lead to customer satisfaction, loyalty, and positive word-of-mouth recommendations.',
        expand: true,
        heading: 'Quality of Service',
      },
    },
    {
      id: '12',
      version: 0,
      attrs: {
        body: 'Customers may choose your company because you offer high-quality products or services that meet their needs and exceed their expectations. This can lead to customer satisfaction, loyalty, and positive word-of-mouth recommendations.',
        heading: 'Competitive Pricing',
      },
    },
    {
      id: '13',
      version: 0,
      attrs: {
        body: 'Customers may choose your company because you offer high-quality products or services that meet their needs and exceed their expectations. This can lead to customer satisfaction, loyalty, and positive word-of-mouth recommendations.',
        heading: 'Customer Service',
      },
    },
  ],
};
