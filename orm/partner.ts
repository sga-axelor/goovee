import {getClient} from '@/goovee';
import {clone} from '@/utils';
import {hash} from '@/utils/auth';

export async function registerPartner({
  firstName,
  name,
  password = '',
  email,
}: {
  firstName?: string;
  name: string;
  password?: string;
  email: string;
}) {
  const client = await getClient();

  const hashedPassword = await hash(password);

  const partner = await client.aOSPartner
    .create({
      data: {
        firstName,
        name,
        password: hashedPassword,
        isContact: false,
        fullName: `${name} ${firstName || ''}`,
        emailAddress: {
          create: {
            address: email,
            name: email,
          },
        },
      },
    })
    .then(clone);

  return partner;
}
