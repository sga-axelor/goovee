import {MdOutlineArticle, MdOutlinePermMedia} from 'react-icons/md';

export const GROUPS = 'Groups';
export const MEMBER = 'Member';
export const NOT_MEMBER = 'Not member';
export const SEARCH_HERE = 'Search here';
export const MARK_AS_READ = 'Mark as read';
export const PIN = 'Pin';
export const NOTIFICATIONS = 'Notifications';
export const LEAVE_THIS_GROUP = 'Leave this group';
export const GROUP_NAME = 'Group name';
export const START_A_POST = 'Start a post';

export const GROUP_SORT_BY = [
  {
    id: 'default',
    title: 'Default',
  },
  {
    id: 'asc',
    title: 'A-Z',
  },
  {
    id: 'dsc',
    title: 'Z-A',
  },
];

export const NOTIFICATIONS_OPTION = [
  {id: 'all', title: 'All new posts and new comments'},
  {id: 'all-my-posts', title: 'All new posts and new comments on my posts'},
  {id: 'comments-my-posts', title: 'Only new comments on my posts'},
  {id: 'no-notifications', title: 'No notifications'},
];

export const MENU = [
  {id: 1, name: 'Homepage', link: ''},
  {id: 2, name: 'Forum notifications', link: '/manage-notifications'},
  {id: 3, name: 'My profile', link: '/profile'},
];

export const TAB_TITLES = [
  {
    id: 1,
    key: 'posts',
    title: 'Posts',
    icon: MdOutlineArticle,
  },
  {
    id: 2,
    key: 'media',
    title: 'Media',
    icon: MdOutlinePermMedia,
  },
];
