export type EntryDetailProps = {
  id?: any;
  title?: string;
  city?: string;
  address?: string;
  twitter?: string;
  website?: string;
  description?: string;
  image?: {
    id?: string;
  };
  linkedIn?: string;
  isMap?: boolean;
  instagram?: string;
  directoryEntryCategorySet?: CategoryProps[];
};
export type CategoryProps = {
  title?: string;
  color?: string;
};

export type DirectoryEntryListProp = {
  id?: any;
  title?: string;
  city?: string;
  address?: string;
  zipcode?: string;
  description?: string;
  image?: {
    id?: string;
  };
  directoryEntryCategorySet?: CategoryProps[];
};

export type ContactDetailProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  linkedinLink?: string;
};
