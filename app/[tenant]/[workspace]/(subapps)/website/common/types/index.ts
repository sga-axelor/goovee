import {ID} from '@/types';
import {MOUNT_TYPE} from '../constants';

export type MenuItem = {
  id: string;
  title: string;
  externalPage?: string;
  page?: {
    slug: string;
  };
  archived?: boolean;
  subMenuList?: MenuItem[];
};

export type Menu = {
  menuList: MenuItem[];
};

export type TemplateProps<T = any, M = any> = {
  data?: T;
  menu?: M;
  lineId?: ID;
  contentId?: ID;
  contentVersion?: number;
  workspaceURI: string;
  websiteSlug: string;
  websitePageSlug?: string;
  code?: string | null;
  mountType: MountType;
  canEditWiki?: boolean;
};

export type MountType = MOUNT_TYPE;
export type LayoutMountType = Exclude<MountType, MOUNT_TYPE.PAGE>;
