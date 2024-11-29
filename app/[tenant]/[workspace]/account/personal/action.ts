'use server';

import fs from 'fs';
import path from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';
import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //

import {manager} from '@/lib/core/tenant';
import {getSession} from '@/auth';
import {TENANT_HEADER} from '@/middleware';
import {getFileSizeText} from '@/utils/files';
import {getTranslation} from '@/i18n/server';
import {clone} from '@/utils';
import {PartnerTypeMap, findPartnerByEmail, updatePartner} from '@/orm/partner';
import {UserType} from '@/auth/types';

const pump = promisify(pipeline);

const storage = process.env.DATA_STORAGE as string;

if (!fs.existsSync(storage)) {
  fs.mkdirSync(storage);
}

function error(message: string) {
  return {
    error: true,
    message,
  };
}

export async function updateProfileImage(formData: FormData) {
  const file: any = formData.get('picture');

  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('TenantId is required'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  const partner = await findPartnerByEmail(user.email, tenantId);

  if (!partner) {
    return error(await getTranslation('Invalid partner'));
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return error(await getTranslation('Invalid tenant'));
  }

  let uploadedPicture = null;

  if (file) {
    try {
      const fileName = `${new Date().getTime()}-${file.name}`;

      await pump(
        file.stream(),
        fs.createWriteStream(path.resolve(storage, fileName)),
      );

      uploadedPicture = await client.aOSMetaFile
        .create({
          data: {
            fileName: file.name,
            filePath: fileName,
            fileType: file.type,
            fileSize: file.size,
            sizeText: getFileSizeText(file.size),
            description: '',
          },
        })
        .then(clone);
    } catch (err) {
      return error(
        await getTranslation('Error updating profile picture. Try again.'),
      );
    }
  }

  try {
    const updatedPartner = await updatePartner({
      data: {
        id: partner.id,
        version: partner.version,
        ...(uploadedPicture
          ? {
              picture: {
                select: {
                  id: uploadedPicture.id,
                },
              },
            }
          : {
              picture: null,
            }),
      },
      tenantId,
    });
  } catch (err) {
    return error(
      await getTranslation('Error updating profile picture. Try again.'),
    );
  }

  return {
    success: true,
    data: uploadedPicture,
  };
}

export async function fetchPersonalSettings() {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('TenantId is required'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  const partner = await findPartnerByEmail(user.email, tenantId);

  if (!partner) {
    return error(await getTranslation('Invalid partner'));
  }

  const {
    partnerTypeSelect,
    name,
    registrationCode,
    fixedPhone,
    firstName,
    emailAddress,
  } = partner;

  const type = Object.entries(PartnerTypeMap).find(
    ([key, value]) => value === partnerTypeSelect,
  )?.[0];

  return {
    type,
    companyName: name,
    identificationNumber: registrationCode,
    companyNumber: fixedPhone,
    firstName,
    name,
    email: emailAddress?.address,
  };
}

export async function update({
  companyName,
  identificationNumber,
  companyNumber,
  firstName,
  name,
  email,
}: {
  companyName?: string;
  identificationNumber?: string;
  companyNumber?: string;
  firstName?: string;
  name: string;
  email: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await getTranslation('TenantId is required'));
  }

  if (!email) {
    return error(await getTranslation('Email is required'));
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  const partner = await findPartnerByEmail(user.email, tenantId);

  if (!partner) {
    return error(await getTranslation('Invalid partner'));
  }

  const isCompany =
    partner.partnerTypeSelect === PartnerTypeMap[UserType.company];

  const isPrivateIndividual =
    partner.partnerTypeSelect === PartnerTypeMap[UserType.individual];

  if (isCompany && !companyName) {
    return error(await getTranslation('Company Name is required'));
  }

  if (isPrivateIndividual && !name) {
    return error(await getTranslation('Last Name is required'));
  }

  const existingPartner = await findPartnerByEmail(email, tenantId);

  if (existingPartner?.id !== partner.id) {
    return error(await getTranslation('Email already exists'));
  }

  try {
    const updatedPartner = await updatePartner({
      data: {
        id: partner.id,
        version: partner.version,
        registrationCode: identificationNumber,
        fixedPhone: companyNumber,
        firstName,
        name: isCompany ? companyName : name,
        ...(email !== partner?.emailAddress?.address
          ? {
              emailAddress: {
                create: {
                  name: email,
                  address: email,
                },
              },
            }
          : {}),
      },
      tenantId,
    });

    return {
      success: true,
      message: await getTranslation('Settings updated successfully.'),
    };
  } catch (err) {
    return error(await getTranslation('Error updating settings. Try again.'));
  }
}
