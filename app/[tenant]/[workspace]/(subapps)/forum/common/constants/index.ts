import {MdOutlineArticle, MdOutlinePermMedia} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {MediaContent, PostsContent} from '@/subapps/forum/common/ui/components';

export const GROUPS = 'Groups';
export const MEMBER = 'Member';
export const NOT_MEMBER = 'Not member';
export const SEARCH_HERE = 'Search here';
export const DISABLED_SEARCH_PLACEHOLDER = 'You must log in to be able to post';
export const MARK_AS_READ = 'Mark as read';
export const PIN = 'Pin';
export const NOTIFICATIONS = 'Notifications';
export const LEAVE_THIS_GROUP = 'Leave this group';
export const GROUP_NAME = 'Group name';
export const START_A_POST = 'Start a post';
export const COMMENT = 'Comment';
export const COMMENTS = 'Comments';
export const DISABLED_COMMENT_PLACEHOLDER =
  'You need to log in to comment posts';
export const REPORT = 'Report';
export const NOT_INTERESTED = 'Not interested';

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
    component: PostsContent,
  },
  {
    id: 2,
    key: 'media',
    title: 'Media',
    icon: MdOutlinePermMedia,
    component: MediaContent,
  },
];

export const THREAD_SORT_BY_OPTIONS = [
  {
    id: 1,
    key: 'new',
    label: 'New',
  },
  {
    id: 2,
    key: 'old',
    label: 'Old',
  },
  {
    id: 3,
    key: 'popular',
    label: 'Popular',
  },
];

export const NOTIFICATIONS_OPTIONS = [
  {
    id: 1,
    title: 'All new posts and new comments',
  },
  {
    id: 2,
    title: 'All new posts and new comments on my posts',
  },
  {
    id: 3,
    title: 'Only new comments on my posts',
  },
  {
    id: 4,
    title: 'No notifications',
  },
];
