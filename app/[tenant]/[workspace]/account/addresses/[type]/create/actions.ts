"use server";

// ---- CORE IMPORTS ---- //
import { getSession } from "@/orm/auth";
import { createPartnerAddress } from "@/orm/address";
import { PartnerAddress } from "@/types";
import { clone } from "@/utils";

export async function createAddress(values: Partial<PartnerAddress>) {
  const session = await getSession();

  if (!session) return null;

  const address = await createPartnerAddress(session.user?.id, values).then(
    clone
  );

  return address;
}
