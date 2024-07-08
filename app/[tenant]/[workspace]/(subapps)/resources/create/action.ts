'use server';

import fs from 'fs';
import path from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';
import moment from 'moment';

import {getClient} from '@/goovee';

import {getFileSizeText} from '@/subapps/resources/common/utils';

const pump = promisify(pipeline);

const storage = process.env.DATA_STORAGE as string;

if (!fs.existsSync(storage)) {
  fs.mkdirSync(storage);
}

function extractFileValues(formData: FormData) {
  let values: any = [];

  for (let pair of formData.entries()) {
    let key = pair[0];
    let value = pair[1];

    let index: any = Number(key.match(/\[(\d+)\]/)?.[1]);

    if (Number.isNaN(index)) {
      continue;
    }

    if (!values[index]) {
      values[index] = {};
    }

    let field = key.substring(key.lastIndexOf('[') + 1, key.lastIndexOf(']'));

    if (field === 'title' || field === 'description') {
      values[index][field] = value;
    } else if (field === 'file') {
      values[index][field] =
        value instanceof File ? value : new File([value], 'filename');
    }
  }

  return values;
}

export async function upload(formData: FormData) {
  const client = await getClient();

  const category = formData.get('category');

  if (!category) {
    return {
      error: true,
      message: 'Category is required',
    };
  }

  const values = extractFileValues(formData);

  const getTimestampFilename = (name: any) => {
    return `${new Date().getTime()}-${name}`;
  };

  const create = async ({file, title, description}: any) => {
    try {
      const name = title || file.name;

      const timestampFilename = getTimestampFilename(name);

      await pump(
        file.stream(),
        fs.createWriteStream(path.resolve(storage, timestampFilename)),
      );

      const timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSSSS');

      await client.aOSDMSFile.create({
        data: {
          fileName: name,
          isDirectory: false,
          parent: {select: {id: Number(category)}},
          createdOn: timestamp as unknown as Date,
          updatedOn: timestamp as unknown as Date,
          metaFile: {
            create: {
              fileName: name,
              filePath: timestampFilename,
              fileType: file.type,
              fileSize: file.size,
              sizeText: getFileSizeText(file.size),
              description: description,
              createdOn: timestamp,
              updatedOn: timestamp,
            },
          },
        },
        select: {
          metaFile: true,
          parent: true,
        },
      });
    } catch (err) {}
  };

  try {
    await Promise.all(
      values.map(({title, description, file}: any) =>
        create({
          title: `${title}${path.extname(file.name)}`,
          description,
          file,
        }),
      ),
    );
  } catch (err) {
    return {
      error: true,
    };
  }

  return {
    success: true,
  };
}
