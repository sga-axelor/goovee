import {ID} from '@/types';

export type Survey = {
  id: ID;
  slug: string;
  name: string;
  statusSelect: number;
  category: {
    name: string;
  };
  target: string;
  publicationDatetime: string;
  customModel: string;
  nbResponses?: number;
};

export type Response = {
  id: ID;
  attrs: {
    statusSelect: number;
    surveyConfig: Survey;
    partner: {
      name: string;
      fullName: string;
    };
  };
  updatedOn?: string;
  createdOn: string;
};

export interface AuthSuccessResponse {
  url: string;
  username: string;
  password: string;
}

export interface AuthErrorResponse {
  error: boolean;
  message: string;
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;
