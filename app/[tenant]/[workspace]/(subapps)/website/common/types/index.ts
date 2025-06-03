export type TemplateProps<T = any, M = any> = {data?: T; menu?: M};

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
