import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const testimonial1Meta = {
  title: 'Testimonial 1',
  name: 'testimonial1',
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
      name: 'link',
      title: 'Link',
      type: 'string',
    },
    {
      name: 'testimonialList',
      title: 'Testimonial List',
      type: 'json-one-to-many',
      target: 'Testimonial1TestimonialList',
    },
  ],
  models: [
    {
      name: 'Testimonial1TestimonialList',
      title: 'Testimonial 1 Testimonial List',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
          nameField: true,
          visibleInGrid: true,
        },
        {
          name: 'designation',
          title: 'Designation',
          type: 'string',
          visibleInGrid: true,
        },
        {
          name: 'review',
          title: 'Review',
          type: 'string',
        },
        {
          name: 'columnClasses',
          title: 'Column Classes',
          type: 'string',
        },
      ],
    },
  ],
} as const satisfies Meta;

export type Testimonial1Data = Data<typeof testimonial1Meta>;
