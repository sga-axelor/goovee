import {requester} from '@axelor/react-survey-components';

export async function ensureAuth() {
  requester.registerConfig(process.env.NEXT_PUBLIC_AOS_URL ?? '', {
    username: process.env.NEXT_PUBLIC_SURVEY_AUTH_USERNAME ?? '',
    password: process.env.NEXT_PUBLIC_SURVEY_AUTH_PASSWORD ?? '',
  });
}
