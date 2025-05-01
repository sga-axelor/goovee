import {LinkType} from 'types/demo-1';
import color from 'utils/color';

import AI from 'icons/solid/AI';
import Hand from 'icons/solid/Hand';
import Code from 'icons/solid/Code';
import Cart from 'icons/solid/Cart';
import Rocket from 'icons/solid/Rocket';
import ShieldTwo from 'icons/solid/Shield';
import SettingTwo from 'icons/solid/Setting';
import DevicesTwo from 'icons/solid/DevicesTwo';
import DevicesThree from 'icons/solid/DevicesThree';
import HandHoldingMedical from 'icons/solid/HandHoldingMedical';
import SuitcaseMedical from 'icons/solid/SuitcaseMdical';
import BrainPlus from 'icons/solid/BrainPlus';
import ScaleUnbalanced from 'icons/solid/ScaleUnbalanced';
import Stethoscope from 'icons/solid/Stethoscope';
import TruckMedical from 'icons/solid/TruckMedical';
import Headphone from 'icons/solid/Headphone';

// used in the services-1 block
export const serviceList1 = [
  {
    id: 1,
    link: '#',
    icon: Rocket,
    title: 'DevOps',
    linkText: 'Learn More',
    linkType: LinkType.yellow,
    description: `The agency can provide DevOps services to help businesses streamline their software development`,
  },
  {
    id: 2,
    link: '#',
    icon: Code,
    title: 'Software Development',
    linkText: 'Learn More',
    linkType: LinkType.red,
    description: `The agency can provide DevOps services to help businesses streamline their software development`,
  },
  {
    id: 3,
    link: '#',
    icon: DevicesTwo,
    linkType: LinkType.green,
    title: 'App Development',
    linkText: 'Learn More',
    description: `The agency can provide DevOps services to help businesses streamline their software development`,
  },
  {
    id: 4,
    link: '#',
    icon: Hand,
    linkType: LinkType.blue,
    title: 'Maintenance & Support',
    linkText: 'Learn More',
    description: `The agency can provide DevOps services to help businesses streamline their software development`,
  },
];

