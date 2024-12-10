import {PortalApp} from '@/types';

export enum Role {
  user = 'user',
  admin = 'admin',
}

export enum Authorization {
  restricted = 'restricted',
  total = 'total',
}

export type InviteAppsConfig = {
  [key: PortalApp['code']]: {
    code: PortalApp['code'];
    access?: string;
    authorization?: Authorization;
    id?: string;
  };
};
