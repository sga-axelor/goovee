import {Data, Meta} from '@/subapps/website/common/types/templates';

export const clients1Meta = {
  title: 'Clients 1',
  name: 'clients1',
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
          name: 'image',
          title: 'Image',
          type: 'string',
          nameField: true,
          visibleInGrid: true,
        },
      ],
    },
  ],
} as const satisfies Meta;

export type Clients1Data = Data<typeof clients1Meta>;
