import Box from '@/subapps/templates/common/icons/solid/Box';
import User from '@/subapps/templates/common/icons/lineal/User';
import Check from '@/subapps/templates/common/icons/lineal/Check';
import {LinkType} from '@/subapps/templates/common/types/demo-1';
import IdCard from '@/subapps/templates/common/icons/solid/IdCard';
import ThumbsUp from '@/subapps/templates/common/icons/solid/ThumbsUp';
import Megaphone from '@/subapps/templates/common/icons/solid/Megaphone';
import BriefcaseTwo from '@/subapps/templates/common/icons/lineal/BriefcaseTwo';

const services = [
  {
    id: 1,
    link: '#',
    Icon: Megaphone,
    title: 'Content Marketing',
    linkType: LinkType.yellow,
    iconClassName: 'icon-svg-md text-orange mb-3',
    cardClassName: 'card-border-bottom border-soft-yellow',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.`,
  },
  {
    id: 2,
    link: '#',
    Icon: ThumbsUp,
    title: 'Social Engagement',
    linkType: LinkType.green,
    iconClassName: 'icon-svg-md text-orange mb-3',
    cardClassName: 'card-border-bottom border-soft-yellow',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.`,
  },
  {
    id: 3,
    link: '#',
    Icon: IdCard,
    linkType: LinkType.orange,
    title: 'Identity & Branding',
    iconClassName: 'icon-svg-md text-orange mb-3',
    cardClassName: 'card-border-bottom border-soft-yellow',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.`,
  },
  {
    id: 4,
    link: '#',
    Icon: Box,
    linkType: LinkType.blue,
    title: 'Product Design',
    iconClassName: 'icon-svg-md text-orange mb-3',
    cardClassName: 'card-border-bottom border-soft-yellow',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.`,
  },
];

const processList = [
  {
    no: '1',
    className: 'me-lg-6',
    title: 'Personalized service',
    subtitle:
      'We believe in getting to know our customers and understanding their unique.',
  },
  {
    no: '2',
    title: 'Competitive pricing',
    className: 'ms-lg-13 mt-6',
    subtitle:
      'We believe in getting to know our customers and understanding their unique.',
  },
  {
    no: '3',
    title: 'Timely delivery',
    className: 'mx-lg-6 mt-6',
    subtitle:
      'We believe in getting to know our customers and understanding their unique.',
  },
];

const factList = [
  {id: 1, number: 200, title: 'Happy Clients', suffix: '+'},
  {id: 2, number: 1, title: 'Completed Projects', suffix: 'K+'},
  {id: 3, number: 100, title: 'Awards Won', suffix: '+'},
];

const reviews = [
  {
    id: 1,
    name: 'Elon Tonnis',
    designation: 'Developer',
    review: `I wanted to share my positive experience working with your team. From start to finish, the process was smooth and efficient.`,
  },
  {
    id: 2,
    name: 'Tomas Anlee',
    designation: 'UX Designer',
    review: `I wanted to share my positive experience working with your team. From start to finish, the process was smooth and efficient.`,
  },
  {
    id: 3,
    name: 'Alina Jeen',
    designation: 'Project Analyzer',
    review: `I wanted to share my positive experience working with your team. From start to finish, the process was smooth and efficient.`,
  },
  {
    id: 4,
    name: 'Fuppe Dup',
    designation: 'Software Engineer',
    review: `I wanted to share my positive experience working with your team. From start to finish, the process was smooth and efficient.`,
  },
];

export {services, processList, factList, reviews};
