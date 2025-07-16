import {
  Template,
  Data,
  Demo,
  Meta,
} from '@/subapps/website/common/types/templates';
import {metaFileModel} from '../meta-models';

export const services2Meta = {
  title: 'Services 2',
  code: 'services2',
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
      type: 'many-to-one',
      target: 'com.axelor.meta.db.MetaFile',
      widget: 'Image',
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
          nameField: true,
          visibleInGrid: true,
        },
      ],
    },
  ],
  metaModels: [metaFileModel],
} as const satisfies Meta;

export type Services2Data = Data<typeof services2Meta>;

export const services2Demos: Demo<typeof services2Meta>[] = [
  {
    language: 'en_US',
    data: {
      services2Image: {
        id: '1',
        version: 1,
        fileName: 'i8.png',
        fileType: 'image/png',
        filePath: '/img/illustrations/i8.png',
      },
      services2Title: 'Our Solutions',
      services2Caption:
        'We provide effortless spending control with complete peace of mind.',
      services2Description:
        'At our company, we understand that managing spending can be stressful and overwhelming, which is why we offer a range of services aimed at effortless for you to stay in control.',
      services2Services: [
        {
          id: '40',
          version: 0,
          attrs: {title: 'We offer stress-free spending control.'},
        },
        {
          id: '41',
          version: 0,
          attrs: {title: 'We offer stress-free spending control.'},
        },
        {
          id: '42',
          version: 0,
          attrs: {title: 'We offer stress-free spending control.'},
        },
        {
          id: '43',
          version: 0,
          attrs: {title: 'We offer stress-free spending control.'},
        },
      ],
    },
  },
];
