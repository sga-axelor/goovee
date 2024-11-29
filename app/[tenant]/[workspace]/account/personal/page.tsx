import {notFound} from 'next/navigation';

// ---- CORE IMPORT ---- //
import {getSession} from '@/auth';
import {PartnerTypeMap, findPartnerByEmail} from '@/orm/partner';

// ---- LOCAL IMPORT ---- //
import Form from './form';

export default async function Page({params}: {params: {tenant: string}}) {
  const {tenant} = params;

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return notFound();
  }

  const partner = await findPartnerByEmail(user.email, tenant);

  if (!partner) {
    return notFound();
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

  const settings = {
    type,
    companyName: name,
    identificationNumber: registrationCode,
    companyNumber: fixedPhone,
    firstName,
    name,
    email: emailAddress?.address,
  };

  return <Form settings={settings as any} />;
}
