import {i18n} from '@/i18n';

export const ROUTES = {
  personal: 'personal',
  prefrences: 'preferences',
  password: 'password',
  addresses: 'addresses',
  members: 'members',
  notifications: 'notifications',
  apps: 'apps',
};

export const GLOBAL_MENU = [
  {
    label: i18n.get('Personal settings'),
    route: ROUTES.personal,
  },
  {
    label: i18n.get('Preferences'),
    route: ROUTES.prefrences,
  },
  {
    label: i18n.get('Password'),
    route: ROUTES.password,
  },

  {
    label: i18n.get('Addresses'),
    route: ROUTES.addresses,
  },
];

export const WORKSPACE_MENU = [
  {
    label: i18n.get('Members'),
    route: ROUTES.members,
  },
  {
    label: i18n.get('Notifications'),
    route: ROUTES.notifications,
  },
  {
    label: i18n.get('My apps'),
    route: ROUTES.apps,
  },
];
