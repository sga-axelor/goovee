import Target from '@/subapps/templates/common/icons/lineal/Target';
import AwardTwo from '@/subapps/templates/common/icons/lineal/AwardTwo';
import BarChart from '@/subapps/templates/common/icons/lineal/BarChart';
import Megaphone from '@/subapps/templates/common/icons/lineal/Megaphone';
import SettingsThree from '@/subapps/templates/common/icons/lineal/SettingsThree';
import Rocket from '@/subapps/templates/common/icons/solid/Rocket';
import Shield from '@/subapps/templates/common/icons/solid/Shield';
import DevicesThree from '@/subapps/templates/common/icons/solid/DevicesThree';
import AI from '@/subapps/templates/common/icons/solid/AI';
import Setting from '@/subapps/templates/common/icons/solid/Setting';
import Cart from '@/subapps/templates/common/icons/solid/Cart';

const clients = [
  {id: 1, image: '/img/brands/c1.png'},
  {id: 2, image: '/img/brands/c2.png'},
  {id: 3, image: '/img/brands/c3.png'},
  {id: 4, image: '/img/brands/c4.png'},
  {id: 5, image: '/img/brands/c5.png'},
  {id: 6, image: '/img/brands/c6.png'},
  {id: 7, image: '/img/brands/c7.png'},
  {id: 8, image: '/img/brands/c8.png'},
];

const whatWeAre = [
  {
    id: 1,
    Icon: Rocket,
    title: 'Our Mission',
    description: 'The influence of great design and creative thinking',
  },
  {
    id: 2,
    Icon: Shield,
    title: 'Our Values',
    description: 'The influence of great design and creative thinking',
  },
];

const services = [
  {
    id: 1,
    Icon: DevicesThree,
    title: 'IoT Development',
    description: 'IoT development, devices are connected to the internet',
  },
  {
    id: 2,
    Icon: AI,
    title: 'Artificial Intelligence',
    description: 'IoT development, devices are connected to the internet',
  },
  {
    id: 3,
    Icon: Setting,
    title: 'Software Maintenance',
    description: 'IoT development, devices are connected to the internet',
  },
  {
    id: 4,
    Icon: Cart,
    title: 'E-commerce Solutions',
    description: 'IoT development, devices are connected to the internet',
  },
];

const teams = [
  {
    id: 1,
    name: 'Tom Accor',
    designation: 'Developer',
    image: {'1x': '/img/avatars/t1.jpg', '2x': '/img/avatars/t1@2x.jpg 2x'},
  },
  {
    id: 2,
    name: 'Anna Trois',
    designation: 'UI and UX Designer',
    image: {'1x': '/img/avatars/t2.jpg', '2x': '/img/avatars/t2@2x.jpg 2x'},
  },
  {
    id: 3,
    name: 'Sonal Ocer',
    designation: 'Sr. Marketing Manager',
    image: {'1x': '/img/avatars/t3.jpg', '2x': '/img/avatars/t3@2x.jpg 2x'},
  },
  {
    id: 4,
    name: 'Inan Rocketich',
    designation: 'Advisor',
    image: {'1x': '/img/avatars/t4.jpg', '2x': '/img/avatars/t4@2x.jpg 2x'},
  },
];

const progressList = [
  {id: 1, percent: 100, title: 'Marketing'},
  {id: 2, percent: 80, title: 'Strategy'},
  {id: 3, percent: 85, title: 'Development'},
];

const pricingList = [
  {
    monthlyPrice: 19,
    yearlyPrice: 199,
    planName: 'Premium',
    features: [
      '5 Projects',
      '100K API Access',
      '200MB Storage',
      'Weekly Reports',
      '7/24 Support',
    ],
  },
  {
    monthlyPrice: 49,
    yearlyPrice: 499,
    planName: 'Corporate',
    features: [
      '20 Projects',
      '300K API Access',
      '500MB Storage',
      'Weekly Reports',
      '7/24 Support',
    ],
  },
];

const accordions = [
  {
    no: 'One',
    expand: false,
    heading: 'How often should I get a physical examination?',
    body: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum. Praesent commodo cursus magna, vel.',
  },
  {
    no: 'Two',
    expand: false,
    heading: 'How can I access mental health services?',
    body: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum. Praesent commodo cursus magna, vel.',
  },
  {
    no: 'Three',
    expand: false,
    heading: 'What should I do if I have a medical emergency?',
    body: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum. Praesent commodo cursus magna, vel.',
  },
  {
    no: 'Four',
    expand: false,
    heading: 'What is telemedicine, and how does it work?',
    body: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum. Praesent commodo cursus magna, vel.',
  },
];

export {
  clients,
  whatWeAre,
  services,
  teams,
  progressList,
  pricingList,
  accordions,
};
