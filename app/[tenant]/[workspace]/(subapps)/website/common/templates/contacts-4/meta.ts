import {Data, Meta} from '@/subapps/website/common/types/templates';
import {metaFileModel} from '../meta-models';

export const contact4Meta = {
  title: 'Contact 4',
  code: 'contact4',
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
      type: 'many-to-one',
      target: 'com.axelor.meta.db.MetaFile',
      widget: 'Image',
    },
  ],
  metaModels: [metaFileModel],
} as const satisfies Meta;

export type Contact4Data = Data<typeof contact4Meta>;

export const contact4Demo: Contact4Data = {
  contact4Image: {
    id: '1',
    version: 1,
    fileName: 'i5.png',
    fileType: 'image/png',
    filePath: '/img/illustrations/i5.png',
  },
  contact4Title: 'Let’s Talk',
  contact4Caption:
    "Together, let's build something fantastic. We have more than 5000 clients who trust us.",
  contact4LinkUrl: '#',
  contact4LinkText: 'Join Us',
  contact4Description:
    'At our company, we understand that managing spending can be stressful and overwhelming, which is why we offer a range of services aimed at making it effortless for you to stay in control.',
};
