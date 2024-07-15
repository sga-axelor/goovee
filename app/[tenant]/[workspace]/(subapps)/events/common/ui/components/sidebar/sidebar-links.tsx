import {
  MdApps,
  MdGroups3,
  MdList,
  MdNewspaper,
  MdOutlineCalendarMonth,
  MdOutlineDocumentScanner,
  MdOutlineListAlt,
  MdOutlineShoppingCart,
} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import type {SidebarProps} from '@/subapps/events/common/ui/components';

export const sidebarLinks: SidebarProps[] = [
  {
    icon: <MdOutlineShoppingCart className="w-6 h-6" color="#15A9FC" />,
    url: '/',
    label: 'E-commerce',
  },
  {
    icon: <MdOutlineDocumentScanner className="w-6 h-6" color="#A641F6" />,
    url: '/',
    label: 'Resources',
  },
  {
    icon: <MdNewspaper className="w-6 h-6" color="#FB9C0C" />,
    url: '/',
    label: 'News',
  },
  {
    icon: <MdOutlineCalendarMonth className="w-6 h-6" color="#15A9FC" />,
    url: '/',
    label: 'Events',
  },
  {
    icon: <MdApps className="w-6 h-6" color="#FF7AF2" />,
    url: '/',
    label: 'Directory',
  },
  {
    icon: <MdGroups3 className="w-6 h-6" color="#FB9C0C" />,
    url: '/',
    label: 'Community',
  },
  {
    icon: <MdList className="w-6 h-6" color="#A641F6" />,
    url: '/',
    label: 'Ticketing',
  },
  {
    icon: <MdOutlineListAlt className="w-6 h-6" color="#FF7AF2" />,
    url: '/',
    label: 'Project',
  },
];
