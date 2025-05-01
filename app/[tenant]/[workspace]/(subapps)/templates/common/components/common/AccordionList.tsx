import {FC} from 'react';
import Accordion from 'components/reuseable/accordion';
// -------- data -------- //
const accordions = [
  {
    no: 'One',
    expand: true,
    heading: 'Quality of Service',
    body: 'Customers may choose your company because you offer high-quality products or services that meet their needs and exceed their expectations. This can lead to customer satisfaction, loyalty, and positive word-of-mouth recommendations.',
  },
  {
    no: 'Two',
    expand: false,
    heading: 'Competitive Pricing',
    body: 'Customers may choose your company because you offer high-quality products or services that meet their needs and exceed their expectations. This can lead to customer satisfaction, loyalty, and positive word-of-mouth recommendations.',
  },
  {
    no: 'Three',
    expand: false,
    heading: 'Customer Service',
    body: 'Customers may choose your company because you offer high-quality products or services that meet their needs and exceed their expectations. This can lead to customer satisfaction, loyalty, and positive word-of-mouth recommendations.',
  },
];

const AccordionList: FC = () => {
  return (
    <div className="accordion accordion-wrapper" id="accordionExample">
      {accordions.map(item => (
        <Accordion type="plain" key={item.no} {...item} />
      ))}
    </div>
  );
};

export default AccordionList;
