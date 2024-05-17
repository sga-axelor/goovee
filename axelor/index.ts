import { AxelorClient, createClient } from "./.generated/client";

let client: AxelorClient;

export async function getClient() {
  if (client === undefined) {
    client = createClient();
    await client.$connect();
    await client.$sync();
  }
  return client;
}
