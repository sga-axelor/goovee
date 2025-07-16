import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const pricing1Meta = {
  title: 'Pricing 1',
  code: 'pricing1',
  type: Template.block,
  fields: [
    {
      name: 'roundShape',
      title: 'Round Shape',
      type: 'boolean',
    },
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
      name: 'switchLeftLabel',
      title: 'Switch Left Label',
      type: 'string',
    },
    {
      name: 'switchRightLabel',
      title: 'Switch Right Label',
      type: 'string',
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
    },
    {
      name: 'plans',
      title: 'Plans',
      type: 'json-one-to-many',
      target: 'Pricing1Plan',
    },
  ],
  models: [
    {
      name: 'Pricing1Plan',
      title: 'Pricing 1 Plan',
      fields: [
        {
          name: 'plan',
          title: 'Plan',
          type: 'string',
          nameField: true,
          visibleInGrid: true,
        },
        {
          name: 'price1',
          title: 'Price 1',
          type: 'decimal',
          visibleInGrid: true,
        },
        {
          name: 'price2',
          title: 'Price 2',
          type: 'decimal',
          visibleInGrid: true,
        },
        {
          name: 'bulletBg',
          title: 'Bullet Background',
          type: 'boolean',
        },
        {
          name: 'roundedButton',
          title: 'Rounded Button',
          type: 'boolean',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'features',
          title: 'Features',
          type: 'json-one-to-many',
          target: 'Pricing1Feature',
        },
      ],
    },
    {
      name: 'Pricing1Feature',
      title: 'Pricing 1 Feature',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'string',
          nameField: true,
          visibleInGrid: true,
        },
      ],
    },
  ],
} as const satisfies Meta;

export type Pricing1Data = Data<typeof pricing1Meta>;