// used in the services-3, services-8, services-13 block
export const serviceList2 = [
  {
    id: 1,
    linkUrl: '#',
    title: 'IoT Development',
    icon: 'uil-circuit',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 2,
    linkUrl: '#',
    title: 'Artificial Intelligence',
    icon: 'uil-processor',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 3,
    linkUrl: '#',
    title: 'Software Maintenance',
    icon: 'uil-setting',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 4,
    linkUrl: '#',
    title: 'Cybersecurity',
    icon: 'uil-lock-access',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
];

// used in the services-4 block
export const serviceList3 = [
  {
    id: 1,
    linkUrl: '#',
    title: '24/7 Support',
    icon: 'uil-phone-volume',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.`,
  },
  {
    id: 2,
    linkUrl: '#',
    title: 'Secure Payments',
    icon: 'uil-shield-exclamation',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.`,
  },
  {
    id: 3,
    linkUrl: '#',
    title: 'Daily Updates',
    icon: 'uil-laptop-cloud',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.`,
  },
  {
    id: 4,
    linkUrl: '#',
    title: 'Market Research',
    icon: 'uil-chart-line',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.`,
  },
];

// used in the services-5 block
export const serviceList4 = [
  {
    id: 1,
    Icon: DevicesThree,
    title: 'IoT Development',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 2,
    Icon: AI,
    title: 'Artificial Intelligence',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 3,
    Icon: SettingTwo,
    title: 'Software Maintenance',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 4,
    Icon: ShieldTwo,
    title: 'Cybersecurity',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 5,
    Icon: Rocket,
    title: 'IT Consulting',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 6,
    Icon: Cart,
    title: 'E-commerce Solutions',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
];

// used in the services-6 block
export const serviceList5 = [
  [
    'Aenean quam ornare curabitur blandit consectetur.',
    'Nullam quis risus eget urna mollis ornare aenean leo.',
  ],
  [
    'Etiam porta euismod malesuada mollis nisl ornare.',
    'Vivamus sagittis lacus augue rutrum maecenas odio.',
  ],
];

// used in the services-7 block
export const serviceList6 = [
  {
    id: 1,
    Icon: HandHoldingMedical,
    color: color.aqua,
    title: 'Primary Care',
    description: `Many of these services may be provide by primary care physicians, while other may require a referral to a specialist.`,
  },
  {
    id: 2,
    Icon: SuitcaseMedical,
    color: color.yellow,
    title: 'Maintain Health',
    description: `Many of these services may be provide by primary care physicians, while other may require a referral to a specialist.`,
  },
  {
    id: 3,
    Icon: BrainPlus,
    color: color.red,
    title: 'Pain Management',
    description: `Many of these services may be provide by primary care physicians, while other may require a referral to a specialist.`,
  },
  {
    id: 4,
    Icon: ScaleUnbalanced,
    color: color.pink,
    title: 'Weight Management',
    description: `Many of these services may be provide by primary care physicians, while other may require a referral to a specialist.`,
  },
  {
    id: 5,
    Icon: Stethoscope,
    color: color.green,
    title: 'Diagnostic Reports',
    description: `Many of these services may be provide by primary care physicians, while other may require a referral to a specialist.`,
  },
  {
    id: 6,
    Icon: TruckMedical,
    color: color.purple,
    title: 'Emergency Care',
    description: `Many of these services may be provide by primary care physicians, while other may require a referral to a specialist.`,
  },
];

// used in the services-9 block
export const serviceList7 = [
  {
    id: 1,
    Icon: DevicesThree,
    color: color.yellow,
    title: 'IoT Development',
    cardColor: 'bg-pale-yellow',
    columnClass: 'col-md-5 offset-md-1 align-self-end',
    description:
      'IoT development, devices are connected to the internet provide useful.',
  },
  {
    id: 2,
    Icon: AI,
    color: color.red,
    title: 'Artificial Intelligence',
    cardColor: 'bg-pale-red',
    columnClass: 'col-md-6 align-self-end',
    description:
      'IoT development, devices are connected to the internet provide useful.',
  },
  {
    id: 3,
    color: color.leaf,
    Icon: SettingTwo,
    title: 'Software Maintenance',
    cardColor: 'bg-pale-leaf',
    columnClass: 'col-md-5',
    description:
      'IoT development, devices are connected to the internet provide useful.',
  },
  {
    id: 4,
    Icon: ShieldTwo,
    color: color.primary,
    title: 'Cybersecurity',
    cardColor: 'bg-pale-primary',
    columnClass: 'col-md-6 align-self-start',
    description:
      'IoT development, devices are connected to the internet provide useful.',
  },
];

// used in the services-18 block
export const serviceList8 = [
  {
    id: 1,
    Icon: Code,
    title: 'Software Development',
    description: `Software engineers develop software solutions using various technologies to meet clients' needs.`,
  },
  {
    id: 2,
    Icon: DevicesThree,
    title: 'DevOps',
    description: `Software engineers develop software solutions using various technologies to meet clients' needs.`,
  },
  {
    id: 3,
    Icon: SettingTwo,
    title: 'Web Design',
    description: `Software engineers develop software solutions using various technologies to meet clients' needs.`,
  },
  {
    id: 4,
    title: 'Support',
    Icon: Headphone,
    description: `Software engineers develop software solutions using various technologies to meet clients' needs.`,
  },
];

// used in the services-19 block
export const serviceList9 = [
  {
    id: 1,
    linkUrl: '#',
    color: color.purple,
    title: 'IoT Development',
    icon: 'uil-circuit',
    description:
      'IoT development, devices are connected to the internet devices are connected to the internet.',
  },
  {
    id: 2,
    linkUrl: '#',
    color: color.green,
    title: 'Artificial Intelligence',
    icon: 'uil-brain',
    description:
      'IoT development, devices are connected to the internet devices are connected to the internet.',
  },
  {
    id: 3,
    linkUrl: '#',
    color: color.orange,
    title: 'Software Maintenance',
    icon: 'uil-process',
    description:
      'IoT development, devices are connected to the internet devices are connected to the internet.',
  },
];

// used in the services-20 block
export const serviceList10 = [
  {
    id: 1,
    linkUrl: '#',
    Icon: Code,
    title: 'IoT Development',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 2,
    linkUrl: '#',
    Icon: AI,
    title: 'Artificial Intelligence',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 3,
    linkUrl: '#',
    Icon: SettingTwo,
    title: 'Software Maintenance',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 4,
    linkUrl: '#',
    Icon: ShieldTwo,
    title: 'Cybersecurity',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 5,
    linkUrl: '#',
    Icon: Rocket,
    title: 'IT Consulting',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 6,
    linkUrl: '#',
    Icon: Cart,
    title: 'E-commerce Solutions',
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
];

// used in the services-21 block
export const serviceList11 = [
  {
    id: 1,
    link: '#',
    Icon: Rocket,
    title: 'DevOps',
    linkType: LinkType.fuchsia,
    iconClassName: 'icon-svg-sm solid-mono text-fuchsia mb-3',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.`,
  },
  {
    id: 2,
    link: '#',
    Icon: Code,
    title: 'Development',
    linkType: LinkType.violet,
    iconClassName: 'icon-svg-sm solid-mono text-violet mb-3',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.`,
  },
  {
    id: 3,
    link: '#',
    Icon: DevicesTwo,
    linkType: LinkType.orange,
    title: 'App Development',
    iconClassName: 'icon-svg-sm solid-mono text-orange mb-3',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.`,
  },
  {
    id: 4,
    link: '#',
    Icon: Hand,
    title: 'Support',
    linkType: LinkType.green,
    iconClassName: 'icon-svg-sm solid-mono text-green mb-3',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.`,
  },
];

// used in the services-24 block
export const serviceList12 = [
  {
    id: 1,
    title: 'Web Design',
    image: {
      '1x': '/img/illustrations/i24.png',
      '2x': '/img/illustrations/i24@2x.png 2x',
    },
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 2,
    title: 'Digital Marketing',
    image: {
      '1x': '/img/illustrations/i19.png',
      '2x': '/img/illustrations/i19@2x.png 2x',
    },
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
  {
    id: 3,
    title: 'Motion Graphics',
    image: {
      '1x': '/img/illustrations/i18.png',
      '2x': '/img/illustrations/i18@2x.png 2x',
    },
    description: `IoT development, devices are connected to the internet and data to provide useful services and automate processes.`,
  },
];

// used in the services-25 block
export const serviceList13 = [
  {
    id: 1,
    linkUrl: '#',
    color: color.purple,
    title: 'Web Design',
    icon: 'uil-monitor',
    description: `Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget. Fusce dapibus tellus.`,
  },
  {
    id: 2,
    linkUrl: '#',
    color: color.green,
    title: 'Graphic Design',
    icon: 'uil-swatchbook',
    description: `Maecenas faucibus mollis interdum. Vivamus sagittis lacus vel augue laoreet. Sed posuere consectetur.`,
  },
  {
    id: 3,
    linkUrl: '#',
    color: color.pink,
    title: '3D Animation',
    icon: 'uil-presentation-play',
    description: `Cras justo odio, dapibus ac facilisis in, egestas eget quam. Praesent commodo cursus magna scelerisque.`,
  },
];

// used in the services-26 block
export const serviceList14 = [
  {
    id: 1,
    url: '#',
    title: 'Wedding',
    image: {'1x': '/img/photos/fs1.jpg', '2x': '/img/photos/fs1@2x.jpg 2x'},
  },
  {
    id: 2,
    url: '#',
    title: 'Couples',
    image: {'1x': '/img/photos/fs2.jpg', '2x': '/img/photos/fs2@2x.jpg 2x'},
  },
  {
    id: 3,
    url: '#',
    title: 'Engagement',
    image: {'1x': '/img/photos/fs3.jpg', '2x': '/img/photos/fs3@2x.jpg 2x'},
  },
];
