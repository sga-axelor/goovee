import {MetaModel} from '../types/templates';

export const metaFileModel = {
  name: 'com.axelor.meta.db.MetaFile',
  title: 'Meta File',
  fields: [
    {
      name: 'fileName',
      title: 'File Name',
      type: 'string',
    },
    {
      name: 'filePath',
      title: 'File Path',
      type: 'string',
    },
    {
      name: 'fileType',
      title: 'File Type',
      type: 'string',
    },
    {
      name: 'fileSize',
      title: 'File Size',
      type: 'integer',
    },
    {
      name: 'sizeText',
      title: 'Size Text',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'createdOn',
      title: 'Created On',
      type: 'datetime',
    },
    {
      name: 'updatedOn',
      title: 'Updated On',
      type: 'datetime',
    },
  ],
} as const satisfies MetaModel;
