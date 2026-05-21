export interface DmsFile {
  id: string;
  version?: number | null;
  fileName?: string | null;
  content?: string | null;
  contentType?: string | null;
  description?: string | null;
  isPrivate?: boolean | null;
  isDirectory?: boolean | null;
  permissionSelect?: string | null;
  colorSelect?: string | null;
  logoSelect?: string | null;
  createdBy?: {
    id?: string | null;
    version?: number | null;
    name?: string | null;
    fullName?: string | null;
  } | null;
  createdOn?: string | Date | null;
  partnerSet?: {id: string}[] | null;
  partnerCategorySet?: {id: string}[] | null;
  metaFile?: {
    id?: string | null;
    version?: number | null;
    fileType?: string | null;
    sizeText?: string | null;
    description?: string | null;
    createdOn?: string | Date | null;
    updatedOn?: string | Date | null;
    fileName?: string | null;
    filePath?: string | null;
    fileSize?: string | null;
  } | null;
  parent?: {
    id?: string | null;
    version?: number | null;
    fileName?: string | null;
  } | null;
}

export type ExplorerCategory = {
  id: string;
  parent?: {id: string} | null;
  fileName?: string | null;
  logoSelect?: string | null;
  colorSelect?: string | null;
  children: ExplorerCategory[];
  _parent: string[];
};
