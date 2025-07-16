import {Template, Data, Meta} from '@/subapps/website/common/types/templates';
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
