import {requester} from '@axelor-ent/survey-react-components';

export async function ensureAuth() {
  await requester.registerConfig(process.env.NEXT_PUBLIC_AOS_URL ?? '', {
    username: process.env.NEXT_PUBLIC_SURVEY_AUTH_USERNAME ?? '',
    password: process.env.NEXT_PUBLIC_SURVEY_AUTH_PASSWORD ?? '',
  });
}
