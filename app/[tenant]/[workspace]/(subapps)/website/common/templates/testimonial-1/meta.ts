import {Template, Data, Meta} from '@/subapps/website/common/types/templates';

export const testimonial1Meta = {
  title: 'Testimonial 1',
  code: 'testimonial1',
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

export const testimonial1Demo: Testimonial1Data = {
  testimonial1Link: '#',
  testimonial1Title: 'Testimonial 1',
  testimonial1Caption:
    "Don't believe anything we say. Check out what our clients are saying about us.",
  testimonial1LinkText: 'All Testimonials',
  testimonial1Description:
    'They provided excellent communication and kept me informed every step of the way. The end product exceeded my expectations and has already made a significant impact on my business. I would highly recommend Lighthouse.',
  testimonial1TestimonialList: [
    {
      id: '24',
      version: 1,
      attrs: {
        name: 'Tom Onix',
        review: 'Their team  knowledge, professional, & easy to work',
        designation: 'Financial Analyst',
        columnClasses: 'col-xl-5 align-self-end',
      },
    },
    {
      id: '25',
      version: 1,
      attrs: {
        name: 'Lessar Carey',
        review:
          'I would highly recommend [Company Name] to anyone looking for top-notch services. Impact on my business',
        designation: 'Marketing Specialist',
        columnClasses: 'align-self-end',
      },
    },
    {
      id: '26',
      version: 1,
      attrs: {
        name: 'Ocsiloco Termend',
        review:
          'They provided excellent communication and kept me informed every step of the way.',
        designation: 'Sales Specialist',
        columnClasses: 'col-xl-5 offset-xl-1',
      },
    },
    {
      id: '27',
      version: 1,
      attrs: {
        name: 'Aliko Andree',
        review:
          'The end product exceeded my expectations and has already made a impact on my business.',
        designation: 'Investment Planner',
        columnClasses: 'align-self-start',
      },
    },
  ],
};
