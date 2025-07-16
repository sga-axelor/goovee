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
