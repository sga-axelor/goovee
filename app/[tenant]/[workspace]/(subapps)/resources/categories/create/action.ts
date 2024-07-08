'use server';

import {getClient} from '@/goovee';
import {clone} from '@/utils';

export async function create(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description')!;
  const icon = formData.get('icon')!;
  const parent = formData.get('parent')!;
  const color = formData.get('color')!;

  if (!title) {
    return {
      error: true,
      message: 'Title is required',
    };
  }

  const client = await getClient();

  try {
    const category = await client.aOSDMSFile
      .create({
        data: {
          fileName: title,
          isDirectory: true,
          ...(parent
            ? {
                parent: {
                  select: {
                    id: Number(parent),
                  },
                },
              }
            : {}),
        },
      })
      .then(clone);

    return {
      success: true,
      data: category,
    };
  } catch (err) {
    return {
      error: true,
      message: 'Error creating category',
    };
  }
}
