import {
  Template,
  type Data,
  type Demo,
  type TemplateSchema,
} from '../../types/templates';
import {metaFileModel} from '../meta-models';

export const about2Schema = {
  title: 'About 2',
  code: 'about2',
  type: Template.block,
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Title',
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
      name: 'bulletPoints',
      title: 'Bullet Points',
      target: 'About2Bulletpoints',
      type: 'json-one-to-many',
    },
  ],
  models: [
    {
      name: 'About2Bulletpoints',
      title: 'About 2 Bullet Points',
      fields: [
        {
          name: 'text',
          title: 'Text',
          type: 'string',
          nameField: true,
          visibleInGrid: true,
        },
      ],
    },
  ],
  metaModels: [metaFileModel],
} as const satisfies TemplateSchema;

export type About2Data = Data<typeof about2Schema>;

export const about1Demos: Demo<typeof about2Schema>[] = [
  {
    language: 'en_US',
    data: {
      about2Image: {
        id: '1',
        version: 1,
        fileName: 'team-photo.jpg',
        fileType: 'image/jpeg',
        filePath: '/img/team/team-photo.jpg',
      },
      about2Label: 'Who Are We?',
      about2Title: 'We value the creativity of techniques in our company.',
      about2Description:
        "We take great pride in our ability to develop custom solutions that exceed our clients' expectations and push the boundaries of design. If you are looking for inspiration or want to see what is possible.",
      about2BulletPoints: [
        {
          id: '101',
          version: 0,
          attrs: {
            text: 'We are a firm that understands the impact',
          },
        },
        {
          id: '102',
          version: 0,
          attrs: {text: 'We are a firm that understands the impact'},
        },
        {
          id: '103',
          version: 0,
          attrs: {
            text: 'We are a firm that understands the impact',
          },
        },
        {
          id: '104',
          version: 0,
          attrs: {
            text: 'We are a firm that understands the impact',
          },
        },
      ],
    },
  },
  {
    language: 'fr_FR',
    data: {
      about2Image: {
        id: '1',
        version: 1,
        fileName: 'team-photo.jpg',
        fileType: 'image/jpeg',
        filePath: '/img/team/team-photo.jpg',
      },
      about2Label: 'Qui sommes-nous ?',
      about2Title:
        'Nous valorisons la créativité des techniques dans notre entreprise.',
      about2Description:
        "Nous sommes fiers de notre capacité à développer des solutions personnalisées qui dépassent les attentes de nos clients et repoussent les limites du design. Si vous cherchez de l'inspiration ou souhaitez découvrir ce qui est possible.",
      about2BulletPoints: [
        {
          id: '101',
          version: 0,
          attrs: {
            text: "Nous sommes une entreprise qui comprend l'impact",
          },
        },
        {
          id: '102',
          version: 0,
          attrs: {
            text: "Nous sommes une entreprise qui comprend l'impact",
          },
        },
        {
          id: '103',
          version: 0,
          attrs: {
            text: "Nous sommes une entreprise qui comprend l'impact",
          },
        },
        {
          id: '104',
          version: 0,
          attrs: {
            text: "Nous sommes une entreprise qui comprend l'impact",
          },
        },
      ],
    },
  },
];
