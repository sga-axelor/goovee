import {i18n} from '@/i18n';

export const ROUTES = {
  personal: 'personal',
  company: 'company',
  notifications: 'notifications',
  password: 'password',
  apps: 'apps',
  addresses: 'addresses',
};

export const MENU = [
  {
    label: i18n.get('Personal settings'),
    route: ROUTES.personal,
  },
  {
    label: i18n.get('Company settings'),
    route: ROUTES.company,
  },
  {
    label: i18n.get('Notifications'),
    route: ROUTES.notifications,
  },
  {
    label: i18n.get('Password'),
    route: ROUTES.password,
  },
  {
    label: i18n.get('My apps'),
    route: ROUTES.apps,
  },
  {
    label: i18n.get('Addresses'),
    route: ROUTES.addresses,
  },
];
