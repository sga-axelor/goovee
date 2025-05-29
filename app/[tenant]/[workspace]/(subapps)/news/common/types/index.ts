// ---- CORE IMPORTS ---- //
import {PageInfo} from '@/types';

export interface Category {
  id: number;
  name: string;
  parentCategory?: Category;
  childCategory: Category[];
  slug: string;
}

export type NewsItem = {
  id: string;
  title?: string;
  description?: string;
  image?: any;
  slug?: string;
  isPrivate?: boolean;
  publicationDateTime?: string;
  categorySet?: any;
};

export type NewsResponse = {
  news: NewsItem[];
  pageInfo: PageInfo;
};
