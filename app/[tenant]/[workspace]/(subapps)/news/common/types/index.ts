// ---- CORE IMPORTS ---- //
import {PageInfo} from '@/types';

export interface Category {
  id: number;
  name: string;
  parentCategory?: Category;
  childCategory: Category[];
  slug: string;
}

export type Attachment = {
  id: string;
  title?: string;
  metaFile?: {
    id: string;
    fileName: string;
    fileSize: number;
    sizeText: string;
    fileType: string;
  };
};

export type RelatedNewsItem = {
  id: string;
  title?: string;
  slug?: string;
  publicationDateTime?: string;
  image?: any;
  categorySet?: any;
};

export type NewsItem = {
  id: string;
  title?: string;
  description?: string;
  image?: any;
  slug?: string;
  isPrivate?: boolean;
  publicationDateTime?: string;
  categorySet?: any;
  attachmentList?: Attachment[];
  relatedNewsSet?: RelatedNewsItem[];
};

export type NewsResponse = {
  news: NewsItem[];
  pageInfo: PageInfo;
};
