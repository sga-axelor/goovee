import localforage from "localforage";

export async function getitem(key: string) {
  try {
    const item = await localforage.getItem(key);
    return item;
  } catch (err: any) {
    console.error(err?.message);
    return null;
  }
}

export async function setitem(key: string, value: any) {
  try {
    const item = await localforage.setItem(key, value);
    return item;
  } catch (err: any) {
    console.error(err?.message);
    return null;
  }
}
