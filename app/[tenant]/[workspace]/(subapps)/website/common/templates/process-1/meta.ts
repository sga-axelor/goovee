import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const process1Meta = {
  title: 'Process 1',
  code: 'process1',
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
      name: 'description1',
      title: 'Description 1',
      type: 'string',
    },
    {
      name: 'description2',
      title: 'Description 2',
      type: 'string',
    },
    {
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
    },
    {
      name: 'link',
      title: 'Link',
      type: 'string',
    },
    {
      name: 'processList',
      title: 'Process List',
      type: 'json-one-to-many',
      target: 'Process1ProcessList',
    },
  ],
  models: [
    {
      name: 'Process1ProcessList',
      title: 'Process 1 Process List',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          nameField: true,
          visibleInGrid: true,
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          visibleInGrid: true,
        },
        {
          name: 'className',
          title: 'Class Name',
          type: 'string',
        },
      ],
    },
  ],
} as const satisfies Meta;

export type Process1Data = Data<typeof process1Meta>;

export const process1Demo: Process1Data = {
  process1Link: '#',
  process1Title: 'Our Strategy',
  process1Caption:
    'These 3 practical measure will help us organize our company projects.',
  process1LinkText: 'Learn More',
  process1ProcessList: [
    {
      id: '8',
      version: 1,
      attrs: {
        title: 'Specialization',
        subtitle: 'This involves focusing on a specific niche of expertise',
        className: 'me-lg-6',
      },
    },
    {
      id: '9',
      version: 1,
      attrs: {
        title: 'Collaboration',
        subtitle: 'This involves focusing on a specific niche expertise',
        className: 'ms-lg-13 mt-6',
      },
    },
    {
      id: '10',
      version: 1,
      attrs: {
        title: 'Innovation',
        subtitle: 'This involves focusing on a specific niche of expertise',
        className: 'mx-lg-6 mt-6',
      },
    },
  ],
  process1Description1:
    'Have you ever wondered how much faster your website could be? Find out now by checking your SEO score. A high SEO score means that your website is optimized for search engines, making it more likely to appear at the top of',
  process1Description2:
    "By improving your website's speed, you can provide a better user experience for your visitors, reduce bounce rates, and ultimately increase conversions.",
};
