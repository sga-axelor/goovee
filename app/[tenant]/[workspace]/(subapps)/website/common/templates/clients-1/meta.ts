import {Data, Meta} from '@/subapps/website/common/types/templates';
import {metaFileModel} from '../meta-models';

export const clients1Meta = {
  title: 'Clients 1',
  code: 'clients1',
  type: 1,
  fields: [
    {
      name: 'clientList',
      title: 'Client List',
      type: 'json-one-to-many',
      target: 'Clients1ClientList',
    },
  ],
  models: [
    {
      name: 'Clients1ClientList',
      title: 'Client List',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
          visibleInGrid: true,
          nameField: true,
        },
        {
          name: 'image',
          title: 'Image',
          type: 'many-to-one',
          target: 'com.axelor.meta.db.MetaFile',
          widget: 'Image',
        },
      ],
    },
  ],
  metaModels: [metaFileModel],
} as const satisfies Meta;

export type Clients1Data = Data<typeof clients1Meta>;
