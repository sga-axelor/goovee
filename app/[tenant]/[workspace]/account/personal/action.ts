'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {TENANT_HEADER} from '@/middleware';
import {PartnerTypeMap, findPartnerByEmail, updatePartner} from '@/orm/partner';
import {getTranslation} from '@/i18n/server';
import {UserType} from '@/auth/types';

function error(message: string) {
  return {
    error: true,
    message,
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
