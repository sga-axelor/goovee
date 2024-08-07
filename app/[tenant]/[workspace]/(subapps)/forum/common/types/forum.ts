import {IconType} from 'react-icons';

export type ID = string;
export type Version = number;

export interface Model {
  id: ID;
  version: Version;
}

export interface TextAlignment {
  name: 'left' | 'center' | 'right' | 'justify';
  icon: IconType;
}
export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export type PostsContentProps = {
  posts: any;
};
export type MediaContentProps = {};

export type Tab<P = {}> = {
  id: number;
  key: string;
  title: string;
  icon: IconType;
  component: React.ComponentType<P>;
};

export type MetaFile = {
  id: ID;
  fileName: string;
};

export interface Image extends Model {
  metaFile: MetaFile;
}

export interface ForumGroup extends Model {
  name: string;
  image?: Image;
}

export interface Group extends Model {
  isPin?: boolean;
  notificationSelect: string | null;
  forumGroup: ForumGroup;
}

export interface Author extends Model {
  simpleFullName?: string;
  picture: string;
}

export interface Comment extends Model {
  contentComment?: string;
  publicationDateTime?: string;
  author: Author;
  childComment: Comment[];
}

export interface Post extends Model {
  title?: string;
  content?: string;
  forumGroup: ForumGroup;
  attachmentList: [];
  commentList: Comment[];
  author: Author;
  createdOn: string;
}
