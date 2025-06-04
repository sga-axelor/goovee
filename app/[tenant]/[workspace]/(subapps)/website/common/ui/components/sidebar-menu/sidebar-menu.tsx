// ---- LOCAL IMPORTS ---- //
import {TemplateProps, Menu} from '@/subapps/website/common/types';
import {SidebarMenuContent} from './content';

export function SidebarMenu(props: TemplateProps<any, Menu>) {
  const {menu} = props;

  if (!menu) {
    return null;
  }

  const {menuList} = menu;
  return <SidebarMenuContent values={{menuList}} />;
}
