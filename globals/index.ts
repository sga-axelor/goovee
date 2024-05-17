import { getClient } from "@/axelor";
import type { AxelorClient } from "@/axelor/.generated/client";

const globalForAxelor = global as unknown as {
  client: AxelorClient | undefined;
};

export const client = globalForAxelor.client ?? getClient();

if (process.env.NODE_ENV !== "production") {
  globalForAxelor.client = client;
}
