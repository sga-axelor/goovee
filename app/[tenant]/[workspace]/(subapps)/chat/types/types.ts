export interface Error {
  status_code: number;
  id: string;
  message: string;
  request_id: string;
}

export interface ChannelHeaderType {
  id: string;
  date: string;
  subTitle: string;
  title: string;
  unreadCount: number;
  active: boolean;
}

export interface ChannelType {
  id: string;
  create_at: Date;
  update_at: Date;
  delete_at: Date;
  team_id: string;
  type: string;
  display_name: string;
  name: string;
  header: string;
  purpose: string;
  last_post_at: Date;
  total_msg_count: number;
  extra_update_at: Date;
  creator_id: string;
  unread: number;
  groupsPost: any[];
}

export interface Member {
  channel_id: string;
  user_id: string;
  roles: string;
  last_viewed_at: Date;
  msg_count: Date;
  mention_count: number;
  notify_props?: {
    email: string;
    push: string;
    desktop: string;
    mark_unread: string;
  };
  last_update_at: Date;
}

export interface User {
  id: string;
  create_at?: Date;
  update_at?: Date;
  delete_at?: Date;
  username: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  email?: string;
  email_verified?: boolean;
  auth_service?: string;
  roles?: string;
  locale?: string;
  notify_props?: {
    email: string;
    push: string;
    desktop: string;
    desktop_sound: string;
    mention_keys: string;
    channel: string;
    first_name: string;
  };
  props?: {};
  last_password_update?: Date;
  last_picture_update?: Date;
  failed_attempts?: number;
  mfa_active?: boolean;
  timezone?: {
    useAutomaticTimezone: boolean;
    manualTimezone: string;
    automaticTimezone: string;
  };
  terms_of_service_id?: string;
  terms_of_service_create_at?: Date;
  profileImage: any;
}

export interface UserStatus {
  active_channel: string;
  status: string;
  user_id: string;
}

export interface Reaction {
  user_id: string;
  emoji_name: string;
}

export interface Post {
  id: string;
  create_at: Date;
  update_at: Date;
  delete_at: Date;
  edit_at: Date;
  user_id: string;
  channel_id: string;
  root_id: string;
  original_id: string;
  message: string;
  type: string;
  props: {};
  hashtag: string;
  file_ids: [string];
  pending_post_id: string;
  metadata: {
    embeds?: [];
    emojis?: [];
    files?: [];
    images?: {};
    reactions?: Reaction[];
    priority?: {};
    acknowledgements?: [];
  };
  displayName?: string;
  profileImage?: any;
  files?: any;
  root?: any;
}

export interface File {
  file_ids: string[];
  id: string;
  user_id: string;
  post_id: string;
  create_at: Date;
  update_at: Date;
  delete_at: Date;
  name: string;
  extension: string;
  size: number;
  mime_type: string;
  width: number;
  height: number;
  has_preview_image: true;
  type?: string;
}

export interface SocketMsg {
  data: {
    reaction: string;
  };
  broadcast: any;
}

export interface Reply {
  author: string;
  text: string;
  postId: string;
}
export interface Conversation {
  users: User[];
  posts: Post[];
  name: string;
  channel: ChannelType | {id: string | undefined};
}

export interface UserTyping {
  username: string;
  channelId: string;
}
