import Dollar from '@/subapps/templates/common/icons/solid/Dollar';
import Rocket from '@/subapps/templates/common/icons/solid/Rocket';
import Briefcase from '@/subapps/templates/common/icons/solid/Briefcase';
import DisplayChartUp from '@/subapps/templates/common/icons/solid/DisplayChartUp';
import HourGlassStart from '@/subapps/templates/common/icons/solid/HourGlassStart';

const facilities = [
  {
    id: 1,
    Icon: DisplayChartUp,
    title: 'Career Growth',
    description:
      'Customers may choose your company you provide excellent customer service that is make them valued.',
  },
  {
    id: 2,
    Icon: Briefcase,
    title: 'Work From Anywhere',
    description:
      'Customers may choose your company you provide excellent customer service that is make them valued.',
  },
  {
    id: 3,
    Icon: Dollar,
    title: 'Smart Salary',
    description:
      'Customers may choose your company you provide excellent customer service that is make them valued.',
  },
  {
    id: 4,
    Icon: HourGlassStart,
    title: 'Flexible Hours',
    description:
      'Customers may choose your company you provide excellent customer service that is make them valued.',
  },
];

const services = [
  {
    id: 1,
    Icon: Rocket,
    title: 'Our Mission',
    description: 'Curabitur blandit lacus porttitor ridiculus mus.',
  },
  {
    id: 2,
    Icon: Briefcase,
    title: 'Our Values',
    description: 'Curabitur blandit lacus porttitor ridiculus mus.',
  },
];

const designJobList = [
  {
    id: 1,
    link: '#',
    avatar: 'GD',
    time: 'Full Time',
    avatarColor: 'bg-red',
    location: 'San Francisco, US',
    title: 'Senior Graphic Designer',
  },
  {
    id: 2,
    link: '#',
    avatar: 'UX',
    time: 'Remote',
    location: 'Anywhere',
    title: 'UI/UX Designer',
    avatarColor: 'bg-green',
  },
  {
    id: 3,
    link: '#',
    avatar: 'AN',
    time: 'Full Time',
    avatarColor: 'bg-yellow',
    location: 'Birmingham, UK',
    title: 'Multimedia Artist & Animator',
  },
];

const developmentJobList = [
  {
    id: 1,
    link: '#',
    avatar: 'FD',
    time: 'Part Time',
    location: 'Sydney, AU',
    avatarColor: 'bg-purple',
    title: 'Front End Developer',
  },
  {
    id: 2,
    link: '#',
    avatar: 'MD',
    time: 'Full Time',
    avatarColor: 'bg-orange',
    title: 'Mobile Developer',
    location: 'San Francisco, US',
  },
  {
    id: 3,
    link: '#',
    avatar: 'NT',
    time: 'Full Time',
    avatarColor: 'bg-pink',
    title: '.NET Developer',
    location: 'Manchester, UK',
  },
];

const positionOptions = [
  {id: 0, title: 'Position', value: ''},
  {id: 1, title: 'Design', value: 'design'},
  {id: 2, title: 'Finance', value: 'finance'},
  {id: 3, title: 'Business', value: 'business'},
  {id: 4, title: 'Marketing', value: 'marketing'},
  {id: 5, title: 'Development', value: 'development'},
  {id: 6, title: 'Engineering', value: 'engineering'},
];

const typeOptions = [
  {id: 0, title: 'Type', value: ''},
  {id: 1, title: 'Full-time', value: 'full-time'},
  {id: 2, title: 'Part-time', value: 'part-time'},
  {id: 3, title: 'Remote', value: 'remote'},
];

const locationOptions = [
  {id: 0, title: 'Location', value: ''},
  {id: 1, title: 'Chicago, US', value: 'chicago'},
  {id: 2, title: 'Michigan, US', value: 'michigan'},
  {id: 3, title: 'New York, US', value: 'new-york'},
  {id: 4, title: 'Los Angles, US', value: 'los-angles'},
  {id: 5, title: 'Moscow, Russia', value: 'Moscow'},
  {id: 6, title: 'Sydney, Australia', value: 'sydney'},
  {id: 7, title: 'Birmingham, UK', value: 'birmingham'},
  {id: 8, title: 'Manchester, UK', value: 'manchester'},
  {id: 9, title: 'Beijing, China', value: 'beijing'},
];

export default {
  services,
  facilities,
  typeOptions,
  designJobList,
  positionOptions,
  locationOptions,
  developmentJobList,
};
