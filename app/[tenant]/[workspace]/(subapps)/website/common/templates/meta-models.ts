import type {EntityName, MetaModel} from '../types/templates';

export const metaFileModel = {
  name: 'com.axelor.meta.db.MetaFile',
  entity: 'aOSMetaFile',
  select: {id: true, fileName: true, filePath: true, fileType: true},
} as const satisfies MetaModel<'aOSMetaFile'>;

export const metaModels: Record<string, MetaModel<EntityName>> = {
  [metaFileModel.name]: metaFileModel,
};
