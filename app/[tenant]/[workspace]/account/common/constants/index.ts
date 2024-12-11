import {i18n} from '@/i18n';
import {Role} from '../types';
import {SUBAPP_CODES} from '@/constants';

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
    label: i18n.get('Notifications'),
    route: ROUTES.notifications,
  },
  {
    label: i18n.get('My apps'),
    route: ROUTES.apps,
  },
];

export const ADMIN_WORKSPACE_MENU = [
  {
    label: i18n.get('Members'),
    route: ROUTES.members,
  },
  ...WORKSPACE_MENU,
];

export const RoleLabel = {
  [Role.admin]: i18n.get('Admin'),
  [Role.user]: i18n.get('User'),
};
