import {Data, Meta} from '@/subapps/website/common/types/templates';
import {metaFileModel} from '../meta-models';

export const cta1Meta = {
  title: 'CTA 1',
  code: 'cta1',
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
      type: 'many-to-one',
      target: 'com.axelor.meta.db.MetaFile',
      widget: 'Image',
    },
  ],
  metaModels: [metaFileModel],
} as const satisfies Meta;

export type CTA1Data = Data<typeof cta1Meta>;

export const cta1Demo: CTA1Data = {
  cta1Image: {
    id: '1',
    version: 1,
    fileName: 'i3.png',
    fileType: 'image/png',
    filePath: '/img/illustrations/i3.png',
  },
  cta1Title: 'Analyze Now',
  cta1Caption:
    'Improve your website. Check SEO score for faster speed, higher rankings, & more traffic.',
  cta1Description:
    'Digital marketing encompasses a wide range of activities, including search engine optimization, social media marketing, email marketing, and content marketing. By leveraging businesses can increase their visibility online.',
};
