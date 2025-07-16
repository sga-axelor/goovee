import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const services1Meta = {
  title: 'Services 1',
  code: 'services1',
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
          nameField: true,
          visibleInGrid: true,
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
          visibleInGrid: true,
        },
        {
          name: 'linkType',
          title: 'Link Type',
          type: 'string',
          visibleInGrid: true,
        },
      ],
    },
  ],
} as const satisfies Meta;

export type Services1Data = Data<typeof services1Meta>;

export const services1Demo: Services1Data = {
  services1Title: 'What We Do?',
  services1Caption:
    'We have designed our services with your specific needs in mind.',
  services1Services: [
    {
      id: '5',
      version: 1,
      attrs: {
        icon: 'Rocket',
        link: '#',
        title: 'DevOps',
        linkType: 'yellow',
        description:
          'The agency can provide DevOps services to help businesses streamline their software development',
      },
    },
    {
      id: '6',
      version: 1,
      attrs: {
        icon: 'Code',
        link: '#',
        title: 'Software Development',
        linkType: 'red',
        description:
          'The agency can provide DevOps services to help businesses streamline their software development',
      },
    },
    {
      id: '7',
      version: 0,
      attrs: {
        icon: 'DevicesTwo',
        link: '#',
        title: 'App Development',
        linkType: 'green',
        description:
          'The agency can provide DevOps services to help businesses streamline their software development',
      },
    },
    {
      id: '8',
      version: 1,
      attrs: {
        link: '#',
        icon: 'Hand',
        linkType: 'blue',
        title: 'Maintenance & Support',
        description: `The agency can provide DevOps services to help businesses streamline their software development`,
      },
    },
  ],
};
