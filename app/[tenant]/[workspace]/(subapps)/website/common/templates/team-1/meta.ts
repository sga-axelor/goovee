import {
  Template,
  Data,
  Demo,
  Meta,
} from '@/subapps/website/common/types/templates';
import {metaFileModel} from '../meta-models';

export const team1Meta = {
  title: 'Team 1',
  code: 'team1',
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
      name: 'teams',
      title: 'Teams',
      type: 'json-one-to-many',
      target: 'Team1Teams',
    },
  ],
  models: [
    {
      name: 'Team1Teams',
      title: 'Team 1 Teams',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
          nameField: true,
          visibleInGrid: true,
        },
        {
          name: 'image',
          title: 'Image',
          type: 'many-to-one',
          target: 'com.axelor.meta.db.MetaFile',
          widget: 'Image',
        },
        {
          name: 'designation',
          title: 'Designation',
          type: 'string',
          visibleInGrid: true,
        },
        {
          name: 'dribbbleUrl',
          title: 'Dribbble URL',
          type: 'string',
        },
        {
          name: 'twitterUrl',
          title: 'Twitter URL',
          type: 'string',
        },
        {
          name: 'facebookUrl',
          title: 'Facebook URL',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'string',
        },
      ],
    },
  ],
  metaModels: [metaFileModel],
} as const satisfies Meta;

export type Team1Data = Data<typeof team1Meta>;

export const team1Demos: Demo<typeof team1Meta>[] = [
  {
    language: 'en_US',
    data: {
      team1Title: 'Our Team',
      team1Caption:
        'Think beyond the box and be creative. Lighthouse can help you make a difference.',
      team1Teams: [
        {
          id: '14',
          version: 0,
          attrs: {
            name: 'Tom Accor',
            image: {
              id: '1',
              version: 1,
              fileName: 't8.jpg',
              fileType: 'image/jpeg',
              filePath: '/img/avatars/t8.jpg',
            },
            twitterUrl: 'https://www.twitter.com',
            description: "I'm passionate about creating elegant theme.",
            designation: 'Developer',
            dribbbleUrl: 'https://dribbble.com',
            facebookUrl: 'https://www.facebook.com',
          },
        },
        {
          id: '15',
          version: 0,
          attrs: {
            name: 'Selina Anteree',

            image: {
              id: '1',
              version: 1,
              fileName: 't9.jpg',
              fileType: 'image/jpeg',
              filePath: '/img/avatars/t9.jpg',
            },
            twitterUrl: 'https://www.twitter.com',
            description: "I'm passionate about creating elegant theme.",
            designation: 'Developer',
            dribbbleUrl: 'https://dribbble.com',
            facebookUrl: 'https://www.facebook.com',
          },
        },
        {
          id: '16',
          version: 0,
          attrs: {
            name: 'Olocks Pree',
            image: {
              id: '1',
              version: 1,
              fileName: 't10.jpg',
              fileType: 'image/jpeg',
              filePath: '/img/avatars/t10.jpg',
            },
            twitterUrl: 'https://www.twitter.com',
            description: "I'm passionate about creating elegant theme.",
            designation: 'Designer',
            dribbbleUrl: 'https://dribbble.com',
            facebookUrl: 'https://www.facebook.com',
          },
        },
        {
          id: '17',
          version: 0,
          attrs: {
            name: 'Andree Buie',
            image: {
              id: '1',
              version: 1,
              fileName: 't11.jpg',
              fileType: 'image/jpeg',
              filePath: '/img/avatars/t11.jpg',
            },
            twitterUrl: 'https://www.twitter.com',
            description: "I'm passionate about creating elegant theme.",
            designation: 'Manager',
            dribbbleUrl: 'https://dribbble.com',
            facebookUrl: 'https://www.facebook.com',
          },
        },
      ],
    },
  },
  {
    language: 'fr_FR',
    data: {
      team1Title: 'Notre équipe',
      team1Caption:
        'Pensez hors des sentiers battus et soyez créatif. Lighthouse peut vous aider à faire la différence.',
      team1Teams: [
        {
          id: '14',
          version: 0,
          attrs: {
            name: 'Tom Accor',
            image: {
              id: '1',
              version: 1,
              fileName: 't8.jpg',
              fileType: 'image/jpeg',
              filePath: '/img/avatars/t8.jpg',
            },
            twitterUrl: 'https://www.twitter.com',
            description:
              'Je suis passionné par la création de thèmes élégants.',
            designation: 'Développeur',
            dribbbleUrl: 'https://dribbble.com',
            facebookUrl: 'https://www.facebook.com',
          },
        },
        {
          id: '15',
          version: 0,
          attrs: {
            name: 'Selina Anteree',

            image: {
              id: '1',
              version: 1,
              fileName: 't9.jpg',
              fileType: 'image/jpeg',
              filePath: '/img/avatars/t9.jpg',
            },
            twitterUrl: 'https://www.twitter.com',
            description:
              'Je suis passionné par la création de thèmes élégants.',
            designation: 'Développeur',
            dribbbleUrl: 'https://dribbble.com',
            facebookUrl: 'https://www.facebook.com',
          },
        },
        {
          id: '16',
          version: 0,
          attrs: {
            name: 'Olocks Pree',
            image: {
              id: '1',
              version: 1,
              fileName: 't10.jpg',
              fileType: 'image/jpeg',
              filePath: '/img/avatars/t10.jpg',
            },
            twitterUrl: 'https://www.twitter.com',
            description:
              'Je suis passionné par la création de thèmes élégants.',
            designation: 'Designer',
            dribbbleUrl: 'https://dribbble.com',
            facebookUrl: 'https://www.facebook.com',
          },
        },
        {
          id: '17',
          version: 0,
          attrs: {
            name: 'Andree Buie',
            image: {
              id: '1',
              version: 1,
              fileName: 't11.jpg',
              fileType: 'image/jpeg',
              filePath: '/img/avatars/t11.jpg',
            },
            twitterUrl: 'https://www.twitter.com',
            description:
              'Je suis passionné par la création de thèmes élégants.',
            designation: 'Directeur',
            dribbbleUrl: 'https://dribbble.com',
            facebookUrl: 'https://www.facebook.com',
          },
        },
      ],
    },
  },
];
