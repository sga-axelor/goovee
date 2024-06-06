import { client } from "@/globals";

export async function getTheme() {
    const c = await client;
  
    const theme = await c.aOSPortalTheme.findOne();
  
    return theme;
  }