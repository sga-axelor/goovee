import {requester} from '@axelor-ent/survey-react-components';

export async function ensureAuth({
  url,
  username,
  password,
}: {
  url: string;
  username: string;
  password: string;
}) {
  await requester.registerConfig(url, {username, password});
}
