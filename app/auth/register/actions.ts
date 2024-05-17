"use server";

import { registerPartner } from "@/orm/partner";

export async function register({
  firstName,
  name,
  email,
  password,
  confirmPassword,
}: {
  firstName?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  if (!(name && email && password && confirmPassword)) {
    throw new Error("Name, email and password is required.");
  }

  if (password !== confirmPassword) {
    throw new Error("Password and confirm password mismatch");
  }

  const partner = await registerPartner({
    firstName,
    name,
    email,
    password,
  });

  return partner;
}
