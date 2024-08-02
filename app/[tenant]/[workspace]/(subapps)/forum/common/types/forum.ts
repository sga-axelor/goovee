import {IconType} from 'react-icons';

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
