import { client } from "@/globals";
import { clone } from "@/utils";
import { hash } from "@/utils/auth";

export async function registerPartner({
  firstName,
  name,
  password = "",
  email,
}: {
  firstName?: string;
  name: string;
  password?: string;
  email: string;
}) {
  const c = await client;

  const hashedPassword = await hash(password);

  const partner = await c.aOSPartner
    .create({
      data: {
        firstName,
        name,
        password: hashedPassword,
        isContact: false,
        fullName: `${name} ${firstName || ""}`,
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
